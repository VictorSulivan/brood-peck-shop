"use client";

import type { TypeStat } from "types/analyse";
import { fmt } from "src/utils/buildMoisStats";

export function RepartitionTypes({
  gains,
  charges,
  totalGains,
  totalCharges,
}: {
  gains: TypeStat[];
  charges: TypeStat[];
  totalGains: number;
  totalCharges: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Section title="Sources de gains">
        {gains.length === 0 ? (
          <Empty />
        ) : (
          gains
            .sort((a, b) => b.montant - a.montant)
            .map((t) => (
              <BarRow
                key={t.type}
                label={t.type}
                montant={t.montant}
                max={totalGains}
                barColor="bg-linear-to-r from-[#c5a059] to-emerald-400"
                textColor="text-emerald-400"
                sign="+"
              />
            ))
        )}
      </Section>

      <Section title="Sources de charges">
        {charges.length === 0 ? (
          <Empty />
        ) : (
          charges
            .sort((a, b) => b.montant - a.montant)
            .map((t) => (
              <BarRow
                key={t.type}
                label={t.type}
                montant={t.montant}
                max={totalCharges}
                barColor="bg-linear-to-r from-amber-600 to-amber-400"
                textColor="text-amber-400"
                sign="-"
              />
            ))
        )}
      </Section>
    </div>
  );
}

function BarRow({
  label,
  montant,
  max,
  barColor,
  textColor,
  sign,
}: {
  label: string;
  montant: number;
  max: number;
  barColor: string;
  textColor: string;
  sign: string;
}) {
  const pct = max > 0 ? Math.round((montant / max) * 100) : 0;
  return (
    <div className="mb-3.5 last:mb-0">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-[#e6d5b8]/80 capitalize font-medium">{label}</span>
        <span className="tabular-nums">
          <span className={`font-serif font-semibold ${textColor}`}>
            {sign}{fmt(montant)} Mornilles
          </span>
          <span className="text-[#e6d5b8]/40 ml-1.5">({pct}%)</span>
        </span>
      </div>
      <div className="h-1 bg-black/30 rounded-full overflow-hidden border border-[#c5a059]/10">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c5a059]/30" />
      <p className="text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-4">{title}</p>
      {children}
    </div>
  );
}

function Empty() {
  return (
    <p className="text-[#e6d5b8]/30 text-sm py-6 text-center italic">
      Aucune donnée sur cette période.
    </p>
  );
}