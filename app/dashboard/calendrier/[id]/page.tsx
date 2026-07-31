import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import EvenementActions from "@/components/calendrier/EvenementActions";
import { fmtDate } from "@/utils/formatDate";

export default async function EvenementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const e = await prisma.evenement.findUnique({
    where: { id: parseInt(id) },
    include: {
      responsable: true,
      employes: { include: { employe: true } },
      clients: { include: { client: true } },
      consommations: { include: { produit: true } },
    },
  });

  if (!e) notFound();

  const totalConso = e.consommations.reduce((acc, c) => acc + c.quantite * c.prixUnitaire, 0);
  const totalPersonnes = e.clients.reduce((acc, c) => acc + c.nbPersonnes, 0);

  const typeBadge: Record<string, { label: string; style: string }> = {
    reservation: { label: "Réservation", style: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    soiree: { label: "Soirée", style: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  };

  const statutBadge: Record<string, { label: string; style: string }> = {
    planifie: { label: "Planifié", style: "bg-white/10 text-white/70 border-white/15" },
    en_cours: { label: "En cours", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    termine: { label: "Terminé", style: "bg-white/5 text-white/40 border-white/5" },
    annule: { label: "Annulé", style: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-2 text-sm text-white/40">
        <Link href="/dashboard/calendrier" className="hover:text-white transition-colors">
          Calendrier
        </Link>
        <span>/</span>
        <span className="text-white/80 font-medium truncate">{e.titre}</span>
      </div>

      {/* Main Banner Card */}
      <div className="bg-[#16162a] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${typeBadge[e.type]?.style ?? "bg-white/10 text-white"}`}>
                {typeBadge[e.type]?.label ?? e.type}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statutBadge[e.statut]?.style ?? "bg-white/10 text-white"}`}>
                {statutBadge[e.statut]?.label ?? e.statut}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{e.titre}</h1>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>📅</span>
              <span>
                {fmtDate(e.dateDebut, { weekday: "long", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
              {e.dateFin && (
                <>
                  <span className="text-white/30">→</span>
                  <span>{fmtDate(e.dateFin, { hour: "2-digit", minute: "2-digit" })}</span>
                </>
              )}
            </div>
          </div>

          <EvenementActions id={e.id} statut={e.statut} />
        </div>

        {e.description && (
          <div className="border-t border-white/10 pt-4">
            <p className="text-sm text-white/70 leading-relaxed">{e.description}</p>
          </div>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Clients rés.", value: e.clients.length.toString(), icon: "👥" },
          { label: "Personnes total", value: totalPersonnes.toString(), icon: "🧑‍🤝‍🧑" },
          { label: "Conso estimée", value: `${totalConso.toLocaleString("fr-FR")} Mornilles`, icon: "🧪" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-[#16162a] border border-white/10 rounded-xl p-4 text-center space-y-1">
            <span className="text-lg">{icon}</span>
            <p className="text-xl font-bold text-white tracking-tight">{value}</p>
            <p className="text-white/40 text-[11px] uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* Équipe */}
      {(e.responsable || e.employes.length > 0) && (
        <div className="bg-[#16162a] border border-white/10 rounded-xl p-5 space-y-4">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Équipe assignée</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {e.responsable && (
              <div className="flex items-center gap-3 bg-white/3 border border-[#3d3580]/50 rounded-lg p-3">
                <div className="w-9 h-9 rounded-full bg-[#2a2250] border border-[#3d3580] flex items-center justify-center text-[#c4bbff] font-semibold text-xs">
                  {e.responsable.prenom[0]}{e.responsable.nom[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{e.responsable.prenom} {e.responsable.nom}</p>
                  <span className="inline-block text-[10px] bg-[#2a2250] text-[#c4bbff] px-2 py-0.5 rounded-md font-medium">Responsable</span>
                </div>
              </div>
            )}
            {e.employes.map((emp) => (
              <div key={emp.id} className="flex items-center gap-3 bg-white/2 border border-white/5 rounded-lg p-3">
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 font-medium text-xs">
                  {emp.employe.prenom[0]}{emp.employe.nom[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">{emp.employe.prenom} {emp.employe.nom}</p>
                  <p className="text-xs text-white/30">Staff</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clients */}
      {e.clients.length > 0 && (
        <div className="bg-[#16162a] border border-white/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Clients ({e.clients.length})</p>
            <span className="text-xs text-white/30">{totalPersonnes} pers. au total</span>
          </div>
          <div className="divide-y divide-white/5">
            {e.clients.map((c) => (
              <div key={c.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-white">{c.client.prenom} {c.client.nom}</p>
                  {c.commentaire && <p className="text-xs text-white/40 mt-0.5">💬 {c.commentaire}</p>}
                </div>
                <div className="text-right">
                  <span className="inline-block text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-white/70">
                    {c.nbPersonnes} pers.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consommations */}
      {e.consommations.length > 0 && (
        <div className="bg-[#16162a] border border-white/10 rounded-xl p-5 space-y-3">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Consommations prévues</p>
          <div className="space-y-2">
            {e.consommations.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-white/2">
                <span className="text-white/80">{c.produit.nom} <span className="text-white/40">×{c.quantite}</span></span>
                <span className="font-medium text-white">{(c.quantite * c.prixUnitaire).toFixed(0)} Mornilles</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-semibold">
            <span className="text-white/40">Total Estimé</span>
            <span className="text-[#c4bbff]">{totalConso.toFixed(0)} Mornilles</span>
          </div>
        </div>
      )}

      {/* Commentaire */}
      {e.commentaire && (
        <div className="bg-[#16162a] border border-white/10 rounded-xl p-5 space-y-2">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Commentaire interne</p>
          <p className="text-sm text-white/70 italic bg-white/2 p-3 rounded-lg border border-white/5">"{e.commentaire}"</p>
        </div>
      )}
    </div>
  );
}