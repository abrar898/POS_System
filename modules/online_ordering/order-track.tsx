"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, MapPin, Navigation, Clock, Phone, Info, LayoutGrid, Home, BarChart2, ShoppingBag, UtensilsCrossed, Settings } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getRoute } from "@/lib/routing";

const GoogleMapComponent = dynamic(() => import("@/components/google-map"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-50 animate-pulse" />
});

export function OrderTrackPage({ orderId }: { orderId: string }) {
  const [activeSidebar, setActiveSidebar] = useState("track");
  const [eta, setEta] = useState(20);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [riderPos, setRiderPos] = useState<[number, number]>([33.6844, 73.0479]);

  useEffect(() => {
    async function updateRoute() {
      const r = await getRoute([33.6844, 73.0479], [33.6950, 73.0600]); // Restaurant to Customer
      setRoute(r);
    }
    updateRoute();
  }, []);

  // Animate rider along the route
  useEffect(() => {
    if (route.length > 0) {
      let idx = 0;
      const interval = setInterval(() => {
        if (idx < route.length) {
          setRiderPos(route[idx]);
          idx++;
        } else {
          clearInterval(interval);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [route]);

  useEffect(() => {
    if (eta > 0) {
      const t = setInterval(() => setEta(p => Math.max(0, p - 1)), 30000);
      return () => clearInterval(t);
    }
  }, [eta]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-['Outfit'] select-none">
      {/* Left Sidebar */}
      <aside className="flex flex-col items-center shrink-0" style={{ width: "72px", background: "#fff", paddingTop: "20px", paddingBottom: "20px", borderRight: "1px solid #E8E8E8" }}>
        <div className="flex items-center justify-center rounded-xl mb-6 shadow-sm" style={{ width: "40px", height: "40px", background: "#1C1C2E" }}>
          <LayoutGrid size={18} color="white" strokeWidth={2} />
        </div>
        <div className="flex flex-col items-center gap-3 flex-1 w-full px-2">
          {[
            { id: "home", icon: <Home size={20} strokeWidth={2} />, href: "/online/royal-burger?tab=home" },
            { id: "stats", icon: <BarChart2 size={20} strokeWidth={2} />, href: "/online/royal-burger?tab=stats" },
            { id: "bag", icon: <ShoppingBag size={20} strokeWidth={2} />, href: "/online/royal-burger?tab=bag" },
            { id: "menu", icon: <UtensilsCrossed size={20} strokeWidth={2} />, href: "/online/royal-burger?tab=menu" },
            { id: "track", icon: <MapPin size={20} strokeWidth={2} />, href: "#" },
          ].map((item) => (
            <Link 
              href={item.href} 
              key={item.id} 
              onClick={() => setActiveSidebar(item.id)}
              className="flex items-center justify-center rounded-[12px] transition-all w-full relative" 
              style={{ 
                height: "44px", 
                color: activeSidebar === item.id ? "white" : "#9CA3AF", 
                background: activeSidebar === item.id ? "#1C1C2E" : "transparent" 
              }}
            >
              {item.icon}
            </Link>
          ))}
        </div>
        <button className="flex items-center justify-center rounded-xl w-full mx-2" style={{ height: "44px", color: "#9CA3AF" }}>
          <Settings size={20} strokeWidth={2} />
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between bg-white px-4 md:px-8 py-4 border-b border-slate-200 shrink-0 z-10 shadow-sm">
          <Link href="/online/royal-burger" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors">
            <ChevronLeft size={22} /> <span className="hidden sm:inline">Return</span>
          </Link>
          <div className="text-center flex-1">
            <span className="block text-lg font-black text-slate-900 tracking-tight">Live Tracking</span>
            <span className="block text-xs font-bold text-slate-500">Order #{orderId}</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <Info size={20} />
          </button>
        </header>

        {/* Main Map Content */}
        <main className="flex-1 relative flex flex-col md:flex-row">
          
          {/* Map Area */}
          <div className="flex-1 relative z-0 min-h-[400px]">
            <GoogleMapComponent 
              restaurantPos={[33.6844, 73.0479]}
              customerPos={[33.6950, 73.0600]}
              riderPos={riderPos}
              route={route}
              height="100%"
              zoom={15}
            />
            
            {/* Live indicator floating on map */}
            <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-emerald-100 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-emerald-600">Live</span>
            </div>
          </div>

          {/* Floating/Side Panel for Rider Time & Location */}
          <div className="w-full md:w-[400px] shrink-0 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.08)] md:shadow-[-10px_0_40px_rgba(0,0,0,0.08)] rounded-t-[32px] md:rounded-none flex flex-col z-10 relative">
            
            {/* Mobile Drag Handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-2 md:hidden" />

            <div className="p-6 md:p-8 flex-1 overflow-y-auto">
              {/* ETA Section */}
              <div className="bg-slate-50 rounded-[24px] p-6 border border-slate-100 mb-6 text-center shadow-sm">
                <Clock size={32} className="text-amber-500 mx-auto mb-3" />
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Estimated Arrival</div>
                <div className="text-4xl font-black text-slate-900">{eta} <span className="text-xl text-slate-500">mins</span></div>
              </div>

              {/* Location Details */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <Navigation size={22} className="text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Rider Location</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">Moving on GT Road</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <MapPin size={22} className="text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Delivery Address</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5 truncate">Military College of Signals</div>
                  </div>
                </div>
              </div>

              {/* Contact Rider Button */}
              <a href="tel:+923124455667" className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-[20px] p-4 flex items-center justify-center gap-3 transition-colors shadow-lg active:scale-[0.98]">
                <Phone size={20} />
                <span className="font-bold text-[15px]">Contact Rider</span>
              </a>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
