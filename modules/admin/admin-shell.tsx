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
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { href: "/admin/revenue", label: "Revenue", icon: <TrendingUp size={20} /> },
  { href: "/admin/sales-reports", label: "Sales reports", icon: <BarChart3 size={20} /> },
  { href: "/admin/menu-engineering", label: "Menu matrix", icon: <CircleDot size={20} /> },
  { href: "/admin/heatmap", label: "Heatmap", icon: <Grid3x3 size={20} /> },
  { href: "/admin/staff", label: "Staff", icon: <Users size={20} /> },
  { href: "/admin/inventory-costs", label: "Inventory COGS", icon: <Package size={20} /> },
  { href: "/admin/payments", label: "Payments", icon: <PieChart size={20} /> },
  { href: "/admin/reconciliation", label: "Reconciliation", icon: <Scale size={20} /> },
  { href: "/admin/ai-assistant", label: "AI Lite", icon: <Sparkles size={20} /> },
  { href: "/admin/online-orders", label: "Online orders", icon: <Globe size={20} /> },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#EDEDED] font-sans selection:bg-black/10 overflow-hidden text-slate-800">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-[80px] bg-white border-r border-slate-200 flex-col items-center py-8 overflow-y-auto custom-scrollbar shrink-0">
        <Link href="/" className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg mb-8 shrink-0">
           <div className="grid grid-cols-2 gap-[2px]">
              <div className="h-1.5 w-1.5 rounded-[0.5px] bg-white opacity-100" />
              <div className="h-1.5 w-1.5 rounded-[0.5px] bg-white opacity-60" />
              <div className="h-1.5 w-1.5 rounded-[0.5px] bg-white opacity-40" />
              <div className="h-1.5 w-1.5 rounded-[0.5px] bg-white opacity-20" />
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
                  active ? "bg-slate-50 text-black shadow-inner" : "text-slate-300 hover:text-black hover:bg-slate-50"
                }`}
              >
                {active && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-black rounded-r-full" />}
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
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-20 bg-white shadow-2xl rounded-[30px] border border-slate-100 z-50 flex items-center justify-around px-2 overflow-x-auto custom-scrollbar no-scrollbar">
          {LINKS.map(({ href, icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
             return (
              <Link key={href} href={href} className={`shrink-0 px-3 ${active ? "text-black" : "text-slate-300"}`}>
                {icon}
              </Link>
             );
          })}
      </nav>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-32 lg:pb-0">
        <header className="h-[100px] lg:h-[120px] px-6 lg:px-10 flex items-center justify-between shrink-0">
          <div className="min-w-0">
             <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                Analytics & Admin • Module 11
             </p>
             <h1 className="truncate text-xl lg:text-3xl font-black text-slate-800 tracking-tight">Admin Control</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:block text-right mr-2">
                <p className="text-xs font-black text-slate-800">Owner Access</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Branch</p>
             </div>
             <div className="h-12 w-12 rounded-[15px] overflow-hidden border-2 border-white shadow-lg ring-1 ring-slate-100">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Manager" alt="Avatar" />
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 lg:px-10 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
