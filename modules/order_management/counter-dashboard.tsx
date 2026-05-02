"use client";

import * as React from "react";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  UtensilsCrossed,
  MoreHorizontal,
  ChevronDown,
  Star,
  MessageSquare,
  LayoutGrid,
  BarChart3,
  MessageCircle,
  Users,
  ClipboardList,
  Settings,
  Headphones,
  LogOut,
  Search,
  Bell,
  Mail,
  Flame,
  Plus,
  User,
  List,
  MoreVertical
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const SALES_DATA = [
  { day: "Sun", sales: 20 },
  { day: "Mon", sales: 30 },
  { day: "Tue", sales: 25 },
  { day: "Wed", sales: 38 },
  { day: "Thu", sales: 48 },
  { day: "Fri", sales: 42 },
  { day: "Sat", sales: 40 },
];

const KITCHEN_DATA = [
  { name: "Fluent", value: 60, color: "#22c55e" },
  { name: "Congested", value: 25, color: "#3b82f6" },
  { name: "Busy", value: 15, color: "#ef4444" },
];

const POPULAR_MENU = [
  { name: "Sushi Platter", price: 243217, rating: 4.9, reviews: 130, img: "🍱" },
  { name: "Beef Burger", price: 174543, rating: 4.8, reviews: 104, img: "🍔" },
  { name: "Pizza", price: 127999, rating: 4.7, reviews: 89, img: "🍕" },
];

const LATEST_ORDERS = [
  { id: "FD-8095", name: "Emilio Bruce", time: "10 AM, Thu 8", meal: "Grilled Salmon", qty: 2, status: "Done" },
  { id: "FD-8094", name: "Dani Garner", time: "9 AM, Thu 8", meal: "Beef Burger", qty: 1, status: "Ready" },
  { id: "FD-8093", name: "Louisa Walter", time: "9 AM, Thu 8", meal: "Tom Yum Soup", qty: 3, status: "Process" },
  { id: "FD-8092", name: "Ellis Krueger", time: "8 AM, Thu 8", meal: "Chicken Alfredo", qty: 1, status: "Ready" },
  { id: "FD-8091", name: "Zaiden Good", time: "7 AM, Thu 8", meal: "Vegetable Stir", qty: 2, status: "Process" },
];

import { api } from "@/lib/api";

export function CounterDashboard() {
  const router = useRouter();
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.orders.getAll();
        setOrders(data);
      } catch (err) {
        console.error("Dashboard failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    const interval = setInterval(loadData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const stats = React.useMemo(() => {
    const totalIncome = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);
    const orderTotal = orders.length;
    const inProgress = orders.filter(o => ["pending", "preparing", "sent"].includes(o.status)).length;
    const completed = orders.filter(o => o.status === "completed" || o.status === "delivered").length;
    const cancelled = orders.filter(o => o.status === "cancelled").length;

    return {
      income: totalIncome,
      orderTotal,
      inProgress,
      completed,
      cancelled
    };
  }, [orders]);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#EDEDED] font-sans selection:bg-black/10 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-[80px] bg-white border-r border-slate-200 flex-col items-center py-8">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg mb-8">
          <Flame size={20} fill="white" />
        </div>
        
        <div className="w-1 h-1 bg-slate-200 rounded-full mb-8" />

        <div className="flex flex-col gap-8 opacity-40">
            <button className="opacity-100 text-black border-l-2 border-black pl-1"><LayoutGrid size={22} /></button>
            <button onClick={() => router.push('/counter/menu-order')}><ShoppingBag size={22} /></button>
            <button onClick={() => router.push('/counter/orders')}><List size={22} /></button>
            <button><User size={22} /></button>
        </div>

        <div className="w-1 h-1 bg-slate-200 rounded-full mt-8" />
        
        <button className="mt-auto opacity-40 hover:opacity-100 transition-opacity"><MoreVertical size={20} /></button>
      </aside>

      {/* Sidebar - Mobile/Bottom Nav */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-20 bg-white shadow-2xl rounded-[30px] border border-slate-100 z-50 flex items-center justify-around px-4">
          <button className="text-black"><LayoutGrid size={24} /></button>
          <button onClick={() => router.push('/counter/menu-order')} className="text-slate-300"><ShoppingBag size={24} /></button>
          <button onClick={() => router.push('/counter/orders')} className="text-slate-300"><List size={24} /></button>
          <button className="text-slate-300"><User size={24} /></button>
      </nav>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto pb-32 lg:pb-10">
        <header className="h-[100px] lg:h-[120px] px-6 lg:px-10 flex items-center justify-between">
          <div className="flex-1 max-w-[600px] relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search category or menu..." 
              className="h-[50px] lg:h-[60px] w-full border-none rounded-[15px] lg:rounded-[20px] bg-[#E0E0E0]/50 pl-14 pr-6 text-[14px] lg:text-[16px] font-semibold text-slate-600 focus:outline-none focus:bg-white transition-all shadow-inner"
            />
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4 ml-4">
            <button className="h-10 w-10 lg:h-12 lg:w-12 flex items-center justify-center rounded-[12px] lg:rounded-[15px] bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
              <Bell size={20} />
            </button>
            <div className="hidden sm:block h-10 w-10 lg:h-12 lg:w-12 rounded-[12px] lg:rounded-[15px] overflow-hidden border-2 border-white shadow-lg">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="px-6 lg:px-10 space-y-8 lg:space-y-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-[#FF5B22] rounded-[32px] p-7 text-white relative overflow-hidden shadow-2xl shadow-orange-500/30">
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="bg-white/20 p-2.5 rounded-2xl">
                  <ShoppingBag size={22} className="text-white" />
                </div>
                <button className="p-1 hover:bg-white/10 rounded-lg transition-colors"><MoreHorizontal size={22} /></button>
              </div>
              <div className="relative z-10">
                <p className="text-[14px] font-bold text-white/70">Income</p>
                <p className="text-[34px] font-black mt-1">Rs. {stats.income.toLocaleString()}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[12px] font-black"><TrendingUp size={12} /> Live</span>
                  <span className="text-[12px] font-bold text-white/50">Total Earnings</span>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </div>

            {[
              { title: "Order total", val: stats.orderTotal.toString(), sub: "Total", icon: ShoppingBag, color: "text-orange-500", bg: "bg-orange-50" },
              { title: "Order in progress", val: stats.inProgress.toString(), sub: "Live", icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
              { title: "Order Completed", val: stats.completed.toString(), sub: "Total", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
              { title: "Order Cancelled", val: stats.cancelled.toString(), sub: "Total", icon: UtensilsCrossed, color: "text-red-500", bg: "bg-red-50" },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-[32px] p-7 border border-slate-50 shadow-sm relative group hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-2.5 rounded-2xl ${c.bg} ${c.color}`}>
                    <c.icon size={22} />
                  </div>
                  <button className="text-slate-300 hover:text-slate-800 p-1"><MoreHorizontal size={22} /></button>
                </div>
                <div>
                  <p className="text-[14px] font-black text-slate-300">{c.title}</p>
                  <p className="text-[34px] font-black text-slate-800 mt-1">{c.val}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className={`text-[12px] font-black text-slate-400`}>{c.sub}</span>
                    <span className="text-[12px] font-bold text-slate-400">All time</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Graph */}
            <div className="lg:col-span-1.5 bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-slate-800">Sales Graph</h3>
                <div className="bg-orange-50 text-orange-500 px-4 py-1.5 rounded-full text-xs font-black">50%</div>
              </div>
              <div className="flex-1 min-h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SALES_DATA}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF5B22" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#FF5B22" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8', fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8', fontWeight: 600 }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="sales" stroke="#FF5B22" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Kitchen Status */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-10">Kitchen Status</h3>
              <div className="flex flex-col items-center">
                <div className="relative h-48 w-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={KITCHEN_DATA}
                        innerRadius={70}
                        outerRadius={92}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {KITCHEN_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[40px] font-black text-slate-800 leading-none">77%</p>
                  </div>
                </div>
                <div className="mt-10 flex gap-6">
                  {KITCHEN_DATA.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[13px] font-bold text-slate-400">{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-8">Rating And Reviews</h3>
                <div className="flex items-center gap-2.5 mb-6">
                  {[1, 2, 3, 4].map(i => <Star key={i} size={18} fill="#fbbf24" stroke="#fbbf24" />)}
                  <Star size={18} fill="#E2E8F0" stroke="#E2E8F0" />
                  <span className="ml-2 text-base font-black text-slate-800">4,80 Star</span>
                </div>
                <div className="grid grid-cols-2 gap-5 mb-8">
                  <div className="p-5 rounded-[24px] bg-emerald-50/50">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Positive</span>
                    <p className="text-[18px] font-black text-emerald-600 flex items-center gap-1.5 mt-1.5"><TrendingUp size={18} /> 97%</p>
                  </div>
                  <div className="p-5 rounded-[24px] bg-rose-50/50">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Negative</span>
                    <p className="text-[18px] font-black text-rose-600 flex items-center gap-1.5 mt-1.5"><Clock size={18} /> 3%</p>
                  </div>
                </div>
              </div>
              <button className="w-full py-4.5 rounded-[20px] bg-[#F8FAFC] text-slate-600 text-[15px] font-black hover:bg-slate-100 transition-all">
                Detail Reviews
              </button>
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-10 pb-10">
            <div className="xl:col-span-2 bg-white rounded-[40px] p-6 lg:p-10 shadow-sm border border-slate-100 overflow-x-auto">
              <div className="flex justify-between items-center mb-10 min-w-[600px]">
                <h3 className="text-xl font-black text-slate-800">Order Updates</h3>
                <button className="text-sm font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">View All</button>
              </div>
              
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50">
                    <th className="pb-6 px-4">Track ID</th>
                    <th className="pb-6 px-4">Customer Name</th>
                    <th className="pb-6 px-4">Details</th>
                    <th className="pb-6 px-4">Price</th>
                    <th className="pb-6 px-4">Status</th>
                    <th className="pb-6 px-4">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.slice(0, 10).map((o, i) => {
                    const utcStr = o.created_at.includes('Z') || o.created_at.includes('+') ? o.created_at : `${o.created_at}Z`;
                    const date = new Date(utcStr);
                    const formattedDate = date.toLocaleDateString('en-PK', { day: '2-digit', month: 'short' });
                    const formattedTime = date.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true });
                    
                    return (
                      <tr key={o.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="py-5 px-4 font-black text-slate-800 text-sm uppercase tracking-wider">
                          #{ (o.id || o._id || '000000').toString().slice(-6) }
                        </td>
                        <td className="py-5 px-4 text-sm font-bold text-slate-700">{o.customer_name || 'Walk-in'}</td>
                        <td className="py-5 px-4">
                          <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">
                            {o.items?.map((item: any) => `${item.quantity}x ${item.product_name || 'Item'}`).join(', ')}
                          </p>
                        </td>
                        <td className="py-5 px-4 font-black text-[#811920] text-sm">
                          Rs. {o.total_price || 0}
                        </td>
                        <td className="py-5 px-4">
                          <span className={`px-4 py-1.5 rounded-xl text-[11px] font-black ${
                            o.status === 'completed' || o.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                            o.status === 'pending' || o.status === 'preparing' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {o.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-5 px-4 text-sm font-bold text-slate-400">
                          {formattedDate}, {formattedTime}
                        </td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400 font-bold">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Popular Menu */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-slate-800">Popular Menu</h3>
                <button className="text-[13px] font-black text-slate-400 flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-50 rounded-xl transition-all">
                  Today <ChevronDown size={14} />
                </button>
              </div>
              <div className="space-y-6 flex-1">
                {POPULAR_MENU.map((m, i) => (
                  <div key={i} className="flex items-center gap-5 group cursor-pointer">
                    <div className="h-16 w-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-300 shadow-sm border border-slate-100">
                      {m.img}
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] font-black text-slate-800 tracking-tight">{m.name}</p>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400"><Star size={12} fill="#fbbf24" stroke="#fbbf24" /> {m.rating}</span>
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400"><MessageSquare size={12} /> {m.reviews}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-emerald-50 text-emerald-600 text-[11px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                        <TrendingUp size={12} /> ${m.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
