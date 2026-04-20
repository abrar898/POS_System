"use client";

import * as React from "react";
import { SERVICE_REQUESTS } from "./mock-waiter-data";

export function WaiterRequests() {
  const [open, setOpen] = React.useState(SERVICE_REQUESTS);

  const resolve = (id: string) => setOpen((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-white">Service requests</h1>
        <p className="mt-1 text-sm text-stone-500">
          Guest bells, bill requests, refills — clear when done (counter gets bill flow on their screen).
        </p>
      </div>

      <ul className="space-y-3">
        {open.map((r) => (
          <li
            key={r.id}
            className={`flex flex-col gap-3 rounded-3xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
              r.urgent ? "border-rose-600/50 bg-rose-950/30" : "border-stone-800 bg-stone-900/60"
            }`}
          >
            <div>
              <p className="text-xs font-black uppercase text-stone-500">
                Table {r.tableLabel} · {r.type}
                {r.urgent && <span className="ml-2 text-rose-400">Urgent</span>}
              </p>
              <p className="mt-1 text-sm font-bold text-white">{r.message}</p>
              <p className="mt-1 text-[11px] text-stone-500">{r.createdAt}</p>
            </div>
            <button
              type="button"
              onClick={() => resolve(r.id)}
              className="rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white shadow-lg sm:shrink-0"
            >
              Mark done
            </button>
          </li>
        ))}
      </ul>
      {open.length === 0 && (
        <p className="rounded-2xl border border-stone-800 bg-stone-950/50 py-12 text-center text-sm text-stone-500">
          All caught up.
        </p>
      )}
    </div>
  );
}
