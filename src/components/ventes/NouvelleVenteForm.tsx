"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormExtras from "./FormExtras";
import NouveauClientModal from "../clients/NouveauClientModal";
import FormClients from "../clients/FormClients";
import { Client, Produit } from "@prisma/client";

// Modification du type Ligne pour stocker le prix d'achat et le flag employé
type Ligne = { 
  produitId: number; 
  nom: string; 
  quantite: number; 
  prixVente: number;
  prixAchat: number;
  prixEtudiant: boolean; 
  prixEmploye: boolean; // <-- Ajout de l'option employé
};
type Extra = { label: string; montant: number };

export default function NouvelleVenteForm({ clients: initialClients, produits }: { clients: Client[]; produits: Produit[] }) {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [clientId, setClientId] = useState<number | null>(null);
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const selectedClient = clients.find((c) => c.id === clientId);

  // Calcul dynamique du total des produits à l'affichage selon le mode tarifaire coché
  const totalProduits = lignes.reduce((acc, l) => {
    let prixEffectif = l.prixVente;
    if (l.prixEmploye) {
      prixEffectif = l.prixAchat;
    } else if (l.prixEtudiant) {
      prixEffectif = Math.round((l.prixVente * 0.84) * 100) / 100;
    }
    return acc + l.quantite * prixEffectif;
  }, 0);

  const totalExtras = extras.reduce((acc, e) => acc + e.montant, 0);
  const total = totalProduits + totalExtras;

  const clientSelectionFormat = selectedClient 
    ? [{ clientId: selectedClient.id, nbPersonnes: 1, commentaire: "" }] 
    : [];

  function ajouterProduit(p: Produit) {
    const prixVenteNum = Number(p.prixVente);
    const prixAchatNum = Number(p.prixAchat);
    
    setLignes((prev) => {
      const exist = prev.find((l) => l.produitId === p.id);
      if (exist) return prev.map((l) => l.produitId === p.id ? { ...l, quantite: l.quantite + 1 } : l);
      return [...prev, { 
        produitId: p.id, 
        nom: p.nom, 
        quantite: 1, 
        prixVente: prixVenteNum, 
        prixAchat: prixAchatNum, 
        prixEtudiant: false, 
        prixEmploye: false 
      }];
    });
  }
  
  function setQuantite(id: number, q: number) {
    if (q <= 0) return setLignes((p) => p.filter((l) => l.produitId !== id));
    setLignes((p) => p.map((l) => l.produitId === id ? { ...l, quantite: q } : l));
  }

  // Active le tarif étudiant et désactive le tarif employé
  function togglePrixEtudiant(id: number) {
    setLignes((p) => p.map((l) => l.produitId === id ? { 
      ...l, 
      prixEtudiant: !l.prixEtudiant,
      prixEmploye: !l.prixEtudiant ? false : l.prixEmploye 
    } : l));
  }

  // Active le tarif employé (prix d'achat) et désactive le tarif étudiant
  function togglePrixEmploye(id: number) {
    setLignes((p) => p.map((l) => l.produitId === id ? { 
      ...l, 
      prixEmploye: !l.prixEmploye,
      prixEtudiant: !l.prixEmploye ? false : l.prixEtudiant 
    } : l));
  }

  async function handleSubmit() {
    if (!clientId) return setError("Sélectionnez un client");
    if (!lignes.length && !extras.length) return setError("Ajoutez au moins un produit ou un extra");
    setLoading(true); setError("");

    const res = await fetch("/api/ventes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // On transmet les drapeaux prixEtudiant et prixEmploye au serveur
      body: JSON.stringify({ clientId, lignes, extras }),
    });
    
    if (res.ok) { 
      router.push("/dashboard/ventes"); 
      router.refresh(); 
    } else { 
      const d = await res.json(); 
      setError(d.error ?? "Erreur"); 
      setLoading(false); 
    }
  }

  return (
    <>
      {showModal && (
        <NouveauClientModal
          onClose={() => setShowModal(false)} 
          onCreated={(c) => { setClients((p) => [...p, c]); setClientId(c.id); setShowModal(false); }} 
        />
      )}

      <div className="space-y-6">
        {/* CLIENT */}
        {/* CLIENT - Suppression de overflow-hidden et ajout de z-30 pour laisser déborder le menu déroulant */}
        <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl p-5 shadow-xl relative z-30">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30 rounded-t-xl" />
          <FormClients
            clients={clients} 
            selectedClients={clientSelectionFormat} 
            onSelectClient={(id) => setClientId(id)} 
            onRemoveClient={() => setClientId(null)} 
            onUpdateNbPersonnes={() => {}} 
            onOpenModal={() => setShowModal(true)} 
          />
        </div>

        {/* PRODUITS */}
        <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />
          <p className="text-xs text-[#c5a059] uppercase tracking-widest font-medium mb-3">Catalogue des Articles</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {produits.map((p) => {
              const inCart = lignes.find((l) => l.produitId === p.id);
              return (
                <button key={p.id} type="button" onClick={() => ajouterProduit(p)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm border transition-all ${
                    inCart 
                      ? "bg-[#1b3026] border-[#c5a059]/50 text-[#e6d5b8] shadow-inner" 
                      : "bg-[#0a0e0c]/60 border-[#c5a059]/20 text-[#e6d5b8]/70 hover:text-[#e6d5b8] hover:border-[#c5a059]/40 hover:bg-[#111815]"
                  }`}>
                  <span className="block truncate font-medium">{p.nom}</span>
                  <span className="text-xs text-[#c5a059]/70">${Number(p.prixVente).toFixed(0)} · stock {p.stock}</span>
                </button>
              );
            })}
          </div>

          {lignes.length > 0 && (
            <div className="border-t border-[#c5a059]/20 pt-4 space-y-3">
              {lignes.map((l) => {
                let prixEffectifLigne = l.prixVente;
                if (l.prixEmploye) {
                  prixEffectifLigne = l.prixAchat;
                } else if (l.prixEtudiant) {
                  prixEffectifLigne = Math.round((l.prixVente * 0.84) * 100) / 100;
                }
                
                return (
                  <div key={l.produitId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0a0e0c]/60 p-3 rounded-lg border border-[#c5a059]/15">
                    <span className="text-sm text-[#e6d5b8] flex-1 truncate font-medium">{l.nom}</span>
                    
                    {/* Toggles de réduction */}
                    <div className="flex items-center gap-4 my-1 sm:my-0">
                      {/* Switch Étudiant */}
                      <label className="relative flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={l.prixEtudiant}
                          onChange={() => togglePrixEtudiant(l.produitId)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-black/40 peer-focus:outline-none rounded-full peer border border-[#c5a059]/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-[#e6d5b8]/40 peer-checked:after:bg-[#e6d5b8] after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-[#1b3026] peer-checked:border-[#c5a059]"></div>
                        <span className="ml-1.5 text-[11px] font-medium text-[#e6d5b8]/50 peer-checked:text-[#e6d5b8]">🎓 Étudiant</span>
                      </label>

                      {/* Switch Employé */}
                      <label className="relative flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={l.prixEmploye}
                          onChange={() => togglePrixEmploye(l.produitId)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-black/40 peer-focus:outline-none rounded-full peer border border-[#c5a059]/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-[#e6d5b8]/40 peer-checked:after:bg-emerald-300 after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-[#14281d] peer-checked:border-emerald-700"></div>
                        <span className="ml-1.5 text-[11px] font-medium text-[#e6d5b8]/50 peer-checked:text-emerald-400">💼 Employé</span>
                      </label>
                    </div>

                    {/* Controles Quantités, prix de la ligne et suppression */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-[#c5a059]/10 pt-2 sm:pt-0 sm:border-none">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setQuantite(l.produitId, l.quantite - 1)} className="w-7 h-7 rounded bg-[#111815] hover:bg-[#1b3026] border border-[#c5a059]/20 text-[#e6d5b8]/70 hover:text-[#e6d5b8] text-sm transition-colors">−</button>
                        <span className="text-[#e6d5b8] text-sm w-5 text-center font-medium">{l.quantite}</span>
                        <button type="button" onClick={() => setQuantite(l.produitId, l.quantite + 1)} className="w-7 h-7 rounded bg-[#111815] hover:bg-[#1b3026] border border-[#c5a059]/20 text-[#e6d5b8]/70 hover:text-[#e6d5b8] text-sm transition-colors">+</button>
                      </div>

                      <span className="text-sm text-[#e6d5b8] font-serif font-semibold w-16 text-right">${(l.quantite * prixEffectifLigne).toFixed(0)}</span>
                      <button type="button" onClick={() => setQuantite(l.produitId, 0)} className="text-[#e6d5b8]/30 hover:text-red-400 text-xs transition-colors pl-2">✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* EXTRAS */}
        <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />
          <FormExtras 
            extras={extras} 
            onAddExtra={(label, montant) => setExtras((p) => [...p, { label, montant }])} 
            onRemoveExtra={(index) => setExtras((p) => p.filter((_, j) => j !== index))} 
          />
        </div>

        {/* TOTAL & SUBMIT */}
        <div className="backdrop-blur-md bg-[#111815]/85 border border-[#c5a059]/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/40" />
          {extras.length > 0 && (
            <div className="space-y-1.5 mb-4 pb-4 border-b border-[#c5a059]/20">
              <div className="flex justify-between text-sm text-[#e6d5b8]/70"><span>Produits</span><span>${totalProduits.toFixed(0)}</span></div>
              <div className="flex justify-between text-sm text-[#e6d5b8]/70"><span>Extras</span><span>${totalExtras.toFixed(0)}</span></div>
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#c5a059] text-sm uppercase tracking-wider font-medium">Total de la transaction</span>
            <span className="text-2xl font-serif font-bold text-[#e6d5b8]">${total.toFixed(0)}</span>
          </div>
          {error && <p className="text-red-400 text-sm mb-3 italic">{error}</p>}
          <div className="flex gap-3">
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 text-[#f3e9d2] text-sm font-medium py-2.5 rounded-lg transition-all shadow-inner disabled:opacity-50 tracking-wide">
              {loading ? "Validation..." : "✓ Valider la vente"}
            </button>
            <button type="button" onClick={() => router.back()}
              className="px-4 text-sm text-[#e6d5b8]/60 hover:text-[#e6d5b8] border border-[#c5a059]/20 hover:border-[#c5a059]/40 rounded-lg transition-colors">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </>
  );
}