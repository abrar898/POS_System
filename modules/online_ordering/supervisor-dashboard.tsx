"use client";
import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  Users, Clock, Star, CheckCircle2, AlertCircle, Phone,
  Coffee, LayoutGrid, TrendingUp, Bell, X, ChevronRight,
  Activity, MessageSquare, Award, Utensils, RotateCcw, Menu
} from "lucide-react";

type WaiterStatus = "active" | "on-break" | "idle" | "offline";
interface Waiter {
  id: string; name: string; section: string; status: WaiterStatus;
  tablesServed: number; ordersCompleted: number; rating: number;
  activeTable: string | null; avatar: string; phone: string; joinedAt: string;
}
interface Alert { id: string; type: "request" | "delay" | "issue"; message: string; table: string; time: string; waiter: string; }

const WAITERS: Waiter[] = [
  { id: "w1", name: "Ali Hassan", section: "A (Tables 1–6)", status: "active", tablesServed: 5, ordersCompleted: 14, rating: 4.8, activeTable: "Table 3", avatar: "Ali", phone: "0301-1112233", joinedAt: "9:00 AM" },
  { id: "w2", name: "Sara Ahmed", section: "B (Tables 7–12)", status: "active", tablesServed: 4, ordersCompleted: 11, rating: 4.6, activeTable: "Table 9", avatar: "Sara", phone: "0312-3334455", joinedAt: "9:00 AM" },
  { id: "w3", name: "Bilal Khan", section: "C (Tables 13–18)", status: "on-break", tablesServed: 3, ordersCompleted: 8, rating: 4.4, activeTable: null, avatar: "Bilal", phone: "0333-5556677", joinedAt: "10:00 AM" },
  { id: "w4", name: "Nida Iqbal", section: "D (Tables 19–24)", status: "idle", tablesServed: 2, ordersCompleted: 5, rating: 4.9, activeTable: null, avatar: "Nida", phone: "0345-7778899", joinedAt: "10:30 AM" },
  { id: "w5", name: "Omar Farooq", section: "E (Bar/Lounge)", status: "active", tablesServed: 6, ordersCompleted: 18, rating: 4.7, activeTable: "Bar Seat 2", avatar: "Omar", phone: "0321-9990011", joinedAt: "8:00 AM" },
];

const INIT_ALERTS: Alert[] = [
  { id: "a1", type: "request", message: "Requested extra napkins", table: "Table 3", time: "2m ago", waiter: "Ali Hassan" },
  { id: "a2", type: "delay", message: "Order delayed >15 min", table: "Table 9", time: "5m ago", waiter: "Sara Ahmed" },
  { id: "a3", type: "request", message: "Requested bill", table: "Table 15", time: "1m ago", waiter: "Bilal Khan" },
  { id: "a4", type: "issue", message: "Wrong item delivered", table: "Table 7", time: "8m ago", waiter: "Sara Ahmed" },
];

const STATUS_CFG: Record<WaiterStatus, { label: string; color: string; bg: string }> = {
  active:    { label: "Active",    color: "#10b981", bg: "#d1fae5" },
  "on-break":{ label: "On Break", color: "#f59e0b", bg: "#fef3c7" },
  idle:      { label: "Idle",      color: "#6366f1", bg: "#e0e7ff" },
  offline:   { label: "Offline",   color: "#9ca3af", bg: "#f3f4f6" },
};
const ALERT_CFG = {
  request: { color: "#6366f1", bg: "#e0e7ff", icon: <Bell size={13}/> },
  delay:   { color: "#f59e0b", bg: "#fef3c7", icon: <Clock size={13}/> },
  issue:   { color: "#ef4444", bg: "#fee2e2", icon: <AlertCircle size={13}/> },
};

export function SupervisorDashboard() {
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [alerts, setAlerts] = useState(INIT_ALERTS);
  const [selected, setSelected] = useState<Waiter | null>(null);
  const [activeTab, setActiveTab] = useState<"overview"|"performance">("overview");
  const [isAlertPanelOpen, setIsAlertPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWaiters = async () => {
    try {
      const data = await api.waiters.getAll();
      const mappedWaiters: Waiter[] = data.map((w: any) => ({
        id: w.id || w._id,
        name: w.name,
        section: w.assignedTables?.length ? `Tables ${w.assignedTables.join(", ")}` : "No Section",
        status: w.status as WaiterStatus,
        tablesServed: w.assignedTables?.length || 0,
        ordersCompleted: Math.floor(Math.random() * 20), // Mocking for now as we don't have this in DB yet
        rating: 4.5 + Math.random() * 0.5,
        activeTable: w.assignedTables?.[0] || null,
        avatar: w.name.charAt(0),
        phone: w.phone,
        joinedAt: w.joinedAt ? new Date(w.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"
      }));
      setWaiters(mappedWaiters);
    } catch (err) {
      console.error("Failed to fetch waiters for supervisor:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWaiters();
    const interval = setInterval(fetchWaiters, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const setStatus = async (id: string, status: WaiterStatus) => {
    try {
      await api.waiters.update(id, { status });
      setWaiters(p => p.map(w => w.id === id ? { ...w, status } : w));
    } catch (err) {
      console.error("Failed to update waiter status:", err);
    }
  };

  const dismissAlert = (id: string) => setAlerts(p => p.filter(a => a.id !== id));

  const stats = {
    activeWaiters: waiters.filter(w => w.status === "active").length,
    totalOrders: waiters.reduce((s, w) => s + w.ordersCompleted, 0),
    avgRating: waiters.length ? (waiters.reduce((s, w) => s + w.rating, 0) / waiters.length).toFixed(1) : "0.0",
    alerts: alerts.length,
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#F5F6FA]">Loading Supervisor Dashboard...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#F5F6FA] text-slate-900 font-sans overflow-hidden">
      
      {/* Mobile Top Nav */}
      <div className="md:hidden flex items-center justify-between px-4 h-16 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white">
            <Users size={16}/>
          </div>
          <span className="font-black text-sm uppercase tracking-wider">Supervisor</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAlertPanelOpen(true)}
            className="relative p-2 bg-gray-50 rounded-lg"
          >
            <Bell size={20}/>
            {alerts.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />}
          </button>
          <button className="p-2 bg-gray-50 rounded-lg">
            <Menu size={20}/>
          </button>
        </div>
      </div>

      {/* LEFT: Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="hidden md:flex bg-white border-b border-gray-200 p-6 items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Users size={20}/>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-none">Supervisor Dashboard</h1>
              <p className="text-xs text-slate-400 font-bold mt-1">Staff management & floor oversight</p>
            </div>
          </div>
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
            {(["overview","performance"] as const).map((t: "overview" | "performance") => (
              <button 
                key={t} 
                onClick={() => setActiveTab(t)} 
                className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab===t ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-900"}`}
              >
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex p-2 bg-white border-b border-gray-200 gap-2 overflow-x-auto shrink-0">
          {(["overview","performance"] as const).map((t: "overview" | "performance") => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t)} 
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeTab===t ? "bg-slate-900 text-white" : "bg-gray-50 text-slate-400 border border-gray-100"}`}
            >
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-6 pb-0 shrink-0">
          {[
            { label:"Active", value:stats.activeWaiters, total:`/${waiters.length}`, color:"text-emerald-500", bg:"bg-emerald-50", icon:<Activity size={16}/> },
            { label:"Orders", value:stats.totalOrders, total:"today", color:"text-indigo-500", bg:"bg-indigo-50", icon:<Utensils size={16}/> },
            { label:"Rating", value:stats.avgRating, total:"★", color:"text-amber-500", bg:"bg-amber-50", icon:<Star size={16}/> },
            { label:"Alerts", value:stats.alerts, total:"pending", color:"text-red-500", bg:"bg-red-50", icon:<Bell size={16}/> },
          ].map((s,i) => (
            <div key={i} className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center ${s.color}`}>{s.icon}</div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl md:text-2xl font-black text-slate-900">{s.value}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{s.total}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
          {activeTab === "overview" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {waiters.map(w => {
                const cfg = STATUS_CFG[w.status];
                return (
                  <div 
                    key={w.id} 
                    onClick={() => { setSelected(w); if(window.innerWidth < 768) setIsAlertPanelOpen(true); }} 
                    className={`bg-white rounded-[24px] p-5 border transition-all cursor-pointer group ${selected?.id===w.id ? "border-indigo-500 ring-4 ring-indigo-500/5 shadow-lg" : "border-gray-100 hover:border-gray-200"}`}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center text-indigo-600 text-lg font-black border border-indigo-100/50">
                          {w.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-black text-slate-900 truncate">{w.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase truncate">{w.section}</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black shrink-0" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      {[
                        { label:"Tables", value:w.tablesServed },
                        { label:"Orders", value:w.ordersCompleted },
                        { label:"Rating", value:`${w.rating}★` },
                      ].map(m => (
                        <div key={m.label} className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
                          <div className="text-sm font-black text-slate-900">{m.value}</div>
                          <div className="text-[8px] text-slate-400 font-bold uppercase">{m.label}</div>
                        </div>
                      ))}
                    </div>
                    {w.activeTable && (
                      <div className="flex items-center gap-2 p-2 bg-indigo-50/50 rounded-xl text-[10px] font-black text-indigo-600 border border-indigo-100/50">
                        <Coffee size={12}/> Currently at {w.activeTable}
                      </div>
                    )}
                    {/* Quick Status Bar */}
                    <div className="flex gap-1.5 mt-4 pt-4 border-t border-gray-50" onClick={e=>e.stopPropagation()}>
                      {(["active","on-break","idle"] as WaiterStatus[]).map(s => (
                        <button 
                          key={s} 
                          onClick={()=>setStatus(w.id,s)} 
                          className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all ${w.status===s ? "bg-slate-900 text-white" : "bg-gray-100 text-slate-400 hover:bg-gray-200"}`}
                        >
                          {STATUS_CFG[s].label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Performance View */
            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Staff Performance Leaderboard</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-50">
                      {["Waiter","Section","Status","Tables","Orders","Rating"].map(h=>(
                        <th key={h} className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[...waiters].sort((a,b)=>b.ordersCompleted-a.ordersCompleted).map((w,i)=>{
                      const cfg=STATUS_CFG[w.status];
                      return (
                        <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {i===0&&<Award size={14} className="text-amber-500 shrink-0"/>}
                              <div className="text-sm font-black text-slate-900">{w.name}</div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-xs font-bold text-slate-500">{w.section.split(" ")[0]}</td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                          </td>
                          <td className="px-5 py-4 text-sm font-black text-slate-900">{w.tablesServed}</td>
                          <td className="px-5 py-4 text-sm font-black text-indigo-600">{w.ordersCompleted}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <Star size={14} className="fill-amber-500 text-transparent"/>
                              <span className="text-sm font-black text-slate-900">{w.rating}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Sidebar (Alerts & Detail) */}
      <aside className={`
        fixed inset-y-0 right-0 z-[1000] w-full sm:w-[320px] bg-white border-l border-gray-200 flex flex-col transition-transform duration-300 md:relative md:translate-x-0
        ${isAlertPanelOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Alerts Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Live Alerts</h2>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-500 text-[10px] font-black border border-red-100">{alerts.length}</span>
              <button onClick={() => setIsAlertPanelOpen(false)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-slate-400">
                <X size={20}/>
              </button>
            </div>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
            {alerts.length===0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-3">
                  <CheckCircle2 size={24}/>
                </div>
                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">All Clear</p>
              </div>
            )}
            {alerts.map(a=>{
              const cfg=ALERT_CFG[a.type];
              return (
                <div key={a.id} className="p-4 rounded-2xl border transition-all" style={{ backgroundColor: cfg.bg, borderColor: `${cfg.color}33` }}>
                  <div className="flex gap-3">
                    <div style={{ color: cfg.color }} className="shrink-0 mt-0.5">{cfg.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-black text-slate-900 uppercase tracking-wide">{a.table}</div>
                      <div className="text-xs font-bold text-slate-600 mt-0.5 leading-tight">{a.message}</div>
                      <div className="text-[9px] text-slate-400 font-bold mt-2 uppercase">{a.waiter} · {a.time}</div>
                    </div>
                    <button onClick={()=>dismissAlert(a.id)} className="text-slate-400 hover:text-slate-900 shrink-0"><X size={14}/></button>
                  </div>
                  <button 
                    onClick={()=>dismissAlert(a.id)} 
                    className="w-full mt-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}
                  >
                    <CheckCircle2 size={12}/> Resolve
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Waiter Detail Section */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {selected ? (
            <div className="animate-in fade-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Waiter Detail</h3>
                <button onClick={()=>setSelected(null)} className="text-slate-400 hover:text-slate-900"><X size={16}/></button>
              </div>
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-xl shadow-indigo-500/20">
                  {selected.name.charAt(0)}
                </div>
                <div className="text-lg font-black text-slate-900">{selected.name}</div>
                <div className="text-xs font-bold text-slate-400 uppercase mt-1">{selected.section}</div>
              </div>
              <div className="space-y-2">
                {[
                  { label:"Phone", value:selected.phone, icon:<Phone size={14}/> },
                  { label:"Shift Start", value:selected.joinedAt, icon:<Clock size={14}/> },
                  { label:"Active Table", value:selected.activeTable||"None", icon:<Coffee size={14}/> },
                ].map(row=>(
                  <div key={row.label} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-indigo-500 shrink-0">{row.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{row.label}</p>
                      <p className="text-sm font-black text-slate-900 truncate">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-3">
                <button className="w-full py-4 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase shadow-lg shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <MessageSquare size={16}/> Send Message
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={()=>setStatus(selected.id,"on-break")} className="py-3.5 rounded-2xl bg-white border border-gray-200 text-slate-600 text-[10px] font-black uppercase hover:bg-gray-50 transition-all flex flex-col items-center gap-1">
                    <Coffee size={14}/> Break
                  </button>
                  <button onClick={()=>setStatus(selected.id,"active")} className="py-3.5 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex flex-col items-center gap-1">
                    <RotateCcw size={14}/> Active
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Users size={32}/>
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Select a waiter to view details</p>
            </div>
          )}
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isAlertPanelOpen && <div className="md:hidden fixed inset-0 bg-black/40 z-[999] backdrop-blur-sm" onClick={() => setIsAlertPanelOpen(false)} />}
      
    </div>
  );
}
