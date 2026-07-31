import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { fmtDate } from "@/utils/formatDate";

export default async function VentesPage() {
  const ventes = await prisma.vente.findMany({
    orderBy: { dateVente: "desc" },
    take: 50,
    include: {
      client: true,
      employe: true,
      produits: { include: { produit: true } },
    },
  });

  return (
    /* Fix: overflow-hidden pour que le fond ne déborde pas sur la sidebar */
    <div className="max-w-7xl mx-auto relative min-h-full pb-12 rounded-xl overflow-hidden">
      
      {/* Image de fond thématique "Forêt Magique" limitée uniquement au contenu */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-25 filter blur-[1px] scale-105 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80')`
        }}
      />

      {/* Voile sombre appliqué uniquement à cette page */}
      <div className="absolute inset-0 z-0 bg-[#0a0d0c]/70 pointer-events-none" />

      {/* Contenu principal */}
      <div className="relative z-10 p-2">
        
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8 border-b border-[#c5a059]/20 pb-5 backdrop-blur-md bg-[#111815]/60 px-6 py-4 rounded-xl shadow-lg">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-[#e6d5b8]">Registres des Ventes ✨</h1>
            <p className="text-[#c5a059]/80 text-xs italic tracking-wider mt-1">{ventes.length} dernières transactions enregistrées</p>
          </div>
          <Link
            href="/dashboard/ventes/nouvelle"
            className="flex items-center gap-2 bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 text-[#f3e9d2] text-sm font-medium px-4 py-2.5 rounded-lg transition-all shadow-inner tracking-wide"
          >
            + Nouvelle vente
          </Link>
        </div>

        {/* Tableau des ventes */}
        <div className="backdrop-blur-md bg-[#111815]/80 border border-[#c5a059]/30 rounded-xl overflow-hidden shadow-xl relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />
          
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#c5a059]/20 bg-[#0a0e0c]/60">
                <th className="text-left px-5 py-3.5 text-[#c5a059] font-medium text-xs uppercase tracking-wider">#</th>
                <th className="text-left px-5 py-3.5 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Client</th>
                <th className="text-left px-5 py-3.5 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Employé</th>
                <th className="text-left px-5 py-3.5 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Produits</th>
                <th className="text-right px-5 py-3.5 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Total</th>
                <th className="text-right px-5 py-3.5 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {ventes.map((v) => (
                <tr key={v.id} className="border-b border-[#c5a059]/10 hover:bg-[#c5a059]/5 transition-colors">
                  <td className="px-5 py-4 text-[#e6d5b8]/50 font-mono text-xs">#{v.id}</td>
                  <td className="px-5 py-4 text-[#e6d5b8] font-medium">{v.client.prenom} {v.client.nom}</td>
                  <td className="px-5 py-4 text-[#e6d5b8]/70">{v.employe.prenom} {v.employe.nom}</td>
                  <td className="px-5 py-4 text-[#e6d5b8]/70 italic">
                    {v.produits.map((p) => `${p.produit.nom} ×${p.quantite}`).join(", ")}
                  </td>
                  <td className="px-5 py-4 text-right text-[#e6d5b8] font-serif font-semibold">${v.montantTotal.toFixed(0)}</td>
                  <td className="px-5 py-4 text-right text-[#c5a059]/70 text-xs">
                    {fmtDate(v.dateVente, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {ventes.length === 0 && (
            <div className="text-center py-16 text-[#e6d5b8]/50 italic">
              Aucune vente répertoriée. <Link href="/dashboard/ventes/nouvelle" className="text-[#c5a059] underline not-italic">Créer la première</Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}