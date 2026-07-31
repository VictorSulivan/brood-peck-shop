import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  const [totalProduits, stockCritique, totalEmployes, soldeGringotts, ventesAujourdhui] =
    await Promise.all([
      prisma.produit.count({ where: { actif: true } }),
      prisma.produit.count({ where: { actif: true, stock: { lte: 5 } } }),
      prisma.employe.count({ where: { actif: true } }),
      prisma.gringotts.findFirst().then((g) => g?.solde ?? 0),
      prisma.vente.count({
        where: {
          dateVente: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          statut: "validee",
        },
      }),
    ]);

  const stats = [
    { label: "Solde Gringotts",    value: `${soldeGringotts.toLocaleString()} Mornilles`, icon: "🏦", alert: false },
    { label: "Ventes aujourd'hui", value: ventesAujourdhui.toString(),           icon: "💰", alert: false },
    { label: "Employés actifs",    value: totalEmployes.toString(),               icon: "👥", alert: false },
    { label: "Stock critique",     value: stockCritique.toString(),               icon: "⚠️", alert: stockCritique > 0 },
  ];

  const user = session.user;

  return (
    <div className="max-w-7xl mx-auto relative min-h-full overflow-hidden pb-12">
      
      {/* Image de fond thématique "Forêt Magique / Magizoologie" fixe et immersive */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-25 filter blur-[1px] scale-105 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80')` 
        }}
      />

      {/* Voile sombre pour l'harmonie des couleurs et la lisibilité */}
      <div className="absolute inset-0 z-0 bg-[#0a0d0c]/70 pointer-events-none" />

      {/* Contenu principal au premier plan */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8 border-b border-[#c5a059]/20 pb-5 backdrop-blur-md bg-[#111815]/60 px-6 py-4 rounded-xl shadow-lg">
          <h1 className="text-2xl font-serif font-semibold text-[#e6d5b8]">Bonjour, {user.username} ✨</h1>
          <p className="text-[#c5a059]/80 text-xs italic tracking-wider mt-1">Voici l&apos;état des registres de l&apos;entreprise en temps réel.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon, alert }) => (
            <div
              key={label}
              className={`backdrop-blur-md border rounded-xl p-5 shadow-xl relative overflow-hidden transition-all ${
                alert 
                  ? "border-amber-500/50 bg-[#161a15]/80" 
                  : "border-[#c5a059]/30 bg-[#111815]/75 hover:bg-[#111815]/85 hover:border-[#c5a059]/50"
              }`}
            >
              {/* Liseré lumineux en haut des cartes */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${alert ? "bg-amber-500/60" : "bg-[#c5a059]/40"}`} />

              <div className="flex items-center justify-between mb-3">
                <span className="text-xl p-2 bg-[#0a0e0c]/80 rounded-lg border border-[#c5a059]/20">{icon}</span>
                {alert && (
                  <span className="text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-medium tracking-wide">
                    Attention
                  </span>
                )}
              </div>
              <p className="text-2xl font-serif font-bold text-[#e6d5b8] tracking-tight">{value}</p>
              <p className="text-[#c5a059]/80 text-xs mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        {/* Infos rapides */}
        <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl p-6 shadow-xl relative overflow-hidden hover:bg-[#111815]/85 transition-all">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c5a059]/30" />
          <p className="text-[#c5a059] text-xs font-medium uppercase tracking-widest mb-4">Informations du Registre</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm py-1.5 border-b border-white/5">
              <span className="text-[#e6d5b8]/75">Produits actifs référencés</span>
              <span className="text-[#e6d5b8] font-semibold">{totalProduits}</span>
            </div>
            <div className="flex justify-between items-center text-sm py-1.5">
              <span className="text-[#e6d5b8]/75">Rôle d&apos;habilitation</span>
              <span className="text-[#c5a059] font-medium capitalize tracking-wide">{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}