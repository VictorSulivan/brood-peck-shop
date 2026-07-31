import { prisma } from "@/lib/db/prisma";
import NouvelleprimeForm from "@/components/employes/NouvellePrimeForm";
import { fmtDate } from "@/utils/formatDate";

export default async function PrimesPage() {
  const [primes, employes] = await Promise.all([
    prisma.prime.findMany({
      orderBy: { createdAt: "desc" },
      include: { employe: true, attribuePar: true },
    }),
    prisma.employe.findMany({ where: { actif: true }, orderBy: { nom: "asc" } }),
  ]);

  const totalPrimes = primes.reduce((acc, p) => acc + p.montant, 0);

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="pb-4 border-b border-[#c5a059]/20">
        <h1 className="text-2xl font-bold tracking-wide text-[#e6d5b8] flex items-center gap-3 font-serif">
          <span>💰</span> Primes & Gratifications
        </h1>
        <p className="text-xs text-[#c5a059]/70 mt-1 italic">
          {primes.length} primes accordées — Total octroyé :{" "}
          <strong className="text-[#e6d5b8] font-serif font-medium">
            {totalPrimes.toLocaleString("fr-FR")} Mornilles
          </strong>
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Formulaire */}
        <NouvelleprimeForm employes={employes} />

        {/* Historique */}
        <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl overflow-hidden shadow-xl h-fit">
          <div className="px-5 py-4 border-b border-[#c5a059]/20 bg-[#0a0e0c]/80">
            <p className="text-xs text-[#c5a059] uppercase tracking-wider font-semibold font-serif">
              📜 Historique des attributions
            </p>
          </div>
          <div className="divide-y divide-[#c5a059]/10">
            {primes.map((p) => (
              <div key={p.id} className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-[#1b3026]/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1b3026] border border-[#c5a059]/40 flex items-center justify-center text-[#e6d5b8] text-xs font-serif font-semibold uppercase shrink-0 shadow-inner">
                    {p.employe.prenom[0]}{p.employe.nom[0]}
                  </div>
                  <div>
                    <p className="text-[#e6d5b8] text-sm font-medium font-serif">
                      {p.employe.prenom} {p.employe.nom}
                    </p>
                    <p className="text-[#c5a059]/70 text-xs">
                      S{p.semestre}/{p.annee}
                      {p.commentaire && ` · ${p.commentaire}`}
                    </p>
                    {p.attribuePar && (
                      <p className="text-[#e6d5b8]/40 text-[11px] italic">
                        par {p.attribuePar.prenom} {p.attribuePar.nom}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-amber-400 font-medium font-serif text-sm">
                    +{p.montant.toLocaleString("fr-FR")} Mornilles
                  </p>
                  <p className="text-[#e6d5b8]/40 text-xs mt-0.5">
                    {fmtDate(p.createdAt, { day: "2-digit", month: "short" })}
                  </p>
                </div>
              </div>
            ))}
            {primes.length === 0 && (
              <div className="text-center py-12 text-[#e6d5b8]/40 text-sm italic font-serif">
                Aucune prime enregistrée jusqu&apos;à présent.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}