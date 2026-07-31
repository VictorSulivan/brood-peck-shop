"use client";

import { useState } from "react";

const TAXE = 20;

type Mode = "simulateur" | "versement" | "retrait";

export default function CalculateurTaxe() {
  const [mode, setMode] = useState<Mode>("simulateur");

  return (
    <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl overflow-hidden shadow-xl relative mb-8">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c5a059]/30" />
      
      {/* Tabs */}
      <div className="flex border-b border-[#c5a059]/20 bg-black/10">
        {([
          { id: "simulateur", label: "🧮 Simulateur" },
          { id: "versement",  label: "💸 Versement" },
          { id: "retrait",    label: "🏧 Retrait" },
        ] as { id: Mode; label: string }[]).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
              mode === id
                ? "text-[#e6d5b8] border-b-2 border-[#c5a059] bg-[#1b3026]/40"
                : "text-[#e6d5b8]/40 hover:text-[#e6d5b8]/80 hover:bg-[#c5a059]/5"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {mode === "simulateur" && <Simulateur />}
        {mode === "versement"  && <Transaction type="versement" />}
        {mode === "retrait"    && <Transaction type="retrait" />}
      </div>
    </div>
  );
}

function Simulateur() {
  const [montant, setMontant] = useState("");
  const souhait = parseFloat(montant) || 0;
  const aDemanderr = souhait > 0 ? Math.ceil(souhait / (1 - TAXE / 100)) : 0;
  const taxe = aDemanderr - souhait;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1">
          Simulateur de retrait Gringotts
        </p>
        <p className="text-[#e6d5b8]/50 text-xs">
          Calcule combien demander pour recevoir exactement le montant désiré après {TAXE}% de taxe.
        </p>
      </div>

      <div>
        <label className="block text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1.5">
          Montant net désiré (Mornilles)
        </label>
        <input
          type="number"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          placeholder="Ex: 1000"
          className="w-full bg-[#111815] border border-[#c5a059]/20 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] placeholder-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059]/60 transition-colors"
        />
      </div>

      {souhait > 0 && (
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-[#111815]/80 border border-[#c5a059]/20 rounded-xl p-4">
            <p className="text-xs text-[#c5a059]/70 mb-1">À demander</p>
            <p className="text-2xl font-serif font-semibold text-emerald-400">
              ${aDemanderr.toLocaleString("fr-FR")}
            </p>
          </div>
          <div className="bg-[#111815]/80 border border-[#c5a059]/20 rounded-xl p-4">
            <p className="text-xs text-[#c5a059]/70 mb-1">Taxe Gringotts ({TAXE}%)</p>
            <p className="text-2xl font-serif font-semibold text-amber-400">
              -{taxe.toLocaleString("fr-FR")} Mornilles
            </p>
          </div>
        </div>
      )}

      <p className="text-[#e6d5b8]/30 text-[11px] italic">
        * Arrondi supérieur automatique inclus pour garantir la réception exacte du montant désiré.
      </p>
    </div>
  );
}

function Transaction({ type }: { type: "versement" | "retrait" }) {
  const [montant, setMontant] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isRetrait = type === "retrait";
  const montantNum = parseFloat(montant) || 0;
  const taxe = isRetrait ? Math.round((montantNum * TAXE) / 100) : 0;
  const netRecu = montantNum - taxe;

  async function handleSubmit() {
    if (!montantNum) return setError("Montant requis");
    setLoading(true);
    setError("");

    const res = await fetch("/api/gringotts/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        montant: montantNum,
        description: description || (isRetrait ? `Retrait manuel` : `Versement manuel`),
      }),
    });

    if (res.ok) {
      setSuccess(true);
      setMontant("");
      setDescription("");
      setTimeout(() => {
        setSuccess(false);
        window.location.reload();
      }, 1500);
    } else {
      const d = await res.json();
      setError(d.error ?? "Erreur");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1">
          {isRetrait ? "Retrait depuis Gringotts" : "Versement vers Gringotts"}
        </p>
        <p className="text-[#e6d5b8]/50 text-xs">
          {isRetrait
            ? `Gringotts prélève ${TAXE}% de taxe sur chaque retrait.`
            : "Ajouter de l'argent au solde Gringotts directement."}
        </p>
      </div>

      <div>
        <label className="block text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1.5">
          {isRetrait ? "Montant brut à retirer (Mornilles)" : "Montant à verser (Mornilles)"}
        </label>
        <input
          type="number"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          placeholder="Ex: 5000"
          className="w-full bg-[#111815] border border-[#c5a059]/20 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] placeholder-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059]/60 transition-colors"
        />
      </div>

      {isRetrait && montantNum > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#111815]/80 border border-[#c5a059]/20 rounded-xl p-3">
            <p className="text-xs text-[#c5a059]/70 mb-1">Taxe ({TAXE}%)</p>
            <p className="text-lg font-serif font-semibold text-amber-400">
              -{taxe.toLocaleString("fr-FR")} Mornilles
            </p>
          </div>
          <div className="bg-[#111815]/80 border border-[#c5a059]/20 rounded-xl p-3">
            <p className="text-xs text-[#c5a059]/70 mb-1">Net reçu</p>
            <p className="text-lg font-serif font-semibold text-emerald-400">
              {netRecu.toLocaleString("fr-FR")} Mornilles
            </p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1.5">
          Description (optionnel)
        </label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={isRetrait ? "Achat véhicule, loyer..." : "Remboursement, apport..."}
          className="w-full bg-[#111815] border border-[#c5a059]/20 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] placeholder-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059]/60 transition-colors"
        />
      </div>

      {error && <p className="text-amber-400 text-sm font-medium">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full text-sm font-medium py-2.5 rounded-lg border transition-all shadow-inner ${
          success
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : isRetrait
            ? "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300 disabled:opacity-50"
            : "bg-[#1b3026] hover:bg-[#233d31] border-[#c5a059]/40 text-[#f3e9d2] disabled:opacity-50"
        }`}
      >
        {success
          ? "✓ Opération effectuée"
          : loading
          ? "En cours..."
          : isRetrait
          ? "Effectuer le retrait"
          : "Effectuer le versement"}
      </button>
    </div>
  );
}