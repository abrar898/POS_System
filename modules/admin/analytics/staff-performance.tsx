"use client";

import * as React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { STAFF_LEADERBOARD } from "./mock-admin-analytics";

type Key = "orders" | "avgTicket" | "tips" | "hours" | "voids";

export function StaffPerformanceView() {
  const [period, setPeriod] = React.useState<"week" | "month">("week");
  const [sortKey, setSortKey] = React.useState<Key>("orders");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");

  const sorted = React.useMemo(() => {
    const rows = [...STAFF_LEADERBOARD];
    rows.sort((a, b) => {
      const av = a[sortKey === "avgTicket" ? "avgTicket" : sortKey];
      const bv = b[sortKey === "avgTicket" ? "avgTicket" : sortKey];
      const cmp = (av as number) - (bv as number);
      return sortDir === "desc" ? -cmp : cmp;
    });
    return rows;
  }, [sortKey, sortDir]);

  const toggle = (k: Key) => {
    if (sortKey === k) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortKey(k);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ k }: { k: Key }) =>
    sortKey === k ? sortDir === "desc" ? <ArrowDown size={14} /> : <ArrowUp size={14} /> : null;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Staff performance</h1>
          <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">
            <code className="font-mono text-[11px] font-bold text-foreground">GET /api/analytics/staff-performance</code> — per-waiter
            leaderboard.
          </p>
        </div>
        <div className="flex gap-2">
          {(["week", "month"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded-xl px-4 py-2 text-xs font-black capitalize ${
                period === p ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-white shadow-md" : "border border-[var(--border-default)] bg-[var(--bg-card)]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--bg-card)] card-shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#FAFAFC] text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
            <tr>
              <th className="px-5 py-3">Waiter</th>
              <th className="px-5 py-3">
                <button type="button" className="inline-flex items-center gap-1 font-black" onClick={() => toggle("orders")}>
                  Orders <SortIcon k="orders" />
                </button>
              </th>
              <th className="px-5 py-3">
                <button type="button" className="inline-flex items-center gap-1 font-black" onClick={() => toggle("avgTicket")}>
                  Avg ticket <SortIcon k="avgTicket" />
                </button>
              </th>
              <th className="px-5 py-3">
                <button type="button" className="inline-flex items-center gap-1 font-black" onClick={() => toggle("tips")}>
                  Tips (PKR) <SortIcon k="tips" />
                </button>
              </th>
              <th className="px-5 py-3">
                <button type="button" className="inline-flex items-center gap-1 font-black" onClick={() => toggle("hours")}>
                  Hours <SortIcon k="hours" />
                </button>
              </th>
              <th className="px-5 py-3">
                <button type="button" className="inline-flex items-center gap-1 font-black" onClick={() => toggle("voids")}>
                  Voids <SortIcon k="voids" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F1F5]">
            {sorted.map((s) => (
              <tr key={s.name} className="hover:bg-[#FAFAFC]">
                <td className="px-5 py-3 font-bold text-foreground">{s.name}</td>
                <td className="px-5 py-3 font-black tabular-nums">{s.orders}</td>
                <td className="px-5 py-3 font-black tabular-nums">Rs. {s.avgTicket.toLocaleString()}</td>
                <td className="px-5 py-3 font-black tabular-nums">Rs. {s.tips.toLocaleString()}</td>
                <td className="px-5 py-3 font-semibold">{s.hours}h</td>
                <td className="px-5 py-3 font-bold text-rose-600">{s.voids}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
