import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BestiairePage() {
  const especes = await prisma.espece.findMany({
    orderBy: { nom: "asc" },
    include: { _count: { select: { animauxPossedes: true } } }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-white">Bestiaire & Espèces</h1>
          <p className="text-white/40 text-sm mt-1">Encyclopédie des créatures de la région (Dangerosité de 1 à 5)</p>
        </div>
        <Link
          href="/dashboard/bestiaire/nouveau"
          className="bg-[#2a2250] hover:bg-[#342b6e] border border-[#3d3580] text-[#c4bbff] text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          + Répertorier une espèce
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {especes.map((e) => (
          <div key={e.id} className="bg-[#16162a] border border-white/10 rounded-xl p-5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-medium text-white">{e.nom}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
                  Danger : {e.dangerosite}/5
                </span>
              </div>
              <p className="text-xs text-white/40 mt-1">Habitat : {e.habitat || "Inconnu"}</p>
              <p className="text-sm text-white/70 mt-3 line-clamp-3">{e.description || "Aucune description enregistrée."}</p>
            </div>
            
            <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-white/50">
              <span>Animaux possédés : <strong className="text-white">{e._count.animauxPossedes}</strong></span>
              <Link href={`/dashboard/bestiaire/${e.id}`} className="text-[#c4bbff] hover:underline">
                Détails →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {especes.length === 0 && (
        <div className="text-center py-16 text-white/30 bg-[#16162a] border border-white/10 rounded-xl">
          Aucune espèce répertoriée. <Link href="/dashboard/bestiaire/nouveau" className="text-[#a89af9] underline">Ajouter la première</Link>
        </div>
      )}
    </div>
  );
}