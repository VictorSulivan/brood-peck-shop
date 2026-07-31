import { prisma } from "@/lib/db/prisma";
import { fmtDate } from "@/utils/formatDate";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface RapportDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RapportDetailPage({ params }: RapportDetailPageProps) {
  const { id } = await params;
  const rapportId = parseInt(id, 10);

  if (isNaN(rapportId)) {
    notFound();
  }

  const rapport = await prisma.rapportObservation.findUnique({
    where: { id: rapportId },
    include: {
      employe: true,
      espece: true,
      animal: {
        include: {
          entreprise: {
            select: { nom: true },
          },
        },
      },
    },
  });

  if (!rapport) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* En-tête & Fil d'ariane */}
      <div className="pb-4 border-b border-[#c5a059]/20 space-y-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/rapports"
            className="text-xs text-[#c5a059] hover:underline flex items-center gap-1 font-medium"
          >
            ← Registre des Rapports
          </Link>
          <span className="text-xs text-[#c5a059]/40">•</span>
          <span className="text-xs text-[#c5a059]/70 font-mono">
            Rapport #{rapport.id}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <h1 className="text-3xl font-bold font-serif text-[#e6d5b8]">
            {rapport.titre}
          </h1>

          {/* Badges des liaisons */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {rapport.espece && (
              <Link
                href={`/dashboard/bestiaire/${rapport.espece.id}`}
                className="text-xs px-3 py-1 rounded-full bg-[#1b3026] text-[#e6d5b8] border border-[#c5a059]/40 font-medium hover:border-[#c5a059] transition-colors"
              >
                Espèce : {rapport.espece.nom}
              </Link>
            )}
            {rapport.animal && (
              <Link
                href={`/dashboard/animaux/${rapport.animal.id}`}
                className="text-xs px-3 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/40 font-medium hover:border-amber-400 transition-colors"
              >
                Spécimen : {rapport.animal.nom}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal du rapport (Document Parchemin) */}
      <div className="bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Filigrane décoratif en fond */}
        <div className="absolute top-4 right-6 text-7xl opacity-5 pointer-events-none select-none">
          📜
        </div>

        {/* Métadonnées de l'observation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-[#c5a059]/15 text-xs">
          <div>
            <span className="block text-[#c5a059] uppercase tracking-wider font-semibold mb-1">
              Observateur
            </span>
            <p className="text-[#e6d5b8] font-serif text-sm font-medium">
              {rapport.employe.prenom} {rapport.employe.nom}
            </p>
            <p className="text-[#e6d5b8]/50 capitalize">{rapport.employe.role}</p>
          </div>

          <div>
            <span className="block text-[#c5a059] uppercase tracking-wider font-semibold mb-1">
              Date d&apos;Observation
            </span>
            <p className="text-[#e6d5b8] font-medium text-sm">
              {fmtDate(rapport.dateObservation, {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div>
            <span className="block text-[#c5a059] uppercase tracking-wider font-semibold mb-1">
              Lieu de consignation
            </span>
            <p className="text-[#e6d5b8] font-medium text-sm">
              {rapport.lieu || "Non renseigné"}
            </p>
          </div>
        </div>

        {/* Corps du texte RP */}
        <div className="space-y-2">
          <h2 className="text-xs uppercase tracking-wider text-[#c5a059] font-semibold">
            Compte-Rendu Magizoologique
          </h2>
          <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/15 rounded-lg p-5 text-sm text-[#e6d5b8]/90 font-sans leading-relaxed whitespace-pre-wrap">
            {rapport.contenu}
          </div>
        </div>

        {/* Pied de rapport / Signature */}
        <div className="pt-4 border-t border-[#c5a059]/15 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] text-[#c5a059]/60 gap-2 italic font-serif">
          <span>
            Enregistré dans le grand registre le{" "}
            {new Date(rapport.createdAt).toLocaleDateString("fr-FR")}
          </span>
          <span className="not-italic font-sans text-[10px] text-[#e6d5b8]/40">
            Dernière mise à jour : {new Date(rapport.updatedAt).toLocaleDateString("fr-FR")}
          </span>
        </div>
      </div>

      {/* Cartes récapitulatives des entités associées */}
      {(rapport.espece || rapport.animal) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rapport.espece && (
            <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#c5a059] uppercase tracking-wider font-medium">
                  Espèce Référencée
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 font-semibold border border-amber-500/30">
                  Danger : {rapport.espece.dangerosite}/5
                </span>
              </div>
              <h3 className="text-base font-serif font-semibold text-[#e6d5b8]">
                {rapport.espece.nom}
              </h3>
              <p className="text-xs text-[#e6d5b8]/60 line-clamp-2">
                {rapport.espece.description || "Aucune description enregistrée."}
              </p>
              <div className="pt-2">
                <Link
                  href={`/dashboard/bestiaire/${rapport.espece.id}`}
                  className="text-xs text-[#c5a059] hover:underline font-medium"
                >
                  Consulter la fiche espèce →
                </Link>
              </div>
            </div>
          )}

          {rapport.animal && (
            <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#c5a059] uppercase tracking-wider font-medium">
                  Spécimen Concerné
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#1b3026] text-emerald-300 font-semibold border border-emerald-500/30">
                  Santé : {rapport.animal.sante || "Bonne"}
                </span>
              </div>
              <h3 className="text-base font-serif font-semibold text-[#e6d5b8]">
                {rapport.animal.nom}
              </h3>
              <p className="text-xs text-[#e6d5b8]/60">
                Domaine : {rapport.animal.entreprise.nom}
              </p>
              <div className="pt-2">
                <Link
                  href={`/dashboard/animaux/${rapport.animal.id}`}
                  className="text-xs text-[#c5a059] hover:underline font-medium"
                >
                  Consulter le dossier du spécimen →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}