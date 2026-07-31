"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StockActions({ id, actif }: { id: number; actif: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleActif() {
    setLoading(true);
    await fetch(`/api/produits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actif: !actif }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <a 
        href={`/dashboard/stock/${id}`}
        className="text-xs text-[#e6d5b8]/60 hover:text-[#e6d5b8] px-2.5 py-1 rounded hover:bg-[#c5a059]/10 transition-colors"
      >
        Modifier
      </a>
      <button
        onClick={toggleActif}
        disabled={loading}
        className="text-xs text-[#e6d5b8]/60 hover:text-[#e6d5b8] px-2.5 py-1 rounded hover:bg-[#c5a059]/10 transition-colors disabled:opacity-30"
      >
        {actif ? "Désactiver" : "Activer"}
      </button>
    </div>
  );
}