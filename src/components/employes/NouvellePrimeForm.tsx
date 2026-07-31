"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TYPES = ["manuel", "performance", "anciennete", "exceptionnel"];
const TAXE = 20;

export default function NouvelleprimeForm({ employes }: { employes: { id: number; prenom: string; nom: string }[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [netSouhaite, setNetSouhaite] = useState("");
  const now = new Date();
  const [form, setForm] = useState({
    employeId: "",
    montant: "",
    typePrime: "manuel",
    commentaire: "",
    semestre: now.getMonth() < 6 ? "1" : "2",
    annee: now.getFullYear().toString(),
  });

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit() {
    if (!form.employeId || !form.montant) return setError("Sélectionnez un employé et un montant");
    setLoading(true);
    setError("");
    const res = await fetch("/api/primes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setForm((f) => ({ ...f, employeId: "", montant: "", commentaire: "" }));
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de l'attribution");
    }
    setLoading(false);
  }

  return (
    <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-5 space-y-4 shadow-xl h-fit">
      <p className="text-xs text-[#c5a059] uppercase tracking-wider font-semibold font-serif border-b border-[#c5a059]/20 pb-2">
        ✨ Attribuer une nouvelle prime
      </p>

      {/* Employé */}
      <div>
        <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
          Employé bénéficiaire
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
          {employes.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => set("employeId", e.id.toString())}
              className={`text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                form.employeId === e.id.toString()
                  ? "bg-[#1b3026] border-[#c5a059] text-[#e6d5b8] font-medium"
                  : "bg-[#0a0e0c]/80 border-[#c5a059]/20 text-[#e6d5b8]/60 hover:text-[#e6d5b8] hover:border-[#c5a059]/40"
              }`}
            >
              {e.prenom} {e.nom}
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
          Type de prime
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set("typePrime", t)}
              className={`py-2 px-2 rounded-lg text-xs capitalize border transition-colors ${
                form.typePrime === t
                  ? "bg-[#1b3026] border-[#c5a059] text-[#e6d5b8] font-medium"
                  : "bg-[#0a0e0c]/80 border-[#c5a059]/20 text-[#e6d5b8]/60 hover:text-[#e6d5b8] hover:border-[#c5a059]/40"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Simulateur net → brut */}
      <div className="bg-[#0a0e0c]/80 border border-[#c5a059]/20 rounded-xl p-4 space-y-3">
        <p className="text-xs text-[#c5a059] uppercase tracking-wider font-medium flex items-center gap-1.5">
          <span>🧮</span> Simulateur Gringotts
        </p>
        <div>
          <label className="block text-xs text-[#e6d5b8]/70 mb-1.5">
            Montant net souhaité par l&apos;employé
          </label>
          <input
            type="number"
            min={0}
            value={netSouhaite}
            onChange={(e) => setNetSouhaite(e.target.value)}
            className="w-full bg-[#0a0e0c] border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
            placeholder="Ex: 800"
          />
        </div>
        {(() => {
          const net = parseFloat(netSouhaite) || 0;
          if (net <= 0) return null;
          const brut = Math.ceil(net / (1 - TAXE / 100));
          const taxe = brut - net;
          return (
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-[#1b3026]/40 border border-[#c5a059]/20 rounded-lg p-2.5">
                  <p className="text-xs text-[#c5a059]/70 mb-0.5">Brut à saisir</p>
                  <p className="text-[#e6d5b8] font-serif font-medium">{brut.toLocaleString("fr-FR")} Mornilles</p>
                </div>
                <div className="bg-[#1b3026]/40 border border-[#c5a059]/20 rounded-lg p-2.5">
                  <p className="text-xs text-[#c5a059]/70 mb-0.5">Taxe Gringotts ({TAXE}%)</p>
                  <p className="text-amber-400 font-serif font-medium">{taxe.toLocaleString("fr-FR")} Mornilles</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  set("montant", brut.toString());
                  setNetSouhaite("");
                }}
                className="w-full py-1.5 text-xs text-[#e6d5b8] bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 rounded-lg transition-colors font-medium"
              >
                Utiliser {brut.toLocaleString("fr-FR")} Mornilles comme montant brut
              </button>
            </div>
          );
        })()}
      </div>

      {/* Montant */}
      <div>
        <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
          Montant brut (mornilles)
        </label>
        <input
          type="number"
          min={0}
          value={form.montant}
          onChange={(e) => set("montant", e.target.value)}
          className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
          placeholder="1000"
        />
        {(() => {
          const brut = parseFloat(form.montant) || 0;
          if (brut <= 0) return null;
          const taxe = Math.round((brut * TAXE) / 100);
          const net = brut - taxe;
          return (
            <p className="text-xs text-[#e6d5b8]/50 mt-1.5">
              → L&apos;employé reçoit <span className="text-[#e6d5b8] font-medium">{net.toLocaleString("fr-FR")}</span> · Taxe <span className="text-amber-400/80 font-medium">{taxe.toLocaleString("fr-FR")}</span>
            </p>
          );
        })()}
      </div>

      {/* Semestre / Année */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
            Semestre
          </label>
          <div className="grid grid-cols-2 gap-2">
            {["1", "2"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set("semestre", s)}
                className={`py-2 rounded-lg text-xs border transition-colors ${
                  form.semestre === s
                    ? "bg-[#1b3026] border-[#c5a059] text-[#e6d5b8] font-medium"
                    : "bg-[#0a0e0c]/80 border-[#c5a059]/20 text-[#e6d5b8]/60 hover:text-[#e6d5b8]"
                }`}
              >
                S{s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
            Année
          </label>
          <input
            type="number"
            value={form.annee}
            onChange={(e) => set("annee", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>
      </div>

      {/* Commentaire */}
      <div>
        <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
          Commentaire (optionnel)
        </label>
        <input
          value={form.commentaire}
          onChange={(e) => set("commentaire", e.target.value)}
          className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
          placeholder="Ex: Excellent travail durant le mois..."
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
        {success ? "✓ Prime attribuée au registre" : loading ? "Consignation..." : "✨ Attribuer la prime"}
      </button>
    </div>
  );
}