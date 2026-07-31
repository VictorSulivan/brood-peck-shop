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
    if (!form.titre || !form.contenu) {
      return setError("Le titre et le contenu sont requis.");
    }
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
    <div className="p-4 sm:p-8 max-w-2xl mx-auto w-full">
      <div className="mb-6 flex items-center justify-between border-b border-[#c5a059]/20 pb-4">
        <div>
          <h1 className="text-xl font-serif font-semibold text-[#e6d5b8] flex items-center gap-2">
            <span>🖋️</span> Nouveau rapport d&apos;observation
          </h1>
          <p className="text-[#c5a059]/70 text-xs mt-0.5 italic">
            Consigner une note de terrain ou un compte-rendu magizoologique
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
            Titre du rapport
          </label>
          <input
            placeholder="ex: Expédition dans la Forêt Interdite..."
            value={form.titre}
            onChange={(e) => set("titre", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
              Concerne l&apos;espèce (optionnel)
            </label>
            <select
              value={form.especeId}
              onChange={(e) => set("especeId", e.target.value)}
              className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
            >
              <option value="" className="bg-[#0a0e0c] text-[#e6d5b8]/40">-- Aucune / Global --</option>
              {especes.map((esp) => (
                <option key={esp.id} value={esp.id} className="bg-[#0a0e0c] text-[#e6d5b8]">
                  {esp.nom}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
              Concerne l&apos;animal (optionnel)
            </label>
            <select
              value={form.animalId}
              onChange={(e) => set("animalId", e.target.value)}
              className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
            >
              <option value="" className="bg-[#0a0e0c] text-[#e6d5b8]/40">-- Aucun / Aucun en particulier --</option>
              {animaux.map((anim) => (
                <option key={anim.id} value={anim.id} className="bg-[#0a0e0c] text-[#e6d5b8]">
                  {anim.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
            Lieu de l&apos;observation
          </label>
          <input
            placeholder="ex: Enclos principal / Clairière de l'Ouest"
            value={form.lieu}
            onChange={(e) => set("lieu", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
            Contenu du rapport (RP)
          </label>
          <textarea
            rows={6}
            placeholder="Détaillez vos observations, le comportement des créatures..."
            value={form.contenu}
            onChange={(e) => set("contenu", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors resize-none leading-relaxed"
          />
        </div>

        {error && <p className="text-red-400 text-xs italic">⚠️ {error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 text-[#f3e9d2] text-sm font-semibold py-2.5 rounded-lg transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Consignation en cours..." : "✨ Publier le rapport"}
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