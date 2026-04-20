"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import { ACTIVE_ORDERS, TABLES, TABLE_ORDER_LINES } from "./mock-waiter-data";

type Props = { tableLabel: string };

export function WaiterTableDetail({ tableLabel }: Props) {
  const table = TABLES.find((t) => t.label === tableLabel);
  const order = ACTIVE_ORDERS.find((o) => o.tableLabel === tableLabel);
  const lines = table ? TABLE_ORDER_LINES[table.id] ?? [] : [];

  const [note, setNote] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);
  const [lineState, setLineState] = React.useState<Record<number, string>>({});

  if (!table || table.status === "empty") {
    return (
      <div className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8 text-center">
        <p className="text-stone-400">Table not active or not assigned to you.</p>
        <Link href="/waiter/floor" className="mt-4 inline-block text-sm font-black text-emerald-400 hover:underline">
          Back to floor
        </Link>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-2xl">
          {toast}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Link
          href="/waiter/floor"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 ring-1 ring-stone-700 text-stone-300 hover:text-white"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white">Table {tableLabel}</h1>
          <p className="text-xs font-semibold text-stone-500">
            {table.section} · {table.guests} guests · {table.status.replace("_", " ")}
          </p>
        </div>
      </div>

      {order && (
        <div className="rounded-3xl border border-stone-800 bg-stone-900/50 p-4">
          <p className="text-[11px] font-black uppercase text-stone-500">Order</p>
          <p className="font-mono text-sm font-bold text-emerald-300">{order.id}</p>
          <p className="mt-2 text-2xl font-black text-white">Rs. {order.total.toLocaleString()}</p>
          {order.kitchenNote && (
            <p className="mt-3 rounded-2xl border border-amber-800/50 bg-amber-950/40 p-3 text-xs font-semibold text-amber-100">
              <span className="font-black text-amber-400">Kitchen: </span>
              {order.kitchenNote}
            </p>
          )}
        </div>
      )}

      <div>
        <h2 className="mb-3 text-xs font-black uppercase tracking-wider text-stone-500">Line items</h2>
        <ul className="space-y-2">
          {lines.map((line, idx) => {
            const st = lineState[idx] ?? line.lineStatus;
            return (
              <li
                key={idx}
                className="flex flex-col gap-3 rounded-2xl border border-stone-800 bg-stone-950/60 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-black text-white">
                    {line.name} ×{line.qty}
                  </p>
                  <p className="text-[11px] font-bold text-stone-500">{line.course}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                      st === "ready"
                        ? "bg-emerald-500/20 text-emerald-200"
                        : st === "served"
                          ? "bg-teal-600/20 text-teal-200"
                          : "bg-amber-500/15 text-amber-200"
                    }`}
                  >
                    {st}
                  </span>
                  {st === "ready" && (
                    <button
                      type="button"
                      onClick={() => {
                        setLineState((s) => ({ ...s, [idx]: "served" }));
                        showToast("Marked served — guest notified (mock)");
                      }}
                      className="rounded-xl bg-emerald-600 px-3 py-1.5 text-[11px] font-black text-white"
                    >
                      Mark served
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        {lines.length === 0 && (
          <p className="rounded-2xl border border-dashed border-stone-800 py-8 text-center text-sm text-stone-500">
            No line snapshot for this table (counter builds the ticket on{" "}
            <span className="font-mono text-emerald-500/80">/counter</span>).
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-stone-800 bg-stone-900/40 p-4">
        <h2 className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-stone-500">
          <MessageSquare size={14} /> Service note → kitchen
        </h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="e.g. Guest wants extra raita on the side"
          className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-white outline-none ring-emerald-500/30 placeholder:text-stone-600 focus:ring-2"
        />
        <button
          type="button"
          onClick={() => {
            if (!note.trim()) return;
            showToast("Note queued to KDS ticket (mock)");
            setNote("");
          }}
          className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-stone-100 px-4 py-2.5 text-xs font-black text-stone-900"
        >
          <Send size={14} /> Send to pass
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => showToast("Bill request sent to counter terminal")}
          className="rounded-2xl border border-rose-700/50 bg-rose-950/40 px-4 py-3 text-xs font-black text-rose-100"
        >
          Request bill (counter)
        </button>
        <button
          type="button"
          onClick={() => showToast("Manager PIN flow — mock")}
          className="rounded-2xl border border-stone-700 bg-stone-900 px-4 py-3 text-xs font-black text-stone-300"
        >
          Call manager
        </button>
      </div>
    </div>
  );
}
