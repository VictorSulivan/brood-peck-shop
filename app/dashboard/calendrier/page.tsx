import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import CalendrierView from "@/components/calendrier/CalendrierView";

export default async function CalendrierPage() {
  const evenements = await prisma.evenement.findMany({
    orderBy: { dateDebut: "asc" },
    include: {
      responsable: true,
      employes: { include: { employe: true } },
      clients: { include: { client: true } },
      consommations: { include: { produit: true } },
    },
  });

  return (
    <div className="space-y-6">
      {/* En-tête du Grimoire */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-900/30">
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-amber-100 flex items-center gap-3">
            <span>📅</span> Calendrier des Festivités
          </h1>
          <p className="text-xs text-amber-200/50 mt-1">
            {evenements.length} événement{evenements.length > 1 ? "s" : ""} consigné{evenements.length > 1 ? "s" : ""} dans le registre
          </p>
        </div>

        {/* Bouton Nouvel Événement - Style Sceau Ambré */}
        <Link
          href="/dashboard/calendrier/nouveau"
          className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-amber-700/80 to-amber-900/80 hover:from-amber-600 hover:to-amber-800 border border-amber-500/40 text-amber-100 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-950/50 active:scale-[0.98]"
        >
          <span className="text-base leading-none">✨</span>
          <span>Nouvel événement</span>
        </Link>
      </div>

      {/* Vue Calendrier */}
      <CalendrierView evenements={JSON.parse(JSON.stringify(evenements))} />
    </div>
  );
}