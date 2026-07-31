import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import EmployeEditForm from "@/components/employes/EmployeEditForm";
import { fmtDate } from "@/utils/formatDate";
import Link from "next/link";

export default async function EmployePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const employe = await prisma.employe.findUnique({
    where: { id: parseInt(id) },
    include: {
      utilisateur: true,
      rolesHistorique: { orderBy: { dateChangement: "desc" } },
      ventes: {
        orderBy: { dateVente: "desc" },
        take: 5,
        include: { client: true },
      },
      primes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!employe) notFound();

  const totalVentes = await prisma.vente.aggregate({
    where: { employeId: employe.id, statut: "validee" },
    _sum: { montantTotal: true },
    _count: true,
  });

  const roleColor: Record<string, string> = {
    patron:    "bg-amber-950/80 text-amber-300 border-amber-500/40",
    co_patron: "bg-[#1b3026] text-[#e6d5b8] border-[#c5a059]/40",
    employe:   "bg-[#0a0e0c] text-[#e6d5b8]/80 border-[#c5a059]/20",
    stagiaire: "bg-[#0a0e0c]/40 text-[#e6d5b8]/50 border-white/10",
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Navigation retour & Header */}
      <div>
        <Link
          href="/dashboard/employes"
          className="text-xs text-[#c5a059]/70 hover:text-[#e6d5b8] transition-colors mb-4 inline-block"
        >
          ← Retour au registre des employés
        </Link>
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#c5a059]/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#1b3026] border border-[#c5a059]/50 flex items-center justify-center text-[#e6d5b8] text-xl font-serif font-bold uppercase shadow-inner">
              {employe.prenom[0]}{employe.nom[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif text-[#e6d5b8]">
                {employe.prenom} {employe.nom}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2.5 py-0.5 rounded-full border capitalize font-medium ${roleColor[employe.role] ?? ""}`}>
                  {employe.role.replace("_", " ")}
                </span>
                {employe.utilisateur && (
                  <span className="text-xs text-[#c5a059]/70">@{employe.utilisateur.username}</span>
                )}
              </div>
            </div>
          </div>
          <Link
            href={`/dashboard/employes/${employe.id}/contrats`}
            className="text-xs text-[#e6d5b8] bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 px-3 py-2 rounded-lg transition-colors font-medium flex items-center gap-1.5"
          >
            <span>📄</span> Contrats
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Ventes conclues", value: totalVentes._count.toString() },
          { label: "CA généré",        value: `${(totalVentes._sum.montantTotal ?? 0).toLocaleString("fr-FR")} Mornilles` },
          { label: "Salaire",          value: employe.salaire ? `${employe.salaire.toLocaleString("fr-FR")} Mornilles` : "—" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-4 shadow-md">
            <p className="text-lg font-serif font-bold text-[#e6d5b8] truncate">{value}</p>
            <p className="text-[#c5a059]/70 text-xs mt-1 uppercase tracking-wider font-serif">{label}</p>
          </div>
        ))}
      </div>

      {/* Formulaire édition */}
      <EmployeEditForm
        employe={{
          id: employe.id,
          nom: employe.nom,
          prenom: employe.prenom,
          role: employe.role,
          salaire: employe.salaire,
          notes: employe.notes,
        }}
      />

      {/* Historique rôles */}
      {employe.rolesHistorique.length > 0 && (
        <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-5 shadow-xl">
          <p className="text-xs text-[#c5a059] uppercase tracking-wider font-semibold font-serif mb-4 border-b border-[#c5a059]/20 pb-2">
            📜 Historique des Rôles
          </p>
          <div className="space-y-3">
            {employe.rolesHistorique.map((h) => (
              <div key={h.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-[#e6d5b8]/70">
                  {h.ancienRole ? (
                    <>
                      <span className="capitalize">{h.ancienRole.replace("_", " ")}</span>
                      <span className="text-[#c5a059]/40">→</span>
                      <span className="text-[#e6d5b8] font-medium capitalize">{h.nouveauRole?.replace("_", " ")}</span>
                    </>
                  ) : (
                    <span className="text-[#e6d5b8] font-medium">Embauche initiale — <span className="capitalize">{h.nouveauRole?.replace("_", " ")}</span></span>
                  )}
                </div>
                <span className="text-[#e6d5b8]/40 text-xs">
                  {fmtDate(h.dateChangement, { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dernières ventes */}
      {employe.ventes.length > 0 && (
        <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-5 shadow-xl">
          <p className="text-xs text-[#c5a059] uppercase tracking-wider font-semibold font-serif mb-4 border-b border-[#c5a059]/20 pb-2">
            🛒 Dernières transactions
          </p>
          <div className="space-y-2.5">
            {employe.ventes.map((v) => (
              <div key={v.id} className="flex items-center justify-between text-sm py-1 border-b border-[#c5a059]/10 last:border-none">
                <span className="text-[#e6d5b8]/80 font-serif">
                  {v.client.prenom} {v.client.nom}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-[#e6d5b8] font-serif font-medium">
                    {v.montantTotal.toLocaleString("fr-FR")} Mornilles
                  </span>
                  <span className="text-[#e6d5b8]/40 text-xs">
                    {fmtDate(v.dateVente, { day: "2-digit", month: "short" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}