"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PAYMENT_SPLIT } from "./mock-admin-analytics";

const COLORS = ["#1a1a2e", "#818cf8", "#f472b6", "#fbbf24", "#34d399"];

export function PaymentsBreakdownView() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-[#1a1a2e]">Payment method breakdown</h1>
        <p className="mt-1 text-sm font-medium text-[#a0a8b2]">
          <code className="font-mono text-[11px] font-bold text-[#1a1a2e]">GET /api/analytics/payments-breakdown</code> — Cash / Card /
          JazzCash / EasyPaisa / Voucher.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-[#EBEBF0] bg-white p-6 card-shadow">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PAYMENT_SPLIT as { method: string; amount: number; pct: number }[]}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="amount"
                  nameKey="method"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {PAYMENT_SPLIT.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `Rs. ${(Number(value) || 0).toLocaleString()}`}
                  contentStyle={{ borderRadius: 12 }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-3">
          {PAYMENT_SPLIT.map((p, i) => (
            <div
              key={p.method}
              className="flex items-center justify-between rounded-2xl border border-[#F0F1F5] bg-[#FAFAFC] px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-sm font-black">{p.method}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-black tabular-nums">Rs. {p.amount.toLocaleString()}</p>
                <p className="text-[11px] font-bold text-[#a0a8b2]">{p.pct}% share</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
