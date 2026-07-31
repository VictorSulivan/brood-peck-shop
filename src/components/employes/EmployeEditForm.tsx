"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES_EMPLOYE = ["stagiaire", "employe", "co_patron", "patron"];

type EmployeForm = {
  id: number;
  nom: string;
  prenom: string;
  role: string;
  salaire: number | null;
  notes: string | null;
};

export default function EmployeEditForm({ employe }: { employe: EmployeForm }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    nom: employe.nom,
    prenom: employe.prenom,
    role: employe.role,
    salaire: employe.salaire?.toString() ?? "",
    notes: employe.notes ?? "",
  });

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSave() {
    setLoading(true);
    await fetch(`/api/employes/${employe.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        salaire: form.salaire ? parseFloat(form.salaire) : null,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-5 space-y-4 shadow-xl">
      <p className="text-xs text-[#c5a059] uppercase tracking-wider font-semibold font-serif border-b border-[#c5a059]/20 pb-2">
        ✏️ Modifier la fiche
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">Prénom</label>
          <input
            value={form.prenom}
            onChange={(e) => set("prenom", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">Nom</label>
          <input
            value={form.nom}
            onChange={(e) => set("nom", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">Rôle</label>
        <div className="grid grid-cols-2 gap-2">
          {ROLES_EMPLOYE.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => set("role", r)}
              className={`py-2 px-2 rounded-lg text-xs capitalize border transition-colors ${
                form.role === r
                  ? "bg-[#1b3026] border-[#c5a059] text-[#e6d5b8] font-medium"
                  : "bg-[#0a0e0c]/80 border-[#c5a059]/20 text-[#e6d5b8]/60 hover:text-[#e6d5b8] hover:border-[#c5a059]/40"
              }`}
            >
              {r.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
          Salaire (Mornilles)
        </label>
        <input
          type="number"
          value={form.salaire}
          onChange={(e) => set("salaire", e.target.value)}
          className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
          placeholder="5000"
        />
      </div>

      <div>
        <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
          Notes confidentielles
        </label>
        <textarea
          rows={2}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm focus:outline-none focus:border-[#c5a059] transition-colors resize-none"
        />
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
        {saved ? "✓ Fiche mise à jour" : loading ? "Sauvegarde..." : "Mettre à jour la fiche"}
      </button>
    </div>
  );
}