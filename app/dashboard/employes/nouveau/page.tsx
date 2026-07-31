"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const ROLES_EMPLOYE = ["stagiaire", "employe", "co_patron", "patron"];
const ROLES_SITE = ["employe", "co_patron", "patron", "admin"];

export default function NouvelEmploye() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [avecCompte, setAvecCompte] = useState(true);
  const [form, setForm] = useState({
    nom: "", prenom: "", role: "employe",
    salaire: "", dateEmbauche: "",
    username: "", password: "", roleSite: "employe",
  });

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/employes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        ...(avecCompte ? {} : { username: undefined, password: undefined }),
      }),
    });
    if (res.ok) {
      router.push("/dashboard/employes");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de la création");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-8">
      {/* En-tête */}
      <div className="pb-4 border-b border-[#c5a059]/20">
        <h1 className="text-2xl font-bold tracking-wide text-[#e6d5b8] flex items-center gap-3 font-serif">
          <span>📜</span> Nouvel Employé
        </h1>
        <p className="text-xs text-[#c5a059]/70 mt-1 italic">
          Enregistrer un nouveau membre au registre de l&apos;établissement
        </p>
      </div>

      <div className="space-y-5">
        {/* Infos personnelles */}
        <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-5 space-y-4 shadow-xl">
          <p className="text-xs text-[#c5a059] uppercase tracking-wider font-semibold font-serif border-b border-[#c5a059]/20 pb-2">
            Informations Personnelles
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">Prénom</label>
              <input
                value={form.prenom}
                onChange={(e) => set("prenom", e.target.value)}
                className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
                placeholder="Newt"
              />
            </div>
            <div>
              <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">Nom</label>
              <input
                value={form.nom}
                onChange={(e) => set("nom", e.target.value)}
                className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
                placeholder="Scamander"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
              Rôle dans l&apos;établissement
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES_EMPLOYE.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => set("role", r)}
                  className={`py-2 px-2 rounded-lg text-xs capitalize border transition-colors ${
                    form.role === r
                      ? "bg-[#1b3026] border-[#c5a059] text-[#e6d5b8] font-medium"
                      : "bg-[#0a0e0c]/80 border-[#c5a059]/20 text-[#e6d5b8]/60 hover:text-[#e6d5b8] hover:border-[#c5a059]/40"
                  }`}
                >
                  {r.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
                Salaire (Mornilles)
              </label>
              <input
                type="number"
                value={form.salaire}
                onChange={(e) => set("salaire", e.target.value)}
                className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
                Date d&apos;embauche
              </label>
              <input
                type="date"
                value={form.dateEmbauche}
                onChange={(e) => set("dateEmbauche", e.target.value)}
                className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Compte site */}
        <div className="bg-[#0a0e0c]/60 border border-[#c5a059]/25 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#c5a059]/20 pb-2">
            <p className="text-xs text-[#c5a059] uppercase tracking-wider font-semibold font-serif">
              Accès au Système
            </p>
            <button
              type="button"
              onClick={() => setAvecCompte(!avecCompte)}
              className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
                avecCompte
                  ? "bg-[#1b3026] border-[#c5a059] text-[#e6d5b8]"
                  : "bg-[#0a0e0c] border-[#c5a059]/20 text-[#e6d5b8]/40"
              }`}
            >
              {avecCompte ? "Compte Activé" : "Sans Compte"}
            </button>
          </div>

          {avecCompte && (
            <>
              <div>
                <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
                  Nom d&apos;utilisateur
                </label>
                <input
                  value={form.username}
                  onChange={(e) => set("username", e.target.value)}
                  className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
                  placeholder="newt_s"
                />
              </div>
              <div>
                <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className="w-full bg-[#0a0e0c]/80 border border-[#c5a059]/30 rounded-lg px-3 py-2 text-[#e6d5b8] text-sm placeholder:text-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059] transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs text-[#c5a059] uppercase tracking-wider mb-1.5 font-medium">
                  Permissions système
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES_SITE.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => set("roleSite", r)}
                      className={`py-2 px-2 rounded-lg text-xs capitalize border transition-colors ${
                        form.roleSite === r
                          ? "bg-[#1b3026] border-[#c5a059] text-[#e6d5b8] font-medium"
                          : "bg-[#0a0e0c]/80 border-[#c5a059]/20 text-[#e6d5b8]/60 hover:text-[#e6d5b8] hover:border-[#c5a059]/40"
                      }`}
                    >
                      {r.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {error && <p className="text-red-400 text-xs italic">⚠️ {error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 text-[#f3e9d2] text-sm font-semibold py-2.5 rounded-lg transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Inscription..." : "Créer la fiche employé"}
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 text-sm text-[#e6d5b8]/60 hover:text-[#e6d5b8] border border-[#c5a059]/20 hover:border-[#c5a059]/40 rounded-lg transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}