"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TYPES = ["CDI", "Stage", "Co-Patron", "Patron"];

export default function NouveauContratForm({ employeId }: { employeId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    typeContrat: "CDI",
    dateDebut: new Date().toISOString().split("T")[0],
    dateFin: "",
    salaire: "",
    pourcentagePrime: "",
    commentaire: "",
  });

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/contrats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, employeId }),
    });
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setForm((f) => ({ ...f, dateFin: "", commentaire: "" }));
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de la rédaction du contrat");
    }
    setLoading(false);
  }

  return (
    <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-5 space-y-4 shadow-xl">
      <p className="text-xs text-[#c5a059] uppercase tracking-wider font-semibold font-serif border-b border-[#c5a059]/20 pb-2">
        🖋️ Rédiger un nouveau contrat
      </p>

      <div>
        <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
          Type de contrat
        </label>
        <div className="grid grid-cols-4 gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set("typeContrat", t)}
              className={`py-2 px-1 rounded-lg text-xs font-serif transition-colors border ${
                form.typeContrat === t
                  ? "bg-[#1b3026] border-[#c5a059] text-[#e6d5b8] font-medium"
                  : "bg-[#0a0e0c]/80 border-[#c5a059]/20 text-[#e6d5b8]/60 hover:text-[#e6d5b8] hover:border-[#c5a059]/40"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
            Date de début
          </label>
          <input
            type="date"
            value={form.dateDebut}
            onChange={(e) => set("dateDebut", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
            Date de fin (optionnel)
          </label>
          <input
            type="date"
            value={form.dateFin}
            onChange={(e) => set("dateFin", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
            Salaire mensuel (Mornilles)
          </label>
          <input
            type="number"
            value={form.salaire}
            onChange={(e) => set("salaire", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
            placeholder="5000"
          />
        </div>
        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
            Prime (%)
          </label>
          <input
            type="number"
            value={form.pourcentagePrime}
            onChange={(e) => set("pourcentagePrime", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
            placeholder="10"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
          Commentaire (optionnel)
        </label>
        <input
          value={form.commentaire}
          onChange={(e) => set("commentaire", e.target.value)}
          className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
          placeholder="Promotion, renouvellement..."
        />
      </div>

      {error && <p className="text-red-400 text-xs italic">⚠️ {error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full text-sm font-semibold py-2.5 rounded-lg border transition-all shadow-md active:scale-[0.99] ${
          success
            ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
            : "bg-[#1b3026] hover:bg-[#233d31] border-[#c5a059]/40 text-[#f3e9d2] disabled:opacity-50"
        }`}
      >
        {success ? "✓ Contrat enregistré" : loading ? "Scellement..." : "✨ Enregistrer le contrat"}
      </button>
    </div>
  );
}