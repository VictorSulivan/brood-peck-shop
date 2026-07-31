import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface BestiaireDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BestiaireDetailPage({ params }: BestiaireDetailPageProps) {
  const { id } = await params;
  const especeId = parseInt(id, 10);

  if (isNaN(especeId)) {
    notFound();
  }

  const espece = await prisma.espece.findUnique({
    where: { id: especeId },
    include: {
      animauxPossedes: {
        include: {
          entreprise: {
            select: { nom: true },
          },
        },
        orderBy: { dateAcquisition: "desc" },
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

  if (!espece) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* En-tête & Bouton Retour */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#c5a059]/20">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/bestiaire"
              className="text-xs text-[#c5a059] hover:underline flex items-center gap-1 font-medium"
            >
              ← Bestiaire
            </Link>
            <span className="text-xs text-[#c5a059]/40">•</span>
            <span className="text-xs text-[#c5a059]/70 uppercase tracking-widest font-semibold">
              {espece.type === "creature_magique" ? "Créature Magique" : "Animal de Compagnie"}
            </span>
          </div>

          <h1 className="text-3xl font-bold font-serif text-[#e6d5b8] flex items-center gap-3">
            <span>🐉</span> {espece.nom}
          </h1>
        </div>

        {/* Badge Dangerosité */}
        <div className="flex items-center gap-2 bg-[#0a0e0c]/80 border border-[#c5a059]/30 px-4 py-2 rounded-xl self-start sm:self-auto">
          <span className="text-xs text-[#c5a059] font-medium uppercase tracking-wider">Dangerosité :</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <span
                key={lvl}
                className={`text-sm ${
                  lvl <= espece.dangerosite ? "text-amber-400 font-bold" : "text-[#e6d5b8]/15"
                }`}
              >
                ★
              </span>
            ))}
            <span className="text-xs text-[#e6d5b8] font-bold ml-1">({espece.dangerosite}/5)</span>
          </div>
        </div>
      </div>

      {/* Fiche Technique Principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne Gauche : Détails & Attributs */}
        <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-6 shadow-xl space-y-6 lg:col-span-1 h-fit">
          <h2 className="text-base font-serif font-semibold text-[#e6d5b8] border-b border-[#c5a059]/15 pb-2">
            📊 Fiche Signalétique
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <span className="block text-[#c5a059] uppercase tracking-wider font-medium mb-1">Habitat naturel</span>
              <p className="text-[#e6d5b8] bg-[#0a0e0c]/80 border border-[#c5a059]/15 p-2.5 rounded-lg italic">
                {espece.habitat || "Habitat non documenté"}
              </p>
            </div>

            <div>
              <span className="block text-[#c5a059] uppercase tracking-wider font-medium mb-1">
                Régime Alimentaire
              </span>
              <p className="text-[#e6d5b8] bg-[#0a0e0c]/80 border border-[#c5a059]/15 p-2.5 rounded-lg">
                {espece.regimeAlimentaire || "Non précisé"}
              </p>
            </div>

            <div>
              <span className="block text-[#c5a059] uppercase tracking-wider font-medium mb-1">⚡ Points Forts</span>
              <p className="text-[#e6d5b8] bg-[#0a0e0c]/80 border border-[#c5a059]/15 p-2.5 rounded-lg">
                {espece.pointsForts || "Aucun point fort répertorié"}
              </p>
            </div>

            <div>
              <span className="block text-[#c5a059] uppercase tracking-wider font-medium mb-1">🛡️ Points Faibles</span>
              <p className="text-[#e6d5b8] bg-[#0a0e0c]/80 border border-[#c5a059]/15 p-2.5 rounded-lg">
                {espece.pointsFaibles || "Aucun point faible répertorié"}
              </p>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Description & Sections associées */}
        <div className="lg:col-span-2 space-y-6">
          {/* Encyclopédie / Description */}
          <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-6 shadow-xl space-y-3">
            <h2 className="text-base font-serif font-semibold text-[#e6d5b8] border-b border-[#c5a059]/15 pb-2 flex items-center gap-2">
              <span>📜</span> Description Encyclopédique
            </h2>
            <p className="text-sm text-[#e6d5b8]/80 leading-relaxed whitespace-pre-line">
              {espece.description || "Aucune description n'a été saisie dans le grimoire pour cette espèce."}
            </p>
          </div>

          {/* Spécimens en possession */}
          <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#c5a059]/15 pb-2">
              <h2 className="text-base font-serif font-semibold text-[#e6d5b8] flex items-center gap-2">
                <span>🐾</span> Spécimens Répertoriés ({espece.animauxPossedes.length})
              </h2>
            </div>

            {espece.animauxPossedes.length === 0 ? (
              <p className="text-xs text-[#e6d5b8]/40 italic py-2">
                Aucun individu de cette espèce n&apos;est actuellement maintenu en captivité ou enregistre.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {espece.animauxPossedes.map((animal) => (
                  <div
                    key={animal.id}
                    className="bg-[#0a0e0c]/80 border border-[#c5a059]/20 rounded-lg p-3 space-y-1.5"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-serif font-medium text-[#e6d5b8] text-sm">{animal.nom}</span>
                      {animal.sante && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                          {animal.sante}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#c5a059]/70 flex justify-between pt-1">
                      <span>{animal.entreprise.nom}</span>
                      <span>Acquis le {new Date(animal.dateAcquisition).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rapports d'Observation */}
          <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-serif font-semibold text-[#e6d5b8] border-b border-[#c5a059]/15 pb-2 flex items-center gap-2">
              <span>🔍</span> Rapports d&apos;Observation sur le terrain ({espece.rapports.length})
            </h2>

            {espece.rapports.length === 0 ? (
              <p className="text-xs text-[#e6d5b8]/40 italic py-2">
                Aucun rapport de terrain n&apos;a encore été consigné pour cette espèce.
              </p>
            ) : (
              <div className="space-y-3">
                {espece.rapports.map((rapport) => (
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