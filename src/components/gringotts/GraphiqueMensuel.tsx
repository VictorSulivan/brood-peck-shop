"use client";

import { useState } from "react";
import type { MoisStat } from "types/analyse";
import { fmt } from "src/utils/buildMoisStats";

export function GraphiqueMensuel({ mois }: { mois: MoisStat[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (mois.length < 2) {
    return (
      <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-[#c5a059] font-medium uppercase tracking-wider">
            Évolution par semestre RP
          </p>
          <RpBadge />
        </div>
        <p className="text-[#e6d5b8]/40 text-sm py-8 text-center">
          Pas assez de données (2 semestres minimum).
        </p>
      </div>
    );
  }

  const W = 680;
  const H = 200;
  const PAD = { top: 16, right: 16, bottom: 40, left: 56 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const allValues = mois.flatMap((m) => [m.gains, m.depenses + m.taxes, 0]);
  const maxVal = Math.max(...allValues, 1);

  function xPos(i: number) {
    return PAD.left + (i / (mois.length - 1)) * chartW;
  }
  function yPos(v: number) {
    return PAD.top + chartH - (v / maxVal) * chartH;
  }

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    v: maxVal * f,
    y: yPos(maxVal * f),
  }));

  // Génération de courbes lissées (Smooth Curved Paths)
  const getSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    return points.reduce((acc, point, i, a) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const prev = a[i - 1];
      const cx = (prev.x + point.x) / 2;
      return `${acc} C ${cx},${prev.y} ${cx},${point.y} ${point.x},${point.y}`;
    }, "");
  };

  const pointsGains = mois.map((m, i) => ({ x: xPos(i), y: yPos(m.gains) }));
  const pointsCharges = mois.map((m, i) => ({
    x: xPos(i),
    y: yPos(m.depenses + m.taxes),
  }));

  const pathGains = getSmoothPath(pointsGains);
  const pathCharges = getSmoothPath(pointsCharges);

  const areaGains = `${pathGains} L ${xPos(mois.length - 1)},${
    PAD.top + chartH
  } L ${PAD.left},${PAD.top + chartH} Z`;
  const areaCharges = `${pathCharges} L ${xPos(mois.length - 1)},${
    PAD.top + chartH
  } L ${PAD.left},${PAD.top + chartH} Z`;

  return (
    <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />

      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-[#c5a059] font-medium uppercase tracking-wider">
          Évolution par semestre RP
        </p>
        <RpBadge />
      </div>
      <p className="text-[10px] text-[#c5a059]/60 mb-4">
        Chaque colonne = 1 semaine réelle = 1 semestre dans le jeu
      </p>

      <div className="flex items-center gap-4 mb-3">
        <Legend color="bg-[#c5a059]" label="Gains" />
        <Legend color="bg-[#e6d5b8]/50" label="Charges (dont taxes)" />
      </div>

      <div className="overflow-x-auto relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ minWidth: `${Math.max(mois.length * 80, 320)}px` }}
        >
          <defs>
            <linearGradient id="gradGains" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c5a059" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#c5a059" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradCharges" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e6d5b8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#e6d5b8" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grille + labels Y */}
          {yTicks.map(({ v, y }) => (
            <g key={v}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y}
                y2={y}
                stroke="#c5a059"
                strokeOpacity="0.1"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="9"
                fill="#c5a059"
                opacity="0.6"
              >
                {v === 0 ? "0" : `${fmt(v)} Mornilles`}
              </text>
            </g>
          ))}

          {/* Zones ombragées sous courbe */}
          <path d={areaGains} fill="url(#gradGains)" />
          <path d={areaCharges} fill="url(#gradCharges)" />

          {/* Courbes */}
          <path
            d={pathGains}
            fill="none"
            stroke="#c5a059"
            strokeWidth="1.75"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d={pathCharges}
            fill="none"
            stroke="#e6d5b8"
            strokeOpacity="0.6"
            strokeWidth="1.5"
            strokeDasharray="4,2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Ligne de survol vertical (Crosshair) */}
          {hoveredIndex !== null && (
            <line
              x1={xPos(hoveredIndex)}
              x2={xPos(hoveredIndex)}
              y1={PAD.top}
              y2={PAD.top + chartH}
              stroke="#c5a059"
              strokeOpacity="0.3"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          )}

          {/* Points sur la courbe */}
          {mois.map((m, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={`pt-${i}`}>
                <circle
                  cx={xPos(i)}
                  cy={yPos(m.gains)}
                  r={isHovered ? "4.5" : "3.5"}
                  fill="#111815"
                  stroke="#c5a059"
                  strokeWidth="1.75"
                  className="transition-all duration-150"
                />
                <circle
                  cx={xPos(i)}
                  cy={yPos(m.depenses + m.taxes)}
                  r={isHovered ? "4.5" : "3.5"}
                  fill="#111815"
                  stroke="#e6d5b8"
                  strokeWidth="1.5"
                  className="transition-all duration-150"
                />
              </g>
            );
          })}

          {/* Séparateurs d'années RP */}
          {mois.map((m, i) => {
            const isFinAnnee = m.label.startsWith("S2") && i < mois.length - 1;
            if (!isFinAnnee) return null;
            const x = (xPos(i) + xPos(i + 1)) / 2;
            return (
              <line
                key={`sep-${i}`}
                x1={x}
                x2={x}
                y1={PAD.top}
                y2={PAD.top + chartH}
                stroke="#c5a059"
                strokeOpacity="0.15"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            );
          })}

          {/* Labels X (semestres RP) */}
          {mois.map((m, i) => {
            const soldeNet = m.gains - m.depenses - m.taxes;
            return (
              <g key={`lbl-${i}`}>
                <text
                  x={xPos(i)}
                  y={H - 18}
                  textAnchor="middle"
                  fontSize="9"
                  fill={m.label.startsWith("S1") ? "#f3e9d2" : "#e6d5b8"}
                  opacity={m.label.startsWith("S1") ? "0.9" : "0.5"}
                >
                  {m.label}
                </text>
                {/* Solde net sous le label */}
                <text
                  x={xPos(i)}
                  y={H - 6}
                  textAnchor="middle"
                  fontSize="8"
                  fill={soldeNet >= 0 ? "#c5a059" : "#f87171"}
                  opacity={soldeNet >= 0 ? "0.8" : "0.7"}
                >
                  {soldeNet >= 0 ? "+" : ""}
                  {fmt(soldeNet)}
                </text>
              </g>
            );
          })}

          {/* Overlay invisible pour capter le hover sur chaque point */}
          {mois.map((_, i) => (
            <rect
              key={`hover-zone-${i}`}
              x={xPos(i) - chartW / (mois.length - 1) / 2}
              y={PAD.top}
              width={chartW / (mois.length - 1)}
              height={chartH + PAD.bottom}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>

        {/* Tooltip au survol */}
        {hoveredIndex !== null && (
          <div
            className="absolute pointer-events-none z-10 bg-[#111815] border border-[#c5a059]/40 rounded-lg p-2.5 shadow-2xl transition-all duration-75 text-xs -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(xPos(hoveredIndex) / W) * 100}%`,
              top: `${(yPos(mois[hoveredIndex].gains) / H) * 100 - 10}%`,
            }}
          >
            <p className="font-medium text-[#f3e9d2] mb-1 border-b border-[#c5a059]/20 pb-1">
              {mois[hoveredIndex].label}
            </p>
            <div className="flex flex-col gap-1 text-[11px]">
              <div className="flex items-center justify-between gap-3 text-[#c5a059]">
                <span>Gains :</span>
                <span className="font-medium">
                  +{fmt(mois[hoveredIndex].gains)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[#e6d5b8]/70">
                <span>Charges :</span>
                <span className="font-medium">
                  -{fmt(mois[hoveredIndex].depenses + mois[hoveredIndex].taxes)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-3 h-1 rounded-full ${color} inline-block`} />
      <span className="text-xs text-[#e6d5b8]/60">{label}</span>
    </div>
  );
}

function RpBadge() {
  return (
    <span className="text-[10px] text-[#f3e9d2] border border-[#c5a059]/30 rounded px-2 py-0.5 bg-[#1b3026]">
      Temps RP
    </span>
  );
}