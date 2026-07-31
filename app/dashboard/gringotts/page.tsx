import { prisma } from "@/lib/db/prisma";
import CalculateurTaxe from "@/components/gringotts/CalculateurTaxe";
import Link from "next/link";
import { fmtDate } from "@/utils/formatDate";

const POSITIF = ["vente", "versement"];

export default async function GringottsPage() {
  const [gringotts, transactions] = await Promise.all([
    prisma.gringotts.findFirst({ include: { entreprise: true } }),
    prisma.transactionGringotts.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { employe: true, vente: { include: { client: true } } },
    }),
  ]);

  const solde = gringotts?.solde ?? 0;

  const aujourd = new Date();
  aujourd.setHours(0, 0, 0, 0);

  const revenusJour = transactions
    .filter((t) => POSITIF.includes(t.typeTransaction ?? "") && new Date(t.createdAt) >= aujourd)
    .reduce((acc, t) => acc + (t.montant ?? 0), 0);

  const depensesJour = transactions
    .filter((t) => !POSITIF.includes(t.typeTransaction ?? "") && new Date(t.createdAt) >= aujourd)
    .reduce((acc, t) => acc + (t.montant ?? 0), 0);

  const stats = [
    { label: "Solde actuel",           value: `${solde.toLocaleString("fr-FR")} Mornilles`, color: "text-[#e6d5b8]" },
    { label: "Revenus aujourd'hui",    value: `+${revenusJour.toFixed(0)} Mornilles`,        color: "text-emerald-400" },
    { label: "Dépenses aujourd'hui",   value: `${depensesJour.toFixed(0)} Mornilles`,       color: "text-amber-400" },
    { label: "Transactions (Récentes)",value: transactions.length.toString(),       color: "text-[#e6d5b8]" },
  ];

  const typeBadge: Record<string, string> = {
    vente:     "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    versement: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    retrait:   "bg-red-500/10 text-red-400 border-red-500/20",
    salaire:   "bg-red-500/10 text-red-400 border-red-500/20",
    prime:     "bg-amber-500/10 text-amber-400 border-amber-500/20",
    taxe:      "bg-amber-500/10 text-amber-400 border-amber-500/20",
    achat:     "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <div>
      {/* En-tête avec lien analyse */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#e6d5b8]">Gringotts</h1>
          <p className="text-[#c5a059]/70 text-sm mt-1">
            Économie de {gringotts?.entreprise.nom ?? "l'entreprise"}
          </p>
        </div>
        <Link
          href="/dashboard/gringotts/analyse"
          className="flex items-center gap-2 text-xs text-[#e6d5b8] hover:text-white border border-[#c5a059]/30 hover:border-[#c5a059] bg-[#1b3026]/50 hover:bg-[#1b3026] rounded-lg px-3.5 py-2 font-medium transition-all shadow-inner"
        >
          <span>📊</span>
          Analyse financière
        </Link>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />
            <p className={`text-2xl font-serif font-semibold ${color}`}>{value}</p>
            <p className="text-[#c5a059]/70 text-xs mt-1 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      <CalculateurTaxe />

      <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl overflow-hidden shadow-xl relative mt-8">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />
        <div className="px-5 py-4 border-b border-[#c5a059]/20 flex justify-between items-center">
          <p className="text-[#c5a059] text-xs font-medium uppercase tracking-wider">Dernières transactions</p>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/gringotts/analyse"
              className="text-xs text-[#e6d5b8]/50 hover:text-[#c5a059] transition-colors"
            >
              Analyser →
            </Link>
            <Link
              href="/dashboard/gringotts/historique"
              className="text-xs text-[#c5a059] hover:underline font-medium"
            >
              Voir tout l&apos;historique →
            </Link>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#c5a059]/20">
              <th className="text-left px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Type</th>
              <th className="text-left px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Description</th>
              <th className="text-left px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Employé</th>
              <th className="text-right px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Montant</th>
              <th className="text-right px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => {
              const isPositif = POSITIF.includes(t.typeTransaction ?? "");
              return (
                <tr key={t.id} className="border-b border-[#c5a059]/10 hover:bg-[#c5a059]/5 transition-colors">
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${typeBadge[t.typeTransaction ?? ""] ?? "bg-black/20 text-[#e6d5b8]/50 border-[#c5a059]/15"}`}>
                      {t.typeTransaction ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#e6d5b8]/70">{t.description ?? "—"}</td>
                  <td className="px-5 py-4 text-[#e6d5b8]/70">
                    {t.employe ? `${t.employe.prenom} ${t.employe.nom}` : "—"}
                  </td>
                  <td className={`px-5 py-4 text-right font-serif font-semibold ${isPositif ? "text-emerald-400" : "text-amber-400"}`}>
                    {isPositif ? "+" : "-"}${t.montant?.toFixed(0) ?? "0"}
                  </td>
                  <td className="px-5 py-4 text-right text-[#c5a059]/60 text-xs">
                    {fmtDate(t.createdAt, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div className="text-center py-16 text-[#e6d5b8]/40 italic">Aucune transaction pour le moment.</div>
        )}
        {transactions.length > 0 && (
          <div className="p-4 border-t border-[#c5a059]/10 text-center bg-black/10">
            <Link
              href="/dashboard/gringotts/historique"
              className="text-sm text-[#c5a059] hover:text-[#e6d5b8] transition-colors font-medium"
            >
              Afficher les transactions plus anciennes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}