import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import StockActions from "@/components/stock/StockActions";
import { fmtDate } from "@/utils/formatDate";

export default async function StockPage() {
  const [produits, derniersRestocks] = await Promise.all([
    prisma.produit.findMany({
      orderBy: { nom: "asc" },
    }),
    prisma.restock.findMany({
      orderBy: { dateRestock: "desc" },
      take: 5,
      include: {
        employe: true,
        produits: {
          include: { produit: true },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-10">
      {/* SECTION PRODUITS */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#e6d5b8]">Stock & Spécimens</h1>
            <p className="text-[#c5a059]/70 text-sm mt-1">{produits.length} articles référencés au registre</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/stock/restock"
              className="flex items-center gap-2 bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 text-[#f3e9d2] text-sm font-medium px-4 py-2.5 rounded-lg transition-all shadow-inner"
            >
              Restock
            </Link>
            <Link
              href="/dashboard/stock/nouveau"
              className="flex items-center gap-2 bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 text-[#f3e9d2] text-sm font-medium px-4 py-2.5 rounded-lg transition-all shadow-inner"
            >
              + Nouveau produit
            </Link>
          </div>
        </div>

        <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl overflow-hidden shadow-xl relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#c5a059]/20">
                <th className="text-left px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Produit</th>
                <th className="text-right px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Stock</th>
                <th className="text-right px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Prix achat</th>
                <th className="text-right px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Prix vente</th>
                <th className="text-right px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Statut</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {produits.map((p) => (
                <tr key={p.id} className="border-b border-[#c5a059]/10 hover:bg-[#c5a059]/5 transition-colors">
                  <td className="px-5 py-4 text-[#e6d5b8] font-medium">{p.nom}</td>
                  <td className="px-5 py-4 text-right">
                    <span className={`font-medium ${p.stock <= 5 ? "text-amber-400" : "text-[#e6d5b8]"}`}>
                      {p.stock}
                      {p.stock <= 5 && <span className="ml-1 text-xs">⚠️</span>}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-[#e6d5b8]/60">${p.prixAchat.toFixed(0)}</td>
                  <td className="px-5 py-4 text-right text-[#e6d5b8] font-serif font-semibold">${p.prixVente.toFixed(0)}</td>
                  <td className="px-5 py-4 text-right">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${
                      p.actif
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-black/20 text-[#e6d5b8]/30 border-[#c5a059]/15"
                    }`}>
                      {p.actif ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <StockActions id={p.id} actif={p.actif} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {produits.length === 0 && (
            <div className="text-center py-16 text-[#e6d5b8]/40 italic">
              Aucun produit enregistré. <Link href="/dashboard/stock/nouveau" className="text-[#c5a059] underline font-medium">Créer le premier</Link>
            </div>
          )}
        </div>
      </div>

      {/* SECTION VERSION RÉDUITE DE L'HISTORIQUE */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-serif font-medium text-[#e6d5b8]">Derniers Réapprovisionnements</h2>
            <p className="text-[#c5a059]/70 text-xs italic mt-0.5">Aperçu des 5 derniers restocks</p>
          </div>
          <Link 
            href="/dashboard/stock/historique" 
            className="text-xs text-[#e6d5b8] hover:text-white border border-[#c5a059]/30 hover:border-[#c5a059] bg-[#1b3026]/50 hover:bg-[#1b3026] px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            Voir l&apos;historique complet →
          </Link>
        </div>

        <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl overflow-hidden text-sm shadow-xl relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />
          <div className="divide-y divide-[#c5a059]/10">
            {derniersRestocks.length === 0 ? (
              <div className="p-6 text-center text-[#e6d5b8]/40 italic">Aucun restock récent.</div>
            ) : (
              derniersRestocks.map((r) => (
                <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#c5a059]/5 transition-colors">
                  <div>
                    <div className="text-xs text-[#c5a059]/80">
                      {fmtDate(r.dateRestock, { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      {" · par "}
                      <span className="text-[#e6d5b8] font-medium">{r.employe.prenom} {r.employe.nom}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-[#e6d5b8]/70">
                      {r.produits.map((p) => (
                        <span key={p.id}>
                          • {p.produit.nom} <span className="text-[#e6d5b8] font-medium">(x{p.quantite})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right sm:border-l sm:border-[#c5a059]/20 sm:pl-4">
                    <span className="text-xs text-[#c5a059]/70 block">Valeur estimée</span>
                    <span className="font-serif font-semibold text-emerald-400">${r.valeurTotale.toFixed(0)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}