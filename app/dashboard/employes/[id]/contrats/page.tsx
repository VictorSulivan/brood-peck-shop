import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import NouveauContratForm from "@/components/employes/NouveauContratForm";
import ContratActions from "@/components/employes/ContratActions";
import Link from "next/link";
import { fmtDate } from "@/utils/formatDate";

export default async function ContratsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const employe = await prisma.employe.findUnique({
    where: { id: parseInt(id) },
    include: { contrats: { orderBy: { dateDebut: "desc" } } },
  });

  if (!employe) notFound();

  const typeColor: Record<string, string> = {
    CDI:         "bg-emerald-950/60 text-emerald-300 border-emerald-500/30",
    "Co-Patron": "bg-[#1b3026] text-[#e6d5b8] border-[#c5a059]/40",
    Stage:       "bg-amber-950/60 text-amber-300 border-amber-500/30",
    Patron:      "bg-amber-900/80 text-amber-200 border-amber-500/50",
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* En-tête avec navigation breadcrumb */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#c5a059]/20">
        <Link
          href={`/dashboard/employes/${id}`}
          className="text-[#c5a059]/70 hover:text-[#e6d5b8] text-sm transition-colors font-serif"
        >
          ← {employe.prenom} {employe.nom}
        </Link>
        <span className="text-[#c5a059]/30">/</span>
        <h1 className="text-2xl font-bold font-serif text-[#e6d5b8] flex items-center gap-2">
          <span>📜</span> Registre des Contrats
        </h1>
      </div>

      <NouveauContratForm employeId={employe.id} />

      <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-[#c5a059]/20 bg-[#0a0e0c]/80">
          <p className="text-xs text-[#c5a059] uppercase tracking-wider font-semibold font-serif">
            Historique des contrats signés
          </p>
        </div>

        {employe.contrats.length === 0 ? (
          <div className="text-center py-12 text-[#e6d5b8]/40 text-sm italic font-serif">
            Aucun contrat enregistré pour cet employé.
          </div>
        ) : (
          <div className="divide-y divide-[#c5a059]/10">
            {employe.contrats.map((c) => (
              <div key={c.id} className="px-5 py-4 hover:bg-[#1b3026]/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
                          typeColor[c.typeContrat] ?? "bg-[#0a0e0c] text-[#e6d5b8]/60 border-[#c5a059]/20"
                        }`}
                      >
                        {c.typeContrat}
                      </span>
                      {c.estActif && (
                        <span className="text-xs bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-medium">
                          Actif
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#c5a059]/70">
                      <span>
                        Du {fmtDate(c.dateDebut, { day: "2-digit", month: "short", year: "numeric" })}
                        {c.dateFin && ` au ${fmtDate(c.dateFin, { day: "2-digit", month: "short", year: "numeric" })}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-serif">
                      {c.salaire && (
                        <span className="text-[#e6d5b8] font-medium">
                          {c.salaire.toLocaleString("fr-FR")} Mornilles / mois
                        </span>
                      )}
                      {c.pourcentagePrime && (
                        <span className="text-amber-400 font-medium">{c.pourcentagePrime}% prime</span>
                      )}
                    </div>
                    {c.commentaire && (
                      <p className="text-[#e6d5b8]/40 text-xs italic">{c.commentaire}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/dashboard/employes/${id}/contrats/${c.id}`}
                      className="text-xs text-[#e6d5b8] bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/30 px-2.5 py-1 rounded-lg transition-colors font-medium"
                    >
                      Consulter le Parchemin (PDF)
                    </Link>
                    <ContratActions id={c.id} estActif={c.estActif} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}