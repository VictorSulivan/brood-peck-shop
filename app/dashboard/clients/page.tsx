import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { nom: "asc" },
    include: {
      entrepriseCliente: true,
      _count: { select: { ventes: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#e6d5b8]">Clients</h1>
          <p className="text-[#c5a059]/70 text-sm mt-1">{clients.length} clients enregistrés</p>
        </div>
        <Link
          href="/dashboard/clients/nouveau"
          className="flex items-center gap-2 bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 text-[#f3e9d2] text-sm font-medium px-4 py-2.5 rounded-lg transition-all shadow-inner"
        >
          + Nouveau client
        </Link>
      </div>

      <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl overflow-hidden shadow-xl relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c5a059]/30" />
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#c5a059]/20">
              <th className="text-left px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Client</th>
              <th className="text-left px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Type</th>
              <th className="text-left px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Entreprise</th>
              <th className="text-right px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Ventes</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-[#c5a059]/10 hover:bg-[#c5a059]/5 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1b3026] border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] text-xs font-serif font-medium uppercase">
                      {c.prenom?.[0] ?? c.nom[0]}{c.nom[0]}
                    </div>
                    <span className="text-[#e6d5b8] font-medium">{c.prenom} {c.nom}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${
                    c.typeClient === "entreprise"
                      ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                      : "bg-black/20 text-[#e6d5b8]/50 border-[#c5a059]/15"
                  }`}>
                    {c.typeClient ?? "particulier"}
                  </span>
                </td>
                <td className="px-5 py-4 text-[#e6d5b8]/60">
                  {c.entrepriseCliente?.nom ?? "—"}
                </td>
                <td className="px-5 py-4 text-right text-[#e6d5b8] font-serif font-semibold">
                  {c._count.ventes}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/dashboard/clients/${c.id}`}
                    className="text-xs text-[#e6d5b8]/70 hover:text-[#e6d5b8] border border-[#c5a059]/30 hover:border-[#c5a059] bg-[#1b3026]/50 hover:bg-[#1b3026] px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {clients.length === 0 && (
          <div className="text-center py-16 text-[#e6d5b8]/40 italic">
            Aucun client. <Link href="/dashboard/clients/nouveau" className="text-[#c5a059] underline font-medium">Créer le premier</Link>
          </div>
        )}
      </div>
    </div>
  );
}