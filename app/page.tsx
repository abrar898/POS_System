import Link from "next/link";
import {
  Store,
  Globe,
  TerminalSquare,
  ChefHat,
  Activity,
  KeyRound,
  ArrowRight,
  ScanLine,
  UserCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#0A0A0B] text-white flex flex-col items-center justify-center p-6 sm:p-24 selection:bg-indigo-500/30">
      {/* Background Orbs */}
      <div className="absolute top-[0%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] rounded-full bg-rose-600/20 blur-[100px] pointer-events-none" />
      
      <div className="z-10 w-full max-w-6xl flex flex-col items-center gap-16">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl pt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">System Online</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[1.1]">
            Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400">POS Core</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 font-medium max-w-2xl">
            One codebase, one deployment — open the right workspace by path only:{" "}
            <span className="text-slate-300 font-semibold">/admin</span>,{" "}
            <span className="text-slate-300 font-semibold">/counter</span>,{" "}
            <span className="text-slate-300 font-semibold">/waiter</span>. Each shell is isolated for that role.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* Card 1: Customer Facing */}
          <Link href="/online/royal-burger" className="group relative rounded-[32px] p-[2px] overflow-hidden transition-transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-rose-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-[#12121A] rounded-[30px] p-8 flex flex-col gap-6 w-full overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-[100px]" />
               
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                 <Globe size={28} />
               </div>
               
               <div className="flex flex-col gap-2 relative z-10 mt-auto">
                 <h2 className="text-2xl font-bold">Online Ordering</h2>
                 <p className="text-sm text-slate-400 font-medium">Customer-facing dynamic menu & cart dashboard.</p>
               </div>
               
               <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mt-4 group-hover:text-indigo-300">
                 Launch Module <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
          </Link>

          {/* Card 2: Order Tracker */}
          <Link href="/online/orders/123/track" className="group relative rounded-[32px] p-[2px] overflow-hidden transition-transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-[#12121A] rounded-[30px] p-8 flex flex-col gap-6 w-full overflow-hidden">
               
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
                 <Activity size={28} />
               </div>
               
               <div className="flex flex-col gap-2 relative z-10 mt-auto">
                 <h2 className="text-2xl font-bold">Live Tracking</h2>
                 <p className="text-sm text-slate-400 font-medium">Real-time status tracking for customer orders.</p>
               </div>
               
               <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mt-4 group-hover:text-emerald-300">
                 Launch Module <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
          </Link>

          {/* Counter (cashier) — isolated /counter */}
          <Link href="/counter" className="group relative rounded-[32px] p-[2px] overflow-hidden transition-transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 opacity-35 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-[#12121A] rounded-[30px] p-8 flex flex-col gap-6 w-full overflow-hidden">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/25">
                 <ScanLine size={28} />
               </div>
               <div className="flex flex-col gap-2 relative z-10 mt-auto">
                 <h2 className="text-2xl font-bold">Counter terminal</h2>
                 <p className="text-sm text-slate-400 font-medium">Cashier POS: tabs, menu, cart, hold, send to kitchen, offline queue — path /counter.</p>
               </div>
               <div className="flex items-center gap-2 text-teal-400 font-bold text-sm mt-4 group-hover:text-teal-300">
                 Open /counter <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
          </Link>

          {/* Waiter — isolated /waiter */}
          <Link href="/waiter" className="group relative rounded-[32px] p-[2px] overflow-hidden transition-transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-lime-700 opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-[#12121A] rounded-[30px] p-8 flex flex-col gap-6 w-full overflow-hidden">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
                 <UserCircle2 size={28} />
               </div>
               <div className="flex flex-col gap-2 relative z-10 mt-auto">
                 <h2 className="text-2xl font-bold">Waiter floor</h2>
                 <p className="text-sm text-slate-400 font-medium">Floor map, runner queue, guest requests, table tickets — path /waiter.</p>
               </div>
               <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mt-4 group-hover:text-emerald-300">
                 Open /waiter <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
          </Link>

          {/* Card 3: Manager Orders */}
          <Link href="/admin/online-orders" className="group relative rounded-[32px] p-[2px] overflow-hidden transition-transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-[#12121A] rounded-[30px] p-8 flex flex-col gap-6 w-full overflow-hidden">
               
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
                 <Store size={28} />
               </div>
               
               <div className="flex flex-col gap-2 relative z-10 mt-auto">
                 <h2 className="text-2xl font-bold">Aggregator</h2>
                 <p className="text-sm text-slate-400 font-medium">Centralized manager dashboard for incoming orders.</p>
               </div>
               
               <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mt-4 group-hover:text-amber-300">
                 Launch Module <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
          </Link>

          {/* Card 4: Terminal POS */}
          <Link href="/admin" className="group relative rounded-[32px] p-[2px] overflow-hidden transition-transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-[#12121A] rounded-[30px] p-8 flex flex-col gap-6 w-full overflow-hidden">
               
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                 <TerminalSquare size={28} />
               </div>
               
               <div className="flex flex-col gap-2 relative z-10 mt-auto">
                 <h2 className="text-2xl font-bold">Admin and analytics</h2>
                 <p className="text-sm text-slate-400 font-medium">Owner / manager BI — isolated path /admin (not counter or waiter).</p>
               </div>
               
               <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mt-4 group-hover:text-cyan-300">
                 Launch Module <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
          </Link>

          {/* Utility Cards / Placeholders */}
          <div className="group relative rounded-[32px] p-[2px] overflow-hidden opacity-40 cursor-not-allowed">
            <div className="absolute inset-0 bg-white/5" />
            <div className="relative h-full bg-[#12121A] rounded-[30px] p-8 flex flex-col gap-6 w-full opacity-80">
               <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
                 <ChefHat size={28} />
               </div>
               <div className="flex flex-col gap-2 relative z-10 mt-auto">
                 <h2 className="text-2xl font-bold text-slate-300">Kitchen Display</h2>
                 <p className="text-sm text-slate-500 font-medium">Coming soon.</p>
               </div>
            </div>
          </div>

          <div className="group relative rounded-[32px] p-[2px] overflow-hidden opacity-40 cursor-not-allowed">
            <div className="absolute inset-0 bg-white/5" />
            <div className="relative h-full bg-[#12121A] rounded-[30px] p-8 flex flex-col gap-6 w-full opacity-80">
               <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
                 <KeyRound size={28} />
               </div>
               <div className="flex flex-col gap-2 relative z-10 mt-auto">
                 <h2 className="text-2xl font-bold text-slate-300">System Config</h2>
                 <p className="text-sm text-slate-500 font-medium">Coming soon.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pb-10">
           <div className="px-4 py-2 rounded-full border border-white/10 text-xs font-semibold text-slate-400 tracking-wide bg-white/5">Next.js 15</div>
           <div className="px-4 py-2 rounded-full border border-white/10 text-xs font-semibold text-slate-400 tracking-wide bg-white/5">Tailwind CSS</div>
           <div className="px-4 py-2 rounded-full border border-white/10 text-xs font-semibold text-slate-400 tracking-wide bg-white/5">Lucide UI</div>
        </div>

      </div>
    </main>
  );
}
