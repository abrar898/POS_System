"use client";

import * as React from "react";
import { buildHeatmapData } from "./mock-admin-analytics";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HeatmapView() {
  const [metric, setMetric] = React.useState<"orders" | "revenue">("orders");
  const grid = React.useMemo(() => buildHeatmapData(), []);
  const max = React.useMemo(() => Math.max(...grid.flat(), 1), [grid]);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Busiest hours heatmap</h1>
          <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">
            <code className="font-mono text-[11px] font-bold text-foreground">GET /api/analytics/heatmap/:branchId</code> — last 90
            days rolled into 7×24. Colour = volume for scheduling & promos.
          </p>
        </div>
        <div className="flex gap-2">
          {(["orders", "revenue"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMetric(m)}
              className={`rounded-xl px-4 py-2 text-xs font-black capitalize ${
                metric === m ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-white shadow-md" : "border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-secondary)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-[28px] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 card-shadow">
        <div className="min-w-[900px]">
          <div className="mb-1 grid grid-cols-[72px_repeat(24,minmax(0,1fr))] gap-0.5 text-[9px] font-bold text-[var(--text-secondary)]">
            <div />
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="text-center">
                {h}
              </div>
            ))}
          </div>
          {grid.map((row, di) => (
            <div key={DAYS[di]} className="mb-0.5 grid grid-cols-[72px_repeat(24,minmax(0,1fr))] gap-0.5">
              <div className="flex items-center pr-2 text-[11px] font-black text-foreground">{DAYS[di]}</div>
              {row.map((v, hi) => {
                const t = v / max;
                const bg =
                  metric === "revenue"
                    ? `rgba(26, 26, 46, ${0.08 + t * 0.85})`
                    : `rgba(129, 140, 248, ${0.1 + t * 0.8})`;
                return (
                  <div
                    key={hi}
                    title={`${DAYS[di]} ${hi}:00 — ${metric === "orders" ? v + " orders" : "Rs. " + (v * 1200).toLocaleString()}`}
                    className="aspect-square min-h-[18px] rounded-sm"
                    style={{ background: bg }}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-[11px] font-semibold text-[var(--text-secondary)]">
          <span>Low</span>
          <div className="h-2 w-32 rounded-full bg-gradient-to-r from-[#f5f6fa] to-[#1a1a2e]" />
          <span>High</span>
        </div>
      </div>
    </div>
  );
}
