"use client";

import { Produit } from "@prisma/client";

type ConsoItem = { produitId: number; nom: string; quantite: number; prixUnitaire: number };

export default function FormConsommations({
  produits,
  conso,
  onToggleProduit,
  onUpdateConsoQte,
}: {
  produits: Produit[];
  conso: ConsoItem[];
  onToggleProduit: (p: Produit) => void;
  onUpdateConsoQte: (id: number, q: number) => void;
}) {
  return (
    <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-5 space-y-4">
      <p className="text-xs text-[#c5a059] uppercase tracking-widest font-medium">Consommations prévues</p>
      
      <div className="grid grid-cols-2 gap-2">
        {produits.map((p) => {
          const isSelected = conso.some((c) => c.produitId === p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onToggleProduit(p)}
              className={`text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                isSelected
                  ? "bg-[#1b3026] border-[#c5a059]/50 text-[#e6d5b8] shadow-inner"
                  : "bg-[#0a0e0c]/40 border-[#c5a059]/20 text-[#e6d5b8]/50 hover:text-[#e6d5b8] hover:border-[#c5a059]/40"
              }`}
            >
              <span className="block font-medium">{p.nom}</span>
              <span className="text-xs text-[#c5a059]/70">${p.prixVente}</span>
            </button>
          );
        })}
      </div>

      {conso.length > 0 && (
        <div className="space-y-2 border-t border-[#c5a059]/15 pt-3">
          {conso.map((c) => (
            <div key={c.produitId} className="flex items-center gap-3 bg-[#0a0e0c]/40 px-3 py-2 rounded-lg border border-[#c5a059]/15">
              <span className="text-[#e6d5b8] text-sm flex-1">{c.nom}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateConsoQte(c.produitId, Math.max(1, c.quantite - 1))}
                  className="w-7 h-7 rounded bg-[#1b3026] border border-[#c5a059]/30 text-[#e6d5b8] text-sm hover:bg-[#233d31] transition-colors"
                >
                  −
                </button>
                <span className="text-[#e6d5b8] text-sm w-5 text-center font-medium">{c.quantite}</span>
                <button
                  type="button"
                  onClick={() => onUpdateConsoQte(c.produitId, c.quantite + 1)}
                  className="w-7 h-7 rounded bg-[#1b3026] border border-[#c5a059]/30 text-[#e6d5b8] text-sm hover:bg-[#233d31] transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}