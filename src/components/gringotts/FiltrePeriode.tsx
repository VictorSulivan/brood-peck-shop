"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Periode } from "types/analyse";

// 1 semaine réelle = 1 semestre RP / 2 semaines réelles = 1 an RP
const PERIODES: { id: Periode; labelRp: string; labelReel: string }[] = [
  { id: "7j",    labelRp: "1 semestre",  labelReel: "7 jours"  },
  { id: "30j",   labelRp: "1 an",        labelReel: "14 jours" },
  { id: "90j",   labelRp: "3 ans",       labelReel: "42 jours" },
  { id: "annee", labelRp: "6 ans",       labelReel: "84 jours" },
  { id: "all",   labelRp: "Tout",        labelReel: ""         },
  { id: "custom",labelRp: "Plage libre", labelReel: ""         },
];

export function FiltrePeriode() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const currentPeriode = (searchParams.get("periode") ?? "30j") as Periode;
  const currentDebut   = searchParams.get("debut") ?? "";
  const currentFin     = searchParams.get("fin")   ?? "";

  const [debut, setDebut] = useState(currentDebut);
  const [fin,   setFin]   = useState(currentFin);

  function navigate(periode: Periode, d?: string, f?: string) {
    const p = new URLSearchParams();
    p.set("periode", periode);
    if (periode === "custom" && d && f) {
      p.set("debut", d);
      p.set("fin",   f);
    }
    router.push(`?${p.toString()}`);
  }

  return (
    <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl p-4 space-y-3 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c5a059]/30" />
      
      <div className="flex items-center gap-2 mb-1">
        <p className="text-xs text-[#c5a059] font-medium uppercase tracking-wider">Période</p>
        <span className="text-[10px] text-[#c5a059]/70 border border-[#c5a059]/20 bg-black/20 rounded px-1.5 py-0.5">
          1 sem. réelle = 1 semestre RP
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {PERIODES.map(({ id, labelRp, labelReel }) => (
          <button
            key={id}
            onClick={() => navigate(id, debut, fin)}
            className={`flex flex-col items-start px-3 py-2 rounded-lg border transition-all text-left ${
              currentPeriode === id
                ? "bg-[#1b3026] border-[#c5a059] text-[#e6d5b8] shadow-inner"
                : "bg-black/20 border-[#c5a059]/15 text-[#e6d5b8]/50 hover:text-[#e6d5b8] hover:border-[#c5a059]/40"
            }`}
          >
            <span className="text-xs font-medium">{labelRp}</span>
            {labelReel && (
              <span className={`text-[10px] ${currentPeriode === id ? "text-[#c5a059]" : "text-[#e6d5b8]/30"}`}>
                {labelReel} réels
              </span>
            )}
          </button>
        ))}
      </div>

      {currentPeriode === "custom" && (
        <div className="flex flex-wrap items-end gap-3 pt-3 border-t border-[#c5a059]/15">
          <div>
            <label className="block text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1.5">Du</label>
            <input
              type="date"
              value={debut}
              onChange={(e) => setDebut(e.target.value)}
              className="bg-[#111815] border border-[#c5a059]/20 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] focus:outline-none focus:border-[#c5a059]/60 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1.5">Au</label>
            <input
              type="date"
              value={fin}
              onChange={(e) => setFin(e.target.value)}
              className="bg-[#111815] border border-[#c5a059]/20 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] focus:outline-none focus:border-[#c5a059]/60 transition-colors"
            />
          </div>
          <button
            onClick={() => navigate("custom", debut, fin)}
            disabled={!debut || !fin}
            className="bg-[#1b3026] hover:bg-[#233d31] disabled:opacity-40 border border-[#c5a059]/40 text-[#f3e9d2] text-sm rounded-lg px-4 py-2 font-medium transition-all shadow-inner"
          >
            Appliquer
          </button>
        </div>
      )}
    </div>
  );
}