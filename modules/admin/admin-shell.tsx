"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  CircleDot,
  Grid3x3,
  Users,
  Package,
  PieChart,
  Scale,
  Sparkles,
  Globe,
} from "lucide-react";

const LINKS: { href: string; label: string; icon: ReactNode }[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={15} /> },
  { href: "/admin/revenue", label: "Revenue", icon: <TrendingUp size={15} /> },
  { href: "/admin/sales-reports", label: "Sales reports", icon: <BarChart3 size={15} /> },
  { href: "/admin/menu-engineering", label: "Menu matrix", icon: <CircleDot size={15} /> },
  { href: "/admin/heatmap", label: "Heatmap", icon: <Grid3x3 size={15} /> },
  { href: "/admin/staff", label: "Staff", icon: <Users size={15} /> },
  { href: "/admin/inventory-costs", label: "Inventory COGS", icon: <Package size={15} /> },
  { href: "/admin/payments", label: "Payments", icon: <PieChart size={15} /> },
  { href: "/admin/reconciliation", label: "Reconciliation", icon: <Scale size={15} /> },
  { href: "/admin/ai-assistant", label: "AI Lite", icon: <Sparkles size={15} /> },
  { href: "/admin/online-orders", label: "Online orders", icon: <Globe size={15} /> },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-screen flex-col bg-[#F5F6FA] text-[#1a1a2e] overflow-hidden font-sans">
      <header className="shrink-0 border-b border-[#EBEBF0] bg-white z-30">
        <div className="flex items-center gap-4 px-4 py-2.5">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1a1a2e] shadow-lg"
            title="Home"
          >
            <div className="grid grid-cols-2 gap-[3px]">
              <div className="h-[7px] w-[7px] rounded-[1.5px] bg-white opacity-100" />
              <div className="h-[7px] w-[7px] rounded-[1.5px] bg-white opacity-60" />
              <div className="h-[7px] w-[7px] rounded-[1.5px] bg-white opacity-40" />
              <div className="h-[7px] w-[7px] rounded-[1.5px] bg-white opacity-20" />
            </div>
          </Link>
          <div className="min-w-0 shrink">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#a0a8b2]">
              Module 11 · Analytics & Admin
            </p>
            <p className="truncate text-sm font-black text-[#1a1a2e]">Pakistan Restaurant POS</p>
          </div>
        </div>
        <nav
          className="flex gap-1 overflow-x-auto px-3 pb-2 pt-0.5 scrollbar-thin"
          aria-label="Admin analytics"
        >
          {LINKS.map(({ href, label, icon }) => {
            const active =
              href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-[12px] font-bold transition-all ${
                  active
                    ? "bg-[#1a1a2e] text-white shadow-md shadow-[#1a1a2e]/20"
                    : "bg-[#F5F6FA] text-[#8a919e] hover:bg-[#EBEBF0] hover:text-[#1a1a2e]"
                }`}
              >
                <span className="opacity-90">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      <footer className="shrink-0 border-t border-[#EBEBF0] bg-white px-4 py-1.5 text-center text-[10px] font-semibold text-[#a0a8b2]">
        Same deployment · path <code className="font-mono text-[#1a1a2e]">/admin</code> only · owner / manager
      </footer>
    </div>
  );
}
