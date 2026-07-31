import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import EmployeActions from "@/components/employes/EmployeActions";

export default async function EmployesPage() {
  const employes = await prisma.employe.findMany({
    orderBy: { nom: "asc" },
    include: { utilisateur: true },
  });

  const roleColor: Record<string, string> = {
    patron:    "bg-amber-950/80 text-amber-300 border-amber-500/40",
    co_patron: "bg-[#1b3026] text-[#e6d5b8] border-[#c5a059]/40",
    employe:   "bg-[#0a0e0c] text-[#e6d5b8]/80 border-[#c5a059]/20",
    stagiaire: "bg-[#0a0e0c]/40 text-[#e6d5b8]/50 border-white/10",
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#c5a059]/20">
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-[#e6d5b8] flex items-center gap-3 font-serif">
            <span>🧙‍♂️</span> Registre des Employés
          </h1>
          <p className="text-xs text-[#c5a059]/70 mt-1 italic">
            {employes.filter((e) => e.actif).length} membres du personnel actifs au registre
          </p>
        </div>
        <Link
          href="/dashboard/employes/nouveau"
          className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-amber-800 to-amber-950 hover:from-amber-700 hover:to-amber-900 border border-[#c5a059]/50 text-[#f3e9d2] text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-black/40 active:scale-[0.98]"
        >
          <span className="text-base leading-none">✨</span>
          <span>Nouvel employé</span>
        </Link>
      </div>

      {/* Tableau des employés */}
      <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#c5a059]/20 bg-[#0a0e0c]/80 text-[#c5a059]">
                <th className="text-left px-5 py-3.5 font-medium text-xs uppercase tracking-wider font-serif">Employé</th>
                <th className="text-left px-5 py-3.5 font-medium text-xs uppercase tracking-wider font-serif">Rôle</th>
                <th className="text-left px-5 py-3.5 font-medium text-xs uppercase tracking-wider font-serif">Compte</th>
                <th className="text-right px-5 py-3.5 font-medium text-xs uppercase tracking-wider font-serif">Salaire</th>
                <th className="text-right px-5 py-3.5 font-medium text-xs uppercase tracking-wider font-serif">Statut</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c5a059]/10">
              {employes.map((e) => (
                <tr key={e.id} className="hover:bg-[#1b3026]/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1b3026] border border-[#c5a059]/40 flex items-center justify-center text-[#e6d5b8] text-xs font-serif font-semibold uppercase shadow-inner">
                        {e.prenom[0]}{e.nom[0]}
                      </div>
                      <div>
                        <p className="text-[#e6d5b8] font-medium font-serif">{e.prenom} {e.nom}</p>
                        {e.utilisateur && (
                          <p className="text-[#c5a059]/60 text-xs">@{e.utilisateur.username}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border capitalize font-medium ${roleColor[e.role] ?? ""}`}>
                      {e.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {e.utilisateur ? (
                      <span className="text-xs bg-[#1b3026] text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-medium">
                        Actif
                      </span>
                    ) : (
                      <span className="text-xs text-[#e6d5b8]/30 italic">Aucun</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right text-[#e6d5b8]/90 font-medium font-serif">
                    {e.salaire ? `${e.salaire.toLocaleString()} Mornilles` : "—"}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                        e.actif
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
                          : "bg-[#0a0e0c] text-[#e6d5b8]/40 border-[#c5a059]/15"
                      }`}
                    >
                      {e.actif ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <EmployeActions id={e.id} actif={e.actif} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employes.length === 0 && (
          <div className="text-center py-16 text-[#e6d5b8]/40 italic font-serif">
            Aucun employé répertorié au registre.
          </div>
        )}
      </div>
    </div>
  );
}