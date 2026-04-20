"use client";

import Link from "next/link";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { ACTIVE_ORDERS, RUNNER_QUEUE, SERVICE_REQUESTS, TABLES } from "./mock-waiter-data";

export function WaiterDashboard() {
  const myTables = TABLES.filter((t) => t.assignedWaiter === "Sara Khan" && t.status !== "empty");
  const ready = RUNNER_QUEUE.filter((r) => !r.claimed).length;
  const urgentReq = SERVICE_REQUESTS.filter((r) => r.urgent).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Shift hub</h1>
        <p className="mt-1 text-sm font-medium text-stone-500">
          Quick read on your section — tap a card to drill in. KDS sync is mock; layout matches real workflow.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/waiter/floor"
          className="group rounded-3xl border border-stone-800 bg-gradient-to-br from-stone-900 to-stone-950 p-5 ring-1 ring-stone-800 transition hover:border-emerald-800/60 hover:ring-emerald-500/20"
        >
          <p className="text-[11px] font-black uppercase tracking-wider text-stone-500">My tables</p>
          <p className="mt-2 text-3xl font-black text-white">{myTables.length}</p>
          <p className="mt-1 text-xs font-semibold text-stone-400">Seated or in service</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-emerald-400">
            Open floor <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
          </span>
        </Link>
        <Link
          href="/waiter/runner"
          className="group rounded-3xl border border-amber-900/40 bg-gradient-to-br from-amber-950/80 to-stone-950 p-5 ring-1 ring-amber-900/30"
        >
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-amber-200/80">
            <Flame size={14} /> Runner queue
          </p>
          <p className="mt-2 text-3xl font-black text-amber-100">{ready}</p>
          <p className="mt-1 text-xs font-semibold text-amber-200/60">Food ready from kitchen</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-amber-300">
            Run food <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
          </span>
        </Link>
        <Link
          href="/waiter/requests"
          className="group rounded-3xl border border-rose-900/40 bg-gradient-to-br from-rose-950/50 to-stone-950 p-5 ring-1 ring-rose-900/20"
        >
          <p className="text-[11px] font-black uppercase tracking-wider text-rose-200/70">Guest requests</p>
          <p className="mt-2 text-3xl font-black text-rose-100">{SERVICE_REQUESTS.length}</p>
          <p className="mt-1 text-xs font-semibold text-rose-200/50">{urgentReq} urgent</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-rose-300">
            Resolve <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>

      <div className="rounded-3xl border border-stone-800 bg-stone-900/50 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-stone-400">Live tickets</h2>
          <Link href="/waiter/orders" className="text-xs font-black text-emerald-400 hover:underline">
            See all
          </Link>
        </div>
        <ul className="space-y-2">
          {ACTIVE_ORDERS.slice(0, 4).map((o) => (
            <li key={o.id}>
              <Link
                href={`/waiter/table/${o.tableLabel}`}
                className="flex items-center justify-between rounded-2xl bg-stone-950/80 px-4 py-3 ring-1 ring-stone-800 transition hover:ring-emerald-600/40"
              >
                <div>
                  <p className="text-sm font-black text-white">Table {o.tableLabel}</p>
                  <p className="text-[11px] font-semibold capitalize text-stone-500">{o.status.replace("_", " ")}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-200/90">Rs. {o.total.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-stone-600">{o.covers} guests</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-emerald-900/30 bg-emerald-950/20 p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 shrink-0 text-emerald-400" size={22} />
          <div>
            <p className="text-sm font-black text-emerald-100">Handoff with counter</p>
            <p className="mt-1 text-xs leading-relaxed text-stone-400">
              New bills and voids stay on <span className="font-mono text-emerald-500/90">/counter</span>. You mark
              served / guest-ready here; counter finalizes payment — one codebase, isolated paths.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
