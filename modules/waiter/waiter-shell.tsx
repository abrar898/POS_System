"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ClipboardList,
  Home,
  LayoutGrid,
  Map,
  UtensilsCrossed,
} from "lucide-react";
import { SERVICE_REQUESTS, WAITER_PROFILE } from "./mock-waiter-data";

const TOP_NAV = [
  { href: "/waiter", label: "Hub", icon: LayoutGrid },
  { href: "/waiter/floor", label: "Floor", icon: Map },
  { href: "/waiter/runner", label: "Runner", icon: UtensilsCrossed },
  { href: "/waiter/orders", label: "Orders", icon: ClipboardList },
  { href: "/waiter/requests", label: "Requests", icon: Bell },
];

export function WaiterShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const openRequests = SERVICE_REQUESTS.length;

  return (
    <div className="flex min-h-screen flex-col bg-[#0c0f0e] text-stone-100">
      <header className="sticky top-0 z-40 border-b border-emerald-950/80 bg-gradient-to-r from-emerald-950 via-[#0c1412] to-emerald-950/90 px-4 py-3 shadow-lg shadow-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2 rounded-xl bg-emerald-500/15 px-2 py-1.5 ring-1 ring-emerald-500/30">
            <Home size={18} className="text-emerald-300" />
          </Link>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400/80">
              Waiter · Floor service
            </p>
            <p className="truncate text-sm font-black text-white">{WAITER_PROFILE.name}</p>
            <p className="truncate text-[11px] font-semibold text-stone-500">{WAITER_PROFILE.shift}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden rounded-full border border-emerald-800/80 bg-emerald-950 px-2.5 py-1 text-[10px] font-black text-emerald-300 sm:inline">
              {WAITER_PROFILE.section}
            </span>
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 ring-1 ring-stone-700">
              <Bell size={18} className="text-amber-200" />
              {openRequests > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white">
                  {openRequests}
                </span>
              )}
            </span>
          </div>
        </div>
        <nav className="mx-auto mt-3 flex max-w-6xl gap-1 overflow-x-auto pb-1 sm:gap-2" aria-label="Waiter">
          {TOP_NAV.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/waiter"
                ? pathname === "/waiter" || pathname === "/waiter/"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-xs font-black transition-all sm:px-4 ${
                  active
                    ? "bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/25"
                    : "bg-stone-900/80 text-stone-400 ring-1 ring-stone-800 hover:text-emerald-200"
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-6 sm:py-6">{children}</main>

      <footer className="border-t border-stone-800 bg-stone-950/90 px-4 py-3 text-center text-[10px] font-semibold text-stone-600">
        Same deployment · path <code className="text-emerald-600/90">/waiter</code> only · not admin or counter
      </footer>
    </div>
  );
}
