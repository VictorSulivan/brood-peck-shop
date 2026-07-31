"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ClientForm = {
  id: number;
  nom: string;
  prenom: string | null;
  typeClient: string | null;
};

export default function ClientEditForm({ client }: { client: ClientForm }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    nom: client.nom,
    prenom: client.prenom ?? "",
    typeClient: client.typeClient ?? "particulier",
  });

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSave() {
    setLoading(true);
    await fetch(`/api/clients/${client.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-5 space-y-4 shadow-xl">
      <p className="text-xs text-[#c5a059] uppercase tracking-widest font-medium flex items-center gap-2">
        <span>✏️</span> Modifier la fiche
      </p>

      <div>
        <label className="block text-xs text-[#c5a059]/80 mb-1.5 font-medium">Type de client</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "particulier", label: "👤  Particulier" },
            { value: "entreprise",  label: "🏢  Entreprise" },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => set("typeClient", value)}
              className={`py-2 rounded-lg text-sm border transition-all ${
                form.typeClient === value
                  ? "bg-[#1b3026] border-[#c5a059]/50 text-[#e6d5b8] font-medium shadow-inner"
                  : "bg-[#0a0e0c]/40 border-[#c5a059]/20 text-[#e6d5b8]/50 hover:text-[#e6d5b8] hover:border-[#c5a059]/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#c5a059]/80 mb-1.5 font-medium">Prénom</label>
          <input
            value={form.prenom}
            onChange={(e) => set("prenom", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-[#c5a059]/80 mb-1.5 font-medium">Nom</label>
          <input
            value={form.nom}
            onChange={(e) => set("nom", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className={`w-full text-sm font-semibold py-2.5 rounded-lg border transition-all shadow-md active:scale-[0.99] ${
          saved
            ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
            : "bg-[#1b3026] hover:bg-[#233d31] border-[#c5a059]/40 text-[#f3e9d2] disabled:opacity-50"
        }`}
      >
        {saved ? "✓ Enregistré dans le registre" : loading ? "Mise à jour..." : "Enregistrer les modifications"}
      </button>
    </div>
  );
}