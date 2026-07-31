"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function EmployeActions({ id, actif }: { id: number; actif: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleActif() {
    setLoading(true);
    await fetch(`/api/employes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actif: !actif }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/dashboard/employes/${id}`}
        className="text-xs text-[#e6d5b8]/70 hover:text-[#e6d5b8] px-2.5 py-1 rounded-lg border border-[#c5a059]/20 hover:border-[#c5a059]/40 bg-[#0a0e0c]/40 transition-colors"
      >
        Voir
      </Link>
      <button
        onClick={toggleActif}
        disabled={loading}
        className="text-xs text-[#e6d5b8]/70 hover:text-[#e6d5b8] px-2.5 py-1 rounded-lg border border-[#c5a059]/20 hover:border-[#c5a059]/40 bg-[#0a0e0c]/40 transition-colors disabled:opacity-30"
      >
        {actif ? "Désactiver" : "Activer"}
      </button>
    </div>
  );
}