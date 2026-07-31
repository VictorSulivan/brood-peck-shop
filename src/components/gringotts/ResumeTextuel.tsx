"use client";

import type { KpiData, EmployeStat } from "types/analyse";
import { fmt, periodeLabel } from "src/utils/buildMoisStats";
import type { Periode } from "types/analyse";

export function ResumeTextuel({
  kpi,
  topEmploye,
  periode,
  debut,
  fin,
}: {
  kpi: KpiData;
  topEmploye: EmployeStat | null;
  periode: Periode;
  debut?: string;
  fin?: string;
}) {
  const label = periodeLabel(periode, debut, fin);

  return (
    <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />
      <p className="text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-3">Résumé</p>
      <p className="text-[#e6d5b8]/70 text-sm leading-relaxed">
        Sur la période{" "}
        <span className="text-[#e6d5b8] font-medium">{label}</span>, Gringotts a enregistré{" "}
        <span className="text-emerald-400 font-serif font-semibold">+{fmt(kpi.gains)} Mornilles</span> de gains bruts
        pour{" "}
        <span className="text-amber-400 font-serif font-semibold">-{fmt(kpi.depenses)} Mornilles</span> de dépenses et{" "}
        <span className="text-amber-400 font-serif font-semibold">-{fmt(kpi.taxes)} Mornilles</span> de taxes
        prélevées. Le solde net de la période est de{" "}
        <span
          className={`font-serif font-semibold ${
            kpi.net >= 0 ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          {kpi.net >= 0 ? "+" : ""}{fmt(kpi.net)} Mornilles
        </span>
        {kpi.net < 0 && (
          <span className="text-[#e6d5b8]/40">
            {" "}— les charges dépassent les gains sur cette période.
          </span>
        )}
        .{" "}
        {topEmploye && (
          <>
            L&apos;employé le plus contributeur est{" "}
            <span className="text-[#e6d5b8] font-medium">{topEmploye.nom}</span> avec{" "}
            <span className="text-emerald-400 font-serif font-semibold">+{fmt(topEmploye.gains)} Mornilles</span>{" "}
            générés sur {topEmploye.nbTransactions} transaction
            {topEmploye.nbTransactions > 1 ? "s" : ""}.
          </>
        )}
      </p>
    </div>
  );
}