"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutGrid, Home, BarChart2, ShoppingBag, UtensilsCrossed, Settings,
  Search, Bell, Plus, Minus, Star, Heart, User, Ticket, X, ChevronRight,
  CreditCard, Wallet, Smartphone, MapPin, Clock, CheckCircle2, Truck, Package,
  ChevronLeft
} from "lucide-react";

const CATEGORIES = [
  { id: "all", name: "All", emoji: "🍽️" },
  { id: "burgers", name: "Burgers", emoji: "🍔" },
  { id: "pizza", name: "Pizza", emoji: "🍕" },
  { id: "chicken", name: "Chicken", emoji: "🍗" },
  { id: "seafood", name: "Seafood", emoji: "🐟" },
  { id: "beverages", name: "Drinks", emoji: "🥤" },
];

const DISHES = [
  { id: "d1", name: "Fish Burger", price: 350, rating: 4, category: "burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
  { id: "d2", name: "Beef Burger", price: 550, rating: 5, category: "burgers", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop" },
  { id: "d3", name: "Chicken Burger", price: 250, rating: 4, category: "burgers", image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop" },
  { id: "d4", name: "Cheese Burger", price: 550, rating: 4, category: "burgers", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop" },
  { id: "d5", name: "Margherita Pizza", price: 890, rating: 5, category: "pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop" },
  { id: "d6", name: "BBQ Chicken Pizza", price: 1050, rating: 4, category: "pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop" },
  { id: "d7", name: "Crispy Fried Chicken", price: 480, rating: 5, category: "chicken", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop" },
  { id: "d8", name: "Cola 500ml", price: 80, rating: 4, category: "beverages", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop" },
];

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: <CreditCard size={20} />, desc: "Visa, Mastercard accepted" },
  { id: "cod", label: "Cash on Delivery", icon: <Wallet size={20} />, desc: "Pay when your order arrives" },
  { id: "jazzcash", label: "JazzCash", icon: <Smartphone size={20} />, desc: "Mobile wallet payment" },
  { id: "easypaisa", label: "EasyPaisa", icon: <Smartphone size={20} />, desc: "Mobile wallet payment" },
];

type CartItem = { id: string; name: string; price: number; image: string; qty: number };
type Screen = "menu" | "cart" | "payment" | "success";

export function OnlineOrderingDashboard() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSidebar, setActiveSidebar] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("tab") || "home";
    }
    return "home";
  });
  const [screen, setScreen] = useState<Screen>(() => {
    if (typeof window !== "undefined") {
      const tab = new URLSearchParams(window.location.search).get("tab");
      if (tab === "bag") return "cart";
    }
    return "menu";
  });
  const [liked, setLiked] = useState<Record<string, boolean>>({ d1: true });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "bag") {
        setActiveSidebar("bag");
        setScreen("cart");
      } else if (tab === "menu" || tab === "home") {
        setActiveSidebar(tab);
        setScreen("menu");
      } else if (tab) {
        setActiveSidebar(tab);
      }
    }
  }, []);
  const [address, setAddress] = useState("Military College of Signals, Lalkurti");
  const [search, setSearch] = useState("");

  const [cardDetails, setCardDetails] = useState({ number: "", name: "", expiry: "", cvv: "" });

  const addToCart = (dish: typeof DISHES[0]) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === dish.id);
      if (ex) return prev.map(c => c.id === dish.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: dish.id, name: dish.name, price: dish.price, image: dish.image, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === id);
      if (!ex) return prev;
      if (ex.qty === 1) return prev.filter(c => c.id !== id);
      return prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c);
    });
  };

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const serviceCharge = 50;
  const grandTotal = cartTotal + serviceCharge;

  const filteredDishes = DISHES.filter(d =>
    (activeCategory === "all" || d.category === activeCategory) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckout = () => {
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    router.push(`/online/orders/${orderId}/track`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden select-none" style={{ background: "#F0F0F0", fontFamily: "'Inter', sans-serif" }}>
      {/* Left Sidebar */}
      <aside className="flex flex-col items-center shrink-0" style={{ width: "72px", background: "#fff", paddingTop: "20px", paddingBottom: "20px", borderRight: "1px solid #E8E8E8" }}>
        <div className="flex items-center justify-center rounded-xl mb-6 shadow-sm" style={{ width: "40px", height: "40px", background: "#1C1C2E" }}>
          <LayoutGrid size={18} color="white" strokeWidth={2} />
        </div>
        <div className="flex flex-col items-center gap-3 flex-1 w-full px-2">
          {[
            { id: "home", icon: <Home size={20} strokeWidth={2} /> },
            { id: "stats", icon: <BarChart2 size={20} strokeWidth={2} /> },
            { id: "bag", icon: <ShoppingBag size={20} strokeWidth={2} /> },
            { id: "menu", icon: <UtensilsCrossed size={20} strokeWidth={2} /> },
            { id: "track", icon: <MapPin size={20} strokeWidth={2} /> },
          ].map((item) => (
            <button key={item.id} onClick={() => {
              setActiveSidebar(item.id);
              if (item.id === "bag") setScreen("cart");
              else if (item.id === "home" || item.id === "menu") setScreen("menu");
              else if (item.id === "track") router.push(`/online/orders/ORD-${Math.floor(100000 + Math.random() * 900000)}/track`);
            }} className="flex items-center justify-center rounded-[12px] transition-all w-full relative" style={{ height: "44px", color: activeSidebar === item.id ? "white" : "#9CA3AF", background: activeSidebar === item.id ? "#1C1C2E" : "transparent" }}>
              {item.icon}
              {item.id === "bag" && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-black" style={{ background: "#EF4444" }}>{cartCount}</span>
              )}
            </button>
          ))}
        </div>
        <button className="flex items-center justify-center rounded-xl w-full mx-2" style={{ height: "44px", color: "#9CA3AF" }}>
          <Settings size={20} strokeWidth={2} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative" style={{ padding: "18px 22px 14px" }}>
        
        {screen === "menu" && (
          <div className="flex flex-col h-full gap-4">
            {/* Header */}
            <header className="flex justify-between items-center shrink-0">
              <div>
                <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#111827", letterSpacing: "-0.5px" }}>Hello, Ethan 👋</h1>
                <p style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: 500 }}>What would you like to eat today?</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search dishes..." className="outline-none border-none" style={{ height: "38px", width: "240px", background: "#E0E0E0", borderRadius: "24px", paddingLeft: "38px", paddingRight: "16px", fontSize: "12px" }} />
                </div>
                <button style={{ width: "38px", height: "38px", borderRadius: "12px", background: "#E0E0E0", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}>
                  <Bell size={16} />
                </button>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#1C1C2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={18} color="white" />
                </div>
              </div>
            </header>

            {/* Banner */}
            <div className="shrink-0 rounded-[20px] w-full overflow-hidden relative" style={{ height: "140px" }}>
              <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&h=400&fit=crop&q=80" alt="Food Banner" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
              <div className="absolute inset-0 flex flex-col justify-center" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)", padding: "0 40px" }}>
                <span style={{ color: "white", fontSize: "24px", fontWeight: 900 }}>Fresh & Delicious 🔥</span>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", fontWeight: 600, marginTop: "4px" }}>Order now · Free delivery on orders over PKR 500</span>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-3 shrink-0 overflow-x-auto" style={{ scrollbarWidth: "none", paddingBottom: "4px" }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className="flex items-center gap-2 shrink-0 rounded-[14px] transition-all" style={{ padding: "10px 20px", background: activeCategory === cat.id ? "#1C1C2E" : "#E5E5E5", color: activeCategory === cat.id ? "white" : "#6B7280", fontSize: "14px", fontWeight: 700 }}>
                  <span>{cat.emoji}</span> {cat.name}
                </button>
              ))}
            </div>

            {/* Dishes Grid */}
            <section className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              <div className="grid grid-cols-4 gap-4 pb-20">
                {filteredDishes.map((dish) => {
                  const cartQty = cart.find(c => c.id === dish.id)?.qty || 0;
                  return (
                    <div key={dish.id} className="relative flex flex-col rounded-[20px] overflow-hidden transition-transform hover:scale-[1.02]" style={{ background: "white", padding: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
                      <button className="absolute z-10" style={{ top: "16px", right: "16px", background: "white", borderRadius: "50%", padding: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} onClick={() => setLiked(prev => ({ ...prev, [dish.id]: !prev[dish.id] }))}>
                        <Heart size={16} fill={liked[dish.id] ? "#EF4444" : "none"} stroke={liked[dish.id] ? "#EF4444" : "#374151"} strokeWidth={2} />
                      </button>
                      <div style={{ height: "140px", borderRadius: "14px", overflow: "hidden", marginBottom: "12px" }}>
                        <img src={dish.image} alt={dish.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div className="flex gap-[2px] mb-2">
                        {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i <= dish.rating ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth={1.5} />)}
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#111827", marginBottom: "2px" }}>{dish.name}</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#6B7280", marginBottom: "12px" }}>{dish.price} PKR</div>
                      <div className="flex items-center justify-between mt-auto">
                        {cartQty > 0 ? (
                          <div className="flex items-center gap-3 rounded-[10px]" style={{ background: "#1C1C2E", padding: "6px 12px", width: "100%", justifyContent: "space-between" }}>
                            <button onClick={() => removeFromCart(dish.id)}><Minus size={14} color="white" /></button>
                            <span style={{ color: "white", fontSize: "14px", fontWeight: 800, minWidth: "20px", textAlign: "center" }}>{cartQty}</span>
                            <button onClick={() => addToCart(dish)}><Plus size={14} color="white" /></button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(dish)} className="flex items-center justify-center gap-2 rounded-[10px] transition-all w-full" style={{ padding: "8px 12px", background: "#1C1C2E", fontSize: "13px", fontWeight: 700, color: "white" }}>
                            <Plus size={14} /> Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            
            {/* View Cart Floating Button */}
            {cartCount > 0 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <button onClick={() => { setScreen("cart"); setActiveSidebar("bag"); }} className="flex items-center gap-4 rounded-full shadow-2xl transition-transform hover:scale-105" style={{ background: "#1C1C2E", padding: "12px 24px" }}>
                  <div className="flex items-center justify-center rounded-full" style={{ background: "#EF4444", width: "24px", height: "24px", color: "white", fontSize: "12px", fontWeight: "bold" }}>{cartCount}</div>
                  <span style={{ color: "white", fontSize: "15px", fontWeight: 800 }}>View Cart</span>
                  <span style={{ color: "#9CA3AF", fontSize: "15px", fontWeight: 700 }}>{cartTotal} PKR</span>
                </button>
              </div>
            )}
          </div>
        )}

        {screen === "cart" && (
          <div className="flex flex-col h-full w-full">
            <button onClick={() => setScreen("menu")} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 font-bold w-max transition-colors">
              <ChevronLeft size={20} /> Back to Menu
            </button>
            <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Your Cart</h2>
            
            <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0 pb-8">
              {/* Left Column - Cart Items */}
              <div className="flex-1 flex flex-col min-h-0 bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4 flex justify-between items-center">
                  <span>Order Items</span>
                  <span className="bg-gray-100 text-gray-600 text-xs py-1 px-3 rounded-full">{cartCount}</span>
                </h3>
                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
                    <ShoppingBag size={48} strokeWidth={1.5} />
                    <p className="font-bold text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto pr-2 space-y-3" style={{ scrollbarWidth: "thin" }}>
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 bg-gray-50/50 hover:bg-gray-50 transition-colors p-3 rounded-[16px] border border-gray-100/50">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-[12px] object-cover shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-[15px] truncate">{item.name}</h4>
                          <p className="text-gray-500 font-semibold text-[13px] mt-0.5">{item.price} PKR</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-full px-2 py-1 shadow-sm border border-gray-200 shrink-0">
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-gray-900 w-7 h-7 flex items-center justify-center transition-colors"><Minus size={14} strokeWidth={3} /></button>
                          <span className="font-bold w-4 text-center text-gray-900 text-[14px]">{item.qty}</span>
                          <button onClick={() => addToCart(DISHES.find(d => d.id === item.id)!)} className="text-gray-400 hover:text-gray-900 w-7 h-7 flex items-center justify-center transition-colors"><Plus size={14} strokeWidth={3} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Summary & Order Type */}
              <div className="w-full lg:w-[380px] flex flex-col shrink-0 gap-6">
                <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Order Type</h3>
                  <div className="flex gap-2 mb-5 bg-gray-50 p-1 rounded-[14px]">
                    {(["delivery", "pickup"] as const).map(t => (
                      <button key={t} onClick={() => setOrderType(t)} className="flex-1 flex items-center justify-center gap-2 rounded-[10px] py-2.5 transition-all font-bold text-[13px]" style={{ background: orderType === t ? "white" : "transparent", color: orderType === t ? "#111827" : "#6B7280", boxShadow: orderType === t ? "0 2px 4px rgba(0,0,0,0.05)" : "none" }}>
                        {t === "delivery" ? <Truck size={16} /> : <Package size={16} />}
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                  {orderType === "delivery" && (
                    <div className="bg-gray-50 rounded-[16px] p-4 border border-gray-100">
                      <div className="flex items-center gap-2 mb-1.5 text-gray-700">
                        <MapPin size={14} />
                        <span className="font-bold text-[12px] uppercase tracking-wide text-gray-500">Delivery Address</span>
                      </div>
                      <p className="text-gray-900 text-[13px] font-semibold leading-relaxed">{address}</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                  <div className="space-y-3.5 mb-6">
                    <div className="flex justify-between text-gray-500 font-semibold text-[14px]"><span>Subtotal</span><span className="text-gray-900">{cartTotal} PKR</span></div>
                    <div className="flex justify-between text-gray-500 font-semibold text-[14px]"><span>Service Charge</span><span className="text-gray-900">+{serviceCharge} PKR</span></div>
                    <div className="flex justify-between text-gray-900 font-black text-[18px] pt-4 border-t border-gray-100 mt-2"><span>Total</span><span>{grandTotal} PKR</span></div>
                  </div>
                  <button disabled={cart.length === 0} onClick={() => setScreen("payment")} className="w-full flex items-center justify-center gap-2 rounded-[16px] transition-all py-4 font-black text-[15px] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0" style={{ background: "#1C1C2E", color: "white" }}>
                    Proceed to Checkout <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {screen === "payment" && (
          <div className="flex flex-col h-full w-full">
            <button onClick={() => setScreen("cart")} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 font-bold w-max transition-colors">
              <ChevronLeft size={20} /> Back to Cart
            </button>
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Payment Method</h2>
            <p className="text-gray-500 font-medium mb-8">Choose how you want to pay for your order.</p>

            <div className="flex flex-col lg:flex-row gap-8 pb-8">
              {/* Left Column: Methods */}
              <div className="flex-1 flex flex-col gap-4">
                {PAYMENT_METHODS.map(pm => (
                  <button key={pm.id} onClick={() => setPaymentMethod(pm.id)} className="flex items-center gap-4 bg-white p-5 rounded-[20px] transition-all border-2 text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md" style={{ borderColor: paymentMethod === pm.id ? "#1C1C2E" : "transparent" }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors" style={{ background: paymentMethod === pm.id ? "#1C1C2E" : "#F3F4F6", color: paymentMethod === pm.id ? "white" : "#6B7280" }}>
                      {pm.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-[16px] truncate">{pm.label}</h4>
                      <p className="text-gray-500 font-medium text-[13px] truncate">{pm.desc}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors" style={{ borderColor: paymentMethod === pm.id ? "#1C1C2E" : "#D1D5DB" }}>
                      {paymentMethod === pm.id && <div className="w-3 h-3 rounded-full bg-gray-900" />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Column: Card Details or Summary */}
              <div className="w-full lg:w-[420px] shrink-0 flex flex-col">
                {paymentMethod === "card" && (
                  <div className="bg-white rounded-[24px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-6">
                    <h3 className="text-xl font-black text-gray-900 mb-5">Card Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-600 font-bold text-[12px] uppercase tracking-wide mb-1.5">Cardholder Name</label>
                        <input type="text" placeholder="John Doe" value={cardDetails.name} onChange={e => setCardDetails({...cardDetails, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[14px] px-4 py-3 outline-none focus:border-gray-900 font-semibold text-[14px] transition-colors" />
                      </div>
                      <div>
                        <label className="block text-gray-600 font-bold text-[12px] uppercase tracking-wide mb-1.5">Card Number</label>
                        <div className="relative">
                          <input type="text" placeholder="0000 0000 0000 0000" value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[14px] px-4 py-3 pl-11 outline-none focus:border-gray-900 font-semibold text-[14px] tracking-widest transition-colors" />
                          <CreditCard size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-gray-600 font-bold text-[12px] uppercase tracking-wide mb-1.5">Expiry Date</label>
                          <input type="text" placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[14px] px-4 py-3 outline-none focus:border-gray-900 font-semibold text-[14px] transition-colors" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-gray-600 font-bold text-[12px] uppercase tracking-wide mb-1.5">CVV</label>
                          <input type="password" placeholder="123" value={cardDetails.cvv} onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[14px] px-4 py-3 outline-none focus:border-gray-900 font-semibold text-[14px] transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(paymentMethod === "jazzcash" || paymentMethod === "easypaisa") && (
                  <div className="bg-white rounded-[24px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-6">
                    <h3 className="text-xl font-black text-gray-900 mb-3">Mobile Wallet Details</h3>
                    <p className="text-gray-500 text-[13px] mb-5 leading-relaxed">Please enter your registered {paymentMethod === "jazzcash" ? "JazzCash" : "EasyPaisa"} mobile number to receive a secure payment prompt.</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-600 font-bold text-[12px] uppercase tracking-wide mb-1.5">Mobile Number</label>
                        <div className="relative">
                          <input type="tel" placeholder="03XX XXXXXXX" className="w-full bg-gray-50 border border-gray-200 rounded-[14px] px-4 py-3 pl-11 outline-none focus:border-gray-900 font-semibold text-[14px] tracking-widest transition-colors" />
                          <Smartphone size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white p-6 rounded-[24px] border border-gray-100 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-auto">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 font-bold text-[14px]">Total Amount</span>
                    <span className="text-gray-900 font-black text-[22px]">{grandTotal} PKR</span>
                  </div>
                  <button onClick={handleCheckout} className="w-full flex items-center justify-center gap-2 rounded-[16px] transition-all py-4 font-black text-[15px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0" style={{ background: "#1C1C2E", color: "white" }}>
                    Pay & Place Order 🚀
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
