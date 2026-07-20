"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NouveauRapportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [especes, setEspeces] = useState<{ id: number; nom: string }[]>([]);
  const [animaux, setAnimaux] = useState<{ id: number; nom: string }[]>([]);

  const [form, setForm] = useState({
    titre: "",
    contenu: "",
    lieu: "",
    especeId: "",
    animalId: "",
  });

  useEffect(() => {
    fetch("/api/especes").then((r) => r.json()).then(setEspeces);
    fetch("/api/animaux").then((r) => r.json()).then(setAnimaux).catch(() => {});
  }, []);

  function set(key: string, val: string | number) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/rapports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        especeId: form.especeId ? parseInt(form.especeId) : null,
        animalId: form.animalId ? parseInt(form.animalId) : null,
      }),
    });
    if (res.ok) {
      router.push("/dashboard/rapports");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Erreur inconnue");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-white">Nouveau rapport d&apos;observation</h1>
        <p className="text-white/40 text-sm mt-1">Rédiger une note de terrain ou un compte-rendu magizoologique</p>
      </div>

      <div className="bg-[#16162a] border border-white/10 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Titre du rapport</label>
          <input
            placeholder="ex: Expédition dans la forêt interdite..."
            value={form.titre}
            onChange={(e) => set("titre", e.target.value)}
            className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Concerne l&apos;espèce (optionnel)</label>
            <select
              value={form.especeId}
              onChange={(e) => set("especeId", e.target.value)}
              className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">-- Aucune / Global --</option>
              {especes.map((esp) => (
                <option key={esp.id} value={esp.id}>{esp.nom}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Concerne l&apos;animal (optionnel)</label>
            <select
              value={form.animalId}
              onChange={(e) => set("animalId", e.target.value)}
              className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">-- Aucun / Aucun en particulier --</option>
              {animaux.map((anim) => (
                <option key={anim.id} value={anim.id}>{anim.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Lieu de l&apos;observation</label>
          <input
            placeholder="ex: Enclos principal / Zone montagneuse"
            value={form.lieu}
            onChange={(e) => set("lieu", e.target.value)}
            className="w-full bg-[#0f0f1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Contenu du rapport (RP)</label>
          <textarea
            rows={6}
            placeholder="Détaillez vos observations, le comportement des créatures..."
            value={form.contenu}
            onChange={(e) => set("contenu", e.target.value)}
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
            {loading ? "Publication..." : "Publier le rapport"}
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