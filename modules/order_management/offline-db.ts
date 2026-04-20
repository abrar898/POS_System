"use client";

import Dexie, { type Table } from "dexie";
import type { PosOrder } from "./types";

export interface QueuedOrderRow {
  localId: string;
  branchId: string;
  createdAt: number;
  payload: PosOrder;
}

class OfflineOrderDB extends Dexie {
  queuedOrders!: Table<QueuedOrderRow, string>;

  constructor() {
    super("pos_offline_orders_v1");
    this.version(1).stores({
      queuedOrders: "localId, branchId, createdAt",
    });
  }
}

let db: OfflineOrderDB | null = null;

export function getOfflineOrderDB(): OfflineOrderDB {
  if (typeof window === "undefined") {
    throw new Error("Offline DB is browser-only");
  }
  if (!db) db = new OfflineOrderDB();
  return db;
}

export async function queueOrderOffline(order: PosOrder): Promise<void> {
  const d = getOfflineOrderDB();
  await d.queuedOrders.put({
    localId: order.localId,
    branchId: order.branchId,
    createdAt: Date.now(),
    payload: order,
  });
}

export async function listQueuedOrders(): Promise<QueuedOrderRow[]> {
  const d = getOfflineOrderDB();
  return d.queuedOrders.orderBy("createdAt").toArray();
}

export async function removeQueuedOrder(localId: string): Promise<void> {
  const d = getOfflineOrderDB();
  await d.queuedOrders.delete(localId);
}
