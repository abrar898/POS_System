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
  Search,
  Bell,
} from "lucide-react";

const LINKS: { href: string; label: string; icon: ReactNode }[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { href: "/admin/revenue", label: "Revenue", icon: <TrendingUp size={20} /> },
  { href: "/admin/sales-reports", label: "Sales reports", icon: <BarChart3 size={20} /> },
  { href: "/admin/menu-engineering", label: "Menu matrix", icon: <CircleDot size={20} /> },
  { href: "/admin/heatmap", label: "Heatmap", icon: <Grid3x3 size={20} /> },
  { href: "/admin/inventory-costs", label: "Inventory COGS", icon: <Package size={20} /> },
  { href: "/admin/payments", label: "Payments", icon: <PieChart size={20} /> },
  { href: "/admin/reconciliation", label: "Reconciliation", icon: <Scale size={20} /> },
  { href: "/admin/ai-assistant", label: "AI Lite", icon: <Sparkles size={20} /> },
  { href: "/admin/online-orders", label: "Online orders", icon: <Globe size={20} /> },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-background font-sans selection:bg-[var(--btn-primary-bg)] overflow-hidden text-foreground">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-[80px] bg-[var(--bg-card)] border-r border-[var(--border-default)] flex-col items-center py-8 overflow-y-auto custom-scrollbar shrink-0">
        <Link href="/" className="w-10 h-10 bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] rounded-xl flex items-center justify-center shadow-lg mb-8 shrink-0">
           <div className="grid grid-cols-2 gap-[2px]">
              <div className="h-1.5 w-1.5 rounded-[0.5px] bg-[var(--bg-card)] opacity-100" />
              <div className="h-1.5 w-1.5 rounded-[0.5px] bg-[var(--bg-card)] opacity-60" />
              <div className="h-1.5 w-1.5 rounded-[0.5px] bg-[var(--bg-card)] opacity-40" />
              <div className="h-1.5 w-1.5 rounded-[0.5px] bg-[var(--bg-card)] opacity-20" />
           </div>
        </Link>
        
        <div className="w-1 h-1 bg-slate-200 rounded-full mb-6 shrink-0" />

        <div className="flex flex-col gap-6 py-2">
          {LINKS.map(({ href, icon, label }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={`transition-all duration-300 relative h-12 w-12 flex items-center justify-center rounded-2xl group ${
                  active ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-inner" : "text-[var(--text-secondary)] hover:text-black hover:bg-slate-50"
                }`}
              >
                {active && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[var(--btn-primary-bg)] rounded-r-full" />}
                <div className={`${active ? "opacity-100 scale-110" : "opacity-100 group-hover:scale-110"} transition-all`}>
                  {icon}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="w-1 h-1 bg-slate-200 rounded-full mt-6 shrink-0" />
        
        <button className="mt-auto pt-8 opacity-30 hover:opacity-100 transition-opacity shrink-0">
          <CircleDot size={20} />
        </button>
      </aside>

      {/* Sidebar - Mobile/Bottom Nav */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-20 bg-[var(--bg-card)] shadow-2xl rounded-[30px] border border-[var(--border-default)] z-50 flex items-center justify-around px-2 overflow-x-auto custom-scrollbar no-scrollbar">
          {LINKS.map(({ href, icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
             return (
              <Link key={href} href={href} className={`shrink-0 px-3 ${active ? "text-[var(--btn-primary-bg)]" : "text-[var(--text-secondary)]"}`}>
                {icon}
              </Link>
             );
          })}
      </nav>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-0">
        <header className="h-[80px] px-8 flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Assalam-o-Alaikum, Manager
          </h1>
          <div className="flex items-center gap-5">
            <button className="text-[var(--text-secondary)] hover:text-foreground transition-colors">
              <Search size={20} />
            </button>
            <div className="relative">
              <button className="text-[var(--text-secondary)] hover:text-foreground transition-colors group">
                <Bell size={20} />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#ef4444] rounded-full border-2 border-white group-hover:scale-125 transition-transform" />
              </button>
            </div>
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-md ring-1 ring-black/5 cursor-pointer hover:scale-105 transition-transform">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan"
                alt="Profile"
                className="w-full h-full object-cover bg-[#fde8d8]"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden px-6 lg:px-10 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
