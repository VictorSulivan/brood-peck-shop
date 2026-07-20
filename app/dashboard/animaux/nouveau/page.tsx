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
    <div className="p-8 max-w-2xl mx-auto w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Enregistrer un animal</h1>
          <p className="text-white/40 text-xs mt-0.5">Ajouter une créature au cheptel de l&apos;entreprise</p>
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
          <label className="block text-xs text-white/40 mb-1.5">Nom / Surnom de l&apos;animal</label>
          <input
            placeholder="ex: Poussin"
            value={form.nom}
            onChange={(e) => set("nom", e.target.value)}
            className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Espèce</label>
          <select
            value={form.especeId}
            onChange={(e) => set("especeId", e.target.value)}
            className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="">-- Choisir une espèce --</option>
            {especes.map((esp) => (
              <option key={esp.id} value={esp.id}>{esp.nom}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Santé</label>
          <input
            placeholder="ex: Bonne, Blessée..."
            value={form.sante}
            onChange={(e) => set("sante", e.target.value)}
            className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#2a2250] hover:bg-[#342b6e] border border-[#3d3580] text-[#c4bbff] text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Enregistrer l'animal"}
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