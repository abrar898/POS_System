"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, FileText } from "lucide-react";
import { SALES_REPORT_ROWS } from "./mock-admin-analytics";

export function SalesReportsView() {
  const [range, setRange] = React.useState<"day" | "week" | "month" | "custom">("week");
  const [orderType, setOrderType] = React.useState<string>("all");
  const [waiter, setWaiter] = React.useState<string>("all");

  const chartData = SALES_REPORT_ROWS.map((r) => ({
    day: r.day.slice(5),
    revenue: r.revenue / 1000,
  }));

  const mockExport = (kind: "csv" | "pdf") => {
    window.alert(`POST /api/analytics/export (${kind.toUpperCase()}) — mock`);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#1a1a2e]">Sales reports</h1>
          <p className="mt-1 text-sm font-medium text-[#a0a8b2]">
            <code className="font-mono text-[11px] font-bold text-[#1a1a2e]">GET /api/analytics/sales</code> — drill-down
            by period, channel, payment, waiter, table, time band.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => mockExport("csv")}
            className="inline-flex items-center gap-2 rounded-xl border border-[#EBEBF0] bg-white px-4 py-2 text-xs font-black shadow-sm"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            type="button"
            onClick={() => mockExport("pdf")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1a1a2e] px-4 py-2 text-xs font-black text-white shadow-lg"
          >
            <FileText size={14} /> Export PDF
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {(["day", "week", "month", "custom"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={`rounded-xl px-4 py-2 text-xs font-black capitalize ${
              range === r ? "bg-[#1a1a2e] text-white shadow-md" : "bg-white text-[#8a919e] border border-[#EBEBF0]"
            }`}
          >
            {r === "custom" ? "Custom range" : r}
          </button>
        ))}
        <select
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
          className="rounded-xl border border-[#EBEBF0] bg-white px-3 py-2 text-xs font-bold"
        >
          <option value="all">All order types</option>
          <option value="dine_in">Dine-in</option>
          <option value="takeaway">Takeaway</option>
          <option value="delivery">Delivery</option>
        </select>
        <select
          value={waiter}
          onChange={(e) => setWaiter(e.target.value)}
          className="rounded-xl border border-[#EBEBF0] bg-white px-3 py-2 text-xs font-bold"
        >
          <option value="all">All waiters</option>
          <option value="Ahmed">Ahmed</option>
          <option value="Sara">Sara</option>
          <option value="Bilal">Bilal</option>
        </select>
      </div>

      <div className="mb-6 rounded-[28px] border border-[#EBEBF0] bg-white p-6 card-shadow">
        <h2 className="mb-4 text-[15px] font-black text-[#1a1a2e]">Revenue (Rs. thousands)</h2>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f5" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v: any) => [`${(Number(v) || 0).toFixed(0)}k PKR`, "Revenue"]}
                contentStyle={{ borderRadius: 12, border: "1px solid #EBEBF0" }}
              />
              <Bar dataKey="revenue" fill="#1a1a2e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[#EBEBF0] bg-white card-shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#FAFAFC] text-[11px] font-black uppercase tracking-wider text-[#a0a8b2]">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Orders</th>
              <th className="px-5 py-3 text-right">Revenue</th>
              <th className="px-5 py-3">Waiter</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F1F5]">
            {SALES_REPORT_ROWS.map((r) => (
              <tr key={r.day} className="hover:bg-[#FAFAFC]">
                <td className="px-5 py-3 font-mono text-xs font-bold">{r.day}</td>
                <td className="px-5 py-3 font-bold">{r.orders}</td>
                <td className="px-5 py-3 text-right font-black tabular-nums">Rs. {r.revenue.toLocaleString()}</td>
                <td className="px-5 py-3 text-xs font-semibold">{r.waiter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
