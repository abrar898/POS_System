"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Bell, Flame, LayoutGrid, Sparkles, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export function WaiterDashboard() {
  const [tables, setTables] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tData, oData] = await Promise.all([
          api.tables.getAll(),
          api.orders.getAll()
        ]);
        setTables(tData);
        setOrders(oData);
      } catch (err) {
        console.error("Waiter dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter tables assigned to "Sara Khan" (mocking current user for now)
  // In a real app, we'd use the logged in waiter's ID
  const myTables = tables.filter((t: any) => t.status !== "available");
  const activeTickets = orders.filter((o: any) => o.status === "pending" || o.status === "sent");

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
    </div>
  );

  return (
    <div className="h-full flex flex-col gap-4 lg:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col">
        <h1 className="text-xl lg:text-3xl font-black tracking-tighter text-slate-800">Shift Hub</h1>
        <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">
          Main Hall • {myTables.length} active tables
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Link
          href="/waiter/floor"
          className="group relative bg-[#FF5B22] rounded-[25px] lg:rounded-[30px] p-5 lg:p-6 text-white overflow-hidden shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          <div className="relative z-10">
            <div className="bg-white/20 w-fit p-2 rounded-xl mb-3 lg:mb-4">
              <LayoutGrid size={18} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Floor Tables</p>
            <p className="text-3xl lg:text-4xl font-black mt-1 tracking-tighter">{tables.length}</p>
            <div className="mt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest group-hover:gap-4 transition-all">
              Manage Floor <ArrowRight size={12} />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 bg-white/10 w-20 h-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </Link>

        <Link
          href="/waiter/runner"
          className="group relative bg-white rounded-[25px] lg:rounded-[30px] p-5 lg:p-6 text-slate-800 border border-slate-100 shadow-md overflow-hidden transition-all hover:scale-[1.02] active:scale-95"
        >
          <div className="relative z-10">
            <div className="bg-orange-50 text-orange-500 w-fit p-2 rounded-xl mb-3 lg:mb-4">
              <Flame size={18} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Active Orders</p>
            <p className="text-3xl lg:text-4xl font-black mt-1 tracking-tighter text-slate-800">{activeTickets.length}</p>
            <div className="mt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-orange-500 group-hover:gap-4 transition-all">
              Run Food <ArrowRight size={12} />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 bg-orange-50/50 w-20 h-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </Link>

        <Link
          href="/waiter/requests"
          className="group relative bg-white rounded-[25px] lg:rounded-[30px] p-5 lg:p-6 text-slate-800 border border-slate-100 shadow-md overflow-hidden transition-all hover:scale-[1.02] active:scale-95"
        >
          <div className="relative z-10">
            <div className="bg-teal-50 text-teal-600 w-fit p-2 rounded-xl mb-3 lg:mb-4">
              <Bell size={18} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Guest requests</p>
            <p className="text-3xl lg:text-4xl font-black mt-1 tracking-tighter text-slate-800">0</p>
            <div className="mt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-teal-600 group-hover:gap-4 transition-all">
              Quick Resolve <ArrowRight size={12} />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 bg-teal-50/50 w-20 h-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </Link>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-[25px] lg:rounded-[30px] p-5 lg:p-8 border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="mb-4 lg:mb-6 flex items-center justify-between shrink-0">
          <h2 className="text-base lg:text-lg font-black text-slate-800 tracking-tight">Active Room Tickets</h2>
          <Link href="/waiter/orders" className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-black transition-colors">
            Board
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-2">
          {activeTickets.slice(0, 8).map((o: any) => (
            <div key={o.id} className="p-4 lg:p-5 rounded-[20px] border border-slate-100 bg-[#F8FAFC] hover:bg-white hover:shadow-xl transition-all group cursor-pointer h-fit">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-slate-800 font-black shadow-sm group-hover:scale-110 transition-transform">
                   T{o.id.slice(-2)}
                </div>
                <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600`}>
                  {o.status}
                </span>
              </div>
              <p className="text-base font-black text-slate-800">Rs. {o.total_price.toLocaleString()}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">ORDER #{o.id.slice(-4)}</p>
                <ArrowRight size={12} className="text-slate-300 group-hover:text-black transition-colors" />
              </div>
            </div>
          ))}
          {activeTickets.length === 0 && (
            <div className="col-span-full py-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
              No active tickets
            </div>
          )}
        </div>
      </div>

      <div className="p-4 lg:p-6 bg-slate-800 rounded-[25px] lg:rounded-[30px] text-white flex items-center gap-4 shrink-0">
        <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <Sparkles size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black tracking-tight truncate">Cloud Sync Active</p>
          <p className="text-[10px] font-bold text-white/50 truncate">KDS & Counter synchronized</p>
        </div>
      </div>
    </div>
  );
}
