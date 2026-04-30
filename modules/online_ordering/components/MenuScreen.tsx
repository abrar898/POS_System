import React from "react";
import { Search, Filter, ChevronDown, Star, Plus, Truck, Package, MapPin, Clock } from "lucide-react";
import { CATEGORIES, DISHES, COLORS } from "../constants";

interface MenuScreenProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  orderType: string;
  setOrderType: (type: "delivery" | "pickup") => void;
  search: string;
  setSearch: (s: string) => void;
  setSelectedDish: (dish: any) => void;
  addToCart: (dish: any) => void;
}

export function MenuScreen({
  activeCategory,
  setActiveCategory,
  orderType,
  setOrderType,
  search,
  setSearch,
  setSelectedDish,
  addToCart
}: MenuScreenProps) {
  
  const filteredDishes = DISHES.filter(d =>
    (activeCategory === "popular" || d.category === activeCategory) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Hero Section */}
      <section className="m-4 md:m-8 rounded-[32px] md:rounded-[48px] bg-[#FDEFDE] p-6 md:p-16 flex flex-col md:flex-row items-center relative overflow-hidden min-h-[400px] md:h-[450px]">
        {/* Text Content */}
        <div className="w-full md:w-3/5 z-10 flex flex-col items-start text-left">
          <h1 className="text-4xl md:text-7xl font-black md:leading-[1.1] mb-4 text-gray-900">
            Order Your<br />
            Favorites in <span style={{ color: COLORS.deepMaroon }}>Seconds.</span>
          </h1>
          <p className="text-gray-700 font-bold mb-8 md:mb-10 text-sm md:text-lg">Fresh. Hot. Delivered fast to your door.</p>
          
          <div className="flex flex-col gap-4 w-full sm:w-auto">
            {/* Row 1: Toggle Buttons */}
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-1.5 flex shadow-sm border border-white/50 w-full sm:w-fit">
              <button 
                onClick={() => setOrderType("delivery")}
                className={`flex-1 sm:px-8 py-3 rounded-full text-xs md:text-sm font-black transition-all flex items-center justify-center gap-2 ${orderType === "delivery" ? "bg-[#FECE04] text-black shadow-lg" : "text-gray-500 hover:text-gray-900"}`}
              >
                <Truck size={18} /> Delivery
              </button>
              <button 
                onClick={() => setOrderType("pickup")}
                className={`flex-1 sm:px-8 py-3 rounded-full text-xs md:text-sm font-black transition-all flex items-center justify-center gap-2 ${orderType === "pickup" ? "bg-[#FECE04] text-black shadow-lg" : "text-gray-500 hover:text-gray-900"}`}
              >
                <Package size={18} /> Pickup
              </button>
            </div>
            
            {/* Row 2: Location and Time */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-3 flex items-center gap-3 border border-white/50 shadow-sm flex-1 max-w-full sm:max-w-[320px]">
                <MapPin size={20} className="text-[#811920]" />
                <span className="text-xs md:text-sm font-black text-gray-800 flex-1 truncate">Emaar DHA 5, Islamabad</span>
                <ChevronDown size={18} className="text-gray-400" />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-3 flex items-center gap-3 border border-white/50 shadow-sm w-fit">
                <Clock size={20} className="text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] md:text-[11px] font-black text-gray-900 leading-tight">20-30 min</span>
                  <span className="text-[8px] md:text-[9px] font-bold text-gray-500 uppercase tracking-wider">Delivery Time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-[45%] items-center justify-end">
           <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src="/banner-food.png" 
                alt="Cheezious Special" 
                className="w-[120%] max-w-none h-auto object-contain transform translate-x-10 scale-110 drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]" 
              />
              <div className="absolute top-[20%] left-0 bg-white p-4 rounded-3xl shadow-2xl border border-gray-50 max-w-[140px] transform -rotate-12 animate-bounce-slow">
                <p className="text-[14px] md:text-[16px] font-black italic text-[#FECE04] leading-tight" style={{ fontFamily: "'Playball', cursive" }}>Cheesy<br/>Goodness</p>
              </div>
              <div className="absolute right-10 bottom-[15%] bg-[#FECE04] p-5 rounded-full shadow-2xl transform rotate-12 flex flex-col items-center justify-center border-4 border-white">
                <p className="text-[10px] md:text-[12px] font-black uppercase text-center leading-tight text-black">FRIES<br/>ALWAYS A<br/>GOOD IDEA</p>
              </div>
           </div>
        </div>

        {/* Mobile Image */}
        <div className="md:hidden absolute -bottom-10 -right-10 w-48 h-48 opacity-40 pointer-events-none">
           <img src="/banner-food.png" className="w-full h-full object-contain" />
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
                onClick={() => setSelectedDish(dish)} 
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
  );
}
