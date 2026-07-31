import { prisma } from "@/lib/db/prisma";
import NouveauRestockForm from "@/components/stock/NouveauRestockForm";

export default async function RestockPage() {
  const produitsRaw = await prisma.produit.findMany({
    where: { actif: true },
    orderBy: { nom: "asc" },
  });

  const produits = produitsRaw.map((p) => ({
    ...p,
    prixAchat: typeof p.prixAchat === "object" && p.prixAchat !== null && "toNumber" in p.prixAchat
      ? (p.prixAchat as { toNumber: () => number }).toNumber()
      : Number(p.prixAchat),
    prixVente: typeof p.prixVente === "object" && p.prixVente !== null && "toNumber" in p.prixVente
      ? (p.prixVente as { toNumber: () => number }).toNumber()
      : Number(p.prixVente),
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-medium text-[#e6d5b8]">Nouveau Restock ✨</h1>
        <p className="text-[#c5a059]/70 text-sm mt-1 italic">
          Ajoutez de nouveaux spécimens et articles au stock.
        </p>
      </div>

      <NouveauRestockForm produits={produits} />
    </div>
  );
}