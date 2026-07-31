"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import pegaseLogo from "./../../../public/pegase.png";

const NAV = [
  { href: "/dashboard",                 label: "Dashboard",  icon: "⬡" },
  { href: "/dashboard/ventes",          label: "Ventes",     icon: "💰" },
  { href: "/dashboard/stock",           label: "Stock",      icon: "📦" },
  { href: "/dashboard/clients",         label: "Clients",    icon: "👥" },
  { href: "/dashboard/gringotts",       label: "Gringotts",  icon: "🏦" },
  { href: "/dashboard/calendrier",      label: "Calendrier", icon: "📅" },
];

const MAGIZOOLOGY_NAV = [
  { href: "/dashboard/bestiaire",       label: "Bestiaire",  icon: "📖" },
  { href: "/dashboard/animaux",         label: "Cheptel",    icon: "🐾" },
  { href: "/dashboard/rapports",        label: "Rapports",   icon: "📝" },
];

const RH_NAV = [
  { href: "/dashboard/employes",                label: "Employés",  icon: "👷" },
  { href: "/dashboard/employes/primes",         label: "Primes",    icon: "🏆" },
];


type Props = {
  user: { username: string; role: string; name?: string | null };
};

function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
        active
          ? "bg-[#1b3026] text-[#e6d5b8] border border-[#c5a059]/40 shadow-inner"
          : "text-[#e6d5b8]/60 hover:text-[#e6d5b8] hover:bg-[#c5a059]/5"
      }`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  );
}

export default function Sidebar({ user }: Props) {
  const pathname = usePathname();
  const isAdmin = user.role === "admin" || user.role === "patron";

  // Détecte si on est sur une fiche employé pour afficher les sous-liens
  const employeMatch = pathname.match(/^\/dashboard\/employes\/(\d+)/);
  const employeId = employeMatch?.[1];

  return (
    <aside className="w-60 shrink-0 flex flex-col bg-[#111815] border-r border-[#c5a059]/20 h-full relative">
      {/* Petit liseré lumineux en haut de la sidebar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#c5a059]/15">
        <div className="w-8 h-8 bg-[#1b3026] border border-[#c5a059]/30 rounded-lg flex items-center justify-center overflow-hidden shadow-inner">
          <Image 
            src={pegaseLogo} 
            alt="Logo Magizoologie" 
            className="w-6 h-6 object-contain filter brightness-90"
          />
        </div>
        <div>
          <p className="text-[#e6d5b8] font-serif font-medium text-sm leading-none">Brood & Peck</p>
          <p className="text-[#c5a059]/70 text-xs italic mt-0.5">Magizoologie</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => <NavLink key={item.href} {...item} />)}

        {/* Section Magizoologie */}
        <div className="pt-3 pb-1 px-3">
          <p className="text-[#c5a059]/50 text-xs uppercase tracking-widest font-medium">Magizoologie</p>
        </div>
        {MAGIZOOLOGY_NAV.map((item) => <NavLink key={item.href} {...item} />)}

        {/* Section RH */}
        <div className="pt-3 pb-1 px-3">
          <p className="text-[#c5a059]/50 text-xs uppercase tracking-widest font-medium">RH</p>
        </div>
        {RH_NAV.map((item) => <NavLink key={item.href} {...item} />)}

        {/* Sous-menu employé si on est sur une fiche */}
        {employeId && (
          <div className="ml-3 pl-3 border-l border-[#c5a059]/20 space-y-1 mt-1">
            {[
              { href: `/dashboard/employes/${employeId}`,          label: "Fiche",     icon: "👤" },
              { href: `/dashboard/employes/${employeId}/contrats`, label: "Contrats",  icon: "📄" },
            ].map(({ href, label, icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                    active
                      ? "bg-[#1b3026] text-[#e6d5b8] border border-[#c5a059]/40"
                      : "text-[#e6d5b8]/50 hover:text-[#e6d5b8] hover:bg-[#c5a059]/5"
                  }`}>
                  <span>{icon}</span>
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-[#c5a059]/15">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#1b3026] border border-[#c5a059]/30 flex items-center justify-center text-[#e6d5b8] text-xs font-serif font-medium uppercase shadow-inner">
            {user.username?.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-[#e6d5b8] text-sm font-medium truncate">{user.username}</p>
            <p className="text-[#c5a059]/70 text-xs capitalize italic">{user.role}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#e6d5b8]/50 hover:text-[#e6d5b8] hover:bg-[#c5a059]/5 transition-colors"
        >
          ← Déconnexion
        </button>
      </div>
    </aside>
  );
}