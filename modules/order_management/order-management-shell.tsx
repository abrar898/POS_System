"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  BarChart3,
  ShoppingBag,
  MessageCircle,
  Users,
  ClipboardList,
  Star,
  Settings,
  Headphones,
  LogOut,
  Search,
  Bell,
  Mail,
  Flame,
} from "lucide-react";
import { BRANCH } from "./mock-data";
import { useOrderCashierStore } from "./order-store";

export type PosShellVariant = "counter" | "legacy";

type ShellProps = {
  children: ReactNode;
  basePath: string;
  variant?: PosShellVariant;
  moduleLabel?: string;
};

export function OrderManagementShell({
  children,
  basePath,
  variant = "legacy",
}: ShellProps) {
  const pathname = usePathname();
  
  const isActive = (href: string) => {
    if (href === basePath) {
      return pathname === basePath || pathname === `${basePath}/`;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isCounter = variant === "counter";

  const MENU_ITEMS = [
    { href: basePath, label: "Overview", icon: LayoutGrid },
    { href: `${basePath}/analytics`, label: "Analytics", icon: BarChart3 },
    { href: `${basePath}/orders`, label: "Order", icon: ShoppingBag },
    { href: `${basePath}/messages`, label: "Messages", icon: MessageCircle },
    { href: `${basePath}/customers`, label: "Customers", icon: Users },
    { href: `${basePath}/menu`, label: "Menu", icon: ClipboardList },
    { href: `${basePath}/rating`, label: "Rating", icon: Star },
  ];

  const OTHER_ITEMS = [
    { href: `${basePath}/settings`, label: "Settings", icon: Settings },
    { href: `${basePath}/support`, label: "Support", icon: Headphones },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="z-20 hidden w-[240px] shrink-0 flex-col border-r bg-white py-8 lg:flex">
        <div className="mb-10 px-8">
          <div className="flex items-center gap-2 text-[#FF5B22]">
            <Flame size={28} fill="#FF5B22" />
            <span className="text-2xl font-black tracking-tight text-slate-800">Serve</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4">
          <p className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Menu</p>
          <nav className="flex flex-col gap-2">
            {MENU_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-[20px] px-4 py-3.5 text-sm font-bold transition-all ${
                    active
                      ? "bg-[#FF5B22] text-white shadow-xl shadow-orange-500/25"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <p className="px-4 mt-10 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Other</p>
          <nav className="flex flex-col gap-2">
            {OTHER_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-[20px] px-4 py-3.5 text-sm font-bold transition-all ${
                    active
                      ? "bg-[#FF5B22] text-white shadow-xl shadow-orange-500/25"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button className="mt-auto flex items-center gap-3 rounded-[20px] px-4 py-3.5 text-sm font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-20 shrink-0 items-center justify-between px-8 bg-[#F8FAFC]">
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-800">Overview</h1>
            <p className="text-[11px] font-bold text-slate-400 mt-0.5">Analyze sales data to identify trends for increased revenue.</p>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="relative w-[400px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="text"
                placeholder="Search"
                className="h-11 w-full rounded-2xl bg-white border border-slate-100 pl-14 pr-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5B22]/10"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all">
                <Bell size={20} />
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all">
                <Mail size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-3 border-l h-10 pl-8">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Carter Gardner</p>
              </div>
              <div className="h-11 w-11 rounded-full bg-slate-300 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-slate-600 uppercase">
                CG
              </div>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
