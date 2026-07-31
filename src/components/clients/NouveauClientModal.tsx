"use client";

import { Client } from "@prisma/client";
import { useState } from "react";

// --- 1. COMPOSANT : MODALE CRÉATION CLIENT ---
export default function NouveauClientModal({ onClose, onCreated }: { onClose: () => void; onCreated: (c: Client) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nom: "", prenom: "", typeClient: "particulier", entrepriseClienteNom: "" });

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  async function handleSubmit() {
    if (!form.nom) return setError("Le nom est requis");
    setLoading(true); setError("");
    const res = await fetch("/api/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { onCreated(await res.json()); }
    else { const d = await res.json(); setError(d.error ?? "Erreur"); setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md backdrop-blur-md bg-[#111815]/90 border border-[#c5a059]/40 rounded-2xl p-6 shadow-2xl space-y-5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/40" />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[#e6d5b8] font-serif font-medium text-lg">Nouveau visiteur ✨</h2>
            <p className="text-[#c5a059]/70 text-xs italic mt-0.5">Enregistrer au registre et l&apos;ajouter à la transaction</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#e6d5b8]/40 hover:text-[#e6d5b8] hover:bg-[#c5a059]/10 transition-colors">✕</button>
        </div>
        
        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">Type de client</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ value: "particulier", label: "👤  Particulier" }, { value: "entreprise", label: "🏢  Entreprise" }].map(({ value, label }) => (
              <button key={value} type="button" onClick={() => set("typeClient", value)}
                className={`py-2.5 rounded-lg text-sm border transition-all ${
                  form.typeClient === value 
                    ? "bg-[#1b3026] border-[#c5a059]/50 text-[#e6d5b8] shadow-inner" 
                    : "bg-[#0a0e0c]/60 border-[#c5a059]/20 text-[#e6d5b8]/50 hover:text-[#e6d5b8] hover:border-[#c5a059]/40"
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">Prénom</label>
            <input value={form.prenom} onChange={(e) => set("prenom", e.target.value)} className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059]" placeholder="Newt" autoFocus />
          </div>
          <div>
            <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">Nom</label>
            <input value={form.nom} onChange={(e) => set("nom", e.target.value)} className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059]" placeholder="Scamander" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          </div>
        </div>

        {form.typeClient === "entreprise" && (
          <div>
            <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">Nom de l&apos;entreprise</label>
            <input value={form.entrepriseClienteNom} onChange={(e) => set("entrepriseClienteNom", e.target.value)} className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059]" placeholder="Magical Menagerie" />
          </div>
        )}

        {error && <p className="text-red-400 text-sm italic">{error}</p>}

        <div className="flex gap-3 pt-1">
          <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 text-[#f3e9d2] text-sm font-medium py-2.5 rounded-lg transition-all shadow-inner disabled:opacity-50 tracking-wide">
            {loading ? "Création..." : "✓ Créer et ajouter"}
          </button>
          <button onClick={onClose} className="px-4 text-sm text-[#e6d5b8]/60 hover:text-[#e6d5b8] border border-[#c5a059]/20 hover:border-[#c5a059]/40 rounded-lg transition-colors">Annuler</button>
        </div>
      </div>
    </div>
  );
}