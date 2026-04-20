"use client";

import Link from "next/link";
import { ACTIVE_ORDERS } from "./mock-waiter-data";

const STATUS_COLOR: Record<string, string> = {
  in_prep: "bg-amber-500/20 text-amber-200 ring-amber-500/30",
  ready: "bg-emerald-500/20 text-emerald-200 ring-emerald-500/30",
  served: "bg-teal-500/15 text-teal-200 ring-teal-500/20",
  billed: "bg-stone-700 text-stone-300 ring-stone-600",
};

export function WaiterOrdersBoard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-white">Active orders</h1>
        <p className="mt-1 text-sm text-stone-500">Everything on your name today — jump to table for line-level status.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/40">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-800 bg-stone-950 text-[10px] font-black uppercase tracking-wider text-stone-500">
            <tr>
              <th className="px-4 py-3">Table</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Covers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {ACTIVE_ORDERS.map((o) => (
              <tr key={o.id} className="hover:bg-stone-950/60">
                <td className="px-4 py-3">
                  <Link href={`/waiter/table/${o.tableLabel}`} className="font-black text-emerald-300 hover:underline">
                    Table {o.tableLabel}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase ring-1 ${STATUS_COLOR[o.status]}`}
                  >
                    {o.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-black tabular-nums text-white">Rs. {o.total.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-bold text-stone-500">{o.covers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
