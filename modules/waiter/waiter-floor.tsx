"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { TABLES } from "./mock-waiter-data";
import type { TableStatus } from "./types";

const STATUS_STYLE: Record<TableStatus, string> = {
  empty: "border-stone-800 bg-stone-950/40 text-stone-600",
  seated: "border-sky-700/50 bg-sky-950/40 text-sky-200",
  ordering: "border-violet-700/50 bg-violet-950/40 text-violet-200",
  in_kitchen: "border-amber-700/50 bg-amber-950/50 text-amber-100",
  food_ready: "border-emerald-500 bg-emerald-950/60 text-emerald-100 shadow-lg shadow-emerald-500/10",
  dining: "border-teal-700/40 bg-teal-950/30 text-teal-100",
  bill_requested: "border-rose-600/60 bg-rose-950/50 text-rose-100",
};

const STATUS_LABEL: Record<TableStatus, string> = {
  empty: "Empty",
  seated: "Seated",
  ordering: "Ordering",
  in_kitchen: "Kitchen",
  food_ready: "Food ready",
  dining: "Dining",
  bill_requested: "Bill",
};

export function WaiterFloor() {
  const mine = TABLES.filter((t) => t.assignedWaiter === "Sara Khan");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-white">Floor map</h1>
        <p className="mt-1 text-sm text-stone-500">
          Your assignment: Main + Family. Tap a table for ticket detail, runner handoff, and notes.
        </p>
      </div>

      {(["Main", "Family", "Rooftop"] as const).map((section) => {
        const rows = mine.filter((t) => t.section === section);
        if (rows.length === 0) return null;
        return (
          <div key={section}>
            <h2 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-stone-500">{section}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {rows.map((t) => (
                <Link
                  key={t.id}
                  href={t.status === "empty" ? "/waiter/floor" : `/waiter/table/${t.label}`}
                  scroll={t.status !== "empty"}
                  className={`relative rounded-3xl border-2 p-4 transition ${
                    STATUS_STYLE[t.status]
                  } ${t.status === "empty" ? "pointer-events-none opacity-50" : "hover:scale-[1.02] active:scale-[0.99]"}`}
                >
                  {t.status === "food_ready" && (
                    <span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  )}
                  <p className="text-2xl font-black">T{t.label}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-stone-500">
                    {STATUS_LABEL[t.status]}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-stone-400">
                    <Users size={12} />
                    {t.guests} pax
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
