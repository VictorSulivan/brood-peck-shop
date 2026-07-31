"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    await signIn("credentials", {
      username,
      password,
      callbackUrl: "/dashboard",
    });
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0d0c]">
      
      {/* Image de fond thématique "Forêt Magique / Mystique" avec un lien stable */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30 filter blur-[2px] scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80')` 
        }}
      />

      {/* Voile sombre coloré par-dessus pour garder vos teintes vert/noir de magizoologiste */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0d0c] via-[#0a0d0c]/80 to-[#14231c]/60" />

      {/* Formulaire au premier plan */}
      <div className="w-full max-w-sm bg-[#111815]/90 backdrop-blur-md border border-[#c5a059]/40 rounded-xl p-8 shadow-2xl shadow-black/90 relative z-10 overflow-hidden">
        
        {/* Bande dorée subtile en haut */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-[#c5a059] to-transparent opacity-80" />

        <div className="flex items-center gap-3 mb-8">
          <div>
            <p className="text-[#e6d5b8] font-serif font-semibold text-lg tracking-wide leading-tight">Brood & Peck</p>
            <p className="text-[#c5a059]/80 text-xs italic tracking-wider">Registre de Magizoologie</p>
          </div>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-xs text-[#c5a059]/90 font-medium mb-1.5 uppercase tracking-wider">Nom d&apos;utilisateur</label>
          <input
            type="text"
            placeholder="ex: p.dryas"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#0a0e0c]/90 border border-[#c5a059]/30 rounded-lg px-3 py-2.5 text-sm text-[#e6d5b8] placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-xs text-[#c5a059]/90 font-medium mb-1.5 uppercase tracking-wider">Mot de passe</label>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-[#0a0e0c]/90 border border-[#c5a059]/30 rounded-lg px-3 py-2.5 text-sm text-[#e6d5b8] placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors pr-10"
            />
            <button
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c5a059]/50 hover:text-[#c5a059] text-xs transition-colors"
            >
              {showPwd ? "Cacher" : "Voir"}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/50 text-[#f3e9d2] font-medium text-sm rounded-lg py-2.5 transition-all shadow-inner disabled:opacity-50 tracking-wide"
        >
          {loading ? "Consultation des registres..." : "Ouvrir le registre"}
        </button>

      </div>
    </main>
  );
}