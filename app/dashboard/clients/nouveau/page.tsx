"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NouveauClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nom: "", prenom: "", typeClient: "particulier", entrepriseClienteNom: "",
  });

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit() {
    if (!form.nom) return setError("Le nom est requis");
    setLoading(true);
    setError("");
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/dashboard/clients");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Erreur");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-medium text-[#e6d5b8]">Nouveau client</h1>
        <p className="text-[#c5a059]/70 text-sm mt-1">Ajouter un client au registre</p>
      </div>

      <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl p-6 space-y-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c5a059]/30" />

        {/* Type */}
        <div>
          <label className="block text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1.5">Type de client</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "particulier", label: "👤 Particulier" },
              { value: "entreprise",  label: "🏢 Entreprise" },
            ].map(({ value, label }) => (
              <button key={value} type="button" onClick={() => set("typeClient", value)}
                className={`py-2.5 rounded-lg text-sm border transition-all ${
                  form.typeClient === value
                    ? "bg-[#1b3026] border-[#c5a059]/60 text-[#f3e9d2] shadow-inner font-medium"
                    : "bg-black/20 border-[#c5a059]/15 text-[#e6d5b8]/50 hover:text-[#e6d5b8] hover:border-[#c5a059]/30"
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Nom / Prénom */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1.5">Prénom</label>
            <input value={form.prenom} onChange={(e) => set("prenom", e.target.value)}
              className="w-full bg-black/20 border border-[#c5a059]/20 rounded-lg px-3.5 py-2 text-sm text-[#e6d5b8] placeholder-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059]/60 transition-colors" placeholder="Michael" />
          </div>
          <div>
            <label className="block text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1.5">Nom</label>
            <input value={form.nom} onChange={(e) => set("nom", e.target.value)}
              className="w-full bg-black/20 border border-[#c5a059]/20 rounded-lg px-3.5 py-2 text-sm text-[#e6d5b8] placeholder-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059]/60 transition-colors" placeholder="De Santa" />
          </div>
        </div>

        {/* Entreprise cliente */}
        {form.typeClient === "entreprise" && (
          <div>
            <label className="block text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1.5">Nom de l&apos;entreprise</label>
            <input value={form.entrepriseClienteNom}
              onChange={(e) => set("entrepriseClienteNom", e.target.value)}
              className="w-full bg-black/20 border border-[#c5a059]/20 rounded-lg px-3.5 py-2 text-sm text-[#e6d5b8] placeholder-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059]/60 transition-colors" placeholder="Maze Bank" />
          </div>
        )}

        {error && <p className="text-amber-400 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 text-[#f3e9d2] text-sm font-medium py-2.5 rounded-lg transition-all shadow-inner disabled:opacity-50">
            {loading ? "Création..." : "Créer le client"}
          </button>
          <button onClick={() => router.back()}
            className="px-4 text-sm text-[#e6d5b8]/60 hover:text-[#e6d5b8] border border-[#c5a059]/20 hover:border-[#c5a059]/40 rounded-lg transition-colors">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}