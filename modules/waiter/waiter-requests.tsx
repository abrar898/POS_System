"use client";

import * as React from "react";
import { SERVICE_REQUESTS } from "./mock-waiter-data";

export function WaiterRequests() {
  const [open, setOpen] = React.useState(SERVICE_REQUESTS);

  const resolve = (id: string) => setOpen((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="h-full flex flex-col gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col">
        <h1 className="text-xl lg:text-3xl font-black text-slate-800 tracking-tighter">Task List</h1>
        <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">
          {open.length} Pending requests
        </p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-10">
        {open.map((r) => (
          <div
            key={r.id}
            className={`flex flex-col md:flex-row md:items-center justify-between p-4 lg:p-6 rounded-2xl lg:rounded-3xl border-2 transition-all ${
              r.urgent ? "border-rose-100 bg-white shadow-lg shadow-rose-500/5" : "border-slate-100 bg-white shadow-sm"
            }`}
          >
            <div className="flex gap-4 lg:gap-5 items-center">
              <div className={`h-10 w-10 lg:h-12 lg:w-12 rounded-lg lg:rounded-xl flex items-center justify-center text-base lg:text-lg font-black shadow-inner shrink-0 ${
                r.urgent ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-800"
              }`}>
                {r.tableLabel}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[7px] lg:text-[8px] font-black uppercase tracking-widest text-slate-400">{r.type}</p>
                  {r.urgent && <span className="bg-rose-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest">Urgent</span>}
                </div>
                <p className="mt-0.5 text-sm lg:text-base font-black text-slate-800 tracking-tight truncate">{r.message}</p>
                <p className="text-[8px] lg:text-[9px] font-bold text-slate-300 uppercase tracking-wider">{r.createdAt}</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => resolve(r.id)}
              className="mt-4 md:mt-0 h-10 lg:h-11 px-6 lg:px-8 bg-slate-800 text-white rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-md shadow-black/5 shrink-0"
            >
              Done
            </button>
          </div>
        ))}
      </div>
      
      {open.length === 0 && (
        <div className="py-20 lg:py-32 flex flex-col items-center justify-center opacity-30 grayscale">
          <div className="text-4xl lg:text-6xl mb-4 lg:mb-6">✅</div>
          <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-slate-400">All Tasks Resolved</p>
        </div>
      )}
    </div>
  );
}
