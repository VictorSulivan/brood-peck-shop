"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fmtDate } from "@/utils/formatDate";

const POSITIF = ["vente", "versement"];

const typeBadge: Record<string, string> = {
  vente:     "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  versement: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  retrait:   "bg-amber-500/10 text-amber-400 border-amber-500/30",
  salaire:   "bg-amber-500/10 text-amber-400 border-amber-500/30",
  prime:     "bg-amber-500/10 text-amber-300 border-amber-500/20",
  taxe:      "bg-amber-600/10 text-amber-500 border-amber-600/30",
  achat:     "bg-amber-500/10 text-amber-400 border-amber-500/30",
};

interface Employe {
  id: number;
  prenom: string;
  nom: string;
}

interface Transaction {
  id: number;
  typeTransaction: string | null;
  description: string | null;
  montant: number | null;
  employeId: number | null;
  createdAt: Date | string;
  employe: Employe | null;
}

interface Props {
  transactions: Transaction[];
  employes: Employe[];
}

export default function HistoriqueTableau({ transactions, employes }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState(false);

  function handleSaved() {
    setEditing(null);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    const res = await fetch(`/api/gringotts/transaction/${confirmDelete.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      setConfirmDelete(null);
      router.refresh();
    }
  }

  return (
    <>
      <div className="backdrop-blur-md bg-[#111815]/75 border border-[#c5a059]/30 rounded-xl overflow-hidden shadow-xl relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c5a059]/30" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#c5a059]/20 bg-black/20">
                <th className="text-left px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Description</th>
                <th className="text-left px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Employé</th>
                <th className="text-right px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Montant</th>
                <th className="text-right px-5 py-3 text-[#c5a059] font-medium text-xs uppercase tracking-wider">Date</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c5a059]/10">
              {transactions.map((t) => {
                const isPositif = POSITIF.includes(t.typeTransaction ?? "");
                return (
                  <tr key={t.id} className="hover:bg-[#1b3026]/30 transition-colors group">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${typeBadge[t.typeTransaction ?? ""] ?? "bg-black/20 text-[#e6d5b8]/40 border-[#c5a059]/20"}`}>
                        {t.typeTransaction ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#e6d5b8]/80 max-w-xs truncate">{t.description ?? "—"}</td>
                    <td className="px-5 py-4 text-[#e6d5b8]/80 whitespace-nowrap">
                      {t.employe ? `${t.employe.prenom} ${t.employe.nom}` : "—"}
                    </td>
                    <td className={`px-5 py-4 text-right font-serif font-semibold whitespace-nowrap ${isPositif ? "text-emerald-400" : "text-amber-400"}`}>
                      {isPositif ? "+" : "-"}{t.montant?.toLocaleString("fr-FR") ?? "0"} Mornilles
                    </td>
                    <td className="px-5 py-4 text-right text-[#e6d5b8]/40 text-xs whitespace-nowrap">
                      {fmtDate(t.createdAt, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditing(t)}
                          className="text-xs text-[#c5a059]/60 hover:text-[#c5a059] transition-colors px-2 py-1 rounded hover:bg-[#1b3026]"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => setConfirmDelete(t)}
                          className="text-xs text-amber-500/60 hover:text-amber-400 transition-colors px-2 py-1 rounded hover:bg-amber-500/10"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {transactions.length === 0 && (
          <div className="text-center py-16 text-[#e6d5b8]/30 italic">Aucune transaction ne correspond à vos filtres.</div>
        )}
      </div>

      {editing && (
        <EditModal
          transaction={editing}
          employes={employes}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-[#111815] border border-amber-500/30 rounded-xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500/40" />
            <h2 className="text-[#e6d5b8] font-serif font-medium text-lg mb-2">Supprimer cette transaction ?</h2>
            <p className="text-[#e6d5b8]/60 text-sm mb-1 capitalize">
              {confirmDelete.typeTransaction} — {confirmDelete.description ?? "sans description"}
            </p>
            <p className="text-[#c5a059]/60 text-xs mb-6">
              Le solde Gringotts sera ajusté en conséquence.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 text-sm text-[#e6d5b8]/60 hover:text-[#e6d5b8] border border-[#c5a059]/20 hover:border-[#c5a059]/40 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 text-sm bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EditModal({
  transaction,
  employes,
  onClose,
  onSaved,
}: {
  transaction: Transaction;
  employes: Employe[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [typeTransaction, setTypeTransaction] = useState(transaction.typeTransaction ?? "");
  const [montant, setMontant] = useState(String(transaction.montant ?? ""));
  const [description, setDescription] = useState(transaction.description ?? "");
  const [employeId, setEmployeId] = useState(String(transaction.employeId ?? ""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const montantNum = parseFloat(montant);
    if (!montantNum || !typeTransaction) return setError("Montant et type requis");

    setLoading(true);
    setError("");

    const res = await fetch(`/api/gringotts/transaction/${transaction.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        montant: montantNum,
        description: description || null,
        typeTransaction,
        employeId: employeId || null,
      }),
    });

    if (res.ok) {
      onSaved();
    } else {
      const d = await res.json();
      setError(d.error ?? "Erreur lors de la sauvegarde");
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-[#111815] border border-[#c5a059]/30 rounded-xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c5a059]/30" />
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[#e6d5b8] font-serif font-medium text-lg">Modifier la transaction</h2>
          <button onClick={onClose} className="text-[#e6d5b8]/30 hover:text-[#e6d5b8] transition-colors text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1.5">Type</label>
            <select
              value={typeTransaction}
              onChange={(e) => setTypeTransaction(e.target.value)}
              className="w-full bg-[#111815] border border-[#c5a059]/20 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] focus:outline-none focus:border-[#c5a059]/60 transition-colors capitalize"
            >
              {Object.keys(typeBadge).map((t) => (
                <option key={t} value={t} className="bg-[#111815] text-[#e6d5b8] capitalize">{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1.5">Montant (Mornilles)</label>
            <input
              type="number"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="w-full bg-[#111815] border border-[#c5a059]/20 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] focus:outline-none focus:border-[#c5a059]/60 transition-colors"
              min="0"
              step="1"
            />
          </div>

          <div>
            <label className="block text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1.5">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#111815] border border-[#c5a059]/20 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] placeholder-[#e6d5b8]/20 focus:outline-none focus:border-[#c5a059]/60 transition-colors"
              placeholder="Description optionnelle"
            />
          </div>

          <div>
            <label className="block text-xs text-[#c5a059] font-medium uppercase tracking-wider mb-1.5">Employé</label>
            <select
              value={employeId}
              onChange={(e) => setEmployeId(e.target.value)}
              className="w-full bg-[#111815] border border-[#c5a059]/20 rounded-lg px-3 py-2 text-sm text-[#e6d5b8] focus:outline-none focus:border-[#c5a059]/60 transition-colors"
            >
              <option value="" className="bg-[#111815] text-[#e6d5b8]">— Aucun employé —</option>
              {employes.map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-[#111815] text-[#e6d5b8]">{emp.prenom} {emp.nom}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-amber-400 text-sm font-medium">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm text-[#e6d5b8]/60 hover:text-[#e6d5b8] border border-[#c5a059]/20 hover:border-[#c5a059]/40 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-sm bg-[#1b3026] hover:bg-[#233d31] border border-[#c5a059]/40 text-[#f3e9d2] rounded-lg font-medium transition-all shadow-inner disabled:opacity-50"
            >
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}