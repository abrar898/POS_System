"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Truck, Clock, CheckCircle2, MapPin, Phone, Search, X, Package, Bike, TrendingUp, AlertCircle, Eye, ChevronRight, Star, Navigation, RefreshCw, Menu, Loader2 } from "lucide-react";
import { getRoute } from "@/lib/routing";
import { api } from "@/lib/api";

const GoogleMap = dynamic(() => import("@/components/google-map"), { ssr: false });

const RESTAURANT: [number, number] = [33.6844, 73.0479];

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:   { label:"Pending",   color:"#f59e0b", bg:"#fef3c7", border: "#f59e0b22" },
  preparing: { label:"Preparing", color:"#6366f1", bg:"#e0e7ff", border: "#6366f122" },
  dispatched:{ label:"On the Way",color:"#0ea5e9", bg:"#e0f2fe", border: "#0ea5e922" },
  delivered: { label:"Delivered", color:"#10b981", bg:"#d1fae5", border: "#10b98122" },
  cancelled: { label:"Cancelled", color:"#ef4444", bg:"#fee2e2", border: "#ef444422" },
};

export function DeliveryDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [riderPos, setRiderPos] = useState<[number, number]>(RESTAURANT);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await api.orders.getAll();
      const deliveryOrders = data.filter((o: any) => o.type === "delivery");
      setOrders(deliveryOrders);
      if (deliveryOrders.length > 0 && !selected) {
        setSelected(deliveryOrders[0]);
      }
    } catch (err) {
      console.error("Failed to fetch delivery orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Fetch route when selected order changes
  useEffect(() => {
    async function updateRoute() {
      if (!selected) return;
      
      // Using some mock coordinates based on order ID if real ones aren't in DB yet
      const destLat = selected.destLat || 33.6844 + (Math.random() - 0.5) * 0.05;
      const destLng = selected.destLng || 73.0479 + (Math.random() - 0.5) * 0.05;
      const riderLat = selected.riderLat || 33.6844;
      const riderLng = selected.riderLng || 73.0479;

      if (selected.status === "dispatched") {
        const start: [number, number] = [riderLat, riderLng];
        const end: [number, number] = [destLat, destLng];
        const newRoute = await getRoute(start, end);
        setRoute(newRoute);
      } else {
         const newRoute = await getRoute(RESTAURANT, [destLat, destLng]);
         setRoute(newRoute);
      }
    }
    updateRoute();
  }, [selected]);

  // Animate rider marker
  useEffect(() => {
    if (!selected || selected.status !== "dispatched" || route.length === 0) {
      setRiderPos(RESTAURANT);
      return;
    }
    
    if (animRef.current) clearInterval(animRef.current);

    let pointIndex = 0;
    animRef.current = setInterval(() => {
      if (pointIndex < route.length) {
        setRiderPos(route[pointIndex]);
        pointIndex++;
      } else {
        if (animRef.current) clearInterval(animRef.current);
      }
    }, 100);

    return () => { if (animRef.current) clearInterval(animRef.current); };
  }, [selected, route]);

  const advanceStatus = async (id: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    const nxt: Record<string, string> = { pending:"preparing", preparing:"dispatched", dispatched:"delivered" };
    const nextStatus = nxt[order.status] || order.status;
    
    try {
      await api.orders.update(id, { status: nextStatus });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Update failed");
    }
  };

  const stats = {
    total: orders.length,
    dispatched: orders.filter(o => o.status === "dispatched").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    revenue: orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + (o.total_price || 0), 0),
  };

  const filtered = orders.filter(o =>
    (filter === "all" || o.status === filter) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) || (o.customer_name || "").toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-slate-900" /></div>;

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-50 overflow-hidden text-slate-800 font-sans">
      
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-[1001] p-3 bg-white rounded-xl shadow-lg border border-gray-200"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ── LEFT PANEL ── */}
      <aside className={`fixed inset-y-0 left-0 z-[1000] w-full sm:w-[340px] bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 pb-4 border-b border-gray-100 mt-12 md:mt-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <Truck size={18} className="text-white"/>
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">Delivery Control</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">LIVE TRACKING</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {[
              { label:"Orders", value:stats.total, color:"text-indigo-500" },
              { label:"Active", value:stats.dispatched, color:"text-sky-500" },
              { label:"Done", value:stats.delivered, color:"text-emerald-500" },
              { label:"PKR", value:`${(stats.revenue/1000).toFixed(1)}K`, color:"text-amber-500" },
            ].map((s,i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
                <div className={`text-sm font-black ${s.color}`}>{s.value}</div>
                <div className="text-[8px] text-slate-400 font-bold uppercase">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input 
              value={search} 
              onChange={e=>setSearch(e.target.value)} 
              placeholder="Search ID or Customer…" 
              className="w-full h-9 rounded-lg border border-gray-200 pl-9 pr-3 text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-900/5"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["all","pending","preparing","dispatched","delivered"].map(s => (
              <button 
                key={s} 
                onClick={()=>setFilter(s)} 
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${filter===s ? "bg-slate-900 text-white" : "bg-gray-100 text-slate-500 hover:bg-gray-200"}`}
              >
                {s==="all"?"All":STATUS_CFG[s].label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50/50">
          {filtered.map(order => {
            const cfg = STATUS_CFG[order.status] || STATUS_CFG.pending;
            const isActive = selected?.id === order.id;
            return (
              <div 
                key={order.id} 
                onClick={()=>{setSelected(order); if(window.innerWidth < 768) setIsSidebarOpen(false)}} 
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${isActive ? "bg-white border-gray-200 shadow-md" : "bg-transparent border-transparent hover:bg-white/50"}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-[13px] font-black text-slate-900">{order.customer_name || "Unknown"}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">#{(order.id || order._id || '000000').toString().slice(-6)}</div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-[9px] font-black border" style={{ backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.border }}>{cfg.label}</span>
                </div>
                <div className="flex items-center gap-1.5 mb-3">
                  <MapPin size={11} className="text-slate-400"/>
                  <span className="text-[11px] text-slate-500 truncate">{order.address || "DHA Islamabad"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900">{order.total_price} <span className="text-[10px] text-slate-400 font-bold">PKR</span></span>
                  <div className="flex items-center gap-2">
                    {order.status === "dispatched" && (
                      <span className="text-[10px] text-amber-600 font-black flex items-center gap-1"><Clock size={11}/> 15m</span>
                    )}
                    {["pending","preparing","dispatched"].includes(order.status) && (
                      <button 
                        onClick={e=>{e.stopPropagation();advanceStatus(order.id)}} 
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm hover:scale-105 active:scale-95 transition-transform"
                      >
                        Update <ChevronRight size={11}/>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div className="py-10 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">No orders found</div>}
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 relative p-4 md:p-6 overflow-hidden">
        <div className="w-full h-full rounded-[24px] md:rounded-[32px] overflow-hidden border border-gray-200 shadow-2xl relative">
            {selected ? (
              <>
                <GoogleMap 
                  restaurantPos={RESTAURANT}
                  customerPos={selected.destLat ? [selected.destLat, selected.destLng!] : RESTAURANT}
                  riderPos={selected.status === "dispatched" ? riderPos : undefined}
                  route={route}
                  height="100%"
                />

                {/* Map overlay: selected order info */}
                <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-white/95 backdrop-blur rounded-[20px] md:rounded-[24px] p-4 md:p-5 border border-gray-200 shadow-xl min-w-[240px] md:min-w-[280px] z-[900]">
                  <div className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Tracking Order</div>
                  <div className="flex gap-3 md:gap-4 items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-16 bg-slate-100 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
                    </div>
                    <div className="overflow-hidden">
                        <div className="text-sm md:text-base font-black text-slate-900 truncate">{selected.customer_name || "Guest"}</div>
                        <div className="text-[11px] md:text-[12px] text-slate-500 flex items-center gap-1 mt-0.5 truncate"><MapPin size={11}/> {selected.address || "Main Blvd, Islamabad"}</div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] md:text-[12px] font-bold text-slate-400 uppercase">Status</span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] md:text-[11px] font-black border" style={{ backgroundColor: (STATUS_CFG[selected.status] || STATUS_CFG.pending).bg, color: (STATUS_CFG[selected.status] || STATUS_CFG.pending).color, borderColor: (STATUS_CFG[selected.status] || STATUS_CFG.pending).border }}>
                          {(STATUS_CFG[selected.status] || STATUS_CFG.pending).label}
                        </span>
                    </div>
                  </div>
                </div>

                {/* Rider detail card (Mocked for now as we don't have rider assignment in DB yet) */}
                {selected.status === "dispatched" && (
                  <div className="absolute bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 bg-white/95 backdrop-blur rounded-[24px] md:rounded-[28px] p-4 md:p-6 border border-gray-200 shadow-2xl flex flex-col md:flex-row items-center gap-4 md:gap-5 md:min-w-[440px] z-[900]">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-18 overflow-hidden border-2 border-slate-100 shrink-0">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" alt="Rider" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm md:text-[15px] font-black text-slate-900 truncate">Rider Assigned</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex gap-0.5">{[1,2,3,4,5].map(i=><Star key={i} size={10} className="fill-amber-500 text-transparent"/>)}</div>
                          <span className="text-[10px] text-slate-400 font-bold">4.9</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full md:w-auto md:flex-col md:items-end md:gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-5">
                      <div className="text-[13px] md:text-sm text-amber-600 font-black">15 mins left</div>
                      <button className="flex items-center gap-2 px-4 py-2 md:py-2.5 rounded-xl bg-emerald-500 text-white text-xs md:text-sm font-black shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-transform">
                        <Phone size={14}/> Call
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-slate-400">
                <Bike size={48} strokeWidth={1.5} className="mb-4 opacity-20"/>
                <p className="font-bold uppercase tracking-[0.2em] text-xs">Select an order to track</p>
              </div>
            )}

            {/* Legend */}
            <div className="hidden lg:block absolute bottom-8 right-8 bg-white/95 backdrop-blur rounded-[20px] p-5 border border-gray-200 shadow-xl min-w-[160px] z-[900]">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Map Legend</div>
              <div className="space-y-2.5">
                {[["🍔","Restaurant"],["🛵","Rider"],["📍","Destination"]].map(([icon,label])=>(
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-base">{icon}</span>
                    <span className="text-xs text-slate-600 font-bold">{label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-5 h-1 bg-indigo-500 rounded-full"/>
                  <span className="text-xs text-slate-600 font-bold">Live Route</span>
                </div>
              </div>
            </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  );
}
