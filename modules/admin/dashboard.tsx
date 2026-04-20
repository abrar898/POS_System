"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Search,
  Bell,
  ChevronDown,
  Maximize2,
  Calendar,
  ArrowRight,
} from "lucide-react";

// ─── Pakistan Restaurant Analytics Mock Data ───────────────────────────────────
const ANALYTICS_DATA = {
  RevenueKPIs: {
    today: { value: 125400, change: 12, trend: "up" },
    week: { value: 845000, change: 8, trend: "up" },
    month: { value: 3240000, change: -2, trend: "down" },
    yoy: 15, // Year over Year %
  },
  MenuEngineering: [
    { name: "Chicken Karahi", popularity: 95, margin: 85, category: "Star" },
    { name: "Beef Seekh Kabab", popularity: 88, margin: 78, category: "Star" },
    { name: "Plain Naan", popularity: 98, margin: 25, category: "Plowhorse" },
    { name: "Mutton Biryani", popularity: 45, margin: 90, category: "Puzzle" },
    { name: "Diet Coke", popularity: 15, margin: 10, category: "Dog" },
  ],
  StaffPerformance: [
    { name: "Ahmed Ali", orders: 156, ticket: 1450, tips: 12000, voids: 2, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop" },
    { name: "Sara Khan", orders: 142, ticket: 1650, tips: 15000, voids: 0, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop" },
    { name: "Bilal Sheikh", orders: 128, ticket: 1380, tips: 9000, voids: 5, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&auto=format&fit=crop" },
  ],
  Payments: {
    Cash: 45,
    Card: 30,
    JazzCash: 15,
    EasyPaisa: 10,
  }
};

const CHART_DATA = {
  Week: {
    blue: [120, 100, 110, 95, 105, 115, 100],
    pink: [80, 90, 85, 100, 95, 105, 110],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  Month: {
    blue: [90, 105, 120, 68, 50, 75, 90, 70],
    pink: [128, 130, 135, 118, 108, 122, 128, 118],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  },
  Year: {
    blue: [100, 120, 90, 110, 130, 95, 105, 115, 100, 120, 110, 105],
    pink: [90, 80, 100, 85, 110, 105, 95, 100, 115, 105, 100, 110],
    labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
  },
};

const CHART_W = 700;
const CHART_H = 160;

function buildPath(data: number[], width: number): string {
  const step = width / (data.length - 1);
  let d = `M 0,${data[0]}`;
  for (let i = 1; i < data.length; i++) {
    const x = i * step;
    const cpx = (i - 0.5) * step;
    d += ` C ${cpx},${data[i - 1]} ${cpx},${data[i]} ${x},${data[i]}`;
  }
  return d;
}

function buildAreaPath(data: number[], width: number): string {
  return buildPath(data, width) + ` L ${width},${CHART_H} L 0,${CHART_H} Z`;
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export function AdminDashboard() {
  const [timeframe, setTimeframe] = useState<"Week" | "Month" | "Year">("Month");
  const [focusPos, setFocusPos] = useState(42);

  const currentData = CHART_DATA[timeframe];

  // Mapping education terms to POS terms
  const labels = {
    title: "Pakistan Restaurant POS Dashboard",
    welcome: "Assalam-o-Alaikum, Manager",
  };

  // Calculate dynamic value for the badge based on current data and focus position
  const getValueAtPos = (data: number[]) => {
    const idx = Math.floor((focusPos / 100) * (data.length - 1));
    const val = data[Math.min(idx, data.length - 1)];
    // Convert SVG Y-coordinate (0-160) back to 0-100 value
    return Math.round(((CHART_H - val) / CHART_H) * 100);
  };

  const currentPercent = getValueAtPos(currentData.pink);
  const lessonsCount = Math.round(currentPercent * 0.4);

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#F5F6FA] text-[#1a1a2e] overflow-hidden font-sans">
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="relative flex h-[72px] shrink-0 items-center px-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#a0a8b2]">
              Overview
            </span>
            <span className="text-[13px] font-bold text-[#8a919e]">Use the bar above for Module 11 reports</span>
          </div>

          {/* Right Controls */}
          <div className="absolute right-8 flex items-center gap-5">
            <button className="text-[#8a919e] hover:text-[#1a1a2e] transition-colors">
              <Search size={20} />
            </button>
            <div className="relative">
              <button className="text-[#8a919e] hover:text-[#1a1a2e] transition-colors group">
                <Bell size={20} />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#ef4444] rounded-full border-2 border-[#F5F6FA] group-hover:scale-125 transition-transform" />
              </button>
            </div>
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-md ring-1 ring-[#000]/5 cursor-pointer hover:scale-105 transition-transform">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan" 
                alt="Profile" 
                className="w-full h-full object-cover bg-[#fde8d8]"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex min-h-0 flex-1 animate-in gap-6 overflow-y-auto px-8 pb-8 fade-in duration-500">
            {/* Column Left */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
              <div className="mt-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#1a1a2e]">
                  {labels.welcome}
                </h1>
                <p className="text-[#a0a8b2] text-sm font-medium mt-1">Here is what's happening at your branch today.</p>
              </div>

              {/* Revenue Quick Cards - NEW */}
              <div className="grid grid-cols-3 gap-6">
                <KPICard label="Today's Revenue" value={`Rs. ${ANALYTICS_DATA.RevenueKPIs.today.value.toLocaleString()}`} change={ANALYTICS_DATA.RevenueKPIs.today.change} />
                <KPICard label="Weekly Sales" value={`Rs. ${ANALYTICS_DATA.RevenueKPIs.week.value.toLocaleString()}`} change={ANALYTICS_DATA.RevenueKPIs.week.change} />
                <KPICard label="Avg Order Value" value="Rs. 1,450" change={5} />
              </div>

              {/* Performance Chart Card */}
              <div className="bg-white rounded-[28px] p-7 card-shadow transition-all hover:shadow-xl hover:shadow-[#000]/5 group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-[17px] font-bold text-[#1a1a2e]">Revenue Over Time</h2>
                    <p className="text-[12px] text-[#a0a8b2] mt-0.5 font-medium">Compare your sales performance across periods.</p>
                  </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#F5F6FA] rounded-xl p-1 flex gap-1 border border-[#EBEBF0]">
                    {(["Week", "Month", "Year"] as const).map(t => (
                      <button 
                        key={t}
                        onClick={() => {
                          setTimeframe(t);
                          setFocusPos(42); // Reset focus for new timeframe
                        }}
                        className={`px-4 py-1.5 rounded-lg text-[11px] font-extrabold transition-all tracking-tight ${
                          timeframe === t 
                            ? "bg-[#1a1a2e] text-white shadow-md shadow-[#1a1a2e]/20" 
                            : "text-[#a0a8b2] hover:text-[#1a1a2e]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <button className="p-2 border border-[#EBEBF0] rounded-xl text-[#a0a8b2] hover:text-[#1a1a2e] hover:bg-[#F5F6FA] transition-all">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>

              {/* Legends */}
              <div className="flex gap-6 mb-6">
                {[
                  { color: "#818cf8", label: "Theory" },
                  { color: "#f472b6", label: "Practice" },
                  { color: "#c4b5fd", label: "Lexicon" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-[11px] font-bold text-[#a0a8b2] uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Dynamic SVG Chart */}
              <div className="relative h-[200px] w-full mt-2">
                {/* Float Badge - Interactively follows the slider */}
                <div 
                  className="absolute top-[5%] bg-[#fde8f1]/90 backdrop-blur-md py-3 px-6 rounded-3xl shadow-xl shadow-pink-200/40 border border-[#fce7f3] z-10 text-center transition-all duration-300 pointer-events-none"
                  style={{ left: `${focusPos}%`, transform: "translateX(-50%)" }}
                >
                  <div className="text-[24px] font-[900] text-[#1a1a2e] leading-none tracking-tight">+{currentPercent}%</div>
                  <div className="text-[11px] font-bold text-[#f472b6] mt-1.5 uppercase tracking-tighter whitespace-nowrap">Recent Lessons this week: {lessonsCount}</div>
                  {/* Point Indicator */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#f472b6] rounded-full border-2 border-white shadow-md" />
                </div>

                <svg width="100%" height="180" viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none" className="overflow-visible">
                  <defs>
                    <linearGradient id="blueArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="pinkArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f472b6" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Faint Grid Lines */}
                  {[0, 40, 80, 120, 160].map(y => (
                    <line key={y} x1="0" y1={y} x2={CHART_W} y2={y} stroke="#f1f3f6" strokeWidth="0.5" />
                  ))}

                  {/* Vertical Bars - Matching the focus effect in the image */}
                  {Array.from({ length: 80 }).map((_, i) => {
                    const x = (i / 79) * CHART_W;
                    const barPercent = (i / 79) * 100;
                    // Focus range follows focusPos (±10%)
                    const isFocused = barPercent > focusPos - 12 && barPercent < focusPos + 12;
                    
                    const barColor = isFocused ? "#fecdd3" : "#e0e7ff";
                    const opacity = isFocused ? 0.9 : 0.4;
                    const h = 50 + Math.sin(i / 5) * 20 + Math.cos(i / 10) * 15;

                    return (
                      <rect 
                        key={i} 
                        x={x} 
                        y={h} 
                        width="1.5" 
                        height={CHART_H - h} 
                        fill={barColor} 
                        opacity={opacity}
                        style={{ transition: "fill 0.3s, opacity 0.3s" }}
                      />
                    );
                  })}

                  {/* Paths with dynamic data */}
                  <path d={buildAreaPath(currentData.blue, CHART_W)} fill="url(#blueArea)" />
                  <path d={buildPath(currentData.blue, CHART_W)} fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  
                  <path d={buildAreaPath(currentData.pink, CHART_W)} fill="url(#pinkArea)" />
                  <path d={buildPath(currentData.pink, CHART_W)} fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                {/* INTERACTIVE Focus Scrollbar */}
                <div 
                  className="w-full h-2 bg-[#F5F6FA] rounded-full mt-1 relative cursor-pointer group/slider overflow-visible"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    setFocusPos(Math.max(10, Math.min(90, (x / rect.width) * 100)));
                  }}
                >
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 h-3 bg-[#1a1a2e] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out z-20 group-hover/slider:scale-y-125"
                    style={{ left: `${focusPos}%`, width: "20%", transform: "translate(-50%, -50%)" }}
                  >
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1.5 bg-white/20 rounded-full" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1.5 bg-white/20 rounded-full" />
                  </div>
                  {/* Subtle track background */}
                  <div className="absolute inset-0 bg-[#EBEBF0] rounded-full opacity-50" />
                </div>

                {/* X-Axis Labels */}
                <div className="flex justify-between mt-3 px-1">
                  {currentData.labels.map(m => (
                    <span key={m} className="text-[10px] font-bold text-[#c8cdd6] uppercase tracking-wider">{m}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Branch Efficiency (Student Progress) */}
              <div className="bg-white rounded-[28px] p-7 card-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1a1a2e]">Operational Status</h3>
                    <p className="text-[11px] text-[#a0a8b2] font-medium">Kitchen & Delivery efficiency</p>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-[#8a919e] hover:text-[#1a1a2e]">
                    Live <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </button>
                </div>
                <div className="flex flex-col gap-6">
                  <ProgressRow label="Order Completion" value={92} color="#818cf8" gradient="linear-gradient(90deg, #818cf8, #c4b5fd)" />
                  <ProgressRow label="Delivery Efficiency" value={78} color="#f472b6" gradient="linear-gradient(90deg, #f472b6, #fb7185)" />
                </div>
              </div>

              {/* Staff Leaderboard (Friends Score) */}
              <div className="bg-white rounded-[28px] p-7 card-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1a1a2e]">Staff Performance</h3>
                    <p className="text-[11px] text-[#a0a8b2] font-medium">Leaderboard based on total sales</p>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-[#8a919e] hover:text-[#1a1a2e]">
                    Last Week <ChevronDown size={14} />
                  </button>
                </div>
                <div className="flex flex-col gap-5">
                  {ANALYTICS_DATA.StaffPerformance.map((staff, i) => (
                    <FriendItem key={i} name={staff.name} score={Math.round((staff.orders / 160) * 100)} image={staff.image} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column Right: AI assistant & Menu Matrix */}
          <div className="w-[340px] flex flex-col gap-6 pt-[116px] pb-10">
            {/* AI Lite Assistant (Phase 3) */}
            <div className="flex-shrink-0 bg-[#1a1a2e] text-white p-7 rounded-[36px] shadow-2xl relative overflow-hidden group border border-white/10">
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                      <Globe size={20} className="text-pink-400 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight leading-none">AI Assistant</h3>
                      <p className="text-[11px] text-white/40 mt-1">Smarter insights in seconds</p>
                    </div>
                 </div>
                 
                 <div className="bg-white/5 rounded-2xl p-4 border border-white/10 focus-within:bg-white/10 transition-all">
                   <input 
                    type="text" 
                    placeholder="Ask in English or Urdu..." 
                    className="bg-transparent text-[13px] w-full outline-none placeholder:text-white/20 text-white font-medium"
                   />
                 </div>
                 <Link
                   href="/admin/ai-assistant"
                   className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f472b6] py-3.5 text-[13px] font-black text-white shadow-xl shadow-[#f472b6]/20 transition-all hover:scale-[1.02] hover:bg-[#fb7185] active:scale-[0.98]"
                 >
                   Open AI Lite <ArrowRight size={16} strokeWidth={3} />
                 </Link>
               </div>
               {/* Decorative background elements */}
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl opacity-50" />
               <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="flex-shrink-0 flex justify-between items-center px-1">
              <div>
                <h3 className="text-[18px] font-black text-[#1a1a2e] tracking-tight">Menu Engineering</h3>
                <p className="text-[12px] text-[#a0a8b2] font-semibold mt-0.5">Top performing items (Stars)</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {ANALYTICS_DATA.MenuEngineering.filter(i => i.category === "Star").map((item, i) => (
                <CourseCard 
                  key={i}
                  title={item.name}
                  subtitle={`Popularity: ${item.popularity}% | Margin: ${item.margin}%`}
                  date={item.category}
                  bgColor={i === 0 ? "#FFD6E3" : "#E4EAFF"} 
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translate(-50%, -5px); }
          50% { transform: translate(-50%, 5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function KPICard({ label, value, change }: { label: string; value: string; change: number }) {
  const isUp = change >= 0;
  return (
    <div className="bg-white p-6 rounded-[28px] card-shadow border border-[#f0f1f5] group hover:scale-[1.02] transition-all">
       <p className="text-[11px] font-bold text-[#a0a8b2] uppercase tracking-wider mb-1">{label}</p>
       <h4 className="text-xl font-black text-[#1a1a2e] mb-2">{value}</h4>
       <div className={`flex items-center gap-1.5 text-[11px] font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isUp ? 'bg-green-50' : 'bg-red-50'}`}>
            {isUp ? <ArrowRight size={10} className="-rotate-45" /> : <ArrowRight size={10} className="rotate-45" />}
          </div>
          {Math.abs(change)}% vs prior year
       </div>
    </div>
  );
}
function ProgressRow({ label, value, color, gradient }: { label: string; value: number; color: string; gradient: string }) {
  return (
    <div className="group cursor-default">
      <div className="flex justify-between items-end mb-3">
        <span className="text-[14px] font-extrabold text-[#1a1a2e]">{label}</span>
        <span className="text-[14px] font-black text-[#1a1a2e] tracking-tighter">{value}/100%</span>
      </div>
      <div className="h-[42px] bg-[#F5F6FA] rounded-[18px] overflow-hidden relative border border-[#f0f1f5]">
        <div 
          className="h-full rounded-[18px] transition-all duration-1000 ease-out relative z-10" 
          style={{ width: `${value}%`, background: gradient }} 
        />
        <div 
          className="absolute inset-0 opacity-10 blur-xl pointer-events-none" 
          style={{ width: `${value}%`, background: color }} 
        />
      </div>
    </div>
  );
}

function FriendItem({ name, score, image }: { name: string; score: number; image: string }) {
  return (
    <div className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-all duration-300">
      <div className="w-[52px] h-[52px] rounded-[18px] overflow-hidden bg-[#F5F6FA] flex-shrink-0 shadow-sm border border-[#EBEBF0]">
        <img src={image} alt={name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[13px] font-bold text-[#1a1a2e] truncate">{name}</span>
          <span className="text-[28px] font-[900] text-[#1a1a2e] tracking-tighter leading-none">{score}%</span>
        </div>
        <div className="h-[5px] bg-[#F0F1F5] rounded-full overflow-hidden mr-12">
          <div 
            className="h-full bg-[#1a1a2e] rounded-full transition-all duration-1000" 
            style={{ width: `${score}%` }} 
          />
        </div>
      </div>
    </div>
  );
}

function CourseCard({ title, subtitle, date, bgColor }: {
  title: string; subtitle: string; date: string; bgColor: string;
}) {
  return (
    <div 
      className="px-6 py-6 rounded-[32px] relative transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group cursor-pointer"
      style={{ background: bgColor }}
    >
      {/* Bell Icon in White Container */}
      <div className="absolute top-6 right-6 w-10 h-10 bg-white/80 rounded-[14px] flex items-center justify-center shadow-sm backdrop-blur-sm group-hover:scale-110 transition-transform">
         <Bell size={18} strokeWidth={2.5} className="text-[#1a1a2e]" />
      </div>

      <div className="mb-8">
        <h4 className="text-[17px] font-[800] leading-[1.25] mb-1.5 pr-10 text-[#1a1a2e]">
          {title}
        </h4>
        <p className="text-[12px] font-medium text-[#1a1a2e] opacity-60">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center justify-between">
        {/* Date in White Pill */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm">
          <Calendar size={13} strokeWidth={3} className="text-[#1a1a2e]" />
          <span className="text-[11px] font-bold text-[#1a1a2e]">{date}</span>
        </div>
        
        <button className="flex items-center gap-1.5 bg-[#1a1a2e] text-white px-5 py-2.5 rounded-2xl text-[11px] font-[900] shadow-lg shadow-[#1a1a2e]/30 transition-all hover:scale-105 active:scale-95 group-hover:bg-black">
          Join Now <ArrowRight size={15} strokeWidth={3} className="ml-0.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
