"use client";

import * as React from "react";
import { 
  LayoutGrid, 
  List, 
  Search, 
  MoreVertical, 
  ChevronRight,
  Clock,
  User,
  ShoppingBag,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { useOrderCashierStore } from "./order-store";
import { useRouter } from "next/navigation";

export function CounterOrdersList() {
  const router = useRouter();
  const [view, setView] = React.useState<"card" | "table">("table");
  const orders = useOrderCashierStore((s) => s.orders).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#EDEDED] font-sans selection:bg-black/10 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-[80px] bg-white flex flex-col items-center py-8 border-r border-slate-200">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg mb-8">
          <LayoutGrid size={20} fill="white" />
        </div>
        
        <div className="w-1 h-1 bg-slate-200 rounded-full mb-8" />

        <div className="flex flex-col gap-8 opacity-40">
            <button onClick={() => router.push('/counter')}><Clock size={22} /></button>
            <button onClick={() => router.push('/counter/menu-order')}><ShoppingBag size={22} /></button>
            <button onClick={() => router.push('/counter/orders')} className="opacity-100 text-black border-l-2 border-black pl-1"><List size={22} /></button>
            <button><User size={22} /></button>
        </div>

        <div className="w-1 h-1 bg-slate-200 rounded-full mt-8" />
        
        <button className="mt-auto opacity-40 hover:opacity-100 transition-opacity"><MoreVertical size={20} /></button>
      </aside>

      {/* Sidebar - Mobile/Bottom Nav */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-20 bg-white shadow-2xl rounded-[30px] border border-slate-100 z-50 flex items-center justify-around px-4">
          <button onClick={() => router.push('/counter')} className="text-slate-300"><LayoutGrid size={24} /></button>
          <button onClick={() => router.push('/counter/menu-order')} className="text-slate-300"><ShoppingBag size={24} /></button>
          <button className="text-black"><List size={24} /></button>
          <button className="text-slate-300"><User size={24} /></button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 pb-32 lg:pb-0">
        <header className="h-auto lg:h-[100px] px-6 lg:px-10 py-6 lg:py-0 flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200 gap-6">
          <div className="flex items-center justify-between lg:justify-start lg:gap-6">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Order list</h1>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setView("table")}
                className={`p-2 rounded-lg transition-all ${view === "table" ? "bg-white shadow-sm text-teal-600" : "text-slate-400"}`}
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => setView("card")}
                className={`p-2 rounded-lg transition-all ${view === "card" ? "bg-white shadow-sm text-teal-600" : "text-slate-400"}`}
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative flex-1 lg:flex-none">
              <select className="appearance-none h-10 w-full lg:w-32 pl-4 pr-10 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 focus:outline-none">
                <option>Sort by</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>
            <button 
              onClick={() => router.push('/counter/menu-order')}
              className="h-10 px-4 sm:px-5 bg-teal-50 text-teal-600 border border-teal-100 text-xs font-black rounded-xl hover:bg-teal-600 hover:text-white transition-all flex items-center gap-2"
            >
              <Plus size={16} /> <span className="hidden sm:inline">Add new</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 lg:px-10 pb-10">
          {view === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8 py-6 lg:py-10">
              {orders.map((o) => (
                <div 
                  key={o.id} 
                  className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 hover:shadow-2xl transition-all group flex flex-col gap-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                       <div className="h-14 w-14 bg-teal-50 rounded-[20px] flex items-center justify-center text-teal-600 font-black text-xs">
                          A-1
                       </div>
                       <div>
                          <p className="text-base font-black text-slate-800">Esther Howard</p>
                          <p className="text-[11px] font-bold text-slate-400 mt-0.5">Order #{o.id}</p>
                       </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-orange-50 text-orange-600`}>
                      In progress
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-[11px] font-black text-slate-800 border-b border-slate-50 pb-4">
                     <span>Fri, Sep 27, 2024</span>
                     <span>17:45 PM</span>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        <span>Items</span>
                        <div className="flex gap-10">
                           <span>Qty</span>
                           <span>Price</span>
                        </div>
                     </div>
                     <div className="space-y-3">
                        <div className="flex justify-between text-[12px] font-bold text-slate-600">
                           <span>Scrambled egg toast</span>
                           <div className="flex gap-14">
                              <span>1</span>
                              <span className="font-black text-slate-800">$16.00</span>
                           </div>
                        </div>
                        <div className="flex justify-between text-[12px] font-bold text-slate-600">
                           <span>Belgian waffles</span>
                           <div className="flex gap-14">
                              <span>1</span>
                              <span className="font-black text-slate-800">$18.50</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="mt-4 pt-6 border-t border-slate-50">
                    <div className="flex justify-between items-center mb-6">
                       <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Total <span className="font-bold text-slate-300">(before tax)</span></p>
                       <p className="text-lg font-black text-slate-800">$171.50</p>
                    </div>

                    <div className="flex gap-4">
                       <button className="flex-1 h-[54px] bg-slate-50 rounded-[15px] text-xs font-black text-slate-600 flex items-center justify-center gap-3">
                          6 items <ArrowUpDown size={14} className="rotate-45" />
                       </button>
                       <button 
                        onClick={() => router.push('/counter/payment')}
                        className="flex-1 h-[54px] bg-teal-500 text-white rounded-[15px] text-xs font-black hover:bg-teal-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                       >
                          Pay bill
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white lg:rounded-[32px] overflow-x-auto shadow-sm border border-slate-100 mt-6 lg:mx-0">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                    <th className="px-8 py-6">ID</th>
                    <th className="px-8 py-6">Date <ArrowUpDown size={12} className="inline ml-1 opacity-50" /></th>
                    <th className="px-8 py-6">Server</th>
                    <th className="px-8 py-6">Amount</th>
                    <th className="px-8 py-6">Payment</th>
                    <th className="px-8 py-6">Type</th>
                    <th className="px-8 py-6">Status <ArrowUpDown size={12} className="inline ml-1 opacity-50" /></th>
                    <th className="px-8 py-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[13px]">
                  {orders.map((o) => (
                    <tr key={o.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6 font-black text-slate-800">#{o.id}</td>
                      <td className="px-8 py-6 font-bold text-slate-500 whitespace-nowrap">Sep 27, 2024 <span className="mx-2 opacity-30">•</span> 14:50 PM</td>
                      <td className="px-8 py-6 font-black text-slate-800 flex items-center gap-2">
                         Mark Davis
                      </td>
                      <td className="px-8 py-6 font-black text-slate-800">$85.50</td>
                      <td className="px-8 py-6">
                         <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                            o.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                         }`}>
                            {o.status === 'completed' ? 'Paid' : 'Pending'}
                         </span>
                      </td>
                      <td className="px-8 py-6 font-bold text-slate-600 capitalize">{o.orderType.replace('_', ' ')}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                          o.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {o.status === 'completed' ? 'Completed' : 'In progress'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button className="h-9 w-9 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center mx-auto">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <ShoppingBag size={48} className="text-slate-100" />
                  <p className="text-slate-300 font-bold uppercase tracking-widest">No orders found</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
