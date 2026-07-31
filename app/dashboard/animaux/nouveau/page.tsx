"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NouvelAnimalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [especes, setEspeces] = useState<{ id: number; nom: string }[]>([]);

  const [form, setForm] = useState({
    entrepriseId: 1, // Fixé directement à 1 en arrière-plan
    especeId: "",
    nom: "",
    sante: "Bonne",
  });

  useEffect(() => {
    // Récupération des espèces pour le select
    fetch("/api/especes").then((r) => r.json()).then(setEspeces);
  }, []);

  function set(key: string, val: string | number) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit() {
    if (!form.especeId) return setError("Veuillez sélectionner une espèce.");
    setLoading(true);
    setError("");
    const res = await fetch("/api/animaux", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        especeId: parseInt(form.especeId),
      }),
    });
    if (res.ok) {
      router.push("/dashboard/animaux");
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
            <span>📜</span> Enregistrer un animal
          </h1>
          <p className="text-[#c5a059]/70 text-xs mt-0.5 italic">
            Ajouter une créature au cheptel du domaine
          </p>
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
            Nom / Surnom de l&apos;animal
          </label>
          <input
            placeholder="ex: Poussin, Barnabé..."
            value={form.nom}
            onChange={(e) => set("nom", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
            Espèce
          </label>
          <select
            value={form.especeId}
            onChange={(e) => set("especeId", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
          >
            <option value="" className="bg-[#0a0e0c] text-[#e6d5b8]/40">-- Choisir une espèce --</option>
            {especes.map((esp) => (
              <option key={esp.id} value={esp.id} className="bg-[#0a0e0c] text-[#e6d5b8]">
                {esp.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
            Santé / État général
          </label>
          <input
            placeholder="ex: Bonne, Blessée..."
            value={form.sante}
            onChange={(e) => set("sante", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>

        {error && <p className="text-red-400 text-xs italic">⚠️ {error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 text-[#f3e9d2] text-sm font-semibold py-2.5 rounded-lg transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Consignation..." : "✨ Enregistrer au cheptel"}
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