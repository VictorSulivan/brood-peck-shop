"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Produit {
  id: number;
  nom: string;
  stock: number;
  prixAchat: number;
}

interface LigneRestock {
  produitId: string;
  quantite: number;
}

export default function NouveauRestockForm({ produits }: { produits: Produit[] }) {
  const router = useRouter();
  const [lignes, setLignes] = useState<LigneRestock[]>([{ produitId: "", quantite: 1 }]);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  const ajouterLigne = () => {
    setLignes([...lignes, { produitId: "", quantite: 1 }]);
  };

  const supprimerLigne = (index: number) => {
    setLignes(lignes.filter((_, i) => i !== index));
  };

  const handleChangeLigne = (index: number, champ: keyof LigneRestock, valeur: string | number) => {
    const nouvellesLignes = [...lignes];
    nouvellesLignes[index] = { ...nouvellesLignes[index], [champ]: valeur };
    setLignes(nouvellesLignes);
  };

  // Calcul purement indicatif de la valeur marchande du restock
  const valeurTotalRestock = lignes.reduce((acc, ligne) => {
    const produit = produits.find((p) => p.id === parseInt(ligne.produitId));
    if (!produit) return acc;
    return acc + produit.prixAchat * (ligne.quantite || 0);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const lignesValides = lignes.filter((l) => l.produitId && l.quantite > 0);
    if (lignesValides.length === 0) {
      setErreur("Veuillez sélectionner au moins un produit.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/produits/restocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lignes: lignesValides.map((l) => ({
            produitId: parseInt(l.produitId),
            quantite: l.quantite,
          })),
        }),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || "Une erreur est survenue");
      }

      router.push("/dashboard/stock");
      router.refresh();
    } catch (err: unknown) {
      setErreur(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {erreur && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-sm">
          {erreur}
        </div>
      )}

      <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl overflow-hidden p-6 space-y-4 shadow-xl relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />

        <h2 className="text-xs font-medium text-[#c5a059] uppercase tracking-wider mb-2">
          Articles à réapprovisionner
        </h2>

        {lignes.map((ligne, index) => {
          const produitSelectionne = produits.find((p) => p.id === parseInt(ligne.produitId));

          return (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-end bg-black/20 p-4 rounded-lg border border-[#c5a059]/10 transition-colors"
            >
              {/* Sélection du produit */}
              <div className="flex-1 w-full">
                <label className="block text-xs text-[#c5a059] mb-1.5 font-medium uppercase tracking-wider">
                  Produit
                </label>
                <select
                  value={ligne.produitId}
                  onChange={(e) => handleChangeLigne(index, "produitId", e.target.value)}
                  className="w-full bg-[#111815] border border-[#c5a059]/20 rounded-lg p-2.5 text-[#e6d5b8] text-sm focus:outline-none focus:border-[#c5a059]/60 transition-colors"
                  required
                >
                  <option value="" className="bg-[#111815] text-[#e6d5b8]/50">Choisir un produit...</option>
                  {produits.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#111815] text-[#e6d5b8]">
                      {p.nom} — Stock : {p.stock}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantité d'items */}
              <div className="w-full sm:w-32">
                <label className="block text-xs text-[#c5a059] mb-1.5 font-medium uppercase tracking-wider">
                  Quantité
                </label>
                <input
                  type="number"
                  min="1"
                  value={ligne.quantite}
                  onChange={(e) => handleChangeLigne(index, "quantite", parseInt(e.target.value) || 0)}
                  className="w-full bg-[#111815] border border-[#c5a059]/20 rounded-lg p-2.5 text-[#e6d5b8] text-sm focus:outline-none focus:border-[#c5a059]/60 transition-colors"
                  required
                />
              </div>

              {/* Valeur indicative de la ligne */}
              <div className="w-full sm:w-32 text-left sm:text-right py-2 sm:py-0">
                <span className="block text-xs text-[#c5a059]/70 mb-1">Coût indicatif</span>
                <span className="text-sm font-serif font-semibold text-[#e6d5b8]">
                  {produitSelectionne ? `$${(produitSelectionne.prixAchat * ligne.quantite).toFixed(0)}` : "$0"}
                </span>
              </div>

              {/* Action supprimer */}
              {lignes.length > 1 && (
                <button
                  type="button"
                  onClick={() => supprimerLigne(index)}
                  className="text-xs text-amber-400/60 hover:text-amber-400 px-3 h-10 rounded-lg hover:bg-amber-500/5 border border-transparent hover:border-amber-500/20 transition-colors w-full sm:w-auto"
                >
                  Supprimer
                </button>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={ajouterLigne}
          className="flex items-center gap-2 bg-[#1b3026]/50 hover:bg-[#1b3026] border border-[#c5a059]/30 hover:border-[#c5a059] text-[#e6d5b8] text-xs font-medium px-4 py-2 rounded-lg transition-colors mt-2"
        >
          + Ajouter un produit
        </button>
      </div>

      {/* Footer de validation */}
      <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl p-6 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />
        
        <div>
          <span className="text-xs text-[#c5a059]/70 block mb-0.5 uppercase tracking-wider">Valeur totale de la commande</span>
          <span className="text-2xl font-serif font-semibold text-emerald-400">${valeurTotalRestock.toFixed(0)}</span>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/dashboard/stock"
            className="text-sm text-[#e6d5b8]/60 hover:text-[#e6d5b8] border border-[#c5a059]/20 hover:border-[#c5a059]/40 px-4 py-2.5 rounded-lg transition-colors text-center w-full sm:w-auto"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 text-[#f3e9d2] text-sm font-medium px-6 py-2.5 rounded-lg transition-all shadow-inner disabled:opacity-50 text-center w-full sm:w-auto"
          >
            {loading ? "Mise à jour..." : "Confirmer le Restock"}
          </button>
        </div>
      </div>
    </form>
  );
}