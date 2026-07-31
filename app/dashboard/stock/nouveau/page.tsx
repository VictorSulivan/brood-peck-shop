"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface AnimalOption {
  id: number;
  nom: string;
  espece: { nom: string };
}

export default function NouveauProduit() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [animaux, setAnimaux] = useState<AnimalOption[]>([]);

  const [form, setForm] = useState({
    nom: "",
    origine: "recolte",
    animalId: "",
    stock: 0,
    prixAchat: 0,
    prixVente: 0,
    description: "",
  });

  // Charger la liste des animaux pour lier les ressources si besoin
  useEffect(() => {
    fetch("/api/animaux")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setAnimaux(data))
      .catch(() => {});
  }, []);

  function set(key: string, val: string | number) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      animalId: form.animalId ? parseInt(form.animalId) : null,
    };

    const res = await fetch("/api/produits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/dashboard/stock");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Erreur inconnue");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto relative min-h-full overflow-hidden pb-12">
      {/* Image de fond thématique */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-25 filter blur-[1px] scale-105 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80')` 
        }}
      />
      <div className="absolute inset-0 z-0 bg-[#0a0d0c]/70 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8 border-b border-[#c5a059]/20 pb-5 backdrop-blur-md bg-[#111815]/60 px-6 py-4 rounded-xl shadow-lg">
          <h1 className="text-2xl font-serif font-semibold text-[#e6d5b8]">Nouveau spécimen / ressource ✨</h1>
          <p className="text-[#c5a059]/80 text-xs italic tracking-wider mt-1">Enregistrer un nouvel arrivage au registre du bestiaire et des stocks.</p>
        </div>

        {/* Formulaire */}
        <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl p-6 shadow-xl relative overflow-hidden space-y-5">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/40" />

          <Field label="Nom du produit ou de la ressource">
            <input
              placeholder="ex: Plume de Jobard-Ardent ou Élixir de soin"
              value={form.nom}
              onChange={(e) => set("nom", e.target.value)}
              className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-4 py-2.5 text-[#e6d5b8] placeholder-[#e6d5b8]/30 focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">

            <Field label="Origine (Magizoologie)">
              <select
                value={form.origine}
                onChange={(e) => set("origine", e.target.value)}
                className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2.5 text-[#e6d5b8] focus:outline-none focus:border-[#c5a059] text-sm"
              >
                <option value="recolte">🌿 Récolte</option>
                <option value="elevage_animal">🐉 Élevage animal</option>
                <option value="marchand_ambulant">📜 Marchand ambulant</option>
                <option value="autre">✨ Autre</option>
              </select>
            </Field>
          </div>

          {/* Association optionnelle à un animal précis */}
          <Field label="Animal / Spécimen source (Optionnel)">
            <select
              value={form.animalId}
              onChange={(e) => set("animalId", e.target.value)}
              className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2.5 text-[#e6d5b8] focus:outline-none focus:border-[#c5a059] text-sm"
            >
              <option value="">Aucun animal direct</option>
              {animaux.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.nom} ({animal.espece.nom})
                </option>
              ))}
            </select>
          </Field>

          <Field label="Stock initial en enclos">
            <input
              type="number" min={0}
              value={form.stock}
              onChange={(e) => set("stock", parseInt(e.target.value) || 0)}
              className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-4 py-2.5 text-[#e6d5b8] focus:outline-none focus:border-[#c5a059] text-sm"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Prix d'achat (Mornilles)">
              <input
                type="number" min={0} step={0.01}
                value={form.prixAchat}
                onChange={(e) => set("prixAchat", parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-4 py-2.5 text-[#e6d5b8] focus:outline-none focus:border-[#c5a059] text-sm"
              />
            </Field>
            <Field label="Prix de vente (Mornilles)">
              <input
                type="number" min={0} step={0.01}
                value={form.prixVente}
                onChange={(e) => set("prixVente", parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-4 py-2.5 text-[#e6d5b8] focus:outline-none focus:border-[#c5a059] text-sm"
              />
            </Field>
          </div>

          <Field label="Notes de description (optionnel)">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-4 py-2.5 text-[#e6d5b8] placeholder-[#e6d5b8]/30 focus:outline-none focus:border-[#c5a059] text-sm resize-none"
            />
          </Field>

          {error && <p className="text-amber-400 text-sm italic">{error}</p>}

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-[#161a15] hover:bg-[#1d231e] border border-[#c5a059]/50 text-[#e6d5b8] text-sm font-medium py-2.5 rounded-lg transition-colors shadow-lg disabled:opacity-50"
            >
              {loading ? "Création..." : "Inscrire au registre"}
            </button>
            <button
              onClick={() => router.back()}
              className="px-5 text-sm text-[#e6d5b8]/60 hover:text-[#e6d5b8] border border-[#c5a059]/20 hover:border-[#c5a059]/40 rounded-lg transition-colors bg-[#0a0e0c]/80"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-[#c5a059]/80 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}