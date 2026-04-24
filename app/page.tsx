"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  Truck,
  ShieldCheck,
  Zap,
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const modules = [
  {
    title: "Online Ordering",
    desc: "Customer-facing dynamic menu & cart dashboard.",
    href: "/online/royal-burger",
    icon: Globe,
    color: "from-indigo-500 to-purple-600",
    shadow: "shadow-indigo-500/25",
    tag: "Customer"
  },
  {
    title: "Live Tracking",
    desc: "Real-time status tracking for customer orders.",
    href: "/online/orders/123/track",
    icon: Activity,
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/25",
    tag: "Live"
  },
  {
    title: "Counter Terminal",
    desc: "Cashier POS: tabs, menu, cart, and kitchen sync.",
    href: "/counter",
    icon: ScanLine,
    color: "from-teal-500 to-cyan-600",
    shadow: "shadow-teal-500/25",
    tag: "Staff"
  },
  {
    title: "Waiter Floor",
    desc: "Floor map, runner queue, and table management.",
    href: "/waiter",
    icon: UserCircle2,
    color: "from-emerald-600 to-green-700",
    shadow: "shadow-emerald-500/25",
    tag: "Staff"
  },
  {
    title: "Aggregator",
    desc: "Centralized manager dashboard for incoming orders.",
    href: "/admin/online-orders",
    icon: Store,
    color: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/25",
    tag: "Manager"
  },
  {
    title: "Admin & Analytics",
    desc: "Owner BI and system-wide configuration.",
    href: "/admin",
    icon: TerminalSquare,
    color: "from-blue-500 to-cyan-600",
    shadow: "shadow-blue-500/25",
    tag: "Admin"
  },
  {
    title: "Delivery Dashboard",
    desc: "Live tracking for all online delivery orders.",
    href: "/online/delivery",
    icon: Truck,
    color: "from-sky-500 to-blue-600",
    shadow: "shadow-sky-500/25",
    tag: "Logistics"
  },
  {
    title: "Supervisor",
    desc: "Manage staff, alerts, and performance metrics.",
    href: "/supervisor",
    icon: ShieldCheck,
    color: "from-violet-500 to-purple-700",
    shadow: "shadow-violet-500/25",
    tag: "Admin"
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#050507] text-white flex flex-col items-center justify-start py-12 px-6 sm:px-24 selection:bg-indigo-500/30 font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] rounded-full bg-indigo-600/20 blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-rose-600/20 blur-[120px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>
      
      <div className="z-10 w-full max-w-7xl flex flex-col items-center gap-20">
        {/* Header Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-between items-center py-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={22} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Premium<span className="text-indigo-400">POS</span></span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Documentation</a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Enterprise</a>
            <Link href="/admin" className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition-all">
              Sign In
            </Link>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="flex flex-col items-center text-center gap-8 max-w-4xl"
        >
          <motion.div 
            variants={fadeIn}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-xl"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-300 uppercase">Enterprise Grade POS</span>
          </motion.div>
          
          <motion.h1 
            variants={fadeIn}
            className="text-6xl sm:text-8xl font-black tracking-tight leading-[0.95]"
          >
            Seamless <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400">Operations</span><br />
            for Modern Venues
          </motion.h1>
          
          <motion.p 
            variants={fadeIn}
            className="text-lg sm:text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed"
          >
            The all-in-one architecture for high-volume hospitality. 
            Connect every role from kitchen to customer with a single, synchronized core.
          </motion.p>

          <motion.div 
            variants={fadeIn}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link href="/counter" className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-xl shadow-indigo-500/30 flex items-center gap-2 group">
              Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/online/royal-burger" className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all backdrop-blur-sm">
              Live Demo
            </Link>
          </motion.div>
        </motion.div>

        {/* Modules Grid */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
        >
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              variants={fadeIn}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <Link href={mod.href} className="block h-full">
                <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-[32px]`} />
                <div className="relative h-full bg-[#111115]/80 backdrop-blur-md border border-white/5 group-hover:border-white/20 rounded-[32px] p-8 flex flex-col gap-8 transition-all overflow-hidden">
                  {/* Glowing background hint */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${mod.color} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity`} />
                  
                  <div className="flex justify-between items-start">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-white shadow-xl ${mod.shadow} transition-transform group-hover:scale-110`}>
                      <mod.icon size={28} />
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase px-2 py-1 rounded-md bg-white/5 border border-white/10">{mod.tag}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-auto">
                    <h2 className="text-xl font-bold group-hover:text-white transition-colors">{mod.title}</h2>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">{mod.desc}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-white/40 font-bold text-xs group-hover:text-white transition-colors">
                    LAUNCH MODULE <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
