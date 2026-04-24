"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Truck, Clock, CheckCircle2, MapPin, Phone, Search, X, Package, Bike, TrendingUp, AlertCircle, Eye, ChevronRight, Star, Navigation, RefreshCw } from "lucide-react";
import { getRoute } from "@/lib/routing";

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), { ssr: false });

// Islamabad coords
const RESTAURANT: [number, number] = [33.6844, 73.0479];

const MOCK_ORDERS = [
  { id: "ORD-928421", customer: "Ethan Blake", phone: "0301-4452110", address: "MCS Lalkurti, Gate 6", items: ["Cheese Burger ×2", "Cola ×1"], total: 1180, status: "dispatched", time: "2m ago", eta: 18, rider: "Ahmed Ali", riderPhone: "+92-312-4455667", placedAt: "10:30 AM", riderLat: 33.6900, riderLng: 73.0520, destLat: 33.6950, destLng: 73.0600 },
  { id: "ORD-125421", customer: "Sara Malik", phone: "0321-5556660", address: "F-7/3, Blue Area", items: ["Margherita Pizza", "Garlic Bread"], total: 1050, status: "preparing", time: "8m ago", eta: 35, placedAt: "10:22 AM", riderLat: null, riderLng: null, destLat: 33.7090, destLng: 73.0551 },
  { id: "ORD-998121", customer: "Ahmed Khan", phone: "0333-7778880", address: "G-11 Markaz", items: ["BBQ Chicken ×3", "Fries ×2"], total: 2450, status: "pending", time: "1m ago", eta: 55, placedAt: "10:35 AM", riderLat: null, riderLng: null, destLat: 33.6750, destLng: 73.0130 },
  { id: "ORD-441221", customer: "Zara Hussain", phone: "0345-1234560", address: "DHA Phase 2", items: ["Fish Burger", "Chicken Burger"], total: 600, status: "delivered", time: "45m ago", eta: 0, rider: "Bilal Raza", riderPhone: "+92-311-9988776", placedAt: "09:45 AM", riderLat: 33.5180, destLat: 33.5180, riderLng: 73.1480, destLng: 73.1480 },
  { id: "ORD-667321", customer: "Omar Sheikh", phone: "0312-9876540", address: "I-8/4 Islamabad", items: ["Beef Burger ×2"], total: 1100, status: "dispatched", time: "15m ago", eta: 8, rider: "Kamran Asif", riderPhone: "+92-333-5544332", placedAt: "10:15 AM", riderLat: 33.6677, riderLng: 73.0870, destLat: 33.6720, destLng: 73.0940 },
];

type Order = typeof MOCK_ORDERS[0];

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label:"Pending",   color:"#f59e0b", bg:"#fef3c7" },
  preparing: { label:"Preparing", color:"#6366f1", bg:"#e0e7ff" },
  dispatched:{ label:"On the Way",color:"#0ea5e9", bg:"#e0f2fe" },
  delivered: { label:"Delivered", color:"#10b981", bg:"#d1fae5" },
  cancelled: { label:"Cancelled", color:"#ef4444", bg:"#fee2e2" },
};

export function DeliveryDashboard() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selected, setSelected] = useState<Order>(MOCK_ORDERS[0]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [riderPos, setRiderPos] = useState<[number, number]>(
    selected.riderLat ? [selected.riderLat, selected.riderLng!] : RESTAURANT
  );
  const [route, setRoute] = useState<[number, number][]>([]);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch route when selected order changes
  useEffect(() => {
    async function updateRoute() {
      if (selected.riderLat && selected.destLat) {
        const start: [number, number] = [selected.riderLat, selected.riderLng!];
        const end: [number, number] = [selected.destLat, selected.destLng!];
        const newRoute = await getRoute(start, end);
        setRoute(newRoute);
      } else if (selected.destLat) {
         // If not dispatched yet, show route from restaurant to destination
         const newRoute = await getRoute(RESTAURANT, [selected.destLat, selected.destLng!]);
         setRoute(newRoute);
      } else {
        setRoute([]);
      }
    }
    updateRoute();
  }, [selected]);

  // Animate rider marker along the road route
  useEffect(() => {
    if (selected.status !== "dispatched" || route.length === 0) {
      setRiderPos(selected.riderLat ? [selected.riderLat, selected.riderLng!] : RESTAURANT);
      return;
    }
    
    if (animRef.current) clearInterval(animRef.current);

    let pointIndex = 0;
    // We want the animation to be smooth, so we'll step through the route points
    animRef.current = setInterval(() => {
      if (pointIndex < route.length) {
        setRiderPos(route[pointIndex]);
        pointIndex++;
      } else {
        if (animRef.current) clearInterval(animRef.current);
      }
    }, 100); // Adjust speed of animation (100ms per point)

    return () => { if (animRef.current) clearInterval(animRef.current); };
  }, [selected, route]);

  const advanceStatus = (id: string) => {
    const nxt: Record<string, string> = { pending:"preparing", preparing:"dispatched", dispatched:"delivered" };
    setOrders(p => p.map(o => o.id === id ? { ...o, status: nxt[o.status] || o.status } : o));
    if (selected.id === id) setSelected(p => ({ ...p, status: nxt[p.status] || p.status }));
  };

  const stats = {
    total: orders.length,
    dispatched: orders.filter(o => o.status === "dispatched").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    revenue: orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
  };

  const filtered = orders.filter(o =>
    (filter === "all" || o.status === filter) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display:"flex", height:"100vh", width:"100%", fontFamily:"'Inter', sans-serif", background:"#f3f4f6", overflow:"hidden", color: "#1e293b" }}>

      {/* ── LEFT PANEL ── (Updated to White per user request) */}
      <div style={{ width:"340px", display:"flex", flexDirection:"column", background:"white", borderRight:"1px solid #e2e8f0", flexShrink:0 }}>
        {/* Header */}
        <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid #f1f5f9" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"15px" }}>
            <div style={{ width:"40px", height:"40px", borderRadius:"12px", background:"#1e293b", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Truck size={18} color="white"/>
            </div>
            <div>
              <h1 style={{ fontSize:"16px", fontWeight:900, color:"#0f172a", margin:0 }}>Delivery Control</h1>
              <div style={{ display:"flex", alignItems:"center", gap:"5px", marginTop:"1px" }}>
                <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#10b981", display:"inline-block", animation:"pulse 2s infinite" }}/>
                <span style={{ fontSize:"10px", color:"#10b981", fontWeight:700 }}>OSM LIVE</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"6px", marginBottom:"15px" }}>
            {[
              { label:"Orders", value:stats.total, color:"#6366f1" },
              { label:"Active", value:stats.dispatched, color:"#0ea5e9" },
              { label:"Done", value:stats.delivered, color:"#10b981" },
              { label:"PKR", value:`${(stats.revenue/1000).toFixed(1)}K`, color:"#f59e0b" },
            ].map((s,i) => (
              <div key={i} style={{ background:"#f8fafc", borderRadius:"10px", padding:"8px 6px", textAlign:"center", border: "1px solid #f1f5f9" }}>
                <div style={{ fontSize:"14px", fontWeight:900, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:"9px", color:"#94a3b8", fontWeight:700, textTransform:"uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search + filter */}
          <div style={{ position:"relative", marginBottom:"10px" }}>
            <Search size={14} style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search ID or Customer…" style={{ width:"100%", height:"38px", borderRadius:"10px", border:"1px solid #e2e8f0", paddingLeft:"34px", paddingRight:"10px", fontSize:"12px", background:"#f8fafc", color:"#0f172a", outline:"none", boxSizing:"border-box" }}/>
          </div>
          <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
            {["all","pending","preparing","dispatched","delivered"].map(s => (
              <button key={s} onClick={()=>setFilter(s)} style={{ padding:"5px 10px", borderRadius:"8px", border:"none", fontSize:"10px", fontWeight:700, cursor:"pointer", background: filter===s?"#1e293b":"#f1f5f9", color: filter===s?"white":"#64748b", transition:"all 0.2s" }}>
                {s==="all"?"All":STATUS_CFG[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* Order List */}
        <div style={{ flex:1, overflowY:"auto", padding:"12px", background: "#fcfcfd" }}>
          {filtered.map(order => {
            const cfg = STATUS_CFG[order.status];
            const isActive = selected.id === order.id;
            return (
              <div key={order.id} onClick={()=>setSelected(order)} style={{ padding:"14px", borderRadius:"16px", marginBottom:"8px", cursor:"pointer", background: isActive?"white":"transparent", border:`1px solid ${isActive?"#e2e8f0":"transparent"}`, boxShadow: isActive ? "0 4px 6px -1px rgba(0, 0, 0, 0.05)" : "none", transition:"all 0.2s" }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"8px" }}>
                  <div>
                    <div style={{ fontSize:"13px", fontWeight:800, color:"#0f172a" }}>{order.customer}</div>
                    <div style={{ fontSize:"10px", color:"#94a3b8", fontFamily:"monospace", marginTop:"1px" }}>#{order.id}</div>
                  </div>
                  <span style={{ padding:"3px 8px", borderRadius:"20px", background:cfg.bg, color:cfg.color, fontSize:"9px", fontWeight:800, border:`1px solid ${cfg.color}22` }}>{cfg.label}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"10px" }}>
                  <MapPin size={11} color="#94a3b8"/>
                  <span style={{ fontSize:"11px", color:"#64748b" }}>{order.address}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:"14px", fontWeight:900, color:"#0f172a" }}>{order.total} <span style={{ fontSize:"10px", color:"#94a3b8" }}>PKR</span></span>
                  <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    {order.eta > 0 && (
                      <span style={{ fontSize:"10px", color:"#f59e0b", fontWeight:800, display:"flex", alignItems:"center", gap:"4px" }}><Clock size={11}/> {order.eta}m</span>
                    )}
                    {["pending","preparing","dispatched"].includes(order.status) && (
                      <button onClick={e=>{e.stopPropagation();advanceStatus(order.id)}} style={{ padding:"5px 10px", borderRadius:"8px", border:"none", background:"#1e293b", color:"white", fontSize:"10px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:"4px" }}>
                        Update <ChevronRight size={11}/>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CENTER MAP ── */}
      <div style={{ flex:1, position:"relative", padding: "16px" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "32px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)" }}>
            <LeafletMap 
            restaurantPos={RESTAURANT}
            customerPos={selected.destLat ? [selected.destLat, selected.destLng!] : RESTAURANT}
            riderPos={selected.status === "dispatched" ? riderPos : undefined}
            route={route}
            height="100%"
            />
        </div>

        {/* Map overlay: selected order info */}
        <div style={{ position:"absolute", top:"32px", left:"32px", background:"white", borderRadius:"24px", padding:"20px", border:"1px solid #e2e8f0", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)", minWidth:"280px", zIndex: 1000 }}>
          <div style={{ fontSize:"11px", fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"12px" }}>Tracking Order</div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "16px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={24} color="#1e293b" />
            </div>
            <div>
                <div style={{ fontSize:"16px", fontWeight:900, color:"#0f172a" }}>{selected.customer}</div>
                <div style={{ fontSize:"12px", color:"#64748b", display:"flex", alignItems:"center", gap:"4px", marginTop: "2px" }}><MapPin size={11}/> {selected.address}</div>
            </div>
          </div>
          <div style={{ marginTop: "16px", padding: "12px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b" }}>Status</span>
                <span style={{ padding:"4px 10px", borderRadius:"20px", background:STATUS_CFG[selected.status].bg, color:STATUS_CFG[selected.status].color, fontSize:"11px", fontWeight:800 }}>
                {STATUS_CFG[selected.status].label}
                </span>
            </div>
            {selected.eta > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b" }}>Est. Arrival</span>
                    <span style={{ fontSize:"12px", color:"#f59e0b", fontWeight:800 }}>{selected.eta} mins</span>
                </div>
            )}
          </div>
        </div>

        {/* Rider detail bottom card */}
        {selected.rider && selected.status === "dispatched" && (
          <div style={{ position:"absolute", bottom:"48px", left:"50%", transform:"translateX(-50%)", background:"white", borderRadius:"28px", padding:"16px 24px", border:"1px solid #e2e8f0", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)", display:"flex", alignItems:"center", gap:"20px", minWidth:"400px", zIndex: 1000 }}>
            <div style={{ width:"56px", height:"56px", borderRadius:"18px", overflow: "hidden", border: "3px solid #f1f5f9" }}>
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" alt="Rider" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"15px", fontWeight:900, color:"#0f172a" }}>{selected.rider}</div>
              <div style={{ display:"flex", alignItems: "center", gap:"8px", marginTop: "2px" }}>
                <div style={{ display: "flex", gap: "2px" }}>{[1,2,3,4,5].map(i=><Star key={i} size={11} fill="#f59e0b" stroke="none"/>)}</div>
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>4.9 (240+)</span>
              </div>
              <div style={{ fontSize:"12px", color:"#64748b", marginTop: "2px", fontWeight: 600 }}>{selected.riderPhone}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:"14px", color:"#f59e0b", fontWeight:900, marginBottom: "8px" }}>{selected.eta} mins left</div>
              <a href={`tel:${selected.riderPhone}`} style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"8px 16px", borderRadius:"12px", background:"#10b981", color:"white", fontSize:"12px", fontWeight:800, textDecoration:"none", boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)" }}>
                <Phone size={14}/> Call Rider
              </a>
            </div>
          </div>
        )}

        {/* Legend */}
        <div style={{ position:"absolute", bottom:"32px", right:"32px", background:"white", borderRadius:"20px", padding:"16px", border:"1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)", zIndex: 1000 }}>
          <div style={{ fontSize: "10px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Map Legend</div>
          {[["🍔","Restaurant"],["🛵","Rider"],["📍","Destination"]].map(([icon,label])=>(
            <div key={label} style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px" }}>
              <span style={{ fontSize:"16px" }}>{icon}</span>
              <span style={{ fontSize:"12px", color:"#64748b", fontWeight:700 }}>{label}</span>
            </div>
          ))}
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{ width:"20px", height:"4px", background:"#6366f1", borderRadius:"2px" }}/>
            <span style={{ fontSize:"12px", color:"#64748b", fontWeight:700 }}>Live Route</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes ping { 0%{box-shadow:0 0 0 0 rgba(99,102,241,0.4)} 100%{box-shadow:0 0 0 24px rgba(99,102,241,0)} }
      `}</style>
    </div>
  );
}
