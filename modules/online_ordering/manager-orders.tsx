"use client";

import React, { useState } from "react";
import { 
  CheckCircle, 
  Clock, 
  Trash2, 
  MoreVertical, 
  Globe, 
  Search, 
  Filter,
  Check,
  ChevronRight,
  Truck,
  Package,
  Home,
  BookOpen,
  Mail,
  Sun,
  Moon,
  Settings,
  User
} from "lucide-react";

const MOCK_ONLINE_ORDERS = [
  { id: "ORD-928421", customer: "Ethan", phone: "0301-445211", total: 1250, status: "pending", time: "2m ago", type: "delivery" },
  { id: "ORD-125421", customer: "Sara", phone: "0321-555666", total: 850, status: "preparing", time: "15m ago", type: "pickup" },
  { id: "ORD-998121", customer: "Ahmed", phone: "0333-777888", total: 2450, status: "dispatched", time: "30m ago", type: "delivery" },
];

export function OnlineOrdersManager() {
  const [orders, setOrders] = useState(MOCK_ONLINE_ORDERS);
  const [activeModule, setActiveModule] = useState("Online Orders");

  const updateStatus = (id: string, newStatus: string) => {
     setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="flex h-screen w-screen bg-[#F5F6FA] text-[#1a1a2e] overflow-hidden font-sans selection:bg-[#1a1a2e] selection:text-white">
      {/* ── Sidebar ── */}
      <aside className="w-[72px] bg-white border-r border-[#EBEBF0] flex flex-col items-center py-6 gap-8 z-10 shrink-0">
        <div className="w-10 h-10 bg-[#1a1a2e] rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer">
           <div className="grid grid-cols-2 gap-[3px]">
             <div className="w-[7px] h-[7px] bg-white rounded-[1.5px] opacity-100" />
             <div className="w-[7px] h-[7px] bg-white rounded-[1.5px] opacity-60" />
             <div className="w-[7px] h-[7px] bg-white rounded-[1.5px] opacity-40" />
             <div className="w-[7px] h-[7px] bg-white rounded-[1.5px] opacity-20" />
           </div>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          {[
            { id: "Home", icon: <Home size={20} /> },
            { id: "Sales", icon: <Clock size={20} /> },
            { id: "Menu", icon: <BookOpen size={20} /> },
            { id: "Staff", icon: <Mail size={20} /> },
            { id: "Online Orders", icon: <Globe size={20} /> },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveModule(item.id)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                activeModule === item.id 
                  ? "bg-[#1a1a2e] text-white shadow-xl shadow-[#1a1a2e]/20" 
                  : "text-[#C5C8D0] hover:text-[#1a1a2e] hover:bg-[#F5F6FA]"
              }`}
            >
              {item.icon}
            </button>
          ))}
        </div>

        <div className="bg-[#F5F6FA] rounded-2xl p-1 flex flex-col gap-1 border border-[#EBEBF0]">
          <button className="w-9 h-9 rounded-xl bg-[#1a1a2e] text-white flex items-center justify-center shadow-sm">
            <Sun size={16} />
          </button>
          <button className="w-9 h-9 rounded-xl text-[#C5C8D0] flex items-center justify-center hover:text-[#1a1a2e] transition-colors">
            <Moon size={16} />
          </button>
        </div>
      </aside>

      {/* ── Main Dashboard ── */}
      <main className="flex-1 flex flex-col p-10 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
         <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Online Orders</h1>
            <p className="text-[#a0a8b2] text-sm font-medium mt-1 pr-12">Aggregate orders from Website, Foodpanda, and Cheetay in one queue.</p>
         </div>
         <div className="flex gap-3">
            <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a8b2]" size={16} />
               <input 
                 type="text" 
                 placeholder="Search Order ID" 
                 className="p-3 pl-10 border border-[#EBEBF0] rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#1a1a2e]/5 w-64 bg-white shadow-sm"
               />
            </div>
            <button className="p-3 bg-white border border-[#EBEBF0] rounded-xl text-[#a0a8b2] hover:text-[#1a1a2e] shadow-sm">
               <Filter size={18} />
            </button>
         </div>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-4 gap-6 mb-10">
         <StatsCard label="New Orders" value="12" color="#f472b6" />
         <StatsCard label="Preparing" value="5" color="#818cf8" />
         <StatsCard label="Dispatched" value="3" color="#fbbf24" />
         <StatsCard label="Revenue Today" value="PKR 45.4K" color="#10b981" />
      </div>

      {/* Main Order Queue Board */}
      <div className="grid grid-cols-3 gap-8">
         {["pending", "preparing", "dispatched"].map((colStatus) => (
           <div key={colStatus} className="flex flex-col gap-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-sm font-black uppercase tracking-widest text-[#a0a8b2]">
                   {colStatus} <span className="ml-2 text-[10px] py-1 px-2 bg-white rounded-full shadow-sm text-black">{orders.filter(o => o.status === colStatus).length}</span>
                 </h3>
                 <MoreVertical size={16} className="text-[#a0a8b2]" />
              </div>
              
              <div className="flex flex-col gap-5">
                 {orders.filter(o => o.status === colStatus).map((order) => (
                   <div key={order.id} className="bg-white p-6 rounded-[28px] card-shadow border border-[#EBEBF0] hover:scale-[1.02] transition-all group cursor-pointer relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                         <div className="w-10 h-10 bg-[#F5F6FA] rounded-2xl flex items-center justify-center text-[#1a1a2e] mb-2">
                            {order.type === 'delivery' ? <Truck size={18} /> : <Package size={18} />}
                         </div>
                         <div className="text-[10px] font-black uppercase text-[#a0a8b2] tracking-widest">{order.time}</div>
                      </div>
                      
                      <h4 className="text-base font-black mb-0.5">{order.customer}</h4>
                      <p className="text-[11px] font-bold text-[#a0a8b2] mb-4">{order.phone}</p>
                      
                      <div className="flex justify-between items-center py-4 border-t border-[#F5F6FA]">
                         <span className="text-lg font-black">{order.total} PKR</span>
                         <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                const nextStatus = colStatus === 'pending' ? 'preparing' : 'dispatched';
                                updateStatus(order.id, nextStatus)
                              }}
                              className="w-10 h-10 bg-[#1a1a2e] text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                            >
                               <ChevronRight size={18} />
                            </button>
                         </div>
                      </div>
                      
                      {/* Status indicator bubble */}
                      <div className={`absolute top-0 right-0 w-2 h-full ${colStatus === 'pending' ? 'bg-[#f472b6]' : colStatus === 'preparing' ? 'bg-[#818cf8]' : 'bg-[#fbbf24]'}`} />
                   </div>
                 ))}
              </div>
           </div>
         ))}
      </div>
      </main>

      {/* Admin Sidebar */}
      <aside className="w-[280px] bg-white border-l border-[#EBEBF0] p-8 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-lg">Admin</h2>
          <Settings size={20} className="text-[#a0a8b2]" />
        </div>
        <div className="flex items-center gap-4 p-4 bg-[#F5F6FA] rounded-2xl">
          <div className="w-12 h-12 bg-[#1a1a2e] rounded-full flex items-center justify-center text-white">
            <User size={24} />
          </div>
          <div>
            <p className="font-black text-sm">Admin User</p>
            <p className="text-[11px] text-[#a0a8b2] font-bold">Manager</p>
          </div>
        </div>
      </aside>

      <style jsx global>{`
        .card-shadow {
           box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
}

function StatsCard({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="bg-white p-6 rounded-[28px] card-shadow border border-[#f0f1f5] group hover:scale-[1.02] transition-all relative overflow-hidden">
       <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-4 rounded-full" style={{ backgroundColor: color }} />
          <p className="text-[11px] font-bold text-[#a0a8b2] uppercase tracking-wider">{label}</p>
       </div>
       <h4 className="text-2xl font-black text-[#1a1a2e]">{value}</h4>
       <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-3xl opacity-10" style={{ backgroundColor: color }} />
    </div>
  );
}
