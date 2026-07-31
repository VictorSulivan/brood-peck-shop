import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import HistoriqueTableau from "@/components/gringotts/HistoriqueTableau";

const TYPES_TRANSACTION = ["vente", "versement", "retrait", "salaire", "prime", "taxe", "achat"];

// Interface pour récupérer les filtres depuis l'URL (Ex: ?type=vente&employeId=...)
interface PageProps {
  searchParams: Promise<{ type?: string; employeId?: string; search?: string }>;
}

export default async function HistoriqueGringottsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentType = params.type || "";
  const currentEmployeId = params.employeId || "";
  const currentSearch = params.search || "";

  // 1. Récupérer la liste des employés pour le filtre déroulant
  const employes = await prisma.employe.findMany({
    orderBy: { prenom: "asc" },
  });

  // 2. Construire la condition de filtrage Prisma dynamiquement
  const whereClause: Prisma.TransactionGringottsWhereInput = {};
  
  if (currentType) {
    whereClause.typeTransaction = currentType;
  }
  if (currentEmployeId) {
    const parsedId = parseInt(currentEmployeId, 10);
    if (!isNaN(parsedId)) {
      whereClause.employeId = parsedId;
    }  
  }
  if (currentSearch) {
    whereClause.description = {
      contains: currentSearch,
      mode: 'insensitive',
    };
  }

  // 3. Charger TOUTES les transactions filtrées
  const transactions = await prisma.transactionGringotts.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: 200, 
    include: { employe: true },
  });

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/dashboard/gringotts" className="text-xs text-[#c5a059]/70 hover:text-[#e6d5b8] transition-colors mb-2 inline-block">
            ← Retour aux finances
          </Link>
          <h1 className="text-2xl font-serif font-medium text-[#e6d5b8]">Historique complet</h1>
        </div>
        <div className="text-sm text-[#c5a059]/70 italic">
          {transactions.length} transaction(s) trouvée(s)
        </div>
      </div>

      {/* BARRE DE FILTRES */}
      <form method="GET" className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6 backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl p-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />
        
        {/* Recherche textuelle */}
        <div>
          <label className="block text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1">Recherche</label>
          <input 
            type="text" 
            name="search"
            defaultValue={currentSearch}
            placeholder="Description label" 
            className="w-full bg-[#111815] border border-[#c5a059]/20 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] placeholder-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059]/60 transition-colors"
          />
        </div>

        {/* Filtre par Type */}
        <div>
          <label className="block text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1">Type de mouvement</label>
          <select 
            name="type" 
            defaultValue={currentType}
            className="w-full bg-[#111815] border border-[#c5a059]/20 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] focus:outline-none focus:border-[#c5a059]/60 transition-colors"
          >
            <option value="" className="bg-[#111815] text-[#e6d5b8]/50">Tous les types</option>
            {TYPES_TRANSACTION.map((type) => (
              <option key={type} value={type} className="bg-[#111815] text-[#e6d5b8]">{type}</option>
            ))}
          </select>
        </div>

        {/* Filtre par Employé */}
        <div>
          <label className="block text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1">Par Employé</label>
          <select 
            name="employeId" 
            defaultValue={currentEmployeId}
            className="w-full bg-[#111815] border border-[#c5a059]/20 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] focus:outline-none focus:border-[#c5a059]/60 transition-colors"
          >
            <option value="" className="bg-[#111815] text-[#e6d5b8]/50">Tous les employés</option>
            {employes.map((e) => (
              <option key={e.id} value={e.id} className="bg-[#111815] text-[#e6d5b8]">{e.prenom} {e.nom}</option>
            ))}
          </select>
        </div>

        {/* Boutons d'actions */}
        <div className="flex items-end gap-2">
          <button 
            type="submit" 
            className="flex-1 bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 text-[#f3e9d2] text-sm font-medium rounded-lg py-2 transition-all shadow-inner"
          >
            Filtrer
          </button>
          {(currentType || currentEmployeId || currentSearch) && (
            <Link 
              href="/dashboard/gringotts/historique" 
              className="px-3 py-2 bg-black/20 hover:bg-black/40 border border-[#c5a059]/20 text-[#e6d5b8]/70 hover:text-[#e6d5b8] text-sm rounded-lg text-center transition-colors"
            >
              Reset
            </Link>
          )}
        </div>
      </form>

      {/* TABLEAU DES RÉSULTATS */}
      <HistoriqueTableau transactions={transactions} employes={employes} />
    </div>
  );
}