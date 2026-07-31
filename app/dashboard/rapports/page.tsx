import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { fmtDate } from "@/utils/formatDate";

export const dynamic = "force-dynamic";

export default async function RapportsPage() {
  const rapports = await prisma.rapportObservation.findMany({
    include: { employe: true, espece: true, animal: true },
    orderBy: { dateObservation: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#c5a059]/20">
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-[#e6d5b8] flex items-center gap-3 font-serif">
            <span>📖</span> Rapports d&apos;Observation
          </h1>
          <p className="text-xs text-[#c5a059]/70 mt-1 italic">
            Notes de terrain, expéditions naturalistes et comptes-rendus magizoologiques
          </p>
        </div>

        <Link
          href="/dashboard/rapports/nouveau"
          className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-amber-800 to-amber-950 hover:from-amber-700 hover:to-amber-900 border border-[#c5a059]/50 text-[#f3e9d2] text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-black/40 active:scale-[0.98]"
        >
          <span className="text-base leading-none">✍️</span>
          <span>Rédiger un rapport</span>
        </Link>
      </div>

      {/* Liste des Rapports */}
      <div className="space-y-4">
        {rapports.map((r) => (
          <div
            key={r.id}
            className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-6 space-y-3 shadow-xl transition-all hover:border-[#c5a059]/40"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <span className="text-xs text-[#c5a059]/70 italic">
                  {fmtDate(r.dateObservation, { day: "2-digit", month: "2-digit", year: "numeric" })}
                  {" · par "}
                  <strong className="text-[#e6d5b8] font-medium font-serif">
                    {r.employe.prenom} {r.employe.nom}
                  </strong>
                  {r.lieu && ` (${r.lieu})`}
                </span>
                <h2 className="text-lg font-serif font-medium text-[#e6d5b8] mt-1">{r.titre}</h2>
              </div>

              {/* Badges d'association */}
              <div className="flex flex-wrap gap-2 shrink-0">
                {r.espece && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#1b3026] text-[#e6d5b8] border border-[#c5a059]/30 font-medium">
                    Espèce : {r.espece.nom}
                  </span>
                )}
                {r.animal && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30 font-medium">
                    Specimen : {r.animal.nom}
                  </span>
                )}
              </div>
            </div>

            {/* Contenu façon parchemin / note de terrain */}
            <p className="text-sm text-[#e6d5b8]/80 whitespace-pre-wrap bg-[#0a0e0c]/80 p-4 rounded-lg border border-[#c5a059]/15 font-sans leading-relaxed">
              {r.contenu}
            </p>
          </div>
        ))}

        {/* État vide */}
        {rapports.length === 0 && (
          <div className="text-center py-16 text-[#e6d5b8]/40 bg-[#0a0e0c]/60 border border-[#c5a059]/20 rounded-xl italic">
            Aucun rapport d&apos;observation consignations au registre.
          </div>
        )}
      </div>
    </div>
  );
}