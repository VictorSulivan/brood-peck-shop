"use client";

import { useState } from "react";

type Extra = { label: string; montant: number };

// --- 6. COMPOSANT : EXTRAS ---
export default function FormExtras({ extras, onAddExtra, onRemoveExtra }: { extras: Extra[]; onAddExtra: (label: string, montant: number) => void; onRemoveExtra: (index: number) => void }) {
  const [label, setLabel] = useState("");
  const [montantStr, setMontantStr] = useState("");

  const handleAdd = () => {
    const val = parseFloat(montantStr);
    if (!label.trim() || !val || val <= 0) return;
    onAddExtra(label.trim(), val);
    setLabel(""); setMontantStr("");
  };

  return (
    <div>
      <p className="text-xs text-[#c5a059] uppercase tracking-widest font-medium mb-3">Extras & Services</p>
      <div className="flex gap-2 mb-3">
        <input 
          value={label} 
          onChange={(e) => setLabel(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && handleAdd()} 
          placeholder="Description (ex: Capture de botruc, Fournitures d'enclos)" 
          className="flex-1 bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] placeholder:text-[#e6d5b8]/25 outline-none focus:border-[#c5a059]" 
        />
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c5a059]/70 text-sm">$</span>
          <input 
            type="number" 
            min={0} 
            value={montantStr} 
            onChange={(e) => setMontantStr(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && handleAdd()} 
            placeholder="0" 
            className="w-24 bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-lg pl-7 pr-3 py-2 text-sm text-[#e6d5b8] text-right placeholder:text-[#e6d5b8]/25 outline-none focus:border-[#c5a059]" 
          />
        </div>
        <button 
          type="button" 
          onClick={handleAdd} 
          disabled={!label.trim() || !montantStr} 
          className="px-4 bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 text-[#f3e9d2] text-sm rounded-lg disabled:opacity-30 transition-all shadow-inner"
        >
          +
        </button>
      </div>
      
      {extras.length > 0 ? (
        <div className="space-y-2">
          {extras.map((e, i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-3 py-2 bg-[#0a0e0c]/60 rounded-lg border border-[#c5a059]/15">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#e6d5b8] bg-[#1b3026] border border-[#c5a059]/30 px-2 py-0.5 rounded font-medium">Extra</span>
                <span className="text-sm text-[#e6d5b8]/80">{e.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#e6d5b8] font-serif font-semibold">${e.montant.toFixed(0)}</span>
                <button type="button" onClick={() => onRemoveExtra(i)} className="text-[#e6d5b8]/30 hover:text-red-400 text-xs transition-colors">✕</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#e6d5b8]/30 text-xs text-center py-2 italic">Aucun extra ajouté à cette transaction...</p>
      )}
    </div>
  );
}