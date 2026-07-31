import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface AnimalDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AnimalDetailPage({ params }: AnimalDetailPageProps) {
  const { id } = await params;
  const animalId = parseInt(id, 10);

  if (isNaN(animalId)) {
    notFound();
  }

  const animal = await prisma.animal.findUnique({
    where: { id: animalId },
    include: {
      espece: true,
      entreprise: {
        select: { id: true, nom: true },
      },
      produits: {
        where: { actif: true },
        orderBy: { nom: "asc" },
      },
      rapports: {
        include: {
          employe: {
            select: { nom: true, prenom: true },
          },
        },
        orderBy: { dateObservation: "desc" },
      },
    },
  });

  if (!animal) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* En-tête & Fil d'ariane */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#c5a059]/20">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/animaux"
              className="text-xs text-[#c5a059] hover:underline flex items-center gap-1 font-medium"
            >
              ← Cheptel
            </Link>
            <span className="text-xs text-[#c5a059]/40">•</span>
            <Link
              href={`/dashboard/bestiaire/${animal.especeId}`}
              className="text-xs text-[#c5a059]/80 hover:underline uppercase tracking-widest font-semibold"
            >
              Espèce : {animal.espece.nom}
            </Link>
          </div>

          <h1 className="text-3xl font-bold font-serif text-[#e6d5b8] flex items-center gap-3">
            <span>🐾</span> {animal.nom}
          </h1>
        </div>

        {/* État de Santé & Badge Dangerosité */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1b3026] text-[#e6d5b8] border border-[#c5a059]/40 shadow-sm">
            Santé : {animal.sante || "Bonne"}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-500/30">
            Dangerosité : {animal.espece.dangerosite}/5
          </span>
        </div>
      </div>

      {/* Grille d'informations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne Gauche : Information Individuelle */}
        <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-6 shadow-xl space-y-6 lg:col-span-1 h-fit">
          <h2 className="text-base font-serif font-semibold text-[#e6d5b8] border-b border-[#c5a059]/15 pb-2">
            📊 Fiche Individuelle
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <span className="block text-[#c5a059] uppercase tracking-wider font-medium mb-1">
                Domaine / Propriétaire
              </span>
              <p className="text-[#e6d5b8] bg-[#0a0e0c]/80 border border-[#c5a059]/15 p-2.5 rounded-lg font-medium">
                {animal.entreprise.nom}
              </p>
            </div>

            <div>
              <span className="block text-[#c5a059] uppercase tracking-wider font-medium mb-1">
                Date d&apos;acquisition / Consignation
              </span>
              <p className="text-[#e6d5b8] bg-[#0a0e0c]/80 border border-[#c5a059]/15 p-2.5 rounded-lg">
                {new Date(animal.dateAcquisition).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              <span className="block text-[#c5a059] uppercase tracking-wider font-medium mb-1">
                Régime & Habitat (Espèce)
              </span>
              <div className="bg-[#0a0e0c]/80 border border-[#c5a059]/15 p-2.5 rounded-lg space-y-1 text-[#e6d5b8]/80">
                <p>📍 Habitat : {animal.espece.habitat || "Inconnu"}</p>
                <p>🍖 Régime : {animal.espece.regimeAlimentaire || "Non spécifié"}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#c5a059]/15">
              <Link
                href={`/dashboard/bestiaire/${animal.espece.id}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0a0e0c] hover:bg-[#111815] border border-[#c5a059]/40 text-[#c5a059] text-xs font-semibold py-2 rounded-lg transition-colors"
              >
                📜 Voir la fiche d&apos;espèce complète →
              </Link>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Produits issus & Observations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Produits dérivés / Récoltés */}
          <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-serif font-semibold text-[#e6d5b8] border-b border-[#c5a059]/15 pb-2 flex items-center gap-2">
              <span>🧪</span> Produits Derivés & Récoltes ({animal.produits.length})
            </h2>

            {animal.produits.length === 0 ? (
              <p className="text-xs text-[#e6d5b8]/40 italic py-1">
                Aucun produit d&apos;élevage ou d&apos;ingrédient n&apos;est actuellement rattaché à cet animal.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {animal.produits.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-[#0a0e0c]/80 border border-[#c5a059]/20 rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-serif font-medium text-[#e6d5b8] text-sm block">
                        {prod.nom}
                      </span>
                      <span className="text-[11px] text-[#c5a059]/70">
                        Stock : {prod.stock} unité(s)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-emerald-400 block">
                        {prod.prixVente} Galleons
                      </span>
                      <span className="text-[10px] text-[#e6d5b8]/40 uppercase">
                        {prod.origine}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rapports d'Observation dédiés */}
          <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-serif font-semibold text-[#e6d5b8] border-b border-[#c5a059]/15 pb-2 flex items-center gap-2">
              <span>📜</span> Carnet de Suivi & Observations ({animal.rapports.length})
            </h2>

            {animal.rapports.length === 0 ? (
              <p className="text-xs text-[#e6d5b8]/40 italic py-1">
                Aucun rapport médical ou note d&apos;observation n&apos;a encore été rédigé pour {animal.nom}.
              </p>
            ) : (
              <div className="space-y-3">
                {animal.rapports.map((rapport) => (
                  <div
                    key={rapport.id}
                    className="bg-[#0a0e0c]/80 border border-[#c5a059]/20 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-semibold text-[#e6d5b8] font-serif">{rapport.titre}</h3>
                      <span className="text-[10px] text-[#c5a059]/60 shrink-0">
                        {new Date(rapport.dateObservation).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <p className="text-xs text-[#e6d5b8]/70 whitespace-pre-line leading-relaxed">
                      {rapport.contenu}
                    </p>
                    <div className="text-[10px] text-[#c5a059]/60 pt-2 border-t border-[#c5a059]/10 flex justify-between">
                      <span>Rédigé par : {rapport.employe.prenom} {rapport.employe.nom}</span>
                      {rapport.lieu && <span>Lieu : {rapport.lieu}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}