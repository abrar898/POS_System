"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, MapPin, Navigation, Clock, Phone, Info, LayoutGrid, 
  Home, BarChart2, ShoppingBag, UtensilsCrossed, Settings, User, 
  ChevronDown, CheckCircle2, Bike, Package, ChefHat, Menu, X
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Colors from design.txt
const COLORS = {
  cream: "#FDEFDE",
  offWhite: "#FEFDFA",
  brandYellow: "#FECE04",
  midGray: "#737373",
  pureBlack: "#000000",
  successGreen: "#7ED957",
  deepMaroon: "#811920",
};

const GoogleMapComponent = dynamic(() => import("@/components/google-map"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-50 animate-pulse rounded-3xl" />
});

export function OrderTrackPage({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState<"placed" | "preparing" | "delivery" | "delivered">("preparing");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FEFDFA]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Navbar */}
      <nav className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white z-[60]">
        <div className="flex items-center gap-4 md:gap-12">
          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#811920] rounded-lg flex items-center justify-center transform rotate-12">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-xl md:text-2xl font-black italic tracking-tighter" style={{ color: COLORS.deepMaroon }}>Cheezious</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[15px] font-bold">
            <Link href="/home" className="text-gray-900 hover:text-[#811920] transition-colors">Home</Link>
            <Link href="/home" className="text-gray-900 hover:text-[#811920] transition-colors">Menu</Link>
            <Link href="#" className="text-[#811920] border-b-2 border-[#811920] pb-0.5">Track Order</Link>
            <Link href="/deals" className="text-gray-900 hover:text-[#811920] transition-colors">Deals</Link>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-700">
            <MapPin size={16} className="text-[#811920]" />
            <span className="max-w-[80px] truncate">Islamabad</span>
            <ChevronDown size={14} />
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <User size={18} className="text-[#811920]" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
            <Link href="/home" className="text-lg font-black text-gray-900">Home</Link>
            <Link href="/home" className="text-lg font-black text-gray-900">Menu</Link>
            <Link href="#" className="text-lg font-black text-[#811920]">Track Order</Link>
            <Link href="/deals" className="text-lg font-black text-gray-900">Deals</Link>
          </div>
        </div>
      )}

      {/* Tracking Content */}
      <div className="flex-1 max-w-[1000px] mx-auto w-full p-4 md:p-12 animate-in fade-in slide-in-from-bottom duration-500">
        
        {/* Sub Header / Back Button */}
        <div className="mb-6 md:mb-10">
          <Link href="/home" className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold transition-colors text-sm md:text-base">
            <ChevronLeft size={20} md:size={22} /> <span>Back to Menu</span>
          </Link>
        </div>

        {/* Order Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10 md:mb-16">
           <h1 className="text-3xl md:text-4xl font-black text-[#811920]">Order #{orderId || "CHZ-39403"}</h1>
           <div className="md:text-right">
             <p className="text-xs md:text-sm font-bold text-gray-400">Estimated Delivery Time</p>
             <p className="text-2xl md:text-3xl font-black text-[#811920]">30-40 min</p>
           </div>
        </div>

        {/* Horizontal Status Stepper */}
        <div className="relative mb-12 md:mb-20 px-2 md:px-0">
           <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 -z-10" />
           {/* Progress Line */}
           <div 
             className="absolute top-1/2 left-0 h-1 bg-[#FECE04] -translate-y-1/2 -z-10 transition-all duration-1000" 
             style={{ width: status === "placed" ? "0%" : status === "preparing" ? "33%" : status === "delivery" ? "66%" : "100%" }}
           />
           <div 
             className="absolute top-1/2 left-0 h-1 bg-[#7ED957] -translate-y-1/2 -z-10 transition-all duration-1000" 
             style={{ width: status === "placed" ? "0%" : "33%" }}
           />

           <div className="flex justify-between items-center">
              {/* Step 1: Placed */}
              <div className="flex flex-col items-center group relative">
                 <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#7ED957] flex items-center justify-center text-white shadow-lg border-2 md:border-4 border-white">
                    <CheckCircle2 size={20} md:size={28} />
                 </div>
                 <span className="absolute -bottom-6 text-[8px] md:text-xs font-bold text-gray-400 whitespace-nowrap">Placed</span>
              </div>
              {/* Step 2: Preparing */}
              <div className="flex flex-col items-center group relative">
                 <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg border-2 md:border-4 border-white transition-all ${["preparing", "delivery", "delivered"].includes(status) ? "bg-[#FECE04] text-black" : "bg-gray-100 text-gray-400"}`}>
                    <ChefHat size={20} md:size={28} />
                 </div>
                 <span className="absolute -bottom-6 text-[8px] md:text-xs font-bold text-gray-400 whitespace-nowrap">Preparing</span>
              </div>
              {/* Step 3: Delivery */}
              <div className="flex flex-col items-center group relative">
                 <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg border-2 md:border-4 border-white transition-all ${["delivery", "delivered"].includes(status) ? "bg-[#FECE04] text-black" : "bg-gray-400 text-white"}`}>
                    <Bike size={20} md:size={28} />
                 </div>
                 <span className="absolute -bottom-6 text-[8px] md:text-xs font-bold text-gray-400 whitespace-nowrap">On the way</span>
              </div>
              {/* Step 4: Delivered */}
              <div className="flex flex-col items-center group relative">
                 <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg border-2 md:border-4 border-white transition-all ${status === "delivered" ? "bg-[#7ED957] text-white" : "bg-gray-400 text-white"}`}>
                    <Package size={20} md:size={28} />
                 </div>
                 <span className="absolute -bottom-6 text-[8px] md:text-xs font-bold text-gray-400 whitespace-nowrap">Delivered</span>
              </div>
           </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12 mt-8">
           {/* Rider Card */}
           <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between min-h-[180px] md:min-h-[220px]">
              <div className="flex items-center gap-4 md:gap-6">
                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-blue-100 shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" 
                      alt="Rider Ali" 
                      className="w-full h-full object-cover"
                    />
                 </div>
                 <div>
                   <p className="text-xs md:text-sm font-bold text-gray-400">Rider Details</p>
                   <p className="text-xl md:text-2xl font-black text-gray-900">Ali</p>
                 </div>
              </div>
              <div className="flex justify-end mt-4 md:mt-0">
                <button className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-all shadow-sm">
                   <Phone size={20} md:size={24} className="fill-current" />
                </button>
              </div>
           </div>

           {/* Map Card */}
           <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden border border-gray-100 shadow-xl shadow-gray-100/50 min-h-[220px]">
              <div className="w-full h-full bg-blue-50 relative min-h-[200px]">
                 <img 
                   src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&h=400&fit=crop" 
                   alt="Location Map" 
                   className="w-full h-full object-cover opacity-60"
                 />
                 {/* Mock route line */}
                 <div className="absolute top-1/2 left-1/4 right-1/4 h-1 md:h-1.5 bg-[#FECE04] rounded-full transform -rotate-12 blur-[1px]" />
                 <div className="absolute top-[45%] left-1/4 w-3 h-3 md:w-4 md:h-4 bg-white border-2 md:border-4 border-[#811920] rounded-full shadow-lg" />
                 <div className="absolute top-[55%] right-1/4 w-3 h-3 md:w-4 md:h-4 bg-white border-2 md:border-4 border-[#7ED957] rounded-full shadow-lg" />
              </div>
           </div>
        </div>

        {/* Status Message Box */}
        <div className="bg-white rounded-[24px] p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
           <div>
             <p className="font-black text-gray-900 text-base md:text-lg mb-1">Your order is being prepared.</p>
             <p className="text-xs md:text-sm font-bold text-gray-500">Our team may call you to ask for further details.</p>
           </div>
           <div className="md:text-right shrink-0">
             <p className="text-xs md:text-sm font-black text-gray-400">12:50 PM</p>
           </div>
        </div>

        {/* Bottom Logo / Branding */}
        <div className="mt-12 md:mt-20 flex justify-center opacity-10">
           <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#811920] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="text-xl font-black italic tracking-tighter" style={{ color: COLORS.deepMaroon }}>Cheezious</span>
          </div>
        </div>

      </div>
    </div>
  );
}
