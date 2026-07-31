"use client";

import { Client } from "@prisma/client";
import { useEffect, useMemo, useRef, useState } from "react";

// --- COMPOSANT : DROPDOWN SELECTION CLIENTS ---
export default function FormClients({
  clients,
  selectedClients,
  onSelectClient,
  onRemoveClient,
  onOpenModal,
}: {
  clients: Client[];
  selectedClients: { clientId: number; nbPersonnes?: number; commentaire?: string }[];
  onSelectClient: (id: number) => void;
  onRemoveClient: (id: number) => void;
  onOpenModal: () => void;
  onUpdateNbPersonnes?: (id: number, count: number) => void; 
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedClient = selectedClients.length > 0 
    ? clients.find((c) => c.id === selectedClients[0].clientId) 
    : null;

  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients.slice(0, 8);
    const q = search.toLowerCase();
    return clients.filter((c) =>
      c.nom.toLowerCase().startsWith(q) ||
      c.prenom?.toLowerCase().startsWith(q) ||
      `${c.prenom} ${c.nom}`.toLowerCase().startsWith(q)
    ).slice(0, 8);
  }, [search, clients]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div>
      <p className="text-xs text-[#c5a059] uppercase tracking-widest font-medium mb-3">Client / Visiteur</p>
      
      {selectedClient ? (
        <div className="flex items-center justify-between bg-[#1b3026] border border-[#c5a059]/40 rounded-xl px-4 py-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0a0e0c] border border-[#c5a059]/30 flex items-center justify-center text-[#e6d5b8] text-xs font-serif font-semibold uppercase shadow-inner">
              {selectedClient.prenom?.[0] ?? selectedClient.nom[0]}{selectedClient.nom[0]}
            </div>
            <div>
              <p className="text-[#e6d5b8] font-medium text-sm">{selectedClient.prenom} {selectedClient.nom}</p>
              <p className="text-[#c5a059]/70 text-xs italic">Client sélectionné</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => { onRemoveClient(selectedClient.id); setSearch(""); setTimeout(() => inputRef.current?.focus(), 50); }}
            className="text-xs text-[#e6d5b8]/60 hover:text-[#e6d5b8] border border-[#c5a059]/20 hover:border-[#c5a059]/40 px-3 py-1.5 rounded-lg transition-colors"
          >
            Changer
          </button>
        </div>
      ) : (
        <div ref={dropdownRef} className="relative">
          <div className={`flex items-center gap-3 bg-[#0a0e0c]/60 border rounded-xl px-4 py-3 transition-all duration-150 ${open ? "border-[#c5a059] ring-2 ring-[#c5a059]/20" : "border-[#c5a059]/25 hover:border-[#c5a059]/40"}`}>
            <svg className={`w-4 h-4 shrink-0 transition-colors ${open ? "text-[#c5a059]" : "text-[#e6d5b8]/30"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input 
              ref={inputRef} 
              autoFocus 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              placeholder="Rechercher un client..."
              className="flex-1 bg-transparent text-sm text-[#e6d5b8] placeholder:text-[#e6d5b8]/30 outline-none min-w-0" 
            />
            {search && (
              <button 
                type="button"
                onClick={() => { setSearch(""); inputRef.current?.focus(); }}
                className="w-5 h-5 flex items-center justify-center rounded-full bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#e6d5b8]/50 hover:text-[#e6d5b8] transition-colors text-[10px] shrink-0"
              >
                ✕
              </button>
            )}
          </div>
          {open && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#111815] border border-[#c5a059]/30 rounded-xl shadow-2xl overflow-hidden z-20 backdrop-blur-md">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c5a059]/30" />
              {filteredClients.length > 0 ? (
                <div className="py-1.5 max-h-52 overflow-y-auto">
                  {filteredClients.map((c) => (
                    <button 
                      key={c.id} 
                      type="button"
                      onMouseDown={() => { onSelectClient(c.id); setSearch(""); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#c5a059]/10 transition-colors text-left group"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#1b3026] border border-[#c5a059]/30 flex items-center justify-center text-[#e6d5b8] text-xs font-serif font-medium uppercase shrink-0">
                        {c.prenom?.[0] ?? c.nom[0]}{c.nom[0]}
                      </div>
                      <span className="text-[#e6d5b8]/80 group-hover:text-[#e6d5b8] text-sm transition-colors">{c.prenom} {c.nom}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-5 text-center">
                  <p className="text-[#e6d5b8]/40 text-sm">Aucun résultat pour <span className="text-[#e6d5b8]/70">&quot;{search}&quot;</span></p>
                </div>
              )}
              <div className="border-t border-[#c5a059]/15 p-2 bg-[#0a0e0c]/40">
                <button 
                  type="button"
                  onMouseDown={() => { setOpen(false); onOpenModal(); }}
                  className="w-full flex items-center justify-center gap-2 text-sm text-[#c5a059] hover:bg-[#1b3026] py-2 rounded-lg transition-colors font-medium"
                >
                  <span className="text-base leading-none">+</span> Nouveau client
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}