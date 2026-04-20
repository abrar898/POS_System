"use client";

import * as React from "react";
import { 
  Search, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  Plus, 
  Minus,
  LayoutGrid,
  Clock,
  Bike,
  UtensilsCrossed,
  X,
  CreditCard,
  Banknote,
  Navigation,
  ClipboardList,
  History,
  Activity,
  Wallet,
  Settings,
  HelpCircle,
  Home,
  ShoppingBag,
  List,
  Bell,
  User,
  MoreVertical,
  Star
} from "lucide-react";
import { useRouter } from "next/navigation";

// Mock Data
const MENU_ITEMS = [
  { id: 101, name: "Classic Beef Burger", price: 45000, category: "Main Dish", img: "🍔" },
  { id: 102, name: "Double Cheese Burger", price: 65000, category: "Main Dish", img: "🍔" },
  { id: 1, name: "Es Buah", price: 26000, category: "Beverage", img: "🍧" },
  { id: 2, name: "Es Cincau", price: 20000, category: "Beverage", img: "🥤" },
  { id: 3, name: "Es Cendol Ijo", price: 20000, category: "Beverage", img: "🍹" },
  { id: 4, name: "Es Pisang Ijo", price: 25000, category: "Beverage", img: "🍨" },
  { id: 5, name: "Es Kelapa Muda", price: 22000, category: "Beverage", img: "🥥" },
  { id: 6, name: "Es Teler", price: 28000, category: "Beverage", img: "🍧" },
];

const ORDER_LIST_TASKS = [
  { id: "#324398", type: "Takeaway", name: "Juna Wok", time: "07-05-2025, 03:19 pm", items: 4, status: "Waiting", statusColor: "text-orange-500 bg-orange-50" },
  { id: "#223399", type: "Delivery", name: "Jung Kit", time: "07-05-2025, 03:10 pm", items: 6, status: "Ready", statusColor: "text-emerald-500 bg-emerald-50" },
  { id: "#114481", type: "Dine in", name: "John Pantau", time: "07-05-2025, 02:19 pm", items: 10, status: "Canceled", statusColor: "text-rose-500 bg-rose-50" },
];

export function MenuOrderPage() {
  const router = useRouter();
  const [cart, setCart] = React.useState<any[]>([]);
  const [category, setCategory] = React.useState("Main Dish");
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = subtotal * 0.1;
  const taxes = subtotal * 0.02;
  const total = subtotal - discount + taxes;

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        return { ...i, quantity: Math.max(1, i.quantity + delta) };
      }
      return i;
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#EDEDED] font-sans selection:bg-black/10 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-[80px] bg-white border-r border-slate-200 flex flex-col items-center py-8">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg mb-8">
          <UtensilsCrossed size={20} fill="white" />
        </div>
        
        <div className="w-1 h-1 bg-slate-200 rounded-full mb-8" />

        <div className="flex flex-col gap-8 opacity-40">
            <button onClick={() => router.push('/counter')}><LayoutGrid size={22} /></button>
            <button className="opacity-100 text-black border-l-2 border-black pl-1"><ShoppingBag size={22} /></button>
            <button onClick={() => router.push('/counter/orders')}><List size={22} /></button>
            <button><User size={22} /></button>
        </div>

        <div className="w-1 h-1 bg-slate-200 rounded-full mt-8" />
        
        <button className="mt-auto opacity-40 hover:opacity-100 transition-opacity"><MoreVertical size={20} /></button>
      </aside>

      {/* Sidebar - Mobile/Bottom Nav */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-20 bg-white shadow-2xl rounded-[30px] border border-slate-100 z-50 flex items-center justify-around px-4">
          <button onClick={() => router.push('/counter')} className="text-slate-300"><LayoutGrid size={24} /></button>
          <button className="text-black"><ShoppingBag size={24} /></button>
          <button onClick={() => router.push('/counter/orders')} className="text-slate-300"><List size={24} /></button>
          <button className="text-slate-300"><User size={24} /></button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32 lg:pb-0">
        <header className="h-[100px] lg:h-[120px] px-6 lg:px-10 flex items-center justify-between">
          <div className="flex-1 max-w-[600px] relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search category or menu..." 
              className="h-[50px] lg:h-[60px] w-full border-none rounded-[15px] lg:rounded-[20px] bg-[#E0E0E0]/50 pl-14 pr-6 text-[14px] lg:text-[16px] font-semibold text-slate-600 focus:outline-none focus:bg-white transition-all shadow-inner"
            />
          </div>
          
          <button className="lg:hidden ml-4 h-[50px] w-[50px] bg-white rounded-[15px] flex items-center justify-center border border-slate-100 shadow-sm relative">
             <ShoppingBag size={20} />
             {cart.length > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-black">{cart.length}</span>}
          </button>
        </header>

        <div className="px-6 lg:px-10 space-y-8 lg:space-y-10">
          <section>
            <h2 className="text-xl font-black text-slate-800 mb-6 lg:mb-8 tracking-tight">Categories</h2>
            
            {/* Categories - Design.png Style */}
            <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 mb-6 lg:mb-10 no-scrollbar">
               {[
                 { id: "Appetizer", label: "Bakery", img: "🥐" },
                 { id: "Main Dish", label: "Seafood", img: "🦐" },
                 { id: "Pizza", label: "Pizza", img: "🍕" },
                 { id: "Main Dish", label: "Chicken", img: "🍗" },
                 { id: "Beverage", label: "Beverages", img: "☕" },
                 { id: "Main Dish", label: "Burgers", img: "🍔" },
               ].map((cat, i) => (
                 <button 
                  key={i}
                  onClick={() => setCategory(cat.id)}
                  className={`min-w-[120px] h-[120px] rounded-[25px] flex flex-col items-center justify-center gap-3 transition-all ${
                    category === cat.id ? "bg-black text-white shadow-xl shadow-black/20" : "bg-white/60 text-slate-400 hover:bg-white hover:text-slate-600"
                  }`}
                 >
                   <div className="text-3xl">{cat.img}</div>
                   <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                 </button>
               ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {MENU_ITEMS.filter(item => category === "All" || item.category === category).map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedItem(item)}
                  className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm group hover:shadow-2xl transition-all duration-500 cursor-pointer relative"
                >
                  <div className="aspect-square rounded-[25px] bg-[#EDEDED] mb-6 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500 overflow-hidden relative shadow-inner">
                    {item.img}
                  </div>
                  
                  <div className="flex gap-0.5 text-black mb-2">
                    {[1,2,3,4].map(star => <Star key={star} size={12} fill="currentColor" />)}
                    <Star size={12} className="text-slate-200" fill="currentColor" />
                  </div>

                  <h3 className="text-[15px] font-black text-slate-800 leading-tight">{item.name}</h3>
                  <p className="text-[15px] font-black text-slate-400 mt-2">{item.price.toLocaleString()} PKR</p>
                  
                  <button className="absolute bottom-6 right-6 h-10 w-10 bg-black text-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                    <Plus size={20} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Orders - Design.png Style */}
          <section className="pb-20 lg:pb-10">
            <h2 className="text-xl font-black text-slate-800 mb-6 tracking-tight">Recent Order</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 lg:gap-8">
               {[
                 { img: "🍔", name: "Cheese Burger" },
                 { img: "🍕", name: "Pepperoni Pizza" },
                 { img: "☕", name: "Iced Coffee" },
                 { img: "🍗", name: "Fried Chicken" },
               ].map((o, i) => (
                 <div key={i} className="h-[200px] bg-white rounded-[35px] border border-slate-100 flex items-center justify-center text-6xl shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                    <div className="group-hover:scale-110 transition-transform duration-500">{o.img}</div>
                 </div>
               ))}
            </div>
          </section>
        </div>
      </main>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-[500px] rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="h-64 bg-slate-100 flex items-center justify-center text-8xl relative">
              {selectedItem.img}
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 h-10 w-10 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-lg hover:scale-110 transition-transform"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-black text-slate-800">{selectedItem.name}</h3>
                <p className="text-lg font-bold text-[#0055A4]">Rp. {selectedItem.price.toLocaleString()}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Choose Variant</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Regular", "Large"].map(v => (
                       <button key={v} className={`py-3 rounded-2xl border-2 font-bold text-sm transition-all ${v === "Regular" ? "border-[#0055A4] bg-blue-50 text-[#0055A4]" : "border-slate-100 text-slate-400"}`}>
                         {v}
                       </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Add-ons</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Normal Sugar", "Less Sugar", "No Sugar"].map(v => (
                       <button key={v} className={`py-3 rounded-2xl border-2 font-bold text-xs transition-all ${v === "Normal Sugar" ? "border-[#0055A4] bg-blue-50 text-[#0055A4]" : "border-slate-100 text-slate-400"}`}>
                         {v}
                       </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  addToCart(selectedItem);
                  setSelectedItem(null);
                }}
                className="w-full py-4 rounded-2xl bg-[#0055A4] text-white font-black shadow-xl shadow-[#0055A4]/20 hover:bg-[#004280] transition-all flex items-center justify-center gap-3"
              >
                <Plus size={20} /> Add to Cart (Rp. {selectedItem.price.toLocaleString()})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right Sidebar - Design.png Style (Hidden on small screens) */}
      <aside className="hidden lg:flex w-[440px] bg-white border-l border-slate-200 flex-col p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
           <div className="flex gap-4">
              <button className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-800 border shadow-sm"><Bell size={20} /></button>
              <button className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-800 border shadow-sm"><Settings size={20} /></button>
           </div>
           <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan" alt="User" />
           </div>
        </div>

        <section className="mb-10">
           <h3 className="text-xl font-black text-slate-800 mb-6 tracking-tight">Your Balance</h3>
           <div className="bg-[#EDEDED] rounded-[30px] p-8 flex justify-between items-center group cursor-pointer hover:bg-slate-200 transition-all">
              <div className="bg-white px-6 py-4 rounded-2xl shadow-sm">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Balance</p>
                 <p className="text-xl font-black text-slate-800">250 PKR</p>
              </div>
              <button className="h-10 px-6 bg-slate-400/20 text-slate-600 text-xs font-black rounded-xl hover:bg-black hover:text-white transition-all uppercase tracking-widest">Change</button>
           </div>
        </section>

        <section className="flex-1 flex flex-col min-h-0">
          <h2 className="text-xl font-black text-slate-800 mb-8 tracking-tight">Order Menu</h2>
          <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-6 items-center group">
                <div className="h-16 w-16 bg-[#EDEDED] rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform shrink-0">
                  {item.img}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-black text-slate-800 truncate">{item.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-slate-800">+ {item.price * item.quantity} PKR</p>
                  </div>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-200 opacity-50">
                 <ShoppingBag size={48} strokeWidth={1} />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-4">Empty Cart</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-10 pt-10 border-t border-slate-100 space-y-6">
           <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Service</span>
              <span className="text-slate-800">+20 PKR</span>
           </div>
           <div className="flex justify-between items-center transition-all">
              <span className="text-[20px] font-black text-slate-800 tracking-tight">Total</span>
              <span className="text-3xl font-black text-slate-800 tracking-tighter">{total.toLocaleString()} PKR</span>
           </div>

           <div className="relative">
              <input 
                type="text" 
                placeholder="Have a Coupon code?" 
                className="w-full h-14 bg-[#EDEDED] border-none rounded-[15px] px-14 text-sm font-bold text-slate-600 focus:ring-0"
              />
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"><LayoutGrid size={18} /></div>
           </div>

           <button 
            onClick={() => router.push('/counter/payment')}
            disabled={cart.length === 0}
            className="w-full h-[60px] bg-slate-300 text-slate-600 text-sm font-black rounded-[15px] hover:bg-black hover:text-white transition-all disabled:opacity-50 active:scale-95 shadow-sm"
           >
              Checkout
           </button>
        </section>
      </aside>
    </div>
  );
}
