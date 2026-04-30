"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Store,
  Globe,
  TerminalSquare,
  ChefHat,
  Activity,
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
    href: "/home",
    icon: Globe,
    color: "bg-[#FECE04] text-black",
    shadow: "shadow-[#FECE04]/30",
    tag: "Customer"
  },
  {
    title: "Live Tracking",
    desc: "Real-time status tracking for customer orders.",
    href: "/orders/CHZ-39403/track",
    icon: Activity,
    color: "bg-[#7ED957] text-white",
    shadow: "shadow-[#7ED957]/30",
    tag: "Live"
  },
  {
    title: "Counter Terminal",
    desc: "Cashier POS: tabs, menu, cart, and kitchen sync.",
    href: "/counter",
    icon: ScanLine,
    color: "bg-[#811920] text-white",
    shadow: "shadow-[#811920]/30",
    tag: "Staff"
  },
  {
    title: "Waiter Floor",
    desc: "Floor map, runner queue, and table management.",
    href: "/waiter",
    icon: UserCircle2,
    color: "bg-[#F28C28] text-white",
    shadow: "shadow-[#F28C28]/30",
    tag: "Staff"
  },
  {
    title: "Aggregator",
    desc: "Centralized manager dashboard for incoming orders.",
    href: "/admin/online-orders",
    icon: Store,
    color: "bg-[#000000] text-white",
    shadow: "shadow-black/20",
    tag: "Manager"
  },
  {
    title: "Admin & Analytics",
    desc: "Owner BI and system-wide configuration.",
    href: "/admin",
    icon: TerminalSquare,
    color: "bg-[#737373] text-white",
    shadow: "shadow-gray-500/20",
    tag: "Admin"
  },
  {
    title: "Delivery Dashboard",
    desc: "Live tracking for all online delivery orders.",
    href: "/online/delivery",
    icon: Truck,
    color: "bg-[#811920] text-white",
    shadow: "shadow-[#811920]/30",
    tag: "Logistics"
  },
  {
    title: "Supervisor",
    desc: "Manage staff, alerts, and performance metrics.",
    href: "/supervisor",
    icon: ShieldCheck,
    color: "bg-[#FECE04] text-black",
    shadow: "shadow-[#FECE04]/30",
    tag: "Admin"
  },
  {
    title: "Cashier POS",
    desc: "In-store ordering terminal for staff.",
    href: "/in-store/cashier-flow",
    icon: ScanLine,
    color: "bg-[#811920] text-white",
    shadow: "shadow-[#811920]/30",
    tag: "In-Store"
  },
  {
    title: "Customer Kiosk",
    desc: "Self-service ordering terminal for customers.",
    href: "/in-store/customer-flow",
    icon: Store,
    color: "bg-[#FECE04] text-black",
    shadow: "shadow-[#FECE04]/30",
    tag: "In-Store"
  },
  {
    title: "Kitchen Display",
    desc: "KDS for kitchen staff to manage orders.",
    href: "/in-store/kds",
    icon: ChefHat,
    color: "bg-[#7ED957] text-white",
    shadow: "shadow-[#7ED957]/30",
    tag: "In-Store"
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#FDEFDE] text-[#000000] flex flex-col items-center justify-start py-12 px-6 sm:px-24 font-sans">
      
      {/* Background Ornaments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#FECE04]/20 blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -right-40 w-[40rem] h-[40rem] rounded-full bg-[#811920]/10 blur-[120px]" 
        />
      </div>
      
      <div className="z-10 w-full max-w-7xl flex flex-col items-center gap-16">
        {/* Header Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-between items-center py-4"
        >
          <div className="flex items-center gap-3">
            <img src="/cheezious_logo.jpeg" alt="Cheezious Logo" className="h-12 w-auto object-contain rounded-xl" />
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FECE04]/20 border border-[#FECE04]/50 backdrop-blur-xl"
          >
            <Zap size={16} className="text-[#811920] fill-[#811920]" />
            <span className="text-[11px] font-black tracking-[0.2em] text-[#811920] uppercase">Cheezious POS System</span>
          </motion.div>
          
          <motion.h1 
            variants={fadeIn}
            className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] text-[#000000]"
          >
            Manage Your <span className="text-[#811920]">Restaurant</span><br />
            Like a Pro.
          </motion.h1>
          
          <motion.p 
            variants={fadeIn}
            className="text-lg sm:text-xl text-[#737373] font-medium max-w-2xl leading-relaxed"
          >
            From the Kitchen Display to the Customer Kiosk, seamlessly connect every part of your restaurant using our premium POS architecture.
          </motion.p>
        </motion.div>

        {/* Modules Grid */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full pt-8"
        >
          {modules.map((mod) => (
            <motion.div
              key={mod.title}
              variants={fadeIn}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <Link href={mod.href} className="block h-full">
                <div className="relative h-full bg-[#FEFDFA] border border-[#737373]/10 hover:border-[#FECE04]/50 rounded-[32px] p-8 flex flex-col gap-6 transition-all overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#FECE04]/10">
                  
                  <div className="flex justify-between items-start">
                    <div className={`w-14 h-14 rounded-2xl ${mod.color} flex items-center justify-center shadow-lg ${mod.shadow} transition-transform group-hover:scale-110 group-hover:-rotate-3`}>
                      <mod.icon size={26} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-[#737373] uppercase px-2 py-1 rounded bg-[#FDEFDE] border border-[#737373]/10 group-hover:bg-[#FECE04] group-hover:text-black transition-colors">{mod.tag}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-auto">
                    <h2 className="text-[18px] font-extrabold text-[#000000]">{mod.title}</h2>
                    <p className="text-[13px] text-[#737373] font-medium leading-relaxed">{mod.desc}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[#811920] font-extrabold text-xs mt-2 group-hover:text-[#000000] transition-colors uppercase tracking-widest">
                    Open <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
