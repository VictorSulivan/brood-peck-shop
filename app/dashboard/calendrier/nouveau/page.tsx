import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import NouvelEvenementForm from "@/components/calendrier/NouvelEvenementForm";

export default async function NouvelEvenementPage() {
  const [employes, clients, produits] = await Promise.all([
    prisma.employe.findMany({ where: { actif: true }, orderBy: { nom: "asc" } }),
    prisma.client.findMany({ orderBy: { nom: "asc" } }),
    prisma.produit.findMany({ where: { actif: true }, orderBy: { nom: "asc" } }),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <Link
          href="/dashboard/calendrier"
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors mb-3"
        >
          ← Retour au calendrier
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Planifier un événement</h1>
        <p className="text-xs text-white/40 mt-1">Configurez une réservation, attribuez l'équipe et prévoyez les consommations</p>
      </div>

      <NouvelEvenementForm
        employes={JSON.parse(JSON.stringify(employes))}
        clients={JSON.parse(JSON.stringify(clients))}
        produits={JSON.parse(JSON.stringify(produits))}
      />
    </div>
  );
}