export type TableStatus =
  | "empty"
  | "seated"
  | "ordering"
  | "in_kitchen"
  | "food_ready"
  | "dining"
  | "bill_requested";

export type KitchenTicketStatus = "queued" | "cooking" | "ready";

export interface TableInfo {
  id: string;
  label: string;
  section: "Main" | "Family" | "Rooftop";
  guests: number;
  status: TableStatus;
  assignedWaiter: string;
  orderId: string | null;
  lastUpdate: string;
}

export interface RunnerItem {
  id: string;
  tableLabel: string;
  items: string[];
  readyAt: string;
  claimed: boolean;
}

export interface ServiceRequest {
  id: string;
  tableLabel: string;
  type: "water" | "bill" | "spice" | "complaint" | "other";
  message: string;
  createdAt: string;
  urgent: boolean;
}

export interface WaiterOrderSummary {
  id: string;
  tableLabel: string;
  status: "in_prep" | "ready" | "served" | "billed";
  covers: number;
  total: number;
  kitchenNote: string | null;
}
