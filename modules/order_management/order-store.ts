"use client";

import { create } from "zustand";
import { produce } from "immer";
import type { CartLine, MenuItem, OrderStatus, OrderType, PosOrder, VoidReason } from "./types";
import { BRANCH, findMenuItem, MENU_ITEMS } from "./mock-data";

const MAX_TABS = 8;
const TAX_RATE = 0.15;

function newLocalId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function emptyOrder(overrides: Partial<PosOrder> = {}): PosOrder {
  const localId = newLocalId();
  return {
    id: `draft-${localId.slice(0, 8)}`,
    localId,
    branchId: BRANCH.id,
    tableId: null,
    tableLabel: null,
    orderType: "dine_in",
    status: "draft",
    staffId: "st-cashier-1",
    guestCount: 2,
    customerName: null,
    customerPhone: null,
    notes: null,
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
    isHeld: false,
    items: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function lineTotal(line: CartLine): number {
  if (line.isVoided) return 0;
  const mod = line.modifiers.reduce((s, m) => s + m.priceAdjustment, 0);
  return (line.priceSnapshot + mod) * line.quantity;
}

function recomputeTotals(order: PosOrder): void {
  const sub = order.items.reduce((s, li) => s + lineTotal(li), 0);
  order.subtotal = Math.round(sub * 100) / 100;
  order.taxAmount = Math.round(order.subtotal * TAX_RATE * 100) / 100;
  order.totalAmount =
    Math.round((order.subtotal - order.discountAmount + order.taxAmount) * 100) / 100;
}

const STATUS_FLOW: OrderStatus[] = [
  "draft",
  "sent",
  "in_prep",
  "ready",
  "served",
  "billed",
  "completed",
];

interface OrderCashierState {
  orders: PosOrder[];
  activeOrderId: string;
  networkOnline: boolean;
  offlineQueue: { localId: string; at: number }[];

  setNetworkOnline: (v: boolean) => void;
  enqueueOffline: (localId: string) => void;
  clearOfflineSynced: (localId: string) => void;

  setActiveOrder: (id: string) => void;
  addOrderTab: (type?: OrderType, tableLabel?: string | null) => void;
  closeOrderTab: (id: string) => void;
  updateActiveOrder: (patch: Partial<PosOrder>) => void;

  addLineFromMenu: (item: MenuItem, modifiers: CartLine["modifiers"]) => void;
  addComboLine: (parent: MenuItem) => void;
  updateLine: (lineId: string, patch: Partial<CartLine>) => void;
  removeLine: (lineId: string) => void;

  toggleHold: () => void;
  sendToKitchen: () => void;
  advanceStatus: () => void;
  voidOrder: (reason: string) => void;
  voidLine: (lineId: string, reason: VoidReason) => void;
}

function getActive(state: OrderCashierState): PosOrder | undefined {
  return state.orders.find((o) => o.id === state.activeOrderId);
}

export const useOrderCashierStore = create<OrderCashierState>((set) => {
  const first = emptyOrder({ tableLabel: "4", tableId: "tbl-4", orderType: "dine_in" });
  return {
    orders: [first],
    activeOrderId: first.id,
    networkOnline: true,
    offlineQueue: [],

    setNetworkOnline: (v) => set({ networkOnline: v }),

    enqueueOffline: (localId) =>
      set(
        produce((s: OrderCashierState) => {
          s.offlineQueue.push({ localId, at: Date.now() });
        })
      ),

    clearOfflineSynced: (localId) =>
      set(
        produce((s: OrderCashierState) => {
          s.offlineQueue = s.offlineQueue.filter((q) => q.localId !== localId);
        })
      ),

    setActiveOrder: (id) => set({ activeOrderId: id }),

    addOrderTab: (type = "dine_in", tableLabel = null) =>
      set(
        produce((s: OrderCashierState) => {
          if (s.orders.length >= MAX_TABS) return;
          const o = emptyOrder({
            orderType: type,
            tableLabel,
            tableId: tableLabel ? `tbl-${tableLabel.replace(/\D/g, "")}` : null,
          });
          s.orders.push(o);
          s.activeOrderId = o.id;
        })
      ),

    closeOrderTab: (id) =>
      set(
        produce((s: OrderCashierState) => {
          if (s.orders.length <= 1) return;
          s.orders = s.orders.filter((o) => o.id !== id);
          if (s.activeOrderId === id) s.activeOrderId = s.orders[s.orders.length - 1].id;
        })
      ),

    updateActiveOrder: (patch) =>
      set(
        produce((s: OrderCashierState) => {
          const o = s.orders.find((x) => x.id === s.activeOrderId);
          if (!o) return;
          Object.assign(o, patch);
          recomputeTotals(o);
        })
      ),

    addLineFromMenu: (item, modifiers) =>
      set(
        produce((s: OrderCashierState) => {
          const o = s.orders.find((x) => x.id === s.activeOrderId);
          if (!o) return;
          const modSum = modifiers.reduce((acc, m) => acc + m.priceAdjustment, 0);
          const line: CartLine = {
            id: newLocalId(),
            menuItemId: item.id,
            nameSnapshot: item.name,
            priceSnapshot: item.price,
            quantity: 1,
            notes: null,
            isVoided: false,
            voidReason: null,
            modifiers,
          };
          o.items.push(line);
          recomputeTotals(o);
        })
      ),

    addComboLine: (parent) =>
      set(
        produce((s: OrderCashierState) => {
          const o = s.orders.find((x) => x.id === s.activeOrderId);
          if (!o || !parent.comboChildren?.length || parent.comboBundlePrice == null) return;
          const parentLineId = newLocalId();
          const bundle = parent.comboBundlePrice;
          const parentLine: CartLine = {
            id: parentLineId,
            menuItemId: parent.id,
            nameSnapshot: parent.name,
            priceSnapshot: bundle,
            quantity: 1,
            notes: null,
            isVoided: false,
            voidReason: null,
            modifiers: [],
          };
          o.items.push(parentLine);
          for (const ch of parent.comboChildren) {
            const mi = findMenuItem(ch.menuItemId);
            const name = mi?.name ?? ch.name;
            o.items.push({
              id: newLocalId(),
              menuItemId: ch.menuItemId,
              nameSnapshot: `${name} (combo part — modifiers OK)`,
              priceSnapshot: 0,
              quantity: ch.qty,
              notes: null,
              isVoided: false,
              voidReason: null,
              modifiers: [],
              fromComboParentId: parentLineId,
            });
          }
          recomputeTotals(o);
        })
      ),

    updateLine: (lineId, patch) =>
      set(
        produce((s: OrderCashierState) => {
          const o = s.orders.find((x) => x.id === s.activeOrderId);
          if (!o) return;
          const li = o.items.find((l) => l.id === lineId);
          if (!li) return;
          Object.assign(li, patch);
          recomputeTotals(o);
        })
      ),

    removeLine: (lineId) =>
      set(
        produce((s: OrderCashierState) => {
          const o = s.orders.find((x) => x.id === s.activeOrderId);
          if (!o) return;
          o.items = o.items.filter((l) => l.id !== lineId && l.fromComboParentId !== lineId);
          recomputeTotals(o);
        })
      ),

    toggleHold: () =>
      set(
        produce((s: OrderCashierState) => {
          const o = s.orders.find((x) => x.id === s.activeOrderId);
          if (!o) return;
          o.isHeld = !o.isHeld;
        })
      ),

    sendToKitchen: () =>
      set(
        produce((s: OrderCashierState) => {
          const o = s.orders.find((x) => x.id === s.activeOrderId);
          if (!o || o.isHeld || o.items.length === 0) return;
          o.status = "sent";
          if (!s.networkOnline) {
            s.offlineQueue.push({ localId: o.localId, at: Date.now() });
          }
        })
      ),

    advanceStatus: () =>
      set(
        produce((s: OrderCashierState) => {
          const o = s.orders.find((x) => x.id === s.activeOrderId);
          if (!o) return;
          const i = STATUS_FLOW.indexOf(o.status);
          if (i >= 0 && i < STATUS_FLOW.length - 1) o.status = STATUS_FLOW[i + 1];
        })
      ),

    voidOrder: (reason) =>
      set(
        produce((s: OrderCashierState) => {
          const o = s.orders.find((x) => x.id === s.activeOrderId);
          if (!o) return;
          o.status = "void";
          o.notes = [o.notes, `VOID: ${reason}`].filter(Boolean).join(" | ");
        })
      ),

    voidLine: (lineId, reason) =>
      set(
        produce((s: OrderCashierState) => {
          const o = s.orders.find((x) => x.id === s.activeOrderId);
          if (!o) return;
          const map: Record<VoidReason, string> = {
            customer_changed_mind: "Customer changed mind",
            incorrect_order: "Incorrect order",
            out_of_stock: "Out of stock",
          };
          const label = map[reason];
          for (const li of o.items) {
            if (li.id === lineId || li.fromComboParentId === lineId) {
              li.isVoided = true;
              li.voidReason = label;
            }
          }
          recomputeTotals(o);
        })
      ),
  };
});

export { STATUS_FLOW };
