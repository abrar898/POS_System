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

const SIDE_NAV = [
  { href: "/waiter", label: "Hub", icon: LayoutGrid },
  { href: "/waiter/floor", label: "Floor", icon: Map },
  { href: "/waiter/runner", label: "Runner", icon: UtensilsCrossed },
  { href: "/waiter/orders", label: "Orders Board", icon: ClipboardList },
  { href: "/waiter/requests", label: "Task List", icon: Bell },
];

export function WaiterShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const openRequests = SERVICE_REQUESTS.length;

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#EDEDED] font-sans selection:bg-black/10 overflow-hidden text-slate-800">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-[80px] bg-white border-r border-slate-200 flex-col items-center py-8 overflow-y-auto custom-scrollbar shrink-0">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg mb-8 shrink-0">
           <UtensilsCrossed size={20} />
        </div>
        
        <div className="w-1 h-1 bg-slate-200 rounded-full mb-6 shrink-0" />

        <div className="flex flex-col gap-6 py-2">
          {SIDE_NAV.map(({ href, icon: Icon, label }) => {
            const active = href === "/waiter" ? pathname === "/waiter" : pathname.startsWith(href);
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
                  <Icon size={20} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="w-1 h-1 bg-slate-200 rounded-full mt-6 shrink-0" />
        
        <button className="mt-auto pt-8 opacity-30 hover:opacity-100 transition-opacity shrink-0">
          <Home size={20} />
        </button>
      </aside>

      {/* Sidebar - Mobile/Bottom Nav */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-20 bg-white shadow-2xl rounded-[30px] border border-slate-100 z-50 flex items-center justify-around px-2">
          {SIDE_NAV.map(({ href, icon: Icon }) => {
            const active = href === "/waiter" ? pathname === "/waiter" : pathname.startsWith(href);
             return (
              <Link key={href} href={href} className={`shrink-0 px-3 ${active ? "text-black" : "text-slate-300"}`}>
                <Icon size={22} />
              </Link>
             );
          })}
      </nav>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-32 lg:pb-0">
        <header className="h-[100px] lg:h-[120px] px-6 lg:px-10 flex items-center justify-between shrink-0">
          <div className="min-w-0">
             <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
               Waiter · {WAITER_PROFILE.section}
             </p>
             <h1 className="truncate text-xl lg:text-2xl font-black text-slate-800 tracking-tight">{WAITER_PROFILE.name}</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="relative h-12 w-12 flex items-center justify-center rounded-[15px] bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                <Bell size={20} />
                {openRequests > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 bg-black text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">{openRequests}</span>}
             </button>
             <div className="h-12 w-12 rounded-[15px] overflow-hidden border-2 border-white shadow-lg">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan" alt="Avatar" />
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
