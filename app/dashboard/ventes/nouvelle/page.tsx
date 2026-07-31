// Exemple : app/dashboard/ventes/nouvelle/page.tsx
import { prisma } from "@/lib/db/prisma";
import NouvelleVenteForm from "@/components/ventes/NouvelleVenteForm"; // Ajuste le chemin

export default async function NouvelleVentePage() {
  // 1. Récupère les données brutes depuis Prisma
  const clientsRaw = await prisma.client.findMany({
    orderBy: { nom: "asc" },
  });

  const produitsRaw = await prisma.produit.findMany({
    orderBy: { nom: "asc" },
    // Optionnel : ne prendre que les produits actifs pour la vente
    where: { actif: true } 
  });

  // 2. Sérialise les types complexes (Prisma.Decimal ou Float selon le schéma -> number)
  const produits = produitsRaw.map(p => ({
    ...p, // On garde toutes les propriétés requises par le type Produit de Prisma
    prixVente: typeof p.prixVente === 'object' && p.prixVente !== null && 'toNumber' in p.prixVente
      ? (p.prixVente as { toNumber: () => number }).toNumber()
      : Number(p.prixVente)
  }));

  // On passe tout l'objet client pour satisfaire le type Client de Prisma attendu par le formulaire
  const clients = clientsRaw.map(c => ({
    ...c
  }));

  // 3. Passe les données nettoyées au composant Client dans l'écrin magizoologique
  return (
    <div className="max-w-4xl mx-auto relative min-h-full pb-12">
      
      {/* Image de fond thématique "Forêt Magique" fixe et immersive */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-25 filter blur-[1px] scale-105 pointer-events-none fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80')`
        }}
      />

      {/* Voile sombre pour l'harmonie */}
      <div className="absolute inset-0 z-0 bg-[#0a0d0c]/70 pointer-events-none fixed" />

      {/* Contenu principal */}
      <div className="relative z-10">
        
        {/* En-tête */}
        <div className="mb-8 border-b border-[#c5a059]/20 pb-5 backdrop-blur-md bg-[#111815]/60 px-6 py-4 rounded-xl shadow-lg">
          <h1 className="text-2xl font-serif font-semibold text-[#e6d5b8]">Nouvelle Transaction 📜</h1>
          <p className="text-[#c5a059]/80 text-xs italic tracking-wider mt-1">Inscrire une nouvelle vente dans le registre du comptoir</p>
        </div>

        {/* Formulaire dans une boîte semi-transparente */}
        <div className="backdrop-blur-md bg-[#111815]/80 border border-[#c5a059]/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c5a059]/30" />
          
          <NouvelleVenteForm clients={clients} produits={produits} />
        </div>

      </div>
    </div>
  );
}