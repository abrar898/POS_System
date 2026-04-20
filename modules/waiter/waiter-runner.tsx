"use client";

import * as React from "react";
import { Check, ChefHat } from "lucide-react";
import { RUNNER_QUEUE } from "./mock-waiter-data";

export function WaiterRunner() {
  const [items, setItems] = React.useState(RUNNER_QUEUE);

  const claim = (id: string) => {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, claimed: true } : r)));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-white">Runner queue</h1>
        <p className="mt-1 text-sm text-stone-500">
          KDS “expo” style: pick up when line turns green. Tap confirm when you leave the pass with the guest table.
        </p>
      </div>

      <ul className="space-y-4">
        {items.map((r) => (
          <li
            key={r.id}
            className={`rounded-3xl border p-5 ${
              r.claimed
                ? "border-stone-800 bg-stone-950/50 opacity-60"
                : "border-emerald-600/40 bg-gradient-to-br from-emerald-950/60 to-stone-950 ring-1 ring-emerald-500/20"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase text-emerald-400/90">Table {r.tableLabel}</p>
                <p className="mt-1 text-lg font-black text-white">{r.items.join(" · ")}</p>
                <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-stone-500">
                  <ChefHat size={14} className="text-amber-500/80" /> Ready {r.readyAt}
                </p>
              </div>
              {!r.claimed ? (
                <button
                  type="button"
                  onClick={() => claim(r.id)}
                  className="flex shrink-0 items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-xs font-black text-emerald-950 shadow-lg shadow-emerald-500/30"
                >
                  <Check size={16} strokeWidth={3} /> Picked up
                </button>
              ) : (
                <span className="rounded-xl bg-stone-800 px-3 py-2 text-[11px] font-black text-stone-400">
                  En route
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
