"use client";

import type { EmployeStat } from "types/analyse";
import { fmt } from "src/utils/buildMoisStats";

export function ClassementEmployes({
  employes,
  sansEmploye,
}: {
  employes: EmployeStat[];
  sansEmploye: { gains: number; depenses: number; taxes: number };
}) {
  const maxGains = Math.max(...employes.map((e) => e.gains), 1);
  const hasSansEmploye =
    sansEmploye.gains > 0 || sansEmploye.depenses > 0 || sansEmploye.taxes > 0;

  return (
    <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c5a059]/30" />
      
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs text-[#c5a059] font-medium uppercase tracking-wider">
            Contribution par employé
          </p>
          <p className="text-xs text-[#e6d5b8]/50 mt-0.5">
            Classé par solde net généré sur la période
          </p>
        </div>
        <span className="text-xs text-[#c5a059] border border-[#c5a059]/20 bg-black/20 rounded-lg px-2.5 py-1">
          {employes.length} employé{employes.length > 1 ? "s" : ""}
        </span>
      </div>

      {employes.length === 0 && !hasSansEmploye ? (
        <p className="text-[#e6d5b8]/30 text-sm py-8 text-center italic">
          Aucune transaction attribuée à un employé sur cette période.
        </p>
      ) : (
        <div className="space-y-4">
          {employes.map((e, i) => {
            const net = e.gains - e.depenses - e.taxes;
            const pct = Math.round((e.gains / maxGains) * 100);
            return (
              <EmployeRow
                key={e.id}
                rang={i + 1}
                nom={e.nom}
                gains={e.gains}
                depenses={e.depenses}
                taxes={e.taxes}
                net={net}
                pct={pct}
                nbTransactions={e.nbTransactions}
              />
            );
          })}

          {hasSansEmploye && (
            <div className="pt-3 border-t border-[#c5a059]/15">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5" />
                  <span className="text-[#e6d5b8]/40 italic">Sans employé attribué</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400/60">
                    +{fmt(sansEmploye.gains)} Mornilles
                  </span>
                  <span className="text-amber-400/60">
                    -{fmt(sansEmploye.depenses + sansEmploye.taxes)} Mornilles
                  </span>
                  <span className="text-[#e6d5b8]/40 tabular-nums w-20 text-right">
                    {fmt(sansEmploye.gains - sansEmploye.depenses - sansEmploye.taxes)} Mornilles
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmployeRow({
  rang,
  nom,
  gains,
  depenses,
  taxes,
  net,
  pct,
  nbTransactions,
}: {
  rang: number;
  nom: string;
  gains: number;
  depenses: number;
  taxes: number;
  net: number;
  pct: number;
  nbTransactions: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs text-[#c5a059]/50 font-mono w-5 shrink-0 text-right font-medium">
            {rang}
          </span>
          <span className="text-sm text-[#e6d5b8] font-medium truncate">{nom}</span>
          <span className="text-xs text-[#c5a059]/40 shrink-0">{nbTransactions} tx</span>
        </div>

        {/* Stats inline */}
        <div className="flex items-center gap-4 text-xs shrink-0 ml-4">
          <span className="text-emerald-400/80 tabular-nums hidden sm:block">
            +{fmt(gains)} Mornilles
          </span>
          <span className="text-amber-400/80 tabular-nums hidden sm:block">
            -{fmt(depenses + taxes)} Mornilles
          </span>
          <span
            className={`font-serif font-semibold tabular-nums w-20 text-right ${
              net >= 0 ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {net >= 0 ? "+" : ""} Mornilles {fmt(net)}
          </span>
        </div>
      </div>

      {/* Barre de progression gains */}
      <div className="h-1 bg-black/30 rounded-full overflow-hidden ml-8 border border-[#c5a059]/10">
        <div
          className="h-full bg-linear-to-r from-[#c5a059] to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}