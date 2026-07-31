"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUTS = [
  { key: "planifie", label: "Planifié" },
  { key: "en_cours", label: "En cours" },
  { key: "termine", label: "Terminé" },
  { key: "annule", label: "Annulé" },
];

export default function EvenementActions({ id, statut }: { id: number; statut: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [commentaire, setCommentaire] = useState("");
  const [showComment, setShowComment] = useState(false);

  async function changerStatut(s: string) {
    setLoading(true);
    await fetch(`/api/evenements/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: s }),
    });
    router.refresh();
    setLoading(false);
  }

  async function saveComment() {
    if (!commentaire.trim()) return;
    setLoading(true);
    await fetch(`/api/evenements/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentaire }),
    });
    setShowComment(false);
    setCommentaire("");
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {STATUTS.filter((s) => s.key !== statut).map((s) => (
          <button
            key={s.key}
            onClick={() => changerStatut(s.key)}
            disabled={loading}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all disabled:opacity-30"
          >
            → {s.label}
          </button>
        ))}
        <button
          onClick={() => setShowComment(!showComment)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-[#3d3580] bg-[#2a2250]/50 hover:bg-[#2a2250] text-[#c4bbff] transition-all"
        >
          💬 Commenter
        </button>
      </div>

      {showComment && (
        <div className="flex gap-2 pt-1">
          <input
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            className="flex-1 bg-[#0f0f1a] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3d3580]"
            placeholder="Écrire un commentaire..."
          />
          <button
            onClick={saveComment}
            disabled={loading || !commentaire.trim()}
            className="text-xs px-3 py-1.5 bg-[#2a2250] hover:bg-[#352b69] border border-[#3d3580] text-[#c4bbff] rounded-lg font-medium transition-all disabled:opacity-40"
          >
            Valider
          </button>
        </div>
      )}
    </div>
  );
}