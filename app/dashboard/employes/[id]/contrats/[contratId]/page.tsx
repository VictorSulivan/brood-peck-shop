import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import ContratPDF from "@/components/contrats/ContratPDF";
import Link from "next/link";

export default async function ContratPage({
  params,
}: {
  params: Promise<{ id: string; contratId: string }>;
}) {
  const { id, contratId } = await params;

  const employeId = parseInt(id, 10);
  const targetContratId = parseInt(contratId, 10);

  if (isNaN(employeId) || isNaN(targetContratId)) {
    notFound();
  }

  const [employe, contrat, entreprise] = await Promise.all([
    prisma.employe.findUnique({ where: { id: employeId } }),
    prisma.contrat.findUnique({ where: { id: targetContratId } }),
    prisma.entreprise.findFirst(),
  ]);

  if (!employe || !contrat) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/dashboard/employes/${id}/contrats`}
          className="text-white/30 hover:text-white text-sm transition-colors"
        >
          ← Contrats
        </Link>
        <span className="text-white/20">/</span>
        <h1 className="text-2xl font-medium text-white">
          Contrat {contrat.typeContrat}
        </h1>
      </div>

      <ContratPDF
        employe={{
          nom: employe.nom,
          prenom: employe.prenom,
          role: employe.role,
          salaire: employe.salaire,
          dateEmbauche: employe.dateEmbauche?.toISOString() ?? null,
        }}
        contrat={{
          typeContrat: contrat.typeContrat,
          dateDebut: contrat.dateDebut.toISOString(),
          dateFin: contrat.dateFin?.toISOString() ?? null,
          salaire: contrat.salaire,
          pourcentagePrime: contrat.pourcentagePrime,
          commentaire: contrat.commentaire,
        }}
        entreprise={entreprise?.nom ?? "Brood & Peck"}
        dateSignature={new Date().toISOString()}
      />
    </div>
  );
}