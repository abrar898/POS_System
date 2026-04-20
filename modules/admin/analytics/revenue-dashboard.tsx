"use client";

import { ArrowDownRight, ArrowUpRight, Users } from "lucide-react";
import { ADMIN_BRANCH, REVENUE_KPI } from "./mock-admin-analytics";

function Delta({ pct }: { pct: number }) {
  const up = pct >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[12px] font-black ${
        up ? "text-emerald-600" : "text-rose-600"
      }`}
    >
      {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      {up ? "+" : ""}
      {pct}% YoY
    </span>
  );
}

export function RevenueDashboardView() {
  const k = REVENUE_KPI;
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-[#1a1a2e]">Revenue dashboard</h1>
        <p className="mt-1 text-sm font-medium text-[#a0a8b2]">
          <code className="font-mono text-[11px] font-bold text-[#1a1a2e]">GET /api/analytics/dashboard/:branchId</code> ·{" "}
          {ADMIN_BRANCH.name}
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[28px] border border-[#f0f1f5] bg-white p-6 card-shadow">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#a0a8b2]">Today</p>
          <p className="mt-1 text-2xl font-black tabular-nums">Rs. {k.today.value.toLocaleString()}</p>
          <div className="mt-2 flex items-center justify-between">
            <Delta pct={k.today.changePct} />
            <span className="text-[11px] text-[#a0a8b2]">
              PY Rs. {k.today.priorYear.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="rounded-[28px] border border-[#f0f1f5] bg-white p-6 card-shadow">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#a0a8b2]">This week</p>
          <p className="mt-1 text-2xl font-black tabular-nums">Rs. {k.week.value.toLocaleString()}</p>
          <div className="mt-2 flex items-center justify-between">
            <Delta pct={k.week.changePct} />
            <span className="text-[11px] text-[#a0a8b2]">
              PY Rs. {k.week.priorYear.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="rounded-[28px] border border-[#f0f1f5] bg-white p-6 card-shadow">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#a0a8b2]">This month</p>
          <p className="mt-1 text-2xl font-black tabular-nums">Rs. {k.month.value.toLocaleString()}</p>
          <div className="mt-2 flex items-center justify-between">
            <Delta pct={k.month.changePct} />
            <span className="text-[11px] text-[#a0a8b2]">
              PY Rs. {k.month.priorYear.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[28px] border border-[#f0f1f5] bg-white p-6 card-shadow">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#a0a8b2]">Avg order value</p>
          <p className="mt-1 text-xl font-black tabular-nums">Rs. {k.avgOrderValue.toLocaleString()}</p>
        </div>
        <div className="rounded-[28px] border border-[#f0f1f5] bg-white p-6 card-shadow">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#a0a8b2] flex items-center gap-2">
            <Users size={14} /> Total covers (guests)
          </p>
          <p className="mt-1 text-xl font-black tabular-nums">{k.covers.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-[#EBEBF0] bg-white p-6 card-shadow">
        <h2 className="text-[15px] font-black text-[#1a1a2e]">Revenue by order type</h2>
        <p className="text-xs font-medium text-[#a0a8b2]">Dine-in · delivery · takeaway · online (aggregators)</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {k.byOrderType.map((row) => (
            <div
              key={row.type}
              className="flex items-center justify-between rounded-2xl border border-[#F0F1F5] bg-[#FAFAFC] px-4 py-3"
            >
              <span className="text-sm font-bold">{row.label}</span>
              <div className="text-right">
                <p className="text-sm font-black tabular-nums">Rs. {row.revenue.toLocaleString()}</p>
                <p className="text-[11px] font-bold text-[#a0a8b2]">{row.pct}% mix</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
