"use client";

import { Employe } from "@prisma/client";

export default function FormEquipe({
  employes,
  responsableId,
  selectedEmployes,
  onResponsableChange,
  onToggleEmploye,
}: {
  employes: Employe[];
  responsableId: string;
  selectedEmployes: number[];
  onResponsableChange: (id: string) => void;
  onToggleEmploye: (id: number) => void;
}) {
  return (
    <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-5 space-y-4">
      <p className="text-xs text-[#c5a059] uppercase tracking-widest font-medium">Équipe & Encadrement</p>

      <div>
        <label className="block text-xs text-[#c5a059]/80 mb-1.5 font-medium">Responsable d&apos;événement</label>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
          {employes.map((e) => {
            const isSelected = responsableId === e.id.toString();
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => onResponsableChange(isSelected ? "" : e.id.toString())}
                className={`text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                  isSelected
                    ? "bg-[#1b3026] border-[#c5a059]/50 text-[#e6d5b8] font-medium shadow-inner"
                    : "bg-[#0a0e0c]/40 border-[#c5a059]/20 text-[#e6d5b8]/50 hover:text-[#e6d5b8] hover:border-[#c5a059]/40"
                }`}
              >
                {e.prenom} {e.nom}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#c5a059]/80 mb-1.5 font-medium">Employés affectés</label>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
          {employes.map((e) => {
            const isSelected = selectedEmployes.includes(e.id);
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => onToggleEmploye(e.id)}
                className={`text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                  isSelected
                    ? "bg-[#1b3026] border-[#c5a059]/50 text-[#e6d5b8] font-medium shadow-inner"
                    : "bg-[#0a0e0c]/40 border-[#c5a059]/20 text-[#e6d5b8]/50 hover:text-[#e6d5b8] hover:border-[#c5a059]/40"
                }`}
              >
                {e.prenom} {e.nom}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}