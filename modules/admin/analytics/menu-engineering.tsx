"use client";

import {
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { MENU_ENGINEERING_POINTS } from "./mock-admin-analytics";

const COLORS: Record<string, string> = {
  Star: "#10b981",
  Plowhorse: "#f59e0b",
  Puzzle: "#818cf8",
  Dog: "#f472b6",
};

export function MenuEngineeringView() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-[#1a1a2e]">Menu engineering matrix</h1>
        <p className="mt-1 max-w-3xl text-sm font-medium text-[#a0a8b2]">
          <code className="font-mono text-[11px] font-bold text-[#1a1a2e]">GET /api/analytics/menu-engineering</code> — X = popularity
          (orders), Y = margin %. Quadrants: Stars, Plowhorses, Puzzles, Dogs.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 text-[11px] font-bold">
        {Object.entries(COLORS).map(([q, c]) => (
          <span key={q} className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: c }} />
            {q}
          </span>
        ))}
      </div>

      <div className="rounded-[28px] border border-[#EBEBF0] bg-white p-4 card-shadow">
        <div className="h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 16, right: 16, bottom: 16, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f5" />
              <XAxis
                type="number"
                dataKey="popularity"
                name="Popularity"
                unit="%"
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                label={{ value: "Popularity (order count index)", position: "bottom", offset: 0, fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="marginPct"
                name="Margin"
                unit="%"
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                label={{ value: "Margin %", angle: -90, position: "insideLeft", fontSize: 11 }}
              />
              <ZAxis range={[60, 60]} />
              <ReferenceLine x={50} stroke="#c5c8d0" strokeDasharray="4 4" />
              <ReferenceLine y={50} stroke="#c5c8d0" strokeDasharray="4 4" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) =>
                  active && payload && payload[0] ? (
                    <div className="rounded-xl border border-[#EBEBF0] bg-white px-3 py-2 text-xs shadow-lg">
                      <p className="font-black text-[#1a1a2e]">
                        {(payload[0].payload as { name: string }).name}
                      </p>
                      <p className="text-[#a0a8b2]">
                        Pop. {(payload[0].payload as { popularity: number }).popularity}% · Margin{" "}
                        {(payload[0].payload as { marginPct: number }).marginPct}%
                      </p>
                    </div>
                  ) : null
                }
              />
              <Scatter name="Items" data={MENU_ENGINEERING_POINTS} fill="#1a1a2e">
                {MENU_ENGINEERING_POINTS.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[entry.quadrant] ?? "#1a1a2e"} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <p className="px-2 pb-2 text-center text-[11px] font-semibold text-[#a0a8b2]">
          Promote Stars · fix Plowhorses · market Puzzles · review Dogs
        </p>
      </div>
    </div>
  );
}
