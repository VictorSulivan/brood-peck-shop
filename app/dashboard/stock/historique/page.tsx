import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { fmtDate } from "@/utils/formatDate";

export const dynamic = "force-dynamic";

export default async function HistoriqueRestocksPage() {
  const restocks = await prisma.restock.findMany({
    orderBy: { dateRestock: "desc" },
    include: {
      employe: true,
      produits: {
        include: { produit: true },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto relative min-h-full overflow-hidden pb-12">
      {/* Image de fond thématique */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-25 filter blur-[1px] scale-105 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80')` 
        }}
      />
      <div className="absolute inset-0 z-0 bg-[#0a0d0c]/70 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center backdrop-blur-md bg-[#111815]/60 border border-[#c5a059]/20 px-6 py-4 rounded-xl shadow-lg">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-[#e6d5b8]">Registre des Ravitaillements d'Enclos</h1>
            <p className="text-[#c5a059]/80 text-xs italic tracking-wider mt-1">Suivi des réapprovisionnements physiques sans impact direct sur les coffres Gringotts</p>
          </div>
          <Link
            href="/dashboard/stock/restock"
            className="bg-[#161a15] hover:bg-[#1d231e] border border-[#c5a059]/50 text-[#e6d5b8] text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg flex items-center gap-2"
          >
            ✨ Nouveau Restock
          </Link>
        </div>

        {/* Tableau */}
        <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl overflow-hidden shadow-xl relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/40" />
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#c5a059]/20 bg-[#0a0e0c]/50 text-[#c5a059] text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Date & Heure</th>
                  <th className="p-4 font-medium">Magizoologiste / Soigneur</th>
                  <th className="p-4 font-medium">Spécimens / Ressources intégrés</th>
                  <th className="p-4 font-medium text-right">Valeur Estimée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c5a059]/10 text-sm text-[#e6d5b8]/90">
                {restocks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[#e6d5b8]/40 italic">Aucun ravitaillement consigné dans le registre</td>
                  </tr>
                ) : (
                  restocks.map((r) => (
                    <tr key={r.id} className="hover:bg-[#161a15]/50 transition-colors">
                      <td className="p-4 text-[#e6d5b8]/70 text-xs font-mono">
                        {fmtDate(r.dateRestock, { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="p-4 font-medium text-[#c5a059]">
                        {r.employe.prenom} {r.employe.nom}
                      </td>
                      <td className="p-4 space-y-1">
                        {r.produits.map((p) => (
                          <div key={p.id} className="text-xs text-[#e6d5b8]/70">
                            • <span className="text-[#e6d5b8] font-medium">{p.produit.nom}</span> (x{p.quantite}) 
                            <span className="text-[#c5a059]/60"> — acquis à {p.prixAchatUnitaire} Mornilles/u</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-4 text-right font-serif font-semibold text-[#c5a059]">
                        {r.valeurTotale.toFixed(0)} Mornilles
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}