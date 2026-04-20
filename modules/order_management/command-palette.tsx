"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Search, UtensilsCrossed } from "lucide-react";
import type { MenuItem } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: MenuItem[];
  onPick: (item: MenuItem) => void;
};

export function MenuCommandPalette({ open, onOpenChange, items, onPick }: Props) {
  const [q, setQ] = React.useState("");

  React.useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const filtered =
    q.trim().length < 2
      ? []
      : items.filter(
          (m) =>
            m.name.toLowerCase().includes(q.toLowerCase()) ||
            m.categoryId.toLowerCase().includes(q.toLowerCase())
        );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center pt-[12vh] px-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal
      aria-label="Menu search"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Close search"
        onClick={() => onOpenChange(false)}
      />
      <Command
        className="relative z-10 w-full max-w-xl rounded-[28px] border border-[#EBEBF0] bg-white shadow-2xl overflow-hidden"
        shouldFilter={false}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#F0F1F5]">
          <Search className="text-[#a0a8b2] shrink-0" size={20} />
          <Command.Input
            value={q}
            onValueChange={setQ}
            placeholder="Type 2+ characters to search menu…"
            className="flex-1 text-sm font-semibold outline-none placeholder:text-[#c5c8d0]"
          />
          <kbd className="hidden sm:inline text-[10px] font-bold text-[#a0a8b2] bg-[#F5F6FA] px-2 py-1 rounded-lg border border-[#EBEBF0]">
            ESC
          </kbd>
        </div>
        <Command.List className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
          {q.trim().length < 2 && (
            <div className="px-4 py-10 text-center text-sm text-[#a0a8b2] font-medium">
              Enter at least two characters to filter all menu items.
            </div>
          )}
          {q.trim().length >= 2 && filtered.length === 0 && (
            <Command.Empty className="py-10 text-center text-sm text-[#a0a8b2]">
              No dishes match “{q}”.
            </Command.Empty>
          )}
          {filtered.map((m) => (
            <Command.Item
              key={m.id}
              value={m.id}
              onSelect={() => {
                onPick(m);
                onOpenChange(false);
              }}
              disabled={!m.available}
              className="flex items-center justify-between gap-4 px-4 py-3 rounded-2xl cursor-pointer data-[disabled=true]:opacity-40 data-[selected=true]:bg-[#1a1a2e] data-[selected=true]:text-white aria-selected:bg-[#F5F6FA]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl shrink-0" aria-hidden>
                  {m.imageEmoji ?? <UtensilsCrossed size={18} />}
                </span>
                <span className="text-sm font-bold truncate">{m.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-xs font-black uppercase tracking-wide ${
                    m.available ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {m.available ? "In stock" : "Off"}
                </span>
                <span className="text-sm font-black tabular-nums">Rs. {m.price.toLocaleString()}</span>
              </div>
            </Command.Item>
          ))}
        </Command.List>
        <div className="px-4 py-2 border-t border-[#F0F1F5] text-[11px] text-[#a0a8b2] font-semibold flex justify-between">
          <span>POS menu search</span>
          <span>Press / to open</span>
        </div>
      </Command>
    </div>
  );
}
