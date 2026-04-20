"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Home,
  MonitorSmartphone,
  UtensilsCrossed,
  Wifi,
  WifiOff,
} from "lucide-react";
import { BRANCH } from "./mock-data";
import { useOrderCashierStore } from "./order-store";

export type PosShellVariant = "counter" | "legacy";

type ShellProps = {
  children: ReactNode;
  /** Route prefix, e.g. `/counter` or `/order_management` */
  basePath: string;
  variant?: PosShellVariant;
  /** Header line 1 */
  moduleLabel?: string;
};

export function OrderManagementShell({
  children,
  basePath,
  variant = "legacy",
  moduleLabel,
}: ShellProps) {
  const pathname = usePathname();
  const networkOnline = useOrderCashierStore((s) => s.networkOnline);
  const setNetworkOnline = useOrderCashierStore((s) => s.setNetworkOnline);

  const nav = [
    { href: basePath, label: variant === "counter" ? "Counter" : "Cashier", icon: UtensilsCrossed },
    { href: `${basePath}/orders`, label: "Floor orders", icon: ClipboardList },
    { href: `${basePath}/offline`, label: "Offline sync", icon: MonitorSmartphone },
  ];

  const isActive = (href: string) => {
    if (href === basePath) {
      return pathname === basePath || pathname === `${basePath}/`;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isCounter = variant === "counter";
  const label =
    moduleLabel ??
    (isCounter ? "Counter · In-venue POS" : "Module 03 · Order Management (POS)");

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden font-sans ${
        isCounter ? "bg-slate-950 text-slate-100" : "bg-[#F5F6FA] text-[#1a1a2e]"
      }`}
    >
      <aside
        className={`z-20 flex w-[72px] shrink-0 flex-col items-center gap-6 border-r py-6 ${
          isCounter ? "border-slate-800 bg-slate-900" : "border-[#EBEBF0] bg-white"
        }`}
      >
        <Link
          href="/"
          className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-lg transition-transform hover:scale-105 ${
            isCounter ? "bg-teal-500 text-white" : "bg-[#1a1a2e] text-white"
          }`}
          title="Launch hub"
        >
          <Home size={18} />
        </Link>

        <div className="flex w-full flex-1 flex-col items-center gap-3">
          {nav.map(({ href, label: navLabel, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                title={navLabel}
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
                  active
                    ? isCounter
                      ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
                      : "bg-[#1a1a2e] text-white shadow-lg shadow-[#1a1a2e]/20"
                    : isCounter
                      ? "text-slate-500 hover:bg-slate-800 hover:text-teal-300"
                      : "text-[#C5C8D0] hover:bg-[#F5F6FA] hover:text-[#1a1a2e]"
                }`}
              >
                <Icon size={20} />
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setNetworkOnline(!networkOnline)}
          title={networkOnline ? "Simulate offline" : "Simulate online"}
          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all ${
            networkOnline
              ? isCounter
                ? "border-emerald-800 bg-emerald-950 text-emerald-300"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
              : isCounter
                ? "border-amber-800 bg-amber-950 text-amber-200"
                : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {networkOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className={`flex h-14 shrink-0 items-center justify-between border-b px-6 backdrop-blur ${
            isCounter
              ? "border-slate-800 bg-slate-900/95"
              : "border-[#EBEBF0] bg-white/90"
          }`}
        >
          <div className="min-w-0">
            <p
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                isCounter ? "text-teal-400/90" : "text-[#a0a8b2]"
              }`}
            >
              {label}
            </p>
            <h1
              className={`truncate text-sm font-black ${isCounter ? "text-white" : "text-[#1a1a2e]"}`}
            >
              {BRANCH.name} · {BRANCH.city}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1.5 text-[11px] font-black ${
                networkOnline
                  ? isCounter
                    ? "border-emerald-800 bg-emerald-950 text-emerald-300"
                    : "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : isCounter
                    ? "border-amber-800 bg-amber-950 text-amber-200"
                    : "border-amber-200 bg-amber-50 text-amber-900"
              }`}
            >
              {networkOnline ? "Online · Supabase" : "Offline · Dexie queue"}
            </span>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
        <footer
          className={`shrink-0 border-t px-4 py-1.5 text-center text-[10px] font-semibold ${
            isCounter ? "border-slate-800 bg-slate-900 text-slate-500" : "border-[#EBEBF0] bg-white text-[#a0a8b2]"
          }`}
        >
          Same app · path{" "}
          <code className={isCounter ? "text-teal-400/90" : "text-[#1a1a2e]"}>{basePath}</code> only · not /admin or
          /waiter
        </footer>
      </div>
    </div>
  );
}
