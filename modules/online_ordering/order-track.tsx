"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  MessageCircle, 
  ChevronLeft,
  Utensils,
  Truck,
  PackageCheck
} from "lucide-react";
import Link from "next/link";

export function OrderTrackPage({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState<"confirmed" | "preparing" | "dispatched" | "delivered">("preparing");

  // Mock status updates
  useEffect(() => {
    const timers = [
      setTimeout(() => setStatus("preparing"), 2000),
      setTimeout(() => setStatus("dispatched"), 10000),
      setTimeout(() => setStatus("delivered"), 20000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const steps = [
    { key: "confirmed", label: "Order Confirmed", time: "10:30 AM", icon: <CheckCircle2 size={24} /> },
    { key: "preparing", label: "Being Prepared", time: "10:35 AM", icon: <Utensils size={24} /> },
    { key: "dispatched", label: "Out for Delivery", time: "10:50 AM", icon: <Truck size={24} /> },
    { key: "delivered", label: "Delivered", time: "11:10 AM", icon: <PackageCheck size={24} /> },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === status);

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-black font-sans selection:bg-black selection:text-white">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between bg-white border-b border-[#EBEBF0] sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 font-black text-lg hover:opacity-70 transition-all">
          <ChevronLeft size={24} />
          Back to Menu
        </Link>
        <span className="font-black text-sm uppercase tracking-widest text-[#a0a8b2]">Order Tracking</span>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <main className="max-w-[480px] mx-auto px-6 py-10">
        {/* Progress Card */}
        <div className="bg-white rounded-[40px] p-10 card-shadow border border-[#EBEBF0] mb-8 text-center">
           <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-[#F5F6FA] flex items-center justify-center">
                 <div className="text-4xl font-black text-black">
                   {status === "delivered" ? "✅" : "🍔"}
                 </div>
              </div>
              {/* Circular progress highlight */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle 
                  cx="64" cy="64" r="60" 
                  fill="none" 
                  stroke="#a855f7" 
                  strokeWidth="8" 
                  strokeDasharray="376.8" 
                  style={{ strokeDashoffset: 376.8 - (376.8 * (currentStepIndex + 1) / steps.length), transition: "stroke-dashoffset 1s ease-in-out" }}
                />
              </svg>
           </div>

           <h2 className="text-3xl font-black mb-2 leading-tight">
              {steps[currentStepIndex].label}
           </h2>
           <p className="text-[#a0a8b2] font-semibold text-sm mb-6">Order #{orderId}</p>
           
           <div className="flex items-center justify-center gap-2 px-6 py-3 bg-[#fde8f3] text-[#f472b6] rounded-2xl w-fit mx-auto font-black text-sm shadow-sm">
              <Clock size={18} /> 45 - 55 MINS
           </div>
        </div>

        {/* Status Steps */}
        <div className="space-y-6 relative mb-10">
           {/* Connector line */}
           <div className="absolute left-7 top-8 bottom-8 w-1 bg-[#F5F6FA]" />
           <div 
             className="absolute left-7 top-8 w-1 bg-[#1a1a2e] origin-top transition-all duration-1000" 
             style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }} 
           />

           {steps.map((step, idx) => {
             const isCompleted = idx <= currentStepIndex;
             const isCurrent = idx === currentStepIndex;
             
             return (
               <div key={idx} className="flex gap-6 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 scale-in ${
                    isCompleted ? "bg-[#1a1a2e] border-[#1a1a2e] text-white shadow-xl shadow-[#1a1a2e]/20" : "bg-white border-[#F5F6FA] text-[#C5C8D0]"
                  }`}>
                    {step.icon}
                  </div>
                  <div className="flex-1 pt-1">
                     <h4 className={`text-base font-black leading-none ${isCompleted ? 'text-black' : 'text-[#a8abb6]'}`}>
                        {step.label}
                     </h4>
                     <p className={`text-[12px] font-bold mt-1 ${isCompleted ? 'text-[#a0a8b2]' : 'text-transparent'}`}>
                        {step.time}
                     </p>
                  </div>
                  {isCurrent && (
                     <div className="w-2 h-2 bg-[#f472b6] rounded-full animate-ping mt-3 shadow-lg shadow-pink-500" />
                  )}
               </div>
             );
           })}
        </div>

        {/* Map & Rider Mock */}
        <div className="bg-[#1a1a2e] rounded-[36px] overflow-hidden shadow-2xl relative order-track-hero mb-8">
           <div className="h-[240px] bg-sky-100 relative opacity-40">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&auto=format&fit=crop" className="w-full h-full object-cover" alt="Map Mock" />
           </div>
           
           <div className="absolute inset-x-0 bottom-0 p-8 flex items-center justify-between text-white backdrop-blur-md bg-black/40">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-2xl border-2 border-white/20 overflow-hidden shadow-xl">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&auto=format&fit=crop" className="w-full h-full object-cover" alt="Rider" />
                 </div>
                 <div>
                    <h4 className="text-sm font-black tracking-tight leading-none mb-1">Ahmed Ali</h4>
                    <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Your Rider</p>
                 </div>
              </div>
              <button className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/20 transition-all hover:scale-110 active:scale-95">
                 <MessageCircle size={24} strokeWidth={2.5} />
              </button>
           </div>
        </div>

        {/* WhatsApp Notification Opt-in */}
        <div className="bg-white rounded-[28px] p-6 border border-[#EBEBF0] flex items-center justify-between gap-4 card-shadow">
           <div className="flex-1">
              <h4 className="text-sm font-black mb-0.5">WhatsApp Updates</h4>
              <p className="text-[11px] font-bold text-[#a0a8b2] leading-tight pr-4">Receive real-time order notifications on WhatsApp.</p>
           </div>
           <div className="flex-shrink-0 relative w-12 h-6 bg-[#F5F6FA] rounded-full border border-[#EBEBF0] overflow-hidden p-1 cursor-pointer">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm translate-x-6 transition-transform" />
           </div>
        </div>
      </main>

      <style jsx global>{`
        .card-shadow {
           box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
        }
        @keyframes scaleIn {
           0% { transform: scale(0.9); opacity: 0; }
           100% { transform: scale(1); opacity: 1; }
        }
        .scale-in {
           animation: scaleIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
