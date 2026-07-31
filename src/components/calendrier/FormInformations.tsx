"use client";

interface EvenementForm {
  type: string;
  titre: string;
  dateDebut: string;
  dateFin: string;
  description: string;
}

export default function FormInformations({
  form,
  onChange,
}: {
  form: EvenementForm;
  onChange: (key: string, val: string) => void;
}) {
  return (
    <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-2xl p-6 space-y-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-[#c5a059]/15">
        <p className="text-xs font-semibold text-[#c5a059] uppercase tracking-widest flex items-center gap-2">
          <span>📜</span> 1. Informations Générales
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#c5a059]/80 mb-2">Type d&apos;événement</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { v: "reservation", l: "📋  Réservation" },
            { v: "soiree", l: "🎉  Soirée" },
          ].map(({ v, l }) => (
            <button
              key={v}
              type="button"
              onClick={() => onChange("type", v)}
              className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                form.type === v
                  ? "bg-[#1b3026] border-[#c5a059]/50 text-[#e6d5b8] shadow-inner font-semibold"
                  : "bg-[#0a0e0c]/40 border-[#c5a059]/20 text-[#e6d5b8]/50 hover:text-[#e6d5b8] hover:border-[#c5a059]/40"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#c5a059]/80 mb-1.5">Titre de l&apos;événement</label>
        <input
          value={form.titre}
          onChange={(e) => onChange("titre", e.target.value)}
          className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-xl px-4 py-2.5 text-sm text-[#e6d5b8] placeholder:text-[#e6d5b8]/25 focus:outline-none focus:border-[#c5a059] transition-colors"
          placeholder="ex: Banquet des Alchimistes, Anniversaire..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#c5a059]/80 mb-1.5">Date & heure de début</label>
          <input
            type="datetime-local"
            value={form.dateDebut}
            onChange={(e) => onChange("dateDebut", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-xl px-4 py-2.5 text-sm text-[#e6d5b8] focus:outline-none focus:border-[#c5a059] transition-colors [color-scheme:dark]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#c5a059]/80 mb-1.5">Date & heure de fin</label>
          <input
            type="datetime-local"
            value={form.dateFin}
            onChange={(e) => onChange("dateFin", e.target.value)}
            className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-xl px-4 py-2.5 text-sm text-[#e6d5b8] focus:outline-none focus:border-[#c5a059] transition-colors [color-scheme:dark]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#c5a059]/80 mb-1.5">Description / Remarques</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-xl px-4 py-2.5 text-sm text-[#e6d5b8] placeholder:text-[#e6d5b8]/25 focus:outline-none focus:border-[#c5a059] transition-colors resize-none"
          placeholder="Détails spécifiques, disposition de la salle..."
        />
      </div>
    </div>
  );
}