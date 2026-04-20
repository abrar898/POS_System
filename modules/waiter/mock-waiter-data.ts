import type { RunnerItem, ServiceRequest, TableInfo, WaiterOrderSummary } from "./types";

export const WAITER_PROFILE = {
  name: "Sara Khan",
  shift: "Lunch · 12:00–20:00",
  section: "Main + Family",
};

export const TABLES: TableInfo[] = [
  { id: "t1", label: "1", section: "Main", guests: 0, status: "empty", assignedWaiter: "Sara Khan", orderId: null, lastUpdate: "—" },
  { id: "t2", label: "2", section: "Main", guests: 4, status: "in_kitchen", assignedWaiter: "Sara Khan", orderId: "ord-204", lastUpdate: "2m" },
  { id: "t3", label: "3", section: "Main", guests: 2, status: "food_ready", assignedWaiter: "Sara Khan", orderId: "ord-201", lastUpdate: "1m" },
  { id: "t4", label: "4", section: "Main", guests: 6, status: "dining", assignedWaiter: "Sara Khan", orderId: "ord-198", lastUpdate: "12m" },
  { id: "t5", label: "5", section: "Family", guests: 3, status: "ordering", assignedWaiter: "Sara Khan", orderId: "ord-210", lastUpdate: "now" },
  { id: "t6", label: "6", section: "Family", guests: 5, status: "bill_requested", assignedWaiter: "Sara Khan", orderId: "ord-195", lastUpdate: "4m" },
  { id: "t7", label: "7", section: "Rooftop", guests: 2, status: "seated", assignedWaiter: "Ahmed Ali", orderId: null, lastUpdate: "8m" },
  { id: "t8", label: "8", section: "Rooftop", guests: 4, status: "in_kitchen", assignedWaiter: "Sara Khan", orderId: "ord-212", lastUpdate: "6m" },
];

export const RUNNER_QUEUE: RunnerItem[] = [
  {
    id: "run-1",
    tableLabel: "3",
    items: ["Chicken Karahi (L)", "Garlic Naan ×2"],
    readyAt: "1m ago",
    claimed: false,
  },
  {
    id: "run-2",
    tableLabel: "8",
    items: ["Seekh Kabab", "Mint Raita"],
    readyAt: "30s ago",
    claimed: false,
  },
];

export const SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: "sr-1",
    tableLabel: "6",
    type: "bill",
    message: "Guest ready for bill",
    createdAt: "3m ago",
    urgent: true,
  },
  {
    id: "sr-2",
    tableLabel: "4",
    type: "water",
    message: "Jug + extra glasses",
    createdAt: "6m ago",
    urgent: false,
  },
  {
    id: "sr-3",
    tableLabel: "5",
    type: "spice",
    message: "Extra green chutney",
    createdAt: "1m ago",
    urgent: false,
  },
];

export const ACTIVE_ORDERS: WaiterOrderSummary[] = [
  { id: "ord-204", tableLabel: "2", status: "in_prep", covers: 4, total: 8_420, kitchenNote: "One mild karahi" },
  { id: "ord-201", tableLabel: "3", status: "ready", covers: 2, total: 3_180, kitchenNote: null },
  { id: "ord-198", tableLabel: "4", status: "served", covers: 6, total: 12_900, kitchenNote: "Birthday — dessert after mains" },
  { id: "ord-210", tableLabel: "5", status: "in_prep", covers: 3, total: 4_560, kitchenNote: null },
  { id: "ord-195", tableLabel: "6", status: "served", covers: 5, total: 9_200, kitchenNote: null },
  { id: "ord-212", tableLabel: "8", status: "in_prep", covers: 4, total: 6_100, kitchenNote: "No nuts" },
];

export const TABLE_ORDER_LINES: Record<
  string,
  { name: string; qty: number; course: string; lineStatus: "sent" | "ready" | "served" }[]
> = {
  t3: [
    { name: "Chicken Karahi (Large)", qty: 1, course: "Mains", lineStatus: "ready" },
    { name: "Garlic Naan", qty: 2, course: "Bread", lineStatus: "ready" },
    { name: "Sweet Lassi", qty: 2, course: "Drinks", lineStatus: "sent" },
  ],
  t4: [
    { name: "Mutton Handi", qty: 1, course: "Mains", lineStatus: "served" },
    { name: "Plain Naan", qty: 4, course: "Bread", lineStatus: "served" },
  ],
  t2: [
    { name: "Chicken Biryani", qty: 2, course: "Mains", lineStatus: "sent" },
    { name: "Raita", qty: 1, course: "Sides", lineStatus: "sent" },
  ],
};
