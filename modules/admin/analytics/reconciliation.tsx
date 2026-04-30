"use client";

import { AlertTriangle, Wallet } from "lucide-react";
import { RECONCILIATION } from "./mock-admin-analytics";

export function ReconciliationView() {
  const r = RECONCILIATION;
  const rows = [
    { label: "Dine-in", value: r.dineIn },
    { label: "Delivery", value: r.delivery },
    { label: "Takeaway", value: r.takeaway },
    { label: "Online", value: r.online },
  ];
  const varianceBad = Math.abs(r.variance) > 15_000;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Revenue reconciliation</h1>
        <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">
          <code className="font-mono text-[11px] font-bold text-foreground">GET /api/analytics/reconciliation</code> — all channels vs
          day-end cash drawer (M05).
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[28px] border border-[var(--border-default)] bg-[var(--bg-card)] p-6 card-shadow">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
            <Wallet size={14} /> Expected (system)
          </div>
          <p className="mt-2 text-2xl font-black tabular-nums">Rs. {r.totalExpected.toLocaleString()}</p>
        </div>
        <div className="rounded-[28px] border border-[var(--border-default)] bg-[var(--bg-card)] p-6 card-shadow">
          <div className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">Actual drawer</div>
          <p className="mt-2 text-2xl font-black tabular-nums">Rs. {r.drawerActual.toLocaleString()}</p>
        </div>
      </div>

      <div
        className={`mb-6 flex items-start gap-3 rounded-[28px] border p-5 ${
          varianceBad ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"
        }`}
      >
        <AlertTriangle className={`mt-0.5 shrink-0 ${varianceBad ? "text-amber-700" : "text-emerald-700"}`} size={22} />
        <div>
          <p className="text-sm font-black text-foreground">Variance</p>
          <p className="text-lg font-black tabular-nums text-foreground">
            Rs. {r.variance.toLocaleString()}
          </p>
          <p className="mt-1 text-xs font-medium text-[var(--text-secondary)]">{r.notes}</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-[var(--border-default)] bg-[var(--bg-card)] p-6 card-shadow">
        <h2 className="mb-4 text-[15px] font-black">Channel roll-up</h2>
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between rounded-2xl bg-[#FAFAFC] px-4 py-3">
              <span className="text-sm font-bold">{row.label}</span>
              <span className="text-sm font-black tabular-nums">Rs. {row.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
