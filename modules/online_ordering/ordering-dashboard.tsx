"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Bell, Plus, Minus, Star, User, X, ChevronDown,
  MapPin, Clock, Truck, Package, Trash2, Filter, ShoppingBag, Ticket, ChevronRight,
  CreditCard, Wallet, Smartphone, CheckCircle2, Heart, ChefHat, Bike, Menu
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";

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

const CATEGORIES = [
  { id: "popular", name: "Popular", emoji: "🔥" },
  { id: "pizzas", name: "Pizzas", emoji: "🍕" },
  { id: "burgers", name: "Burgers", emoji: "🍔" },
  { id: "starters", name: "Starters", emoji: "🍗" },
  { id: "sandwiches", name: "Sandwiches & Platters", emoji: "🥪" },
  { id: "sides", name: "Side Orders", emoji: "🍟" },
  { id: "addons", name: "Add-ons", emoji: "🥗" },
  { id: "drinks", name: "Soft Drinks", emoji: "🥤" },
];

const DISHES = [
  { 
    id: "d1", 
    name: "Crown Crust Pizza", 
    price: 1430, 
    rating: 4.1, 
    category: "pizzas", 
    description: "Scrumptious Pizza with a yummy blend of Grilled Chicken, Olives, Onion, Capsicum and Special Sauce.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    badge: "Hot",
    variations: [
      { name: "Regular", price: 1430 },
      { name: "Large", price: 1980 },
      { name: "Party", price: 3050 }
    ]
  },
  { 
    id: "d2", 
    name: "Beef Pepperoni Thin Crust", 
    price: 1430, 
    rating: 4.1, 
    category: "pizzas", 
    description: "A crispy thin crust topped with beef pepperoni, mozzarella cheese, and rich marinara sauce.",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&h=300&fit=crop",
    badge: "Best Seller",
    variations: [
      { name: "Regular", price: 1430 },
      { name: "Large", price: 1980 },
      { name: "Party", price: 3050 }
    ]
  },
  { 
    id: "d3", 
    name: "Behari Kabab", 
    price: 1430, 
    rating: 4.2, 
    category: "starters", 
    description: "Enjoy Special Chicken Behari Kabab, Grilled Chicken with Onion, Jalapeno and Ginger Garnish.",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop"
  },
  { 
    id: "d4", 
    name: "Chicken Tandoori", 
    price: 660, 
    rating: 4.5, 
    category: "starters", 
    description: "Our traditionally developed Tandoori Chicken with Onion, Olives, Jalapeno and Tomato Sauce.",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=400&h=300&fit=crop"
  },
  { 
    id: "d5", 
    name: "Calzone Chunks", 
    price: 1200, 
    rating: 4.3, 
    category: "starters", 
    description: "4 Pcs Stuffed Calzone Chunks Served With Sauce & Sauce",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop"
  },
  { 
    id: "d6", 
    name: "Bazinga Burger", 
    price: 850, 
    rating: 4.4, 
    category: "burgers", 
    description: "Crispy fried to perfection boneless thigh with signature sauce and lettuce",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    badge: "Classic"
  },
  { 
    id: "d7", 
    name: "Special Roasted", 
    price: 1500, 
    rating: 4.6, 
    category: "starters", 
    description: "4 Pcs Bihari Rolls, 8 Pcs Wings Served With Fries & Sauce",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop"
  },
  { 
    id: "d8", 
    name: "Soft Drink", 
    price: 99, 
    rating: 4.0, 
    category: "drinks", 
    description: "500ml chilled soft drink",
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop"
  },
];

const DEALS = [
  { id: "deal1", name: "Calzone Chunks", price: 1200, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop" },
  { id: "deal2", name: "Bazinga Burger", price: 850, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
  { id: "deal3", name: "Special Roasted", price: 1500, image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop" },
  { id: "deal4", name: "Calzone Chunks", price: 1200, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop" },
  { id: "deal5", name: "Calzone Chunks", price: 1200, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop" },
  { id: "deal6", name: "Bazinga Burger", price: 850, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
  { id: "deal7", name: "Special Roasted", price: 1500, image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop" },
  { id: "deal8", name: "Calzone Chunks", price: 1200, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop" },
];

type CheckoutStep = "delivery" | "payment" | "review";
type Screen = "menu" | "cart" | "checkout" | "success" | "deals";

export function OnlineOrderingDashboard({ 
  initialScreen = "menu", 
  initialCheckoutStep = "delivery" 
}: { 
  initialScreen?: Screen, 
  initialCheckoutStep?: CheckoutStep 
}) {
  const router = useRouter();

  const { cart, addToCart, removeFromCart, deleteFromCart, clearCart, grandTotal, cartTotal, deliveryCharges } = useCart();
  
  const [activeCategory, setActiveCategory] = useState("popular");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [search, setSearch] = useState("");
  const [selectedDish, setSelectedDish] = useState<typeof DISHES[0] | null>(null);
  const [activeVariation, setActiveVariation] = useState<number>(0);
  const [selectedAddress, setSelectedAddress] = useState("Home");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash on Delivery");
  const [orderId, setOrderId] = useState("#CHZ-39403");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredDishes = DISHES.filter(d =>
    (activeCategory === "popular" || d.category === activeCategory) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const recommendations = DISHES.filter(d => !cart.some(c => c.dishId === d.id)).slice(0, 3);

  const handlePlaceOrder = () => {
    const newId = `#CHZ-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderId(newId);
    clearCart();
    router.push("/order/success");
  };

  return (
    <div className="h-screen flex flex-col bg-[#FEFDFA] relative overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Navbar */}
      <nav className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white z-[60]">
        <div className="flex items-center gap-4 md:gap-12">
          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#811920] rounded-lg flex items-center justify-center transform rotate-12">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-xl md:text-2xl font-black italic tracking-tighter" style={{ color: COLORS.deepMaroon }}>Cheezious</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[15px] font-bold">
            <Link href="/home" className={`${initialScreen === "menu" ? "text-[#811920] border-b-2 border-[#811920]" : "text-gray-900"} pb-0.5 transition-all`}>Home</Link>
            <Link href="/home" className="text-gray-900 hover:text-[#811920] transition-all">Menu</Link>
            <Link href="/orders/CHZ-39403/track" className="text-gray-900 hover:text-[#811920] transition-colors">Track Order</Link>
            <Link href="/deals" className={`${initialScreen === "deals" ? "text-[#811920] border-b-2 border-[#811920]" : "text-gray-900"} pb-0.5 transition-all`}>Deals</Link>
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
          <Link href="/cart" className="bg-gray-50 border border-gray-100 rounded-lg px-2 md:px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-all">
            <ShoppingBag size={18} className="text-gray-400" />
            <span className="text-xs font-bold text-[#811920]">Rs {grandTotal}</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
            <Link href="/home" className="text-lg font-black text-gray-900">Home</Link>
            <Link href="/home" className="text-lg font-black text-gray-900">Menu</Link>
            <Link href="/orders/CHZ-39403/track" className="text-lg font-black text-gray-900">Track Order</Link>
            <Link href="/deals" className="text-lg font-black text-gray-900">Deals</Link>
            <div className="h-px bg-gray-100 my-2" />
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <MapPin size={18} className="text-[#811920]" />
              <span>Islamabad</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar bg-[#FEFDFA] pb-32 relative">
          
          {initialScreen === "menu" && (
            <>
              {/* Hero Section */}
              <section className="m-4 md:m-6 rounded-3xl bg-[#FDEFDE] p-6 md:p-10 flex flex-col md:flex-row relative overflow-hidden min-h-[320px] md:h-[320px]">
                <div className="flex-1 z-10">
                  <h1 className="text-4xl md:text-6xl font-black md:leading-tight mb-4">
                    Order Your<br />
                    Favorites in <span style={{ color: COLORS.deepMaroon }}>Seconds.</span>
                  </h1>
                  <p className="text-gray-600 font-medium mb-6 md:mb-8 text-sm md:text-base">Fresh. Hot. Delivered fast to your door.</p>
                  
                  <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
                    <div className="bg-white rounded-full p-1 flex shadow-sm border border-gray-100 w-full sm:w-auto">
                      <button 
                        onClick={() => setOrderType("delivery")}
                        className={`flex-1 sm:px-6 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${orderType === "delivery" ? "bg-[#FECE04] text-black shadow-md" : "text-gray-500"}`}
                      >
                        <Truck size={16} /> Delivery
                      </button>
                      <button 
                        onClick={() => setOrderType("pickup")}
                        className={`flex-1 sm:px-6 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${orderType === "pickup" ? "bg-[#FECE04] text-black shadow-md" : "text-gray-500"}`}
                      >
                        <Package size={16} /> Pickup
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-2xl px-4 py-2.5 flex items-center gap-3 border border-gray-100 shadow-sm w-full sm:min-w-[280px]">
                      <MapPin size={18} className="text-[#811920]" />
                      <span className="text-xs md:text-sm font-bold text-gray-700 flex-1 truncate">Emaar DHA 5, Islamabad</span>
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-1/2 items-center justify-end pr-10">
                   <div className="relative w-full h-full">
                      <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop" alt="Cheezious Special" className="w-[450px] h-full object-cover rounded-l-full shadow-2xl border-8 border-white/20" />
                      <div className="absolute -left-12 top-10 bg-white p-4 rounded-3xl shadow-xl border border-gray-50 max-w-[150px] transform -rotate-12">
                        <img src="https://images.unsplash.com/photo-1562967914-608f82629710?w=200&h=200&fit=crop" className="rounded-2xl mb-2" />
                        <p className="text-[10px] font-black italic text-center text-[#FECE04]">Cheesy Goodness</p>
                      </div>
                      <div className="absolute left-10 bottom-10 bg-[#FECE04] p-3 rounded-full shadow-lg transform rotate-12">
                        <p className="text-[10px] font-black uppercase text-center leading-tight">FRIES<br/>ALWAYS A<br/>GOOD IDEA</p>
                      </div>
                   </div>
                </div>
              </section>

              {/* Menu Section Grid */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 px-4 md:px-8 mt-8 md:mt-12 relative items-start">
                
                {/* Horizontal Categories for Mobile */}
                <div className="md:hidden w-full overflow-x-auto no-scrollbar flex gap-2 pb-2 sticky top-16 bg-[#FEFDFA] z-40 py-2">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat.id} 
                      onClick={() => setActiveCategory(cat.id)} 
                      className={`whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-full text-[11px] font-black transition-all border shadow-sm ${activeCategory === cat.id ? "bg-[#811920] text-white border-[#811920]" : "bg-white text-gray-900 border-gray-100"}`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>

                {/* Left Sidebar Card - Desktop Only */}
                <aside className="hidden md:block w-[280px] shrink-0 sticky top-24 z-20">
                  <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-xl shadow-gray-100/50">
                    <div className="flex flex-col">
                      {CATEGORIES.map(cat => (
                        <button 
                          key={cat.id} 
                          onClick={() => setActiveCategory(cat.id)} 
                          className={`flex items-center gap-3 px-6 py-2.5 text-[12px] font-black transition-all text-left border-b border-gray-50 last:border-0 ${activeCategory === cat.id ? "bg-[#811920] text-white" : "text-gray-900 hover:bg-gray-50"}`}
                        >
                          <span className="text-base">{cat.emoji}</span>
                          <span>{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* Main Menu Feed */}
                <div className="flex-1 min-w-0 w-full">
                  {/* Search & Filters */}
                  <div className="mb-6 md:mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full lg:w-[400px]">
                      <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search for food.." 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                        className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 md:py-4 pl-14 pr-6 outline-none focus:border-[#FECE04] font-bold text-sm shadow-sm transition-all" 
                      />
                    </div>
                    <div className="flex gap-2 md:gap-4 w-full lg:w-auto overflow-x-auto no-scrollbar">
                       <button className="flex-1 md:flex-none flex items-center justify-between gap-2 md:gap-4 px-4 md:px-6 py-3 md:py-4 bg-white border border-gray-100 rounded-2xl text-xs md:text-sm font-black text-gray-900 shadow-sm hover:bg-gray-50 transition-all min-w-[120px] md:min-w-[140px]">
                         <div className="flex items-center gap-2 whitespace-nowrap"><Filter size={16} /> Filters</div>
                         <ChevronDown size={14} className="text-gray-400" />
                       </button>
                       <button className="flex-1 md:flex-none flex items-center justify-between gap-2 md:gap-4 px-4 md:px-6 py-3 md:py-4 bg-white border border-gray-100 rounded-2xl text-xs md:text-sm font-black text-gray-900 shadow-sm hover:bg-gray-50 transition-all min-w-[120px] md:min-w-[140px]">
                         <div className="flex items-center gap-2 whitespace-nowrap">Sort by</div>
                         <ChevronDown size={14} className="text-gray-400" />
                       </button>
                    </div>
                  </div>

                  {/* Dishes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredDishes.map(dish => (
                      <div 
                        key={dish.id} 
                        onClick={() => { setSelectedDish(dish); setActiveVariation(0); }} 
                        className="bg-white rounded-[24px] p-4 md:p-5 border border-[#811920]/10 hover:border-[#811920]/30 transition-all group relative cursor-pointer flex flex-col"
                      >
                        {dish.badge && <div className="absolute top-4 left-4 z-10 bg-[#FECE04] text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">{dish.badge}</div>}
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <h3 className="font-black text-gray-900 text-sm md:text-base leading-tight mb-1">{dish.name}</h3>
                        <p className="text-[10px] font-bold text-gray-500 line-clamp-2 mb-2 leading-normal">{dish.description}</p>
                        
                        <div className="flex items-center gap-1 mb-3">
                           <Star size={10} className="fill-[#FECE04] text-[#FECE04]" />
                           <span className="text-[11px] font-black text-gray-900">{dish.rating}</span>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                           <span className="text-[10px] md:text-[11px] font-black text-gray-900">From Rs {dish.price}</span>
                           <button 
                            onClick={(e) => { e.stopPropagation(); addToCart(dish); }} 
                            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#811920] flex items-center justify-center text-white shadow-lg shadow-maroon/10 hover:scale-110 transition-transform"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {initialScreen === "cart" && (
            <div className="p-4 md:p-8 max-w-[1200px] mx-auto animate-in slide-in-from-right duration-300">
              <h1 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8">Your Cart ({cart.length})</h1>
              <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
                <div className="flex-1 space-y-4">
                  {cart.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 md:p-20 flex flex-col items-center justify-center border border-gray-100 shadow-sm text-center">
                      <ShoppingBag size={64} className="text-gray-200 mb-6" />
                      <p className="text-lg md:text-xl font-black text-gray-900 mb-2">Your cart is empty</p>
                      <Link href="/home" className="text-[#811920] font-bold hover:underline">Go back to menu</Link>
                    </div>
                  ) : (
                    <>
                      {cart.map(item => (
                        <div key={item.id} className="bg-white rounded-3xl p-4 md:p-5 border border-gray-100 shadow-sm flex items-center gap-4 md:gap-6">
                          <img src={item.image} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base md:text-lg font-black text-gray-900 truncate">{item.name}</h3>
                            <p className="text-xs md:text-sm font-bold text-gray-500 mb-2 md:mb-4">{item.variation || "Regular"}</p>
                            <div className="flex items-center gap-3 md:gap-4 bg-gray-50 w-fit rounded-xl px-2 md:px-3 py-1 border border-gray-100">
                              <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-gray-900"><Minus size={14} /></button>
                              <span className="text-sm md:text-base font-black w-6 text-center">{item.qty}</span>
                              <button onClick={() => addToCart(DISHES.find(d => d.id === item.dishId) || DISHES[0], (DISHES.find(d => d.id === item.dishId) || DISHES[0]).variations?.findIndex(v => v.name === item.variation) ?? 0)} className="text-gray-400 hover:text-gray-900"><Plus size={14} /></button>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-3 md:gap-4">
                             <span className="text-base md:text-lg font-black text-gray-900 whitespace-nowrap">Rs {item.price * item.qty}</span>
                             <button onClick={() => deleteFromCart(item.id)} className="text-red-100 hover:text-[#811920] bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      ))}
                      <div className="mt-8 md:mt-12">
                        <p className="text-base md:text-lg font-black text-gray-900 mb-4 md:mb-6">Don't be shy - you can add these too:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                          {recommendations.map(dish => (
                            <div key={dish.id} className="bg-white rounded-3xl p-3 md:p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                              <img src={dish.image} alt={dish.name} className="w-full aspect-video object-cover rounded-2xl mb-3 md:mb-4" />
                              <h4 className="font-black text-gray-900 text-[11px] md:text-sm mb-1 line-clamp-1">{dish.name}</h4>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] md:text-xs font-bold text-gray-500">Rs {dish.price}</span>
                                <button onClick={() => addToCart(dish)} className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#811920] flex items-center justify-center text-white shadow-lg"><Plus size={14} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="w-full lg:w-[400px] shrink-0">
                  <div className="bg-white rounded-[32px] p-6 md:p-8 border border-gray-100 shadow-xl lg:sticky lg:top-24">
                    <h2 className="text-lg md:text-xl font-black text-gray-900 mb-6 md:mb-8">Order Summary</h2>
                    <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                      <div className="flex justify-between text-xs md:text-sm font-bold text-gray-500"><span>Subtotal</span><span className="text-gray-900">Rs {cartTotal}</span></div>
                      <div className="flex justify-between text-xs md:text-sm font-bold text-gray-500"><span>Delivery Charges</span><span className="text-gray-900">Rs {deliveryCharges}</span></div>
                    </div>
                    <div className="pt-4 md:pt-6 border-t border-gray-100 mb-6 md:mb-8">
                       <div className="flex justify-between items-center"><span className="text-base md:text-lg font-black text-gray-900">Total</span><span className="text-xl md:text-2xl font-black text-[#811920]">Rs {grandTotal}</span></div>
                    </div>
                    <div className="relative mb-6 md:mb-8">
                       <Ticket size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input type="text" placeholder="Have a Promo Code?" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 md:py-3.5 pl-12 pr-16 outline-none focus:border-[#FECE04] text-xs md:text-sm font-bold" />
                       <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] md:text-xs font-black uppercase text-[#811920]">Apply</button>
                    </div>
                    <div className="space-y-3">
                      <Link href="/checkout/delivery" className={`block w-full text-center bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-3.5 md:py-4 rounded-2xl shadow-lg shadow-yellow-100 transition-all hover:-translate-y-1 active:translate-y-0 text-sm md:text-base uppercase tracking-wide ${cart.length === 0 ? "opacity-50 pointer-events-none" : ""}`}>Checkout</Link>
                      <Link href="/home" className="block w-full text-center bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-900 font-black py-3.5 md:py-4 rounded-2xl transition-all text-sm md:text-base uppercase tracking-wide">Continue Shopping</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {initialScreen === "checkout" && (
            <div className="p-4 md:p-8 max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom duration-500">
              <div className="flex items-center justify-center mb-8 md:mb-16 relative overflow-x-auto no-scrollbar pb-4 md:pb-0">
                 <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10 hidden md:block" />
                 <div className="flex gap-8 md:gap-20 bg-[#FEFDFA] px-4 md:px-10">
                    {[
                      { id: "delivery", label: "Delivery", icon: <Truck size={18} />, href: "/checkout/delivery" },
                      { id: "payment", label: "Payment", icon: <Wallet size={18} />, href: "/checkout/payment" },
                      { id: "review", label: "Review", icon: <CheckCircle2 size={18} />, href: "/checkout/review" },
                    ].map((step, i) => (
                      <Link key={step.id} href={step.href} className="flex flex-col md:flex-row items-center gap-2 md:gap-3 cursor-pointer shrink-0">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all ${initialCheckoutStep === step.id ? "bg-[#FECE04] text-black shadow-lg shadow-yellow-200" : i < ["delivery","payment","review"].indexOf(initialCheckoutStep) ? "bg-[#7ED957] text-white" : "bg-gray-100 text-gray-400"}`}>
                           {step.icon}
                        </div>
                        <span className={`text-[10px] md:text-sm font-black uppercase tracking-widest ${initialCheckoutStep === step.id ? "text-gray-900" : "text-gray-400"}`}>{step.label}</span>
                      </Link>
                    ))}
                 </div>
              </div>

              {initialCheckoutStep === "delivery" && (
                <div className="space-y-8 md:space-y-12">
                  <section>
                    <h2 className="text-lg md:text-xl font-black text-gray-900 mb-4 md:mb-6">Delivery Address</h2>
                    <div className="space-y-3 md:space-y-4">
                      {[{ id: "Home", address: "Emaar DHA 5, Islamabad" }, { id: "Work", address: "Blue Area, Islamabad" }].map(addr => (
                        <div key={addr.id} onClick={() => setSelectedAddress(addr.id)} className={`bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 transition-all cursor-pointer flex items-center justify-between ${selectedAddress === addr.id ? "border-[#FECE04] shadow-xl shadow-yellow-50/50" : "border-gray-100 hover:border-gray-200"}`}>
                          <div className="flex items-center gap-3 md:gap-4"><div className={`w-3 h-3 rounded-full ${selectedAddress === addr.id ? "bg-[#FECE04]" : "bg-gray-200"}`} /><div><p className="font-black text-sm md:text-base text-gray-900">{addr.id}</p><p className="text-xs md:text-sm font-bold text-gray-500">{addr.address}</p></div></div>
                          <button className="text-[#811920] font-black text-[10px] md:text-sm hover:underline">Edit</button>
                        </div>
                      ))}
                    </div>
                  </section>
                  <button onClick={() => router.push("/checkout/payment")} className="w-full bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-4 md:py-5 rounded-2xl md:rounded-3xl shadow-2xl shadow-yellow-200 transition-all hover:-translate-y-1 active:translate-y-0 text-base md:text-lg">Continue</button>
                </div>
              )}

              {initialCheckoutStep === "payment" && (
                <div className="space-y-8 md:space-y-12">
                   <h2 className="text-lg md:text-xl font-black text-gray-900 mb-4 md:mb-6">Payment Method</h2>
                   <div className="space-y-3 md:space-y-4">
                      {["Cash on Delivery", "Credit / Debit Card", "Easypaisa", "JazzCash", "Cheezious Wallet"].map(method => (
                        <div key={method} onClick={() => setSelectedPaymentMethod(method)} className={`bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 transition-all cursor-pointer flex items-center gap-3 md:gap-4 ${selectedPaymentMethod === method ? "border-[#FECE04] shadow-xl shadow-yellow-50/50" : "border-gray-100 hover:border-gray-200"}`}>
                          <div className={`w-3 h-3 rounded-full ${selectedPaymentMethod === method ? "border-[#FECE04]" : "bg-gray-200"}`} /><span className="font-black text-sm md:text-base text-gray-900">{method}</span>
                        </div>
                      ))}
                   </div>
                   <button onClick={() => router.push("/checkout/review")} className="w-full bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-4 md:py-5 rounded-2xl md:rounded-3xl shadow-2xl shadow-yellow-200 transition-all hover:-translate-y-1 active:translate-y-0 text-base md:text-lg">Continue</button>
                </div>
              )}

              {initialCheckoutStep === "review" && (
                <div className="space-y-8 md:space-y-10 animate-in fade-in duration-500">
                   <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 md:mb-6">Review your Order</h2>
                   <div className="space-y-3 md:space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-6 border border-gray-100 shadow-sm flex items-center gap-4 md:gap-6">
                           <img src={item.image} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover" />
                           <div className="flex-1 min-w-0">
                             <h4 className="font-black text-sm md:text-base text-gray-900 truncate">{item.name}</h4>
                             <p className="text-xs md:text-sm font-bold text-gray-500 mb-2">{item.variation || "Regular"}</p>
                             <div className="flex items-center gap-2 md:gap-3 bg-gray-50 w-fit px-2 py-1 rounded-lg border border-gray-100">
                               <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-black"><Minus size={12} /></button>
                               <span className="text-xs md:text-sm font-black w-4 text-center">{item.qty}</span>
                               <button onClick={() => addToCart(DISHES.find(d => d.id === item.dishId) || DISHES[0], (DISHES.find(d => d.id === item.dishId) || DISHES[0]).variations?.findIndex(v => v.name === item.variation) ?? 0)} className="text-gray-400 hover:text-black"><Plus size={12} /></button>
                             </div>
                           </div>
                           <div className="text-right flex flex-col items-end gap-2 md:gap-3">
                              <span className="font-black text-gray-900 text-base md:text-lg">Rs {item.price * item.qty}</span>
                              <button onClick={() => deleteFromCart(item.id)} className="text-red-100 hover:text-[#811920] bg-red-50 p-1.5 rounded-lg transition-colors"><Trash2 size={14} /></button>
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t border-gray-100">
                      <div className="flex justify-between text-xs md:text-sm font-bold text-gray-500"><span>Subtotal</span><span className="text-gray-900">Rs {cartTotal}</span></div>
                      <div className="flex justify-between text-xs md:text-sm font-bold text-gray-500"><span>Delivery Charges</span><span className="text-gray-900">Rs {deliveryCharges}</span></div>
                      <div className="flex justify-between items-center pt-2"><span className="text-xl md:text-2xl font-black text-gray-900">Total</span><span className="text-2xl md:text-3xl font-black text-[#811920]">Rs {grandTotal}</span></div>
                   </div>
                   <div className="space-y-4 md:space-y-6 bg-gray-50/50 rounded-3xl p-6 md:p-8 border border-gray-100">
                      <div className="flex justify-between items-start gap-4"><div><p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivering to</p><p className="font-black text-sm md:text-base text-gray-900">{selectedAddress} — {selectedAddress === "Home" ? "Emaar DHA 5, Islamabad" : "Blue Area, Islamabad"}</p></div><button onClick={() => router.push("/checkout/delivery")} className="text-[#811920] font-black text-[10px] uppercase tracking-tighter hover:underline shrink-0">Change</button></div>
                      <div className="flex justify-between items-start gap-4"><div><p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Method</p><p className="font-black text-sm md:text-base text-gray-900">{selectedPaymentMethod}</p></div><button onClick={() => router.push("/checkout/payment")} className="text-[#811920] font-black text-[10px] uppercase tracking-tighter hover:underline shrink-0">Change</button></div>
                   </div>
                   <button onClick={handlePlaceOrder} className="w-full bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-4 md:py-5 rounded-[20px] md:rounded-[24px] shadow-2xl shadow-yellow-200 transition-all hover:-translate-y-1 active:translate-y-0 text-lg md:text-xl">Place Order</button>
                </div>
              )}
            </div>
          )}

          {initialScreen === "success" && (
            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-in zoom-in fade-in duration-700 relative min-h-[80vh]">
               <div className="relative mb-6 md:mb-8"><div className="w-20 h-20 md:w-24 md:h-24 bg-[#FECE04] rounded-full flex items-center justify-center shadow-xl shadow-yellow-100 relative z-10"><CheckCircle2 size={40} className="text-white md:w-12 md:h-12" /></div><div className="absolute -top-4 -left-8 w-4 h-4 bg-red-400 rounded-sm rotate-12" /><div className="absolute top-10 -left-12 w-3 h-3 bg-blue-400 rounded-full" /><div className="absolute -bottom-2 -left-6 w-4 h-2 bg-yellow-400 rounded-full rotate-45" /><div className="absolute -top-6 right-0 w-3 h-3 bg-purple-400 rounded-sm -rotate-12" /><div className="absolute top-8 -right-10 w-4 h-4 bg-green-400 rounded-full" /><div className="absolute bottom-0 -right-8 w-3 h-3 bg-pink-400 rounded-full rotate-12" /></div>
               <h1 className="text-3xl md:text-5xl font-black text-[#811920] mb-4 text-center">Order Placed Successfully!</h1>
               <p className="text-base md:text-lg font-bold text-gray-500 mb-8 md:mb-12 text-center max-w-[500px]">Thank you! Your order has been placed and our chef is cooking up some magic.</p>
               <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 border-2 border-[#FECE04]/20 shadow-2xl shadow-yellow-50/50 flex flex-col items-center gap-4 md:gap-6 mb-8 md:mb-12 w-full max-w-[320px] md:min-w-[320px]">
                  <div className="text-center"><p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 md:mb-2">Order Number</p><p className="text-2xl md:text-3xl font-black text-[#811920]">{orderId}</p></div>
                  <div className="w-full h-px bg-gray-100" />
                  <div className="text-center"><p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 md:mb-2">Estimated Delivery Time</p><p className="text-2xl md:text-3xl font-black text-gray-900">30-40 min</p></div>
               </div>
               <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[400px]">
                  <Link href={`/orders/${orderId.replace('#','')}/track`} className="flex-1 text-center bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-4 rounded-2xl shadow-lg shadow-yellow-100 transition-all hover:-translate-y-1 active:translate-y-0 text-sm md:text-base">Track Order</Link>
                  <Link href="/home" className="flex-1 text-center bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-900 font-black py-4 rounded-2xl transition-all text-sm md:text-base">Back to Home</Link>
               </div>
               <div className="absolute bottom-0 left-0 right-0 h-[150px] md:h-[250px] pointer-events-none -z-10 opacity-80 overflow-hidden">
                  <div className="relative w-full h-full flex flex-col items-center justify-end">
                    <div className="w-full flex justify-center mb-4"><img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=200&h=200&fit=crop" alt="Delivery Rider" className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full border-4 md:border-8 border-white shadow-2xl" /></div>
                    <div className="w-full h-16 md:h-24 flex items-end gap-1 md:gap-2 px-4 md:px-10">{[40, 60, 45, 80, 55, 70, 90, 65, 50, 75].map((h, i) => (<div key={i} className="flex-1 bg-gray-50 rounded-t-lg" style={{ height: `${h}%` }} />))}</div>
                  </div>
               </div>
            </div>
          )}

          {initialScreen === "deals" && (
            <div className="animate-in fade-in duration-500">
               <div className="w-full bg-[#FECE04] h-[200px] md:h-[300px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                  <div className="flex flex-col items-center gap-2 md:gap-4 relative z-10">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-[#811920] rounded-2xl flex items-center justify-center transform rotate-12 shadow-xl shadow-maroon/20">
                        <span className="text-white font-black text-2xl md:text-4xl">C</span>
                      </div>
                      <span className="text-4xl md:text-7xl font-black italic tracking-tighter text-[#811920]">Cheezious</span>
                    </div>
                    <p className="text-[10px] md:text-xl font-black text-[#811920]/70 tracking-[0.1em] md:tracking-[0.2em] uppercase">spreading cheezy khushiyan</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-12 md:h-20 bg-white rounded-t-[50px] md:rounded-t-[100px]" />
               </div>
               <div className="p-6 md:p-12 max-w-[1200px] mx-auto">
                  <h2 className="text-2xl md:text-4xl font-black text-[#811920] mb-8 md:mb-12">Deals & Offers</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                     {DEALS.map(deal => (
                       <div key={deal.id} className="bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-5 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-[#FECE04]/30 transition-all group cursor-pointer">
                          <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 md:mb-6"><img src={deal.image} alt={deal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
                          <div className="flex justify-between items-end"><div><h3 className="font-black text-gray-900 text-base md:text-lg leading-tight mb-1">{deal.name}</h3><p className="text-xs md:text-sm font-bold text-[#811920]">Rs {deal.price}</p></div><button onClick={() => addToCart({ ...deal, category: 'deals' })} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#811920] flex items-center justify-center text-white shadow-lg shadow-maroon/10 hover:scale-110 transition-transform"><Plus size={18} /></button></div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {selectedDish && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedDish(null)} />
              <div className="bg-white rounded-[24px] md:rounded-[40px] w-full max-w-[850px] max-h-[90vh] relative overflow-y-auto md:overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in duration-300">
                <button onClick={() => setSelectedDish(null)} className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-gray-500 hover:text-black transition-colors"><X size={20} /></button>
                <div className="w-full md:w-1/2 relative bg-gray-50 flex items-center justify-center p-6 md:p-8 shrink-0">
                  <div className="relative w-full aspect-square max-w-[300px] md:max-w-none">
                    <img src={selectedDish.image} alt={selectedDish.name} className="w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
                <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
                  <div className="mb-4 md:mb-6"><h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-1 md:mb-2">{selectedDish.name}</h2><div className="flex items-center gap-2"><Star size={16} className="fill-[#FECE04] text-[#FECE04] md:w-5 md:h-5" /><span className="text-base md:text-lg font-black text-gray-700">{selectedDish.rating}</span></div></div>
                  <p className="text-sm md:text-base text-gray-500 font-medium mb-6 md:mb-8 leading-relaxed">{selectedDish.description}</p>
                  <div className="mb-6 md:mb-8"><span className="text-[#811920] font-black text-base md:text-lg">Starting Price Rs {selectedDish.price}</span></div>
                  {selectedDish.variations && (
                    <div className="mb-8 md:mb-10">
                      <p className="text-[10px] md:text-sm font-black text-gray-900 uppercase tracking-widest mb-3 md:mb-4">Choose your variation</p>
                      <div className="grid grid-cols-3 gap-2 md:gap-3">
                        {selectedDish.variations.map((v, i) => (
                          <button key={v.name} onClick={() => setActiveVariation(i)} className={`flex flex-col items-center justify-center py-3 md:py-4 rounded-xl md:rounded-2xl border-2 transition-all ${activeVariation === i ? "border-[#811920] bg-[#811920]/5" : "border-gray-100 hover:border-gray-200"}`}>
                            <span className={`text-[10px] md:text-sm font-black ${activeVariation === i ? "text-[#811920]" : "text-gray-900"}`}>{v.name}</span>
                            <span className="text-[8px] md:text-[11px] font-bold text-gray-400">Rs {v.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <button onClick={() => addToCart(selectedDish, activeVariation)} className="w-full bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl shadow-xl shadow-yellow-100 transition-all hover:-translate-y-1 active:translate-y-0 text-base md:text-lg">Add to Cart</button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Floating View Cart for Mobile */}
        {(initialScreen === "menu" || initialScreen === "deals") && cart.length > 0 && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50">
            <Link href="/cart" className="flex items-center justify-between w-full bg-[#811920] text-white p-4 rounded-2xl shadow-xl shadow-maroon/20">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-black">{cart.length}</div>
                <span className="font-black text-sm uppercase tracking-wide">View Cart</span>
              </div>
              <span className="font-black text-base">Rs {grandTotal}</span>
            </Link>
          </div>
        )}

        {(initialScreen === "menu" || initialScreen === "deals") && (
          <aside className="hidden md:flex w-[320px] lg:w-[360px] border-l border-gray-100 bg-[#FEFDFA] flex-col h-[calc(100vh-64px)] shrink-0 no-scrollbar overflow-y-auto">
            <div className="p-6 flex items-center justify-between sticky top-0 bg-[#FEFDFA] z-10 border-b border-gray-50">
              <h2 className="text-lg font-black text-gray-900">Your Order ({cart.length})</h2>
              <button onClick={clearCart} className="text-xs font-bold text-[#811920] hover:underline">Clear Cart</button>
            </div>
            <div className="flex-1 px-6 py-4 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 p-3 bg-white rounded-2xl border border-gray-50 shadow-sm relative group">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-gray-900 leading-tight mb-2 pr-4">{item.name}</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-gray-900"><Minus size={14} /></button>
                        <span className="text-sm font-black w-4 text-center">{item.qty}</span>
                        <button onClick={() => addToCart(DISHES.find(d => d.id === item.dishId) || DISHES[0], (DISHES.find(d => d.id === item.dishId) || DISHES[0]).variations?.findIndex(v => v.name === item.variation) ?? 0)} className="text-gray-400 hover:text-gray-900"><Plus size={14} /></button>
                      </div>
                      <span className="text-sm font-black text-gray-900">Rs {item.price * item.qty}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteFromCart(item.id)} className="absolute top-3 right-3 text-gray-300 hover:text-[#811920] opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                </div>
              ))}
              {cart.length > 0 && (
                <div className="bg-[#FDEFDE]/50 border border-[#FDEFDE] rounded-2xl p-4 mt-6">
                  <p className="text-[11px] font-bold text-gray-600 mb-2">We know you want to add those Fries.. 😉</p>
                  <button className="text-[10px] font-black uppercase text-[#811920]">+ ADD FRIES for Rs 100</button>
                </div>
              )}
              <div className="relative mt-4"><Ticket size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Have a Promo Code?" className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-11 pr-16 outline-none focus:border-[#FECE04] text-xs font-bold" /><button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-[#811920]">Apply</button></div>
            </div>
            <div className="p-6 bg-white border-t border-gray-50 space-y-3 sticky bottom-0">
              <div className="flex justify-between text-xs font-bold text-gray-500"><span>Subtotal</span><span className="text-gray-900">Rs {cartTotal}</span></div>
              <div className="flex justify-between text-xs font-bold text-gray-500"><span>Delivery Charges</span><span className="text-gray-900">Rs {deliveryCharges}</span></div>
              <div className="flex justify-between pt-3 border-t border-gray-100"><span className="text-xl font-black text-gray-900">Total</span><span className="text-xl font-black text-[#811920]">Rs {grandTotal}</span></div>
              <Link href="/cart" className="block w-full text-center bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-4 rounded-2xl mt-4 shadow-lg shadow-yellow-200 transition-all hover:-translate-y-1 active:translate-y-0 text-lg uppercase tracking-wide">Go to Cart</Link>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
