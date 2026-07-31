import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import ClientEditForm from "@/components/clients/ClientEditForm";
import { fmtDate } from "@/utils/formatDate";

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id: parseInt(id) },
    include: {
      entrepriseCliente: true,
      ventes: {
        orderBy: { dateVente: "desc" },
        take: 10,
        include: { employe: true, produits: { include: { produit: true } } },
      },
    },
  });

  if (!client) notFound();

  const totalVentes = await prisma.vente.aggregate({
    where: { clientId: client.id, statut: "validee" },
    _sum: { montantTotal: true },
    _count: true,
  });

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-[#1b3026] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] text-xl font-serif font-medium uppercase shadow-md">
          {client.prenom?.[0] ?? client.nom[0]}{client.nom[0]}
        </div>
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#e6d5b8]">{client.prenom} {client.nom}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2.5 py-1 rounded-full border ${
              client.typeClient === "entreprise"
                ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                : "bg-black/20 text-[#e6d5b8]/50 border-[#c5a059]/15"
            }`}>
              {client.typeClient ?? "particulier"}
            </span>
            {client.entrepriseCliente && (
              <span className="text-[#c5a059]/70 text-xs italic">{client.entrepriseCliente.nom}</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Commandes",  value: totalVentes._count.toString() },
          { label: "Total dépensé", value: `${(totalVentes._sum.montantTotal ?? 0).toFixed(0)} Mornilles` },
        ].map(({ label, value }) => (
          <div key={label} className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl p-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />
            <p className="text-xl font-serif font-semibold text-[#e6d5b8]">{value}</p>
            <p className="text-[#c5a059]/70 text-xs mt-1 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* Formulaire édition */}
      <ClientEditForm client={{
        id: client.id,
        nom: client.nom,
        prenom: client.prenom,
        typeClient: client.typeClient,
      }} />

      {/* Historique ventes */}
      {client.ventes.length > 0 && (
        <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl overflow-hidden shadow-xl relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />
          <div className="px-5 py-4 border-b border-[#c5a059]/20">
            <p className="text-xs text-[#c5a059] font-medium uppercase tracking-wider">Historique des commandes</p>
          </div>
          <div className="divide-y divide-[#c5a059]/10">
            {client.ventes.map((v) => (
              <div key={v.id} className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-[#c5a059]/5 transition-colors">
                <div>
                  <p className="text-[#e6d5b8] text-sm">
                    {v.produits.map((p) => `${p.produit.nom} ×${p.quantite}`).join(", ")}
                  </p>
                  <p className="text-[#c5a059]/70 text-xs mt-0.5">par {v.employe.prenom} {v.employe.nom}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[#e6d5b8] font-serif font-semibold text-sm">${v.montantTotal.toFixed(0)}</p>
                  <p className="text-[#c5a059]/60 text-xs">
                    {fmtDate(v.dateVente, { day: "2-digit", month: "short" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}