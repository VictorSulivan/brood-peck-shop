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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-white">Cheptel & Animaux</h1>
          <p className="text-white/40 text-sm mt-1">Suivi des créatures et animaux en élevage</p>
        </div>
        <Link
          href="/dashboard/animaux/nouveau"
          className="bg-[#2a2250] hover:bg-[#342b6e] border border-[#3d3580] text-[#c4bbff] text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          + Enregistrer un animal
        </Link>
      </div>

      <div className="bg-[#16162a] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/30 text-xs uppercase tracking-wider text-left">
              <th className="p-4">Nom (Surnom)</th>
              <th className="p-4">Espèce</th>
              <th className="p-4">Entreprise</th>
              <th className="p-4">Santé</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {animaux.map((a) => (
              <tr key={a.id} className="hover:bg-white/1 transition-colors">
                <td className="p-4 font-medium text-white">{a.nom}</td>
                <td className="p-4 text-[#c4bbff]">{a.espece.nom}</td>
                <td className="p-4 text-white/60">{a.entreprise.nom}</td>
                <td className="p-4 text-white/80">{a.sante || "Bonne"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {animaux.length === 0 && (
          <div className="text-center py-12 text-white/30">Aucun animal enregistré pour le moment.</div>
        )}
      </div>
    </div>
  );
}