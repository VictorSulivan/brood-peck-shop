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
    <div className="p-8 max-w-2xl mx-auto w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Répertorier une espèce</h1>
          <p className="text-white/40 text-xs mt-0.5">Ajouter une nouvelle créature au bestiaire</p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-xs text-white/50 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
        >
          ← Retour
        </button>
      </div>

      <div className="bg-[#16162a] border border-white/10 rounded-xl p-6 shadow-xl space-y-4">
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Nom de l&apos;espèce</label>
          <input
            placeholder="ex: Niffleur"
            value={form.nom}
            onChange={(e) => set("nom", e.target.value)}
            className="input-dark w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Type</label>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="creature_magique">Créature magique</option>
              <option value="animal_compagnie">Animal de compagnie</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Dangerosité (1 à 5)</label>
            <input
              type="number" min={1} max={5}
              value={form.dangerosite}
              onChange={(e) => set("dangerosite", parseInt(e.target.value) || 1)}
              className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Habitat</label>
          <input
            placeholder="ex: Grottes sombres, Forêts denses..."
            value={form.habitat}
            onChange={(e) => set("habitat", e.target.value)}
            className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Points Forts</label>
            <input
              placeholder="ex: Sensibilité à l'or"
              value={form.pointsForts}
              onChange={(e) => set("pointsForts", e.target.value)}
              className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Points Faibles</label>
            <input
              placeholder="ex: Objets brillants"
              value={form.pointsFaibles}
              onChange={(e) => set("pointsFaibles", e.target.value)}
              className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Régime alimentaire</label>
          <input
            placeholder="ex: Omnivore, Carnivore..."
            value={form.regimeAlimentaire}
            onChange={(e) => set("regimeAlimentaire", e.target.value)}
            className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#2a2250] hover:bg-[#342b6e] border border-[#3d3580] text-[#c4bbff] text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Enregistrer l'espèce"}
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 text-sm text-white/40 hover:text-white border border-white/10 rounded-lg transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}