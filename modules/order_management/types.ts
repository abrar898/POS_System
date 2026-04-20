/** Aligns with design doc: orders / order_items / order_modifiers */

export type OrderType = "dine_in" | "takeaway" | "delivery";

export type OrderStatus =
  | "draft"
  | "sent"
  | "in_prep"
  | "ready"
  | "served"
  | "billed"
  | "completed"
  | "void";

export type VoidReason = "customer_changed_mind" | "incorrect_order" | "out_of_stock";

export interface ModifierOption {
  id: string;
  name: string;
  priceAdjustment: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  available: boolean;
  imageEmoji?: string;
  /** Typical kitchen prep minutes (per line, used for guest ETA) */
  prepMinutes?: number;
  modifierGroups: ModifierGroup[];
  /** Combo deal: child SKUs at bundled total */
  comboChildren?: { menuItemId: string; name: string; qty: number }[];
  comboBundlePrice?: number;
}

export interface CartModifier {
  modifierOptionId: string;
  nameSnapshot: string;
  priceAdjustment: number;
}

export interface CartLine {
  id: string;
  menuItemId: string;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  notes: string | null;
  isVoided: boolean;
  voidReason: string | null;
  modifiers: CartModifier[];
  /** True when line came from a combo parent */
  fromComboParentId?: string;
}

export interface PosOrder {
  id: string;
  localId: string;
  branchId: string;
  tableId: string | null;
  tableLabel: string | null;
  orderType: OrderType;
  status: OrderStatus;
  staffId: string;
  guestCount: number;
  customerName: string | null;
  customerPhone: string | null;
  notes: string | null;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  isHeld: boolean;
  items: CartLine[];
  createdAt: string;
}

export interface OfflineQueuedOrder {
  localId: string;
  payload: PosOrder;
  createdAt: number;
  synced: boolean;
}
