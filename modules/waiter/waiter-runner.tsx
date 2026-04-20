"use client";

import * as React from "react";
import { Check, ChefHat } from "lucide-react";
import { ACTIVE_ORDERS, RUNNER_QUEUE } from "./mock-waiter-data";

export function WaiterRunner() {
  const [items, setItems] = React.useState(RUNNER_QUEUE);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const claim = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, claimed: true } : r)));
  };

  return (
    <div className="h-full flex flex-col gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col">
        <h1 className="text-xl lg:text-3xl font-black text-slate-800 tracking-tighter">Runner Queue</h1>
        <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">
          {items.filter(i => !i.claimed).length} Orders Ready
        </p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10 content-start">
        {items.map((r) => {
          const order = ACTIVE_ORDERS.find((o) => o.tableLabel === r.tableLabel);
          const isExpanded = expandedId === r.id;

          return (
            <div
              key={r.id}
              onClick={() => setExpandedId(isExpanded ? null : r.id)}
              className={`rounded-2xl lg:rounded-3xl border-2 p-4 lg:p-5 transition-all cursor-pointer group ${
                r.claimed
                  ? "border-slate-100 bg-[#F8FAFC] opacity-40"
                  : isExpanded 
                    ? "border-black bg-white shadow-2xl scale-105 z-10"
                    : "border-emerald-100 bg-white shadow-md shadow-black/5 hover:border-emerald-300"
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4 lg:mb-6">
                  <div className={`h-10 lg:h-12 w-10 lg:w-12 rounded-lg lg:rounded-xl flex items-center justify-center font-black text-base lg:text-lg transition-colors ${
                    isExpanded ? "bg-black text-white" : "bg-[#EDEDED] text-slate-800"
                  }`}>
                     {r.tableLabel}
                  </div>
                  <div className="text-right">
                    <p className="text-[7px] lg:text-[8px] font-black uppercase tracking-widest text-slate-400">Ready</p>
                    <p className={`text-[11px] lg:text-xs font-black mt-0.5 transition-colors ${isExpanded ? "text-black" : "text-slate-800"}`}>{r.readyAt}</p>
                  </div>
                </div>

                <div className={`space-y-1 lg:space-y-2 mb-4 lg:mb-6 ${isExpanded ? "flex-none" : "flex-1"}`}>
                   <p className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Items</p>
                   <p className={`font-black tracking-tight leading-tight transition-all ${isExpanded ? "text-lg lg:text-xl text-black" : "text-sm lg:text-base text-slate-800"}`}>
                      {r.items.join(" · ")}
                   </p>
                </div>

                {isExpanded && order && (
                  <div className="mb-6 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">Total</p>
                           <p className="text-sm font-black text-slate-800">Rp. {order.total.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">Guests</p>
                           <p className="text-sm font-black text-slate-800">{order.covers} PAX</p>
                        </div>
                     </div>
                     {order.kitchenNote && (
                        <div className="mt-4 p-3 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-500 italic">
                           "{order.kitchenNote}"
                        </div>
                     )}
                  </div>
                )}

                <div className={`pt-4 border-t border-slate-50 ${isExpanded ? "mt-auto" : ""}`}>
                  {!r.claimed ? (
                    <button
                      type="button"
                      onClick={(e) => claim(r.id, e)}
                      className="w-full h-10 lg:h-12 bg-emerald-500 text-white rounded-xl lg:rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-95"
                    >
                      <Check size={14} strokeWidth={3} /> Picked up
                    </button>
                  ) : (
                    <div className="w-full h-10 lg:h-12 bg-slate-50 text-slate-400 rounded-lg lg:rounded-xl flex items-center justify-center text-[9px] lg:text-[10px] font-black uppercase tracking-widest">
                      <ChefHat size={12} className="mr-2" /> En route
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
