"use client";

import { KpiData } from "types/analyse";
import { fmt } from "src/utils/buildMoisStats";

export function KpiGrid({ kpi }: { kpi: KpiData }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard
        label="Gains bruts"
        value={`+${fmt(kpi.gains)} Mornilles`}
        color="text-emerald-400"
        sub={`${kpi.nbTransactions} transactions`}
      />
      <KpiCard
        label="Dépenses"
        value={`-${fmt(kpi.depenses)} Mornilles`}
        color="text-amber-400"
        sub="hors taxe Gringotts"
      />
      <KpiCard
        label="Taxe Gringotts"
        value={`-${fmt(kpi.taxes)} Mornilles`}
        color="text-amber-400"
        sub="prélevée sur retraits"
      />
      <KpiCard
        label="Solde net période"
        value={`${kpi.net >= 0 ? "+" : ""}${fmt(kpi.net)} Mornilles`}
        color={kpi.net >= 0 ? "text-emerald-400" : "text-amber-400"}
        sub="gains − dépenses − taxes"
        highlight
      />
    </div>
  );
}

function KpiCard({
  label,
  value,
  color,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  color: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 border backdrop-blur-md relative overflow-hidden shadow-xl ${
        highlight
          ? "bg-[#1b3026] border-[#c5a059]"
          : "bg-[#111815]/75 border-[#c5a059]/30"
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />
      <p className="text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-xl font-serif font-semibold tabular-nums ${color}`}>{value}</p>
      {sub && <p className="text-xs text-[#e6d5b8]/40 mt-1">{sub}</p>}
    </div>
  );
}