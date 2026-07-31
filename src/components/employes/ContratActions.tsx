"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ContratActions({ id, estActif }: { id: number; estActif: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/contrats/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estActif: !estActif }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="text-xs text-[#e6d5b8]/60 hover:text-[#e6d5b8] px-2.5 py-1 rounded-lg border border-[#c5a059]/20 hover:border-[#c5a059]/40 bg-[#0a0e0c]/40 transition-colors disabled:opacity-30 shrink-0"
    >
      {estActif ? "Résilier" : "Réactiver"}
    </button>
  );
}