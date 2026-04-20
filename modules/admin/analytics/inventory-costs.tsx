"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { INVENTORY_MARGIN } from "./mock-admin-analytics";

export function InventoryCostsView() {
  const chart = INVENTORY_MARGIN.items.map((r) => ({
    name: r.name.split(" ")[0],
    revenue: r.revenue / 1000,
    cogs: r.cogs / 1000,
    expected: r.expectedUse / 1000,
    actual: r.actualUse / 1000,
  }));

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-[#1a1a2e]">Inventory cost report</h1>
        <p className="mt-1 text-sm font-medium text-[#a0a8b2]">
          <code className="font-mono text-[11px] font-bold text-[#1a1a2e]">GET /api/analytics/inventory-costs</code> — COGS vs revenue,
          recipe vs stocktake variance.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[28px] border border-[#f0f1f5] bg-white p-5 card-shadow">
          <p className="text-[11px] font-bold uppercase text-[#a0a8b2]">Revenue (period)</p>
          <p className="mt-1 text-xl font-black">Rs. {INVENTORY_MARGIN.revenue.toLocaleString()}</p>
        </div>
        <div className="rounded-[28px] border border-[#f0f1f5] bg-white p-5 card-shadow">
          <p className="text-[11px] font-bold uppercase text-[#a0a8b2]">COGS</p>
          <p className="mt-1 text-xl font-black">Rs. {INVENTORY_MARGIN.cogs.toLocaleString()}</p>
        </div>
        <div className="rounded-[28px] border border-[#f0f1f5] bg-emerald-50 p-5 card-shadow">
          <p className="text-[11px] font-bold uppercase text-emerald-800">Gross margin</p>
          <p className="mt-1 text-xl font-black text-emerald-900">{INVENTORY_MARGIN.grossMarginPct}%</p>
        </div>
      </div>

      <div className="mb-6 rounded-[28px] border border-[#EBEBF0] bg-white p-6 card-shadow">
        <h2 className="mb-4 text-[15px] font-black">COGS vs revenue (Rs. thousands)</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f5" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => `${v.toFixed(1)}k`} />
              <Legend />
              <Bar dataKey="revenue" fill="#818cf8" name="Revenue" radius={[6, 6, 0, 0]} />
              <Bar dataKey="cogs" fill="#1a1a2e" name="COGS" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[#EBEBF0] bg-white card-shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#FAFAFC] text-[11px] font-black uppercase tracking-wider text-[#a0a8b2]">
            <tr>
              <th className="px-5 py-3">Item</th>
              <th className="px-5 py-3 text-right">Margin rank</th>
              <th className="px-5 py-3 text-right">Expected use</th>
              <th className="px-5 py-3 text-right">Actual use</th>
              <th className="px-5 py-3 text-right">Variance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F1F5]">
            {INVENTORY_MARGIN.items.map((r, i) => {
              const varPct = ((r.actualUse - r.expectedUse) / r.expectedUse) * 100;
              return (
                <tr key={r.name}>
                  <td className="px-5 py-3 font-bold">{r.name}</td>
                  <td className="px-5 py-3 text-right font-black">#{i + 1}</td>
                  <td className="px-5 py-3 text-right tabular-nums">Rs. {r.expectedUse.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right tabular-nums">Rs. {r.actualUse.toLocaleString()}</td>
                  <td
                    className={`px-5 py-3 text-right font-bold ${varPct > 3 ? "text-rose-600" : "text-emerald-700"}`}
                  >
                    {varPct > 0 ? "+" : ""}
                    {varPct.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
