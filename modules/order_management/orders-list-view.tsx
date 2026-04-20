"use client";

import * as React from "react";
import { Bike, Filter, Search, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { BRANCH, MOCK_HISTORY_ORDERS } from "./mock-data";
import type { OrderStatus, OrderType } from "./types";

const STATUS_OPTIONS: OrderStatus[] = [
  "draft",
  "sent",
  "in_prep",
  "ready",
  "served",
  "billed",
  "completed",
  "void",
];

const TYPE_ICON: Record<OrderType, React.ReactNode> = {
  dine_in: <UtensilsCrossed size={16} />,
  takeaway: <ShoppingBag size={16} />,
  delivery: <Bike size={16} />,
};

const LABEL: Record<OrderStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  in_prep: "In prep",
  ready: "Ready",
  served: "Served",
  billed: "Billed",
  completed: "Done",
  void: "Void",
};

export function OrdersListView() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<OrderStatus | "all">("all");
  const [type, setType] = React.useState<OrderType | "all">("all");

  const rows = MOCK_HISTORY_ORDERS.filter((o) => {
    if (status !== "all" && o.status !== status) return false;
    if (type !== "all" && o.orderType !== type) return false;
    if (q.trim()) {
      const needle = q.toLowerCase();
      return (
        o.id.toLowerCase().includes(needle) ||
        (o.tableLabel?.toLowerCase().includes(needle) ?? false) ||
        (o.customerName?.toLowerCase().includes(needle) ?? false)
      );
    }
    return true;
  });

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1a1a2e] tracking-tight">Floor & kitchen orders</h2>
          <p className="text-sm text-[#a0a8b2] font-medium mt-1 max-w-xl">
            Mirrors <code className="text-[#1a1a2e] font-bold">GET /api/orders</code> with filters. Data is
            sample POS traffic for {BRANCH.name}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a8b2]" size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Order id, table, name…"
              className="pl-9 pr-3 py-2.5 rounded-xl border border-[#EBEBF0] text-xs font-bold w-64 bg-white shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#a0a8b2]" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus | "all")}
              className="px-3 py-2.5 rounded-xl border border-[#EBEBF0] text-xs font-bold bg-white"
            >
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {LABEL[s]}
                </option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as OrderType | "all")}
              className="px-3 py-2.5 rounded-xl border border-[#EBEBF0] text-xs font-bold bg-white"
            >
              <option value="all">All channels</option>
              <option value="dine_in">Dine-in</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[28px] border border-[#EBEBF0] card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAFAFC] text-[11px] font-black uppercase tracking-wider text-[#a0a8b2]">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Channel</th>
                <th className="px-6 py-4">Table / guest</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4">Kitchen note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F1F5]">
              {rows.map((o) => (
                <tr key={o.id} className="hover:bg-[#FAFAFC]/80">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-[#1a1a2e]">{o.id}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 font-bold text-[#1a1a2e]">
                      {TYPE_ICON[o.orderType]}
                      {o.orderType.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-[#1a1a2e]">
                    {o.tableLabel ? `Table ${o.tableLabel}` : "—"} · {o.guestCount} pax
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-100">
                      {LABEL[o.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-black tabular-nums">
                    Rs. {o.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#a0a8b2] max-w-[220px] truncate" title={o.notes ?? ""}>
                    {o.notes ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <p className="text-center text-sm text-[#a0a8b2] font-medium py-16">No orders match filters.</p>
        )}
      </div>
    </div>
  );
}
