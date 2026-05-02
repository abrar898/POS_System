"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Search,
  Bell,
  ChevronDown,
  Maximize2,
  Calendar,
  ArrowRight,
  Loader2
} from "lucide-react";
import { api } from "@/lib/api";

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
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, productsData, ordersData] = await Promise.all([
          api.orders.getStats(),
          api.products.getAll(),
          api.orders.getAll()
        ]);
        setStats(statsData);
        setProducts(productsData);
        setOrders(ordersData);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

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

  if (loading) return <div className="h-full flex items-center justify-center bg-background"><Loader2 className="animate-spin text-[var(--color-primary)]" /></div>;

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground overflow-hidden font-sans">
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Content Area - Full Screen Layout */}
        <div className="flex min-h-0 flex-1 animate-in gap-6 overflow-hidden px-8 py-8 fade-in duration-500">
          {/* Column Left */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">

            {/* Revenue Quick Cards - NEW */}
            <div className="grid grid-cols-3 gap-6">
              <KPICard label="Today's Revenue" value={`Rs. ${ANALYTICS_DATA.RevenueKPIs.today.value.toLocaleString()}`} change={ANALYTICS_DATA.RevenueKPIs.today.change} />
              <KPICard label="Weekly Sales" value={`Rs. ${ANALYTICS_DATA.RevenueKPIs.week.value.toLocaleString()}`} change={ANALYTICS_DATA.RevenueKPIs.week.change} />
              <KPICard label="Avg Order Value" value="Rs. 1,450" change={5} />
            </div>

            {/* Performance Chart Card */}
            <div className="bg-[var(--bg-card)] rounded-[28px] p-7 card-shadow transition-all hover:shadow-xl hover:shadow-[#000]/5 group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-[17px] font-bold text-foreground">Revenue Over Time</h2>
                  <p className="text-[12px] text-[var(--text-secondary)] mt-0.5 font-medium">Compare your sales performance across periods.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-background rounded-xl p-1 flex gap-1 border border-[var(--border-default)]">
                    {(["Week", "Month", "Year"] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => {
                          setTimeframe(t);
                          setFocusPos(42); // Reset focus for new timeframe
                        }}
                        className={`px-4 py-1.5 rounded-lg text-[11px] font-extrabold transition-all tracking-tight ${timeframe === t
                          ? "bg-[var(--color-primary)] text-black shadow-md shadow-black/5"
                          : "text-[var(--text-secondary)] hover:text-foreground"
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <button className="p-2 border border-[var(--border-default)] rounded-xl text-[var(--text-secondary)] hover:text-foreground hover:bg-background transition-all">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>

              {/* Legends */}
              <div className="flex gap-6 mb-6">
                {[
                  { color: "var(--color-primary)", label: "Theory" },
                  { color: "var(--color-success)", label: "Practice" },
                  { color: "var(--color-gray)", label: "Lexicon" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Dynamic SVG Chart */}
              <div className="relative h-[200px] w-full mt-2">
                {/* Float Badge - Interactively follows the slider */}
                <div
                  className="absolute top-[5%] bg-[var(--bg-card)]/90 backdrop-blur-md py-3 px-6 rounded-3xl shadow-xl shadow-black/5 border border-[var(--border-default)] z-10 text-center transition-all duration-300 pointer-events-none"
                  style={{ left: `${focusPos}%`, transform: "translateX(-50%)" }}
                >
                  <div className="text-[24px] font-[900] text-foreground leading-none tracking-tight">+{currentPercent}%</div>
                  <div className="text-[11px] font-bold text-[var(--color-primary)] mt-1.5 uppercase tracking-tighter whitespace-nowrap">Recent lessons this week: {lessonsCount}</div>
                  {/* Point Indicator */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--color-primary)] rounded-full border-2 border-white shadow-md" />
                </div>

                <svg width="100%" height="180" viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none" className="overflow-visible">
                  <defs>
                    <linearGradient id="blueArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-gray)" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="var(--color-gray)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="pinkArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
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
                  <path d={buildPath(currentData.blue, CHART_W)} fill="none" stroke="var(--color-gray)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                  <path d={buildAreaPath(currentData.pink, CHART_W)} fill="url(#pinkArea)" />
                  <path d={buildPath(currentData.pink, CHART_W)} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                {/* INTERACTIVE Focus Scrollbar */}
                <div
                  className="w-full h-2 bg-background rounded-full mt-4 relative cursor-pointer group/slider overflow-visible"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    setFocusPos(Math.max(10, Math.min(90, (x / rect.width) * 100)));
                  }}
                >
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-3 bg-[var(--color-primary)] text-black rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out z-20 group-hover/slider:scale-y-125"
                    style={{ left: `${focusPos}%`, width: "20%", transform: "translate(-50%, -50%)" }}
                  >
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1.5 bg-black/10 rounded-full" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1.5 bg-black/10 rounded-full" />
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
              <div className="bg-[var(--bg-card)] rounded-[28px] p-7 card-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[14px] font-bold text-foreground">Operational Status</h3>
                    <p className="text-[10px] text-[var(--text-secondary)] font-medium">Kitchen & Delivery efficiency</p>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-foreground">
                    Live <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </button>
                </div>
                <div className="flex flex-col gap-6">
                  <ProgressRow label="Order Completion" value={92} color="var(--color-gray)" gradient="linear-gradient(90deg, var(--color-gray), var(--color-gray))" />
                  <ProgressRow label="Delivery Efficiency" value={78} color="var(--color-primary)" gradient="linear-gradient(90deg, var(--color-primary), var(--color-primary))" />
                </div>
              </div>

              {/* Staff Leaderboard (Friends Score) */}
              <div className="bg-[var(--bg-card)] rounded-[28px] p-7 card-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[14px] font-bold text-foreground">Staff Performance</h3>
                    <p className="text-[10px] text-[var(--text-secondary)] font-medium">Leaderboard based on total sales</p>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-foreground">
                    Last Week <ChevronDown size={14} />
                  </button>
                </div>
                <div className="flex flex-col gap-5 max-h-[160px] overflow-y-auto no-scrollbar">
                  {ANALYTICS_DATA.StaffPerformance.map((staff, i) => (
                    <FriendItem key={i} name={staff.name} score={Math.round((staff.orders / 160) * 100)} image={staff.image} />
                  ))}
                </div>
              </div>
            </div>

            {/* Order History Table */}
            <div className="bg-[var(--bg-card)] rounded-[28px] p-7 card-shadow transition-all hover:shadow-xl hover:shadow-[#000]/5 group overflow-x-auto mt-6">
              <div className="flex justify-between items-center mb-6 min-w-[600px]">
                <div>
                  <h3 className="text-[17px] font-bold text-foreground">Order Updates</h3>
                  <p className="text-[12px] text-[var(--text-secondary)] mt-0.5 font-medium">Recent transactions across all channels.</p>
                </div>
                <button className="text-sm font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">View All</button>
              </div>
              
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] border-b border-[#f0f1f5]">
                    <th className="pb-4 px-2">Order #</th>
                    <th className="pb-4 px-2">Customer Name</th>
                    <th className="pb-4 px-2">Details</th>
                    <th className="pb-4 px-2">Price</th>
                    <th className="pb-4 px-2">Status</th>
                    <th className="pb-4 px-2">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f1f5]">
                  {orders.slice(0, 5).map((o, i) => {
                    const utcStr = o.created_at.includes('Z') || o.created_at.includes('+') ? o.created_at : `${o.created_at}Z`;
                    const date = new Date(utcStr);
                    const formattedDate = date.toLocaleDateString('en-PK', { day: '2-digit', month: 'short' });
                    const formattedTime = date.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true });
                    
                    return (
                      <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-2 font-black text-foreground text-sm uppercase tracking-wider">
                          #{ (o.id || o._id || '000000').toString().slice(-6) }
                        </td>
                        <td className="py-4 px-2 text-sm font-bold text-foreground">{o.customer_name || 'Walk-in'}</td>
                        <td className="py-4 px-2">
                          <p className="text-sm font-bold text-[var(--text-secondary)] truncate max-w-[200px]">
                            {o.items?.map((item: any) => `${item.quantity}x ${item.product_name || 'Item'}`).join(', ')}
                          </p>
                        </td>
                        <td className="py-4 px-2 font-black text-[var(--color-primary)] text-sm">
                          Rs. {o.total_price || 0}
                        </td>
                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                            o.status === 'completed' || o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            o.status === 'pending' || o.status === 'preparing' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-xs font-bold text-[var(--text-secondary)]">
                          {formattedDate}, {formattedTime}
                        </td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[var(--text-secondary)] font-medium">No orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Column Right: AI assistant & Menu Matrix */}
          <div className="w-[340px] flex flex-col gap-6 pt-[116px] pb-10 overflow-y-auto no-scrollbar">
            {/* AI Lite Assistant (Phase 3) */}
            <div className="flex-shrink-0 bg-[var(--color-primary)] text-black p-7 rounded-[36px] shadow-2xl relative overflow-hidden group border border-black/5">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-black/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Globe size={20} className="text-black animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight leading-none">AI Assistant</h3>
                    <p className="text-[11px] text-black/60 mt-1">Smarter insights in seconds</p>
                  </div>
                </div>

                <div className="bg-black/5 rounded-2xl p-4 border border-black/10 focus-within:bg-black/10 transition-all">
                  <input
                    type="text"
                    placeholder="Ask in English or Urdu..."
                    className="bg-transparent text-[13px] w-full outline-none placeholder:text-black/40 text-black font-medium"
                  />
                </div>
                <Link
                  href="/admin/ai-assistant"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-3.5 text-[13px] font-black text-white shadow-xl shadow-black/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Open AI Lite <ArrowRight size={16} strokeWidth={3} />
                </Link>
              </div>
              {/* Decorative background elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl opacity-50" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="flex-shrink-0 flex justify-between items-center px-1">
              <div>
                <h3 className="text-[18px] font-black text-foreground tracking-tight">Menu Engineering</h3>
                <p className="text-[12px] text-[var(--text-secondary)] font-semibold mt-0.5">Top performing items (Stars)</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {ANALYTICS_DATA.MenuEngineering.filter(i => i.category === "Star").map((item, i) => (
                <CourseCard
                  key={i}
                  title={item.name}
                  subtitle={`Popularity: ${item.popularity}% | Margin: ${item.margin}%`}
                  date={item.category}
                  bgColor="var(--bg-card)"
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
    <div className="bg-[var(--bg-card)] p-6 rounded-[28px] card-shadow border border-[#f0f1f5] group hover:scale-[1.02] transition-all">
      <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">{label}</p>
      <h4 className="text-xl font-black text-foreground mb-2">{value}</h4>
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
      <div className="flex justify-between items-end mb-2">
        <span className="text-[12px] font-extrabold text-foreground">{label}</span>
        <span className="text-[12px] font-black text-foreground tracking-tighter">{value}/100%</span>
      </div>
      <div className="h-[32px] bg-background rounded-[12px] overflow-hidden relative border border-[#f0f1f5]">
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
      <div className="w-[40px] h-[40px] rounded-[12px] overflow-hidden bg-background flex-shrink-0 shadow-sm border border-[var(--border-default)]">
        <img src={image} alt={name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[12px] font-bold text-foreground truncate">{name}</span>
          <span className="text-[20px] font-[900] text-foreground tracking-tighter leading-none">{score}%</span>
        </div>
        <div className="h-[5px] bg-[#F0F1F5] rounded-full overflow-hidden mr-12">
          <div
            className="h-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] rounded-full transition-all duration-1000"
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
      <div className="absolute top-6 right-6 w-10 h-10 bg-[var(--bg-card)]/80 rounded-[14px] flex items-center justify-center shadow-sm backdrop-blur-sm group-hover:scale-110 transition-transform">
        <Bell size={18} strokeWidth={2.5} className="text-foreground" />
      </div>

      <div className="mb-8">
        <h4 className="text-[17px] font-[800] leading-[1.25] mb-1.5 pr-10 text-foreground">
          {title}
        </h4>
        <p className="text-[12px] font-medium text-foreground opacity-60">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center justify-between">
        {/* Date in White Pill */}
        <div className="flex items-center gap-2 bg-[var(--bg-card)]/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm">
          <Calendar size={13} strokeWidth={3} className="text-foreground" />
          <span className="text-[11px] font-bold text-foreground">{date}</span>
        </div>

        <button className="flex items-center gap-1.5 bg-[var(--color-primary)] text-black px-5 py-2.5 rounded-2xl text-[11px] font-[900] shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95">
          Join Now <ArrowRight size={15} strokeWidth={3} className="ml-0.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
