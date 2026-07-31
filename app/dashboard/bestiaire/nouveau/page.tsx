"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NouvelleEspecePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nom: "",
    type: "creature_magique",
    description: "",
    habitat: "",
    dangerosite: 1,
    pointsForts: "",
    pointsFaibles: "",
    regimeAlimentaire: "",
  });

  function set(key: string, val: string | number) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/especes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/dashboard/bestiaire");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Erreur inconnue");
      setLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto w-full">
      <div className="mb-6 flex items-center justify-between border-b border-[#c5a059]/20 pb-4">
        <div>
          <h1 className="text-xl font-serif font-semibold text-[#e6d5b8] flex items-center gap-2">
            <span>📜</span> Répertorier une espèce
          </h1>
          <p className="text-[#c5a059]/70 text-xs mt-0.5 italic">Consigner une nouvelle créature dans le bestiaire</p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-xs text-[#e6d5b8]/60 hover:text-[#e6d5b8] px-3 py-1.5 rounded-lg border border-[#c5a059]/20 hover:border-[#c5a059]/40 bg-[#0a0e0c]/40 transition-colors"
        >
          ← Retour
        </button>
      </div>

      <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-6 shadow-xl space-y-4">
        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
            Nom de l&apos;espèce
          </label>
          <input
            placeholder="ex: Niffleur"
            value={form.nom}
            onChange={(e) => set("nom", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">Type</label>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
            >
              <option value="creature_magique" className="bg-[#0a0e0c] text-[#e6d5b8]">Créature magique</option>
              <option value="animal_compagnie" className="bg-[#0a0e0c] text-[#e6d5b8]">Animal de compagnie</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
              Dangerosité (1 à 5)
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={form.dangerosite}
              onChange={(e) => set("dangerosite", parseInt(e.target.value) || 1)}
              className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">Habitat</label>
          <input
            placeholder="ex: Grottes sombres, Forêts denses..."
            value={form.habitat}
            onChange={(e) => set("habitat", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">Points Forts</label>
            <input
              placeholder="ex: Sensibilité à l'or"
              value={form.pointsForts}
              onChange={(e) => set("pointsForts", e.target.value)}
              className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">Points Faibles</label>
            <input
              placeholder="ex: Objets brillants"
              value={form.pointsFaibles}
              onChange={(e) => set("pointsFaibles", e.target.value)}
              className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
            Régime alimentaire
          </label>
          <input
            placeholder="ex: Omnivore, Carnivore..."
            value={form.regimeAlimentaire}
            onChange={(e) => set("regimeAlimentaire", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-xs italic">⚠️ {error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 text-[#f3e9d2] text-sm font-semibold py-2.5 rounded-lg transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Consignation en cours..." : "✨ Enregistrer l'espèce"}
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 text-sm text-[#e6d5b8]/60 hover:text-[#e6d5b8] border border-[#c5a059]/20 hover:border-[#c5a059]/40 rounded-lg transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}