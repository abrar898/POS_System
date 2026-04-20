/** Mock analytics aligned with analytics_snapshots / report_cache concepts */

export const ADMIN_BRANCH = { id: "br-main-gulberg", name: "Gulberg II" };

export const REVENUE_KPI = {
  today: { value: 125_400, priorYear: 111_900, changePct: 12 },
  week: { value: 845_000, priorYear: 782_000, changePct: 8 },
  month: { value: 3_240_000, priorYear: 3_310_000, changePct: -2 },
  avgOrderValue: 1_450,
  covers: 2_842,
  byOrderType: [
    { type: "dine_in" as const, label: "Dine-in", revenue: 1_200_000, pct: 42 },
    { type: "delivery" as const, label: "Delivery", revenue: 850_000, pct: 30 },
    { type: "takeaway" as const, label: "Takeaway", revenue: 420_000, pct: 15 },
    { type: "online" as const, label: "Online", revenue: 380_000, pct: 13 },
  ],
};

export const SALES_REPORT_ROWS = [
  { day: "2026-04-14", orders: 142, revenue: 412_000, dineIn: 180_000, takeaway: 95_000, delivery: 137_000, waiter: "Ahmed" },
  { day: "2026-04-15", orders: 156, revenue: 445_000, dineIn: 195_000, takeaway: 88_000, delivery: 162_000, waiter: "Sara" },
  { day: "2026-04-16", orders: 138, revenue: 398_000, dineIn: 170_000, takeaway: 102_000, delivery: 126_000, waiter: "Ahmed" },
  { day: "2026-04-17", orders: 168, revenue: 512_000, dineIn: 220_000, takeaway: 110_000, delivery: 182_000, waiter: "Bilal" },
];

export const MENU_ENGINEERING_POINTS = [
  { name: "Chicken Karahi", popularity: 92, marginPct: 68, quadrant: "Star" as const },
  { name: "Beef Seekh", popularity: 78, marginPct: 58, quadrant: "Star" as const },
  { name: "Plain Naan", popularity: 95, marginPct: 22, quadrant: "Plowhorse" as const },
  { name: "Mutton Karahi", popularity: 38, marginPct: 72, quadrant: "Puzzle" as const },
  { name: "Diet Cola", popularity: 18, marginPct: 12, quadrant: "Dog" as const },
  { name: "Chicken Handi", popularity: 55, marginPct: 48, quadrant: "Plowhorse" as const },
];

/** 7 days × 24 hours — order counts */
export function buildHeatmapData(): number[][] {
  const days = 7;
  const hours = 24;
  const grid: number[][] = [];
  for (let d = 0; d < days; d++) {
    const row: number[] = [];
    for (let h = 0; h < hours; h++) {
      const lunch = h >= 12 && h <= 14 ? 40 : 0;
      const dinner = h >= 19 && h <= 22 ? 55 : 0;
      const weekend = d >= 5 ? 15 : 0;
      const base = 5 + Math.round(Math.sin((h + d) / 3) * 8);
      row.push(Math.max(0, base + lunch + dinner + weekend));
    }
    grid.push(row);
  }
  return grid;
}

export const STAFF_LEADERBOARD = [
  { name: "Ahmed Ali", orders: 156, avgTicket: 1450, tips: 12000, hours: 38, voids: 2 },
  { name: "Sara Khan", orders: 142, avgTicket: 1650, tips: 15000, hours: 36, voids: 0 },
  { name: "Bilal Sheikh", orders: 128, avgTicket: 1380, tips: 9000, hours: 40, voids: 5 },
  { name: "Fatima Noor", orders: 118, avgTicket: 1520, tips: 11200, hours: 34, voids: 1 },
];

export const INVENTORY_MARGIN = {
  revenue: 3_240_000,
  cogs: 1_180_000,
  grossMarginPct: 63.6,
  items: [
    { name: "Chicken Karahi", revenue: 420_000, cogs: 140_000, expectedUse: 118_000, actualUse: 132_000 },
    { name: "Seekh Kabab", revenue: 280_000, cogs: 112_000, expectedUse: 105_000, actualUse: 108_000 },
    { name: "Biryani", revenue: 310_000, cogs: 125_000, expectedUse: 120_000, actualUse: 118_000 },
  ],
};

export const PAYMENT_SPLIT = [
  { method: "Cash", amount: 1_458_000, pct: 45 },
  { method: "Card", amount: 972_000, pct: 30 },
  { method: "JazzCash", amount: 486_000, pct: 15 },
  { method: "EasyPaisa", amount: 324_000, pct: 10 },
];

export const RECONCILIATION = {
  dineIn: 1_200_000,
  delivery: 850_000,
  takeaway: 420_000,
  online: 380_000,
  totalExpected: 2_850_000,
  drawerActual: 2_831_500,
  variance: -18_500,
  notes: "Variance within tolerance after float adjustment.",
};
