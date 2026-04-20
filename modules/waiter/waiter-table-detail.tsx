"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import { ACTIVE_ORDERS, TABLES, TABLE_ORDER_LINES } from "./mock-waiter-data";

type Props = { tableLabel: string };

export function WaiterTableDetail({ tableLabel }: Props) {
  const table = TABLES.find((t) => t.label === tableLabel);
  const order = ACTIVE_ORDERS.find((o) => o.tableLabel === tableLabel);
  const lines = table ? TABLE_ORDER_LINES[table.id] ?? [] : [];

  const [note, setNote] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);
  const [lineState, setLineState] = React.useState<Record<number, string>>({});

  if (!table || table.status === "empty") {
    return (
      <div className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8 text-center">
        <p className="text-stone-400">Table not active or not assigned to you.</p>
        <Link href="/waiter/floor" className="mt-4 inline-block text-sm font-black text-emerald-400 hover:underline">
          Back to floor
        </Link>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {toast && (
        <div className="fixed top-10 left-1/2 z-[100] -translate-x-1/2 rounded-2xl bg-black px-6 py-4 text-xs font-black text-white shadow-2xl flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-6">
          <Link
            href="/waiter/floor"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-800 shadow-sm hover:scale-105 transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tighter">Table {tableLabel}</h1>
            <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
              {table.section} • {table.guests} Guests • {table.status.replace("_", " ")}
            </p>
          </div>
        </div>
        
        <div className="hidden sm:flex gap-2">
           <button onClick={() => showToast("Manager notified")} className="h-10 px-6 rounded-xl bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all">Support</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <div className="bg-white rounded-[32px] lg:rounded-[40px] border border-slate-100 p-6 lg:p-10 shadow-sm overflow-hidden relative">
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <h2 className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">Live Ticket Snapshot</h2>
              {order && <span className="font-mono text-[10px] font-black text-slate-400">#{order.id}</span>}
            </div>

            <div className="space-y-4">
              {lines.map((line, idx) => {
                const st = lineState[idx] ?? line.lineStatus;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 lg:p-6 rounded-[25px] border border-slate-50 bg-[#F8FAFC] transition-all"
                  >
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="h-10 lg:h-12 w-10 lg:w-12 rounded-xl lg:rounded-2xl bg-white flex items-center justify-center font-black text-slate-800 shadow-inner">
                        {line.qty}
                      </div>
                      <div>
                        <p className="text-base lg:text-lg font-black text-slate-800 tracking-tight">{line.name}</p>
                        <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{line.course}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-6">
                      <span
                        className={`rounded-xl px-3 py-1.5 lg:px-4 lg:py-2 text-[8px] lg:text-[9px] font-black uppercase tracking-widest ${
                          st === "ready"
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                            : st === "served"
                              ? "bg-slate-100 text-slate-400"
                              : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {st}
                      </span>
                      {st === "ready" && (
                        <button
                          type="button"
                          onClick={() => {
                            setLineState((s) => ({ ...s, [idx]: "served" }));
                            showToast(`${line.name} marked served`);
                          }}
                          className="h-10 lg:h-12 px-5 lg:px-8 bg-black text-white rounded-[15px] lg:rounded-[20px] text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
                        >
                          Serve
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {lines.length === 0 && (
                <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-[35px]">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">No active lines yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:space-y-8">
           {order && (
            <div className="bg-[#FF5B22] rounded-[32px] lg:rounded-[40px] p-8 lg:p-10 text-white shadow-2xl shadow-orange-500/30 overflow-hidden relative group">
               <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Total Due</p>
                  <p className="text-4xl lg:text-5xl font-black tracking-tighter">Rp. {order.total.toLocaleString()}</p>
                  
                  {order.kitchenNote && (
                    <div className="mt-8 p-6 bg-white rounded-[25px] text-slate-800 shadow-inner">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2">Kitchen Note</p>
                      <p className="text-sm font-bold leading-relaxed opacity-80 italic">"{order.kitchenNote}"</p>
                    </div>
                  )}

                  <button
                    onClick={() => showToast("Bill requested • Check counter")}
                    className="mt-8 w-full h-14 bg-white text-black rounded-[20px] text-[10px] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:scale-[1.03] active:scale-95 transition-all shadow-xl"
                  >
                    Request Bill
                  </button>
               </div>
               <div className="absolute -right-10 -bottom-10 bg-white/10 w-40 h-40 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
            </div>
           )}

           <div className="bg-white rounded-[32px] lg:rounded-[40px] border border-slate-100 p-8 lg:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <MessageSquare size={18} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Direct Note</h3>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Message to chef..."
                className="w-full rounded-[25px] border-2 border-slate-50 bg-[#F8FAFC] px-6 py-5 text-sm font-bold text-slate-800 outline-none ring-slate-200 placeholder:text-slate-300 focus:ring-4 transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  if (!note.trim()) return;
                  showToast("Message sent to pass");
                  setNote("");
                }}
                className="mt-6 w-full h-14 bg-slate-800 text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black active:scale-95 transition-all shadow-lg shadow-black/10"
              >
                <Send size={14} /> Send Note
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
