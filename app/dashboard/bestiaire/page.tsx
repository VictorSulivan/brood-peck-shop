import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BestiairePage() {
  const especes = await prisma.espece.findMany({
    orderBy: { nom: "asc" },
    include: { _count: { select: { animauxPossedes: true } } },
  });

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#c5a059]/20">
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-[#e6d5b8] flex items-center gap-3 font-serif">
            <span>🐉</span> Bestiaire & Espèces
          </h1>
          <p className="text-xs text-[#c5a059]/70 mt-1 italic">
            Encyclopédie des créatures magiques (Dangerosité évaluée de 1 à 5)
          </p>
        </div>

        <Link
          href="/dashboard/bestiaire/nouveau"
          className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-amber-800 to-amber-950 hover:from-amber-700 hover:to-amber-900 border border-[#c5a059]/50 text-[#f3e9d2] text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-black/40 active:scale-[0.98]"
        >
          <span className="text-base leading-none">✨</span>
          <span>Répertorier une espèce</span>
        </Link>
      </div>

      {/* Cartes des Espèces */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {especes.map((e) => (
          <div
            key={e.id}
            className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-5 space-y-3 flex flex-col justify-between shadow-xl transition-all hover:border-[#c5a059]/40"
          >
            <div>
              <div className="flex justify-between items-start gap-2">
                <h2 className="text-lg font-serif font-medium text-[#e6d5b8]">{e.nom}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30 font-semibold shrink-0">
                  Danger : {e.dangerosite}/5
                </span>
              </div>
              <p className="text-xs text-[#c5a059]/70 mt-1 italic">Habitat : {e.habitat || "Inconnu"}</p>
              <p className="text-sm text-[#e6d5b8]/70 mt-3 line-clamp-3">
                {e.description || "Aucune description enregistrée dans l'encyclopédie."}
              </p>
            </div>

            <div className="pt-4 border-t border-[#c5a059]/15 flex justify-between items-center text-xs text-[#e6d5b8]/50">
              <span>
                Specimens répertoriés : <strong className="text-[#e6d5b8] font-semibold">{e._count.animauxPossedes}</strong>
              </span>
              <Link href={`/dashboard/bestiaire/${e.id}`} className="text-[#c5a059] hover:underline font-medium">
                Consulter →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* État vide */}
      {especes.length === 0 && (
        <div className="text-center py-16 text-[#e6d5b8]/40 bg-[#0a0e0c]/60 border border-[#c5a059]/20 rounded-xl space-y-2">
          <p className="italic">Aucune espèce répertoriée dans le bestiaire.</p>
          <Link href="/dashboard/bestiaire/nouveau" className="text-[#c5a059] hover:underline text-sm font-medium inline-block">
            Ajouter la première créature
          </Link>
        </div>
      )}
    </div>
  );
}