"use client";

import { useState } from "react";
import Link from "next/link";
import { fmtDate } from "@/utils/formatDate";

type Evenement = {
  id: number;
  titre: string;
  type: string;
  statut: string;
  dateDebut: string;
  dateFin: string | null;
  responsable: { nom: string; prenom: string } | null;
  employes: { employe: { nom: string; prenom: string } }[];
  clients: { client: { nom: string; prenom: string | null } }[];
};

const MOIS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];
const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

// Badges d'événements - Style Grimoire & Potion
const typeStyle: Record<string, string> = {
  reservation: "bg-amber-950/40 text-amber-300 border-amber-700/40 hover:bg-amber-900/50 shadow-sm shadow-amber-950/50",
  soiree: "bg-emerald-950/40 text-emerald-300 border-emerald-700/40 hover:bg-emerald-900/50 shadow-sm shadow-emerald-950/50",
};

// Statuts enchantés
const statutBadge: Record<string, string> = {
  planifie: "bg-amber-900/20 text-amber-200/70 border-amber-800/30",
  en_cours: "bg-emerald-900/30 text-emerald-300 border-emerald-600/40 animate-pulse",
  termine: "bg-stone-900/40 text-stone-400 border-stone-800/40",
  annule: "bg-rose-950/30 text-rose-300 border-rose-800/30",
};

export default function CalendrierView({ evenements }: { evenements: Evenement[] }) {
  const now = new Date();
  const [mois, setMois] = useState(now.getMonth());
  const [annee, setAnnee] = useState(now.getFullYear());
  const [selected, setSelected] = useState<Evenement | null>(null);

  const premier = new Date(annee, mois, 1);
  const dernier = new Date(annee, mois + 1, 0);
  const startDay = (premier.getDay() + 6) % 7;
  const nbJours = dernier.getDate();

  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: nbJours }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function getEvenementsJour(jour: number) {
    return evenements.filter((e) => {
      const d = new Date(e.dateDebut);
      return d.getFullYear() === annee && d.getMonth() === mois && d.getDate() === jour;
    });
  }

  function prev() {
    if (mois === 0) { setMois(11); setAnnee(a => a - 1); }
    else setMois(m => m - 1);
  }

  function next() {
    if (mois === 11) { setMois(0); setAnnee(a => a + 1); }
    else setMois(m => m + 1);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      {/* Grille Principale du Grimoire */}
      <div className="lg:col-span-3 space-y-4">
        {/* Commandes du mois */}
        <div className="flex items-center justify-between bg-[#130f0c] border border-amber-900/30 rounded-xl px-5 py-3 shadow-lg shadow-black/40">
          <button
            onClick={prev}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-950/30 border border-amber-800/30 text-amber-300/70 hover:text-amber-200 hover:border-amber-600/50 transition-all active:scale-95"
          >
            ‹
          </button>
          <h2 className="text-base font-semibold tracking-wide text-amber-100 flex items-center gap-2">
            <span>📜</span> {MOIS[mois]} <span className="text-amber-400/80 font-mono">{annee}</span>
          </h2>
          <button
            onClick={next}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-950/30 border border-amber-800/30 text-amber-300/70 hover:text-amber-200 hover:border-amber-600/50 transition-all active:scale-95"
          >
            ›
          </button>
        </div>

        {/* Grille Mensuelle Bois & Parchemin */}
        <div className="bg-[#130f0c] border border-amber-900/30 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
          {/* En-tête des jours */}
          <div className="grid grid-cols-7 border-b border-amber-900/30 bg-amber-950/20">
            {JOURS.map((j) => (
              <div key={j} className="py-2.5 text-center text-[11px] font-bold text-amber-500/70 uppercase tracking-widest">
                {j}
              </div>
            ))}
          </div>

          {/* Cases des jours */}
          <div className="grid grid-cols-7 divide-x divide-y divide-amber-900/20 bg-[#0d0a08]">
            {cells.map((jour, i) => {
              const evs = jour ? getEvenementsJour(jour) : [];
              const isToday = jour === now.getDate() && mois === now.getMonth() && annee === now.getFullYear();
              return (
                <div
                  key={i}
                  className={`min-h-[105px] p-1.5 transition-colors ${
                    !jour ? "bg-amber-950/[0.03]" : "hover:bg-amber-900/[0.08]"
                  }`}
                >
                  {jour && (
                    <>
                      <div className="flex justify-between items-center mb-1.5 px-1">
                        <span
                          className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                            isToday
                              ? "bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/30"
                              : "text-amber-200/50"
                          }`}
                        >
                          {jour}
                        </span>
                        {evs.length > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
                        )}
                      </div>

                      <div className="space-y-1">
                        {evs.slice(0, 2).map((e) => (
                          <button
                            key={e.id}
                            onClick={() => setSelected(e)}
                            className={`w-full text-left text-[11px] font-medium px-2 py-1 rounded-md border truncate transition-all ${
                              typeStyle[e.type] ?? "bg-stone-900/60 text-amber-200 border-amber-900/40"
                            }`}
                          >
                            {e.titre}
                          </button>
                        ))}
                        {evs.length > 2 && (
                          <div className="text-[10px] text-amber-500/60 px-1 font-medium italic">
                            +{evs.length - 2} autre{evs.length - 2 > 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panneau Latéral : Parchemin d'inspection */}
      <div className="lg:col-span-1">
        {selected ? (
          <div className="bg-[#130f0c] border border-amber-900/40 rounded-2xl p-5 space-y-4 sticky top-6 shadow-2xl shadow-black">
            <div className="flex items-start justify-between">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${typeStyle[selected.type]}`}>
                {selected.type === "reservation" ? "📋 Réservation" : "🎉 Soirée"}
              </span>
              <button
                onClick={() => setSelected(null)}
                className="text-amber-500/40 hover:text-amber-200 text-sm w-6 h-6 flex items-center justify-center rounded-full hover:bg-amber-950/40 transition-colors"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-amber-100 tracking-wide">{selected.titre}</h3>
              <div className="mt-2 text-xs text-amber-200/60 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span>📅</span>
                  <span>{fmtDate(selected.dateDebut, { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                {selected.dateFin && (
                  <div className="flex items-center gap-1.5 text-amber-300/40">
                    <span>⏱</span>
                    <span>Fin : {fmtDate(selected.dateFin, { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <span className={`inline-block text-xs px-2.5 py-1 rounded-full border font-medium ${statutBadge[selected.statut]}`}>
                {selected.statut.replace("_", " ")}
              </span>
            </div>

            {selected.responsable && (
              <div className="border-t border-amber-900/20 pt-3">
                <p className="text-[10px] text-amber-500/50 uppercase tracking-widest font-semibold mb-1">Maître d'hôtel / Responsable</p>
                <p className="text-xs text-amber-100 font-medium">{selected.responsable.prenom} {selected.responsable.nom}</p>
              </div>
            )}

            {selected.employes.length > 0 && (
              <div className="border-t border-amber-900/20 pt-3">
                <p className="text-[10px] text-amber-500/50 uppercase tracking-widest font-semibold mb-1.5">Membres du staff ({selected.employes.length})</p>
                <div className="flex flex-wrap gap-1">
                  {selected.employes.map((e, i) => (
                    <span key={i} className="text-[11px] bg-amber-950/40 border border-amber-800/30 text-amber-200/80 px-2 py-0.5 rounded-md">
                      {e.employe.prenom} {e.employe.nom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selected.clients.length > 0 && (
              <div className="border-t border-amber-900/20 pt-3">
                <p className="text-[10px] text-amber-500/50 uppercase tracking-widest font-semibold mb-1.5">Convives / Clients ({selected.clients.length})</p>
                <div className="flex flex-wrap gap-1">
                  {selected.clients.map((c, i) => (
                    <span key={i} className="text-[11px] bg-amber-950/40 border border-amber-800/30 text-amber-200/80 px-2 py-0.5 rounded-md">
                      {c.client.prenom} {c.client.nom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              href={`/dashboard/calendrier/${selected.id}`}
              className="block w-full text-center text-xs font-semibold bg-linear-to-r from-amber-900/60 to-amber-950/80 hover:from-amber-800/70 hover:to-amber-900/90 border border-amber-600/40 text-amber-200 py-2.5 rounded-xl transition-all shadow-lg shadow-black/50 mt-4"
            >
              Consulter le Grimoire →
            </Link>
          </div>
        ) : (
          <div className="bg-[#130f0c] border border-amber-900/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="text-center py-3">
              <span className="text-3xl">🔮</span>
              <p className="text-xs text-amber-200/40 mt-2">Sélectionnez un événement pour en révéler les détails</p>
            </div>

            <div className="border-t border-amber-900/20 pt-4 space-y-3">
              <p className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest">Événements imminents</p>
              <div className="space-y-2">
                {evenements
                  .filter((e) => new Date(e.dateDebut) >= new Date() && e.statut !== "annule")
                  .slice(0, 5)
                  .map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setSelected(e)}
                      className="w-full text-left p-2.5 rounded-xl bg-amber-950/20 hover:bg-amber-900/30 border border-amber-900/20 transition-all group"
                    >
                      <p className="text-amber-100 text-xs font-medium group-hover:text-amber-300 truncate transition-colors">{e.titre}</p>
                      <p className="text-amber-500/50 text-[10px] mt-0.5">
                        📅 {fmtDate(e.dateDebut, { day: "2-digit", month: "short" })}
                      </p>
                    </button>
                  ))}
                {evenements.filter((e) => new Date(e.dateDebut) >= new Date()).length === 0 && (
                  <p className="text-amber-200/30 text-xs text-center py-4">Aucun événement à venir</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}