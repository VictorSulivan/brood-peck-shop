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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-white">Rapports d&apos;Observation</h1>
          <p className="text-white/40 text-sm mt-1">Notes de terrain, expéditions naturalistes et rapports magizoologiques</p>
        </div>
        <Link
          href="/dashboard/rapports/nouveau"
          className="bg-[#2a2250] hover:bg-[#342b6e] border border-[#3d3580] text-[#c4bbff] text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          + Rédiger un rapport
        </Link>
      </div>

      <div className="space-y-4">
        {rapports.map((r) => (
          <div key={r.id} className="bg-[#16162a] border border-white/10 rounded-xl p-6 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-white/40">
                  {fmtDate(r.dateObservation, { day: "2-digit", month: "2-digit", year: "numeric" })}
                  {" · par "}
                  <strong className="text-[#c4bbff]">{r.employe.prenom} {r.employe.nom}</strong>
                  {r.lieu && ` (${r.lieu})`}
                </span>
                <h2 className="text-lg font-medium text-white mt-1">{r.titre}</h2>
              </div>
              <div className="flex gap-2">
                {r.espece && <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Espèce : {r.espece.nom}</span>}
                {r.animal && <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Animal : {r.animal.nom}</span>}
              </div>
            </div>
            <p className="text-sm text-white/80 whitespace-pre-wrap bg-black/20 p-4 rounded-lg border border-white/5">{r.contenu}</p>
          </div>
        ))}

        {rapports.length === 0 && (
          <div className="text-center py-16 text-white/30 bg-[#16162a] border border-white/10 rounded-xl">
            Aucun rapport d&apos;observation rédigé.
          </div>
        )}
      </div>
    </div>
  );
}