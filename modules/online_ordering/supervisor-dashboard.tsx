"use client";
import React, { useState } from "react";
import {
  Users, Clock, Star, CheckCircle2, AlertCircle, Phone,
  Coffee, LayoutGrid, TrendingUp, Bell, X, ChevronRight,
  Activity, MessageSquare, Award, Utensils, RotateCcw,
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
  const [waiters, setWaiters] = useState(WAITERS);
  const [alerts, setAlerts] = useState(INIT_ALERTS);
  const [selected, setSelected] = useState<Waiter | null>(null);
  const [activeTab, setActiveTab] = useState<"overview"|"performance">("overview");

  const setStatus = (id: string, status: WaiterStatus) =>
    setWaiters(p => p.map(w => w.id === id ? { ...w, status } : w));
  const dismissAlert = (id: string) => setAlerts(p => p.filter(a => a.id !== id));

  const stats = {
    activeWaiters: waiters.filter(w => w.status === "active").length,
    totalOrders: waiters.reduce((s, w) => s + w.ordersCompleted, 0),
    avgRating: (waiters.reduce((s, w) => s + w.rating, 0) / waiters.length).toFixed(1),
    alerts: alerts.length,
  };

  return (
    <div style={{ display:"flex", height:"100vh", width:"100%", background:"#F5F6FA", fontFamily:"'Inter',sans-serif", overflow:"hidden" }}>
      {/* LEFT: Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ background:"white", borderBottom:"1px solid #EBEBF0", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ width:"38px", height:"38px", borderRadius:"12px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Users size={18} color="white"/>
            </div>
            <div>
              <h1 style={{ fontSize:"18px", fontWeight:900, color:"#1a1a2e", margin:0 }}>Supervisor Dashboard</h1>
              <p style={{ fontSize:"11px", color:"#a0a8b2", margin:0 }}>Waiter management & floor oversight</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:"8px" }}>
            {(["overview","performance"] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ padding:"7px 16px", borderRadius:"10px", border:"none", fontSize:"12px", fontWeight:700, cursor:"pointer", background: activeTab===t?"#1a1a2e":"#F5F6FA", color: activeTab===t?"white":"#6b7280", transition:"all 0.2s" }}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", padding:"16px 24px 0", flexShrink:0 }}>
          {[
            { label:"Active Waiters", value:stats.activeWaiters, total:`/${waiters.length}`, color:"#10b981", icon:<Activity size={16}/> },
            { label:"Total Orders", value:stats.totalOrders, total:"today", color:"#6366f1", icon:<Utensils size={16}/> },
            { label:"Avg Rating", value:stats.avgRating, total:"★", color:"#f59e0b", icon:<Star size={16}/> },
            { label:"Open Alerts", value:stats.alerts, total:"pending", color:"#ef4444", icon:<Bell size={16}/> },
          ].map((s,i) => (
            <div key={i} style={{ background:"white", borderRadius:"16px", padding:"14px 16px", border:"1px solid #EBEBF0" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px" }}>
                <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:`${s.color}18`, display:"flex", alignItems:"center", justifyContent:"center", color:s.color }}>{s.icon}</div>
                <span style={{ fontSize:"10px", fontWeight:700, color:"#a0a8b2", textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</span>
              </div>
              <div style={{ display:"flex", alignItems:"baseline", gap:"4px" }}>
                <span style={{ fontSize:"24px", fontWeight:900, color:"#1a1a2e" }}>{s.value}</span>
                <span style={{ fontSize:"11px", color:"#a0a8b2", fontWeight:600 }}>{s.total}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Waiter Grid */}
        <div style={{ flex:1, overflow:"auto", padding:"16px 24px 24px" }}>
          {activeTab === "overview" ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px" }}>
              {waiters.map(w => {
                const cfg = STATUS_CFG[w.status];
                return (
                  <div key={w.id} onClick={() => setSelected(w)} style={{ background:"white", borderRadius:"20px", padding:"20px", border:`1px solid ${selected?.id===w.id?"#6366f1":"#EBEBF0"}`, cursor:"pointer", transition:"all 0.2s", boxShadow: selected?.id===w.id?"0 0 0 2px #6366f144":"none" }}
                    onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-2px)")}
                    onMouseLeave={e=>(e.currentTarget.style.transform="")}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                        <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:"16px", fontWeight:800 }}>
                          {w.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize:"13px", fontWeight:800, color:"#1a1a2e" }}>{w.name}</div>
                          <div style={{ fontSize:"10px", color:"#a0a8b2" }}>{w.section}</div>
                        </div>
                      </div>
                      <span style={{ padding:"4px 10px", borderRadius:"20px", background:cfg.bg, color:cfg.color, fontSize:"10px", fontWeight:700 }}>{cfg.label}</span>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px", marginBottom:"14px" }}>
                      {[
                        { label:"Tables", value:w.tablesServed },
                        { label:"Orders", value:w.ordersCompleted },
                        { label:"Rating", value:`${w.rating}★` },
                      ].map(m => (
                        <div key={m.label} style={{ background:"#F5F6FA", borderRadius:"10px", padding:"8px", textAlign:"center" }}>
                          <div style={{ fontSize:"14px", fontWeight:900, color:"#1a1a2e" }}>{m.value}</div>
                          <div style={{ fontSize:"9px", color:"#a0a8b2", textTransform:"uppercase", fontWeight:700 }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                    {w.activeTable && (
                      <div style={{ display:"flex", alignItems:"center", gap:"6px", padding:"7px 10px", background:"#e0e7ff", borderRadius:"10px", fontSize:"11px", fontWeight:700, color:"#6366f1" }}>
                        <Coffee size={12}/> Currently at {w.activeTable}
                      </div>
                    )}
                    {/* Quick Status Buttons */}
                    <div style={{ display:"flex", gap:"6px", marginTop:"12px" }} onClick={e=>e.stopPropagation()}>
                      {(["active","on-break","idle"] as WaiterStatus[]).map(s => (
                        <button key={s} onClick={()=>setStatus(w.id,s)} style={{ flex:1, padding:"5px", borderRadius:"8px", border:"none", fontSize:"9px", fontWeight:700, cursor:"pointer", background: w.status===s?"#1a1a2e":"#F5F6FA", color: w.status===s?"white":"#6b7280", transition:"all 0.15s" }}>
                          {STATUS_CFG[s].label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Performance Table */
            <div style={{ background:"white", borderRadius:"20px", border:"1px solid #EBEBF0", overflow:"hidden" }}>
              <div style={{ padding:"16px 20px", borderBottom:"1px solid #F5F6FA" }}>
                <h2 style={{ fontSize:"14px", fontWeight:800, color:"#1a1a2e", margin:0 }}>Staff Performance</h2>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr 1fr", padding:"10px 20px", background:"#FAFBFF", borderBottom:"1px solid #F5F6FA" }}>
                {["Waiter","Section","Status","Tables","Orders","Rating"].map(h=>(
                  <span key={h} style={{ fontSize:"10px", fontWeight:800, color:"#a0a8b2", textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</span>
                ))}
              </div>
              {[...waiters].sort((a,b)=>b.ordersCompleted-a.ordersCompleted).map((w,i)=>{
                const cfg=STATUS_CFG[w.status];
                return (
                  <div key={w.id} style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr 1fr", padding:"14px 20px", borderBottom: i<waiters.length-1?"1px solid #F5F6FA":"none", alignItems:"center" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                      {i===0&&<Award size={14} color="#f59e0b"/>}
                      <div style={{ fontSize:"13px", fontWeight:700, color:"#1a1a2e" }}>{w.name}</div>
                    </div>
                    <div style={{ fontSize:"11px", color:"#6b7280" }}>{w.section.split(" ")[0]}</div>
                    <span style={{ padding:"3px 8px", borderRadius:"20px", background:cfg.bg, color:cfg.color, fontSize:"10px", fontWeight:700, width:"fit-content" }}>{cfg.label}</span>
                    <div style={{ fontSize:"13px", fontWeight:700, color:"#1a1a2e" }}>{w.tablesServed}</div>
                    <div style={{ fontSize:"13px", fontWeight:800, color:"#6366f1" }}>{w.ordersCompleted}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                      <Star size={12} fill="#f59e0b" stroke="none"/>
                      <span style={{ fontSize:"13px", fontWeight:800, color:"#1a1a2e" }}>{w.rating}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Alerts + Detail */}
      <div style={{ width:"300px", background:"white", borderLeft:"1px solid #EBEBF0", display:"flex", flexDirection:"column", flexShrink:0 }}>
        {/* Alerts */}
        <div style={{ padding:"18px 18px 12px", borderBottom:"1px solid #EBEBF0" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
            <h2 style={{ fontSize:"14px", fontWeight:900, color:"#1a1a2e", margin:0 }}>Live Alerts</h2>
            <span style={{ padding:"3px 8px", borderRadius:"20px", background:"#fee2e2", color:"#ef4444", fontSize:"11px", fontWeight:700 }}>{alerts.length}</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {alerts.length===0 && <p style={{ fontSize:"12px", color:"#a0a8b2", textAlign:"center", padding:"16px 0" }}>All clear ✅</p>}
            {alerts.map(a=>{
              const cfg=ALERT_CFG[a.type];
              return (
                <div key={a.id} style={{ padding:"10px 12px", borderRadius:"12px", background:cfg.bg, border:`1px solid ${cfg.color}33`, position:"relative" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:"8px" }}>
                    <div style={{ color:cfg.color, marginTop:"1px" }}>{cfg.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"11px", fontWeight:700, color:"#1a1a2e" }}>{a.table}</div>
                      <div style={{ fontSize:"10px", color:"#6b7280", margin:"2px 0" }}>{a.message}</div>
                      <div style={{ fontSize:"9px", color:"#a0a8b2" }}>{a.waiter} · {a.time}</div>
                    </div>
                    <button onClick={()=>dismissAlert(a.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#a0a8b2", padding:0 }}><X size={13}/></button>
                  </div>
                  <button onClick={()=>dismissAlert(a.id)} style={{ marginTop:"8px", width:"100%", padding:"5px", borderRadius:"8px", border:"none", background:`${cfg.color}22`, color:cfg.color, fontSize:"10px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"4px" }}>
                    <CheckCircle2 size={11}/> Resolve
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Waiter Detail */}
        <div style={{ flex:1, overflow:"auto", padding:"18px" }}>
          {selected ? (
            <>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
                <h3 style={{ fontSize:"13px", fontWeight:800, color:"#1a1a2e", margin:0 }}>Waiter Detail</h3>
                <button onClick={()=>setSelected(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#a0a8b2" }}><X size={14}/></button>
              </div>
              <div style={{ textAlign:"center", marginBottom:"16px" }}>
                <div style={{ width:"56px", height:"56px", borderRadius:"18px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:"22px", fontWeight:800, margin:"0 auto 8px" }}>
                  {selected.name.charAt(0)}
                </div>
                <div style={{ fontSize:"15px", fontWeight:900, color:"#1a1a2e" }}>{selected.name}</div>
                <div style={{ fontSize:"11px", color:"#a0a8b2" }}>{selected.section}</div>
              </div>
              {[
                { label:"Phone", value:selected.phone, icon:<Phone size={12}/> },
                { label:"Started", value:selected.joinedAt, icon:<Clock size={12}/> },
                { label:"Active Table", value:selected.activeTable||"None", icon:<Coffee size={12}/> },
              ].map(row=>(
                <div key={row.label} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"9px 12px", background:"#F5F6FA", borderRadius:"10px", marginBottom:"6px" }}>
                  <span style={{ color:"#6366f1" }}>{row.icon}</span>
                  <span style={{ fontSize:"10px", color:"#a0a8b2", fontWeight:600, width:"60px" }}>{row.label}</span>
                  <span style={{ fontSize:"12px", fontWeight:700, color:"#1a1a2e" }}>{row.value}</span>
                </div>
              ))}
              <div style={{ marginTop:"12px", display:"flex", flexDirection:"column", gap:"6px" }}>
                <button style={{ width:"100%", padding:"9px", borderRadius:"10px", border:"none", background:"#1a1a2e", color:"white", fontSize:"12px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                  <MessageSquare size={13}/> Send Message
                </button>
                <button onClick={()=>setStatus(selected.id,"on-break")} style={{ width:"100%", padding:"9px", borderRadius:"10px", border:"1px solid #EBEBF0", background:"white", color:"#6b7280", fontSize:"12px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                  <Coffee size={13}/> Send to Break
                </button>
                <button onClick={()=>setStatus(selected.id,"active")} style={{ width:"100%", padding:"9px", borderRadius:"10px", border:"1px solid #d1fae5", background:"#d1fae5", color:"#10b981", fontSize:"12px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                  <RotateCcw size={13}/> Resume Active
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"24px 0", color:"#a0a8b2" }}>
              <Users size={28} style={{ margin:"0 auto 8px", opacity:0.4 }}/>
              <p style={{ fontSize:"12px", fontWeight:600 }}>Select a waiter to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
