"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ACTIVE_ORDERS } from "./mock-waiter-data";

export function WaiterOrdersBoard() {
  const router = useRouter();
  return (
    <div className="h-full flex flex-col gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col">
        <h1 className="text-xl lg:text-3xl font-black text-slate-800 tracking-tighter">Orders Board</h1>
        <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">
          {ACTIVE_ORDERS.length} Active tickets
        </p>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-[25px] lg:rounded-[30px] overflow-hidden shadow-sm border border-slate-100 flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-[9px] lg:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-6 lg:px-8 py-4 lg:py-6">Table</th>
                <th className="px-6 lg:px-8 py-4 lg:py-6">Service State</th>
                <th className="px-6 lg:px-8 py-4 lg:py-6 text-right">Total</th>
                <th className="px-6 lg:px-8 py-4 lg:py-6 text-right">Guests</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[12px] lg:text-[13px]">
              {ACTIVE_ORDERS.map((o) => (
                <tr key={o.id} className="group hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => router.push(`/waiter/table/${o.tableLabel}`)}>
                  <td className="px-6 lg:px-8 py-4 lg:py-6">
                    <span className="flex items-center gap-2 lg:gap-3">
                      <span className="h-8 lg:h-10 w-8 lg:w-10 bg-[#EDEDED] rounded-lg lg:rounded-xl flex items-center justify-center font-black text-slate-800 shadow-inner">
                        {o.tableLabel}
                      </span>
                      <span className="font-black text-slate-800">Primary Table</span>
                    </span>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6">
                    <span className={`px-2 py-1 lg:px-4 lg:py-1.5 rounded-lg lg:rounded-xl text-[8px] lg:text-[9px] font-black uppercase tracking-widest ${
                      o.status === 'ready' || o.status === 'served' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {o.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6 text-right font-black text-slate-800 tabular-nums">Rp. {o.total.toLocaleString()}</td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6 text-right font-bold text-slate-400">{o.covers} PAX</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
