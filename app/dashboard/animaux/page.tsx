import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AnimauxPage() {
  const animaux = await prisma.animal.findMany({
    include: { espece: true, entreprise: true },
    orderBy: { dateAcquisition: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#c5a059]/20">
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-[#e6d5b8] flex items-center gap-3 font-serif">
            <span>🐾</span> Cheptel & Animaux
          </h1>
          <p className="text-xs text-[#c5a059]/70 mt-1 italic">
            Suivi des créatures et animaux en élevage au domaine
          </p>
        </div>

        <Link
          href="/dashboard/animaux/nouveau"
          className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-amber-800 to-amber-950 hover:from-amber-700 hover:to-amber-900 border border-[#c5a059]/50 text-[#f3e9d2] text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-black/40 active:scale-[0.98]"
        >
          <span className="text-base leading-none">✨</span>
          <span>Enregistrer un animal</span>
        </Link>
      </div>

      {/* Tableau du Cheptel */}
      <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#c5a059]/20 bg-[#111815]/80 text-[#c5a059] text-xs uppercase tracking-wider text-left font-medium">
              <th className="p-4">Nom (Surnom)</th>
              <th className="p-4">Espèce</th>
              <th className="p-4">Entreprise</th>
              <th className="p-4">Santé</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c5a059]/10">
            {animaux.map((a) => (
              <tr key={a.id} className="hover:bg-[#1b3026]/30 transition-colors">
                <td className="p-4 font-serif font-medium text-[#e6d5b8]">{a.nom}</td>
                <td className="p-4 text-[#c5a059] font-medium">{a.espece.nom}</td>
                <td className="p-4 text-[#e6d5b8]/70">{a.entreprise.nom}</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1b3026] text-[#e6d5b8] border border-[#c5a059]/30">
                    {a.sante || "Bonne"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* État vide */}
        {animaux.length === 0 && (
          <div className="text-center py-12 text-[#e6d5b8]/40 italic">
            Aucun animal répertorié dans le cheptel pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}