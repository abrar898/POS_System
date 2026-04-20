"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { TABLES, WAITER_PROFILE } from "./mock-waiter-data";
import type { TableStatus } from "./types";

const STATUS_STYLE: Record<TableStatus, string> = {
  empty: "border-slate-100 bg-[#F8FAFC] text-slate-300 opacity-40",
  seated: "border-blue-200 bg-blue-100/50 text-blue-700 shadow-sm",
  ordering: "border-violet-200 bg-violet-100/50 text-violet-700 shadow-sm",
  in_kitchen: "border-orange-200 bg-orange-100/50 text-orange-700 shadow-sm",
  food_ready: "border-emerald-300 bg-emerald-100 text-emerald-800 shadow-xl shadow-emerald-500/20",
  dining: "border-teal-200 bg-teal-100/50 text-teal-700 shadow-sm",
  bill_requested: "border-rose-400 bg-rose-200 text-rose-800 shadow-2xl animate-pulse",
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
    <div className="h-full flex flex-col gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col">
        <h1 className="text-xl lg:text-3xl font-black text-slate-800 tracking-tighter">Floor Map</h1>
        <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">
          {WAITER_PROFILE.section} • {mine.length} Tables
        </p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 lg:space-y-8 pb-10">
        {(["Main", "Family", "Rooftop"] as const).map((section) => {
          const rows = mine.filter((t) => t.section === section);
          if (rows.length === 0) return null;
          return (
            <div key={section} className="space-y-3 lg:space-y-4">
              <h2 className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.25em] text-slate-300 pl-1">{section} Section</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 lg:gap-4">
                {rows.map((t) => (
                  <Link
                    key={t.id}
                    href={t.status === "empty" ? "/waiter/floor" : `/waiter/table/${t.label}`}
                    scroll={t.status !== "empty"}
                    className={`relative rounded-2xl lg:rounded-3xl border p-4 transition-all flex flex-col justify-between h-32 lg:h-36 ${
                      STATUS_STYLE[t.status]
                    } ${t.status === "empty" ? "pointer-events-none" : "hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"}`}
                  >
                    <div>
                      <p className="text-xl lg:text-2xl font-black tracking-tight">{t.label}</p>
                      <p className="text-[8px] lg:text-[9px] font-black uppercase tracking-wider opacity-60">
                        {STATUS_LABEL[t.status]}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 text-[8px] lg:text-[10px] font-black uppercase opacity-50">
                      <Users size={12} />
                      {t.guests} PAX
                    </div>

                    {t.status === "food_ready" && (
                      <div className="absolute top-2 right-2 h-2 w-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
