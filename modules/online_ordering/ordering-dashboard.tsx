"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  Home,
  BarChart2,
  ShoppingBag,
  UtensilsCrossed,
  Settings,
  Search,
  Bell,
  Plus,
  Star,
  Heart,
  User,
  Ticket,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "bakery",
    name: "Bakery",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <path d="M8 36 C8 36 8 20 24 20 C40 20 40 36 40 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M4 36 H44" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M12 36 V42 H36 V36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 28 C16 28 18 24 24 24 C30 24 32 28 32 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M20 36 V30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M28 36 V30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "seafood",
    name: "Seafood",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <path d="M6 24 C6 24 14 10 24 10 L38 10 L38 14 C38 14 30 14 28 16 C32 16 36 20 36 24 C36 28 32 32 28 32 C30 34 38 34 38 34 L38 38 L24 38 C14 38 6 24 6 24Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="32" cy="16" r="2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: "pizza",
    name: "Pizza",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="3"/>
        <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M24 6 L24 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M6 24 L42 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="18" cy="18" r="2.5" fill="currentColor"/>
        <circle cx="30" cy="30" r="2.5" fill="currentColor"/>
        <circle cx="30" cy="18" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: "chicken",
    name: "Chicken",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <path d="M22 8 C22 8 28 6 32 10 C36 14 34 20 30 22 L36 36 C36 36 38 40 34 42 C30 44 28 40 28 40 L20 22 C16 20 12 16 14 10 C16 4 22 8 22 8Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M30 22 C32 26 34 30 36 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="32" cy="10" r="3" stroke="currentColor" strokeWidth="2.5"/>
      </svg>
    ),
  },
  {
    id: "beverages",
    name: "Beverages",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="12" y="16" width="24" height="26" rx="4" stroke="currentColor" strokeWidth="3"/>
        <path d="M36 22 L40 22 C42 22 44 24 44 26 C44 28 42 30 40 30 L36 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M16 8 L16 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M24 6 L24 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M32 8 L32 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "burgers",
    name: "Burgers",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <path d="M8 18 C8 12 14 8 24 8 C34 8 40 12 40 18 Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="8" y="18" width="32" height="6" rx="0" stroke="currentColor" strokeWidth="2.5"/>
        <rect x="8" y="24" width="32" height="6" rx="0" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M8 30 L8 34 C8 36 10 38 12 38 L36 38 C38 38 40 36 40 34 L40 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const DISHES = [
  {
    id: "d1",
    name: "Fish Burger",
    price: 350,
    rating: 4,
    liked: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  },
  {
    id: "d2",
    name: "Beef Burger",
    price: 550,
    rating: 4,
    liked: false,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
  },
  {
    id: "d3",
    name: "Chicken Burger",
    price: 250,
    rating: 4,
    liked: false,
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop",
  },
  {
    id: "d4",
    name: "Cheese Burger",
    price: 550,
    rating: 4,
    liked: false,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
  },
];

const RECENT_ORDERS = [
  { id: "r1", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop" },
  { id: "r2", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop" },
  { id: "r3", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop" },
];

const CART_ITEMS = [
  {
    id: "c1",
    name: "Cheese Burger",
    qty: 1,
    price: 250,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop",
  },
  {
    id: "c2",
    name: "Chicken Burger",
    qty: 1,
    price: 350,
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=200&h=200&fit=crop",
  },
];

export function OnlineOrderingDashboard() {
  const [activeSidebar, setActiveSidebar] = useState("home");
  const [liked, setLiked] = useState<Record<string, boolean>>({ d1: true });

  return (
    <div
      className="flex h-screen w-screen overflow-hidden select-none"
      style={{ background: "#EFEFEF", fontFamily: "'Inter', 'SF Pro Display', sans-serif" }}
    >
      {/* ── Left Sidebar ─────────────────────────────── */}
      <aside
        className="flex flex-col items-center shrink-0"
        style={{ width: "72px", background: "#FFFFFF", paddingTop: "24px", paddingBottom: "24px", gap: 0, borderRight: "1px solid #E8E8E8" }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-center rounded-xl mb-6 shadow-sm"
          style={{ width: "40px", height: "40px", background: "#1C1C2E" }}
        >
          <LayoutGrid size={18} color="white" strokeWidth={2} />
        </div>

        {/* Top dots */}
        <div className="flex gap-[4px] mb-4">
          {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "#A78BFA" }} />)}
        </div>

        {/* Nav */}
        <div className="flex flex-col items-center gap-3 flex-1 w-full px-2">
          {[
            { id: "home", icon: <Home size={20} strokeWidth={2} /> },
            { id: "stats", icon: <BarChart2 size={20} strokeWidth={2} /> },
            { id: "bag", icon: <ShoppingBag size={20} strokeWidth={2} /> },
            { id: "menu", icon: <UtensilsCrossed size={20} strokeWidth={2} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSidebar(item.id)}
              className="flex items-center justify-center rounded-[12px] transition-all w-full"
              style={{
                height: "44px",
                color: activeSidebar === item.id ? "white" : "#9CA3AF",
                background: activeSidebar === item.id ? "#1C1C2E" : "transparent",
              }}
            >
              {item.icon}
            </button>
          ))}
        </div>

        {/* Bottom dots */}
        <div className="flex gap-[4px] mb-4 mt-auto">
          {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "#A78BFA" }} />)}
        </div>

        {/* Settings */}
        <button
          className="flex items-center justify-center rounded-xl w-full mx-2"
          style={{ height: "44px", color: "#9CA3AF" }}
        >
          <Settings size={20} strokeWidth={2} />
        </button>
      </aside>

      {/* ── Main Content ─────────────────────────────── */}
      <main
        className="flex-1 flex flex-col overflow-hidden"
        style={{ padding: "18px 22px 14px", gap: "10px" }}
      >
        {/* Header */}
        <header className="flex justify-between items-center shrink-0">
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#111827", letterSpacing: "-0.5px" }}>Hello, Ethan</h1>
          <div className="relative">
            <Search
              size={16}
              style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}
            />
            <input
              type="text"
              className="outline-none border-none"
              style={{
                height: "40px",
                width: "300px",
                background: "#E0E0E0",
                borderRadius: "24px",
                paddingLeft: "42px",
                paddingRight: "16px",
                fontSize: "13px",
              }}
            />
          </div>
        </header>

        {/* Banner — food image */}
        <div
          className="shrink-0 rounded-[20px] w-full overflow-hidden relative"
          style={{ height: "105px" }}
        >
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&h=400&fit=crop&q=80"
            alt="Food Banner"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          />
          <div
            className="absolute inset-0 flex flex-col justify-center"
            style={{
              background: "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
              padding: "0 28px",
            }}
          >
            <span style={{ color: "white", fontSize: "18px", fontWeight: 900, lineHeight: 1.2, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
              Delicious Food
            </span>
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "10px", fontWeight: 600, marginTop: "3px" }}>
              Order fresh meals, delivered fast 🚀
            </span>
          </div>
        </div>


        {/* CATEGORY */}
        <section className="shrink-0 flex flex-col" style={{ gap: "10px" }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#111827" }}>Category</span>
            <div className="flex gap-1">
              {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#A78BFA" }} />)}
            </div>
          </div>
          <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(6,1fr)", height: "82px" }}>
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col items-center justify-center rounded-[18px] cursor-pointer transition-all group"
                style={{ background: "#E5E5E5", gap: "6px" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#1C1C2E")}
                onMouseLeave={e => (e.currentTarget.style.background = "#E5E5E5")}
              >
                <div style={{ color: "#1C1C2E" }} className="group-hover:[&>svg]:stroke-white">
                  {cat.icon}
                </div>
                <span style={{ fontSize: "10px", fontWeight: 600, color: "#6B7280" }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* POPULAR DISHES */}
        <section className="shrink-0 flex flex-col" style={{ gap: "10px" }}>
          <span style={{ fontSize: "16px", fontWeight: 800, color: "#111827" }}>Popular Dishes</span>
          <div className="grid grid-cols-4 gap-3" style={{ height: "138px" }}>
            {DISHES.map((dish) => (
              <div
                key={dish.id}
                className="relative flex flex-col rounded-[20px] overflow-hidden"
                style={{ background: "#E5E5E5", padding: "12px 12px 10px 12px" }}
              >
                {/* Heart */}
                <button
                  className="absolute z-10"
                  style={{ top: "12px", right: "12px" }}
                  onClick={() => setLiked(prev => ({ ...prev, [dish.id]: !prev[dish.id] }))}
                >
                  <Heart
                    size={14}
                    fill={liked[dish.id] ? "#EF4444" : "none"}
                    stroke={liked[dish.id] ? "#EF4444" : "#374151"}
                    strokeWidth={2}
                  />
                </button>

                {/* Image */}
                <div className="flex items-center justify-center" style={{ height: "68px" }}>
                  <img
                    src={dish.image}
                    alt={dish.name}
                    style={{ height: "100%", width: "100%", objectFit: "cover", borderRadius: "12px" }}
                  />
                </div>

                {/* Info */}
                <div style={{ marginTop: "auto", paddingTop: "6px" }}>
                  <div className="flex gap-[2px]">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star
                        key={i}
                        size={9}
                        fill={i <= dish.rating ? "#1C1C2E" : "none"}
                        stroke="#1C1C2E"
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: "10px", fontWeight: 800, color: "#111827" }}>{dish.name}</div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#374151" }}>{dish.price} PKR</div>
                </div>

                {/* Plus */}
                <button
                  className="absolute flex items-center justify-center rounded-[8px] transition-transform hover:scale-110"
                  style={{ bottom: "10px", right: "10px", width: "24px", height: "24px", background: "#1C1C2E" }}
                >
                  <Plus size={14} color="white" strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* RECENT ORDER */}
        <section className="flex flex-col flex-1 min-h-0" style={{ gap: "6px" }}>
          <span style={{ fontSize: "16px", fontWeight: 800, color: "#111827" }}>Recent Order</span>
          <div className="grid grid-cols-3 gap-3" style={{ flex: 1, minHeight: 0, height: "100%" }}>
            {RECENT_ORDERS.map((order) => (
              <div
                key={order.id}
                className="rounded-[18px] overflow-hidden"
                style={{ background: "#E5E5E5", minHeight: "80px" }}
              >
                <img
                  src={order.image}
                  alt="Recent Order"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Right Sidebar ────────────────────────────── */}
      <aside
        className="flex flex-col shrink-0 overflow-hidden"
        style={{ width: "280px", background: "#E5E5E5", padding: "28px 22px", gap: "16px", borderLeft: "1px solid #D8D8D8" }}
      >
        {/* Top row */}
        <div className="flex justify-between items-start shrink-0">
          <div className="flex flex-col" style={{ gap: "8px" }}>
            <div className="flex gap-1">
              {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "#A78BFA" }} />)}
            </div>
            <div className="flex items-center gap-3">
              <Bell size={20} style={{ color: "#374151", cursor: "pointer" }} strokeWidth={1.8} />
              <Settings size={20} style={{ color: "#374151", cursor: "pointer" }} strokeWidth={1.8} />
            </div>
          </div>
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{ width: "50px", height: "50px", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            <User size={26} style={{ color: "#1C1C2E" }} strokeWidth={1.8} />
          </div>
        </div>

        {/* Your Balance */}
        <div className="flex flex-col shrink-0" style={{ gap: "8px" }}>
          <span style={{ fontSize: "18px", fontWeight: 800, color: "#111827" }}>Your Balance</span>
          <div
            className="flex items-center rounded-[20px]"
            style={{ height: "88px", background: "#D0D0D0", padding: "16px" }}
          >
            <div
              className="flex flex-col justify-center rounded-[16px]"
              style={{ background: "white", padding: "10px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}
            >
              <span style={{ fontSize: "8px", color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Balance</span>
              <span style={{ fontSize: "16px", fontWeight: 900, color: "#111827" }}>250 PKR</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col shrink-0" style={{ gap: "6px" }}>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: "10px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Your Address</span>
            <button
              className="rounded-[8px]"
              style={{ padding: "4px 12px", background: "#D0D0D0", fontSize: "10px", fontWeight: 700, color: "#374151" }}
            >
              Change
            </button>
          </div>
          <p style={{ fontSize: "10px", fontWeight: 500, color: "#374151", lineHeight: 1.6 }}>
            Military College of Signals, Lalkurti,<br/>Gate 6, Near NUML
          </p>
          <div className="flex gap-2">
            <button className="rounded-[10px]" style={{ padding: "6px 14px", background: "#D0D0D0", fontSize: "10px", fontWeight: 700, color: "#374151" }}>Add Details</button>
            <button className="rounded-[10px]" style={{ padding: "6px 14px", background: "#D0D0D0", fontSize: "10px", fontWeight: 700, color: "#374151" }}>Add Notes</button>
          </div>
        </div>

        {/* Order Menu */}
        <div className="flex-1 flex flex-col min-h-0" style={{ gap: "8px", overflow: "hidden" }}>
          <span style={{ fontSize: "18px", fontWeight: 800, color: "#111827" }}>Order Menu</span>
          <div className="flex flex-col overflow-y-auto" style={{ gap: "10px", scrollbarWidth: "none" }}>
            {CART_ITEMS.map((item) => (
              <div key={item.id} className="flex items-center" style={{ gap: "12px" }}>
                <div
                  className="shrink-0 rounded-[12px] overflow-hidden"
                  style={{ width: "60px", height: "48px", background: "#D0D0D0" }}
                >
                  <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#111827" }}>{item.name}</div>
                  <div style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: 500 }}>x{item.qty}</div>
                </div>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#111827", whiteSpace: "nowrap" }}>
                  + {item.price * item.qty} PKR
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="flex flex-col shrink-0" style={{ gap: "8px", paddingTop: "12px", borderTop: "1px solid #C8C8C8" }}>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: "11px", fontWeight: 500, color: "#9CA3AF" }}>Service</span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#9CA3AF" }}>+20 PKR</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#111827" }}>Total</span>
            <span style={{ fontSize: "20px", fontWeight: 900, color: "#111827" }}>620 PKR</span>
          </div>

          {/* Coupon */}
          <div
            className="flex items-center rounded-[16px]"
            style={{ height: "42px", background: "#D0D0D0", padding: "0 16px", gap: "12px" }}
          >
            <div
              className="flex items-center justify-center rounded-[8px]"
              style={{ width: "22px", height: "22px", background: "#1C1C2E" }}
            >
              <Ticket size={12} color="#D0D0D0" className="rotate-[135deg]" />
            </div>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280" }}>Have a Coupon code?</span>
          </div>

          {/* Checkout */}
          <button
            className="w-full flex items-center justify-center rounded-[16px] transition-all"
            style={{ height: "42px", background: "#D0D0D0", fontSize: "12px", fontWeight: 800, color: "#374151" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#1C1C2E"; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#D0D0D0"; (e.currentTarget as HTMLButtonElement).style.color = "#374151"; }}
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
