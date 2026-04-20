"use client";

import * as React from "react";
import { CloudUpload, Database, Trash2 } from "lucide-react";
import { listQueuedOrders, removeQueuedOrder } from "./offline-db";
import { useOrderCashierStore } from "./order-store";
import { BRANCH } from "./mock-data";

export function OfflineSyncView() {
  const [rows, setRows] = React.useState<Awaited<ReturnType<typeof listQueuedOrders>>>([]);
  const offlineMeta = useOrderCashierStore((s) => s.offlineQueue);
  const clearOfflineSynced = useOrderCashierStore((s) => s.clearOfflineSynced);

  const refresh = React.useCallback(async () => {
    try {
      const r = await listQueuedOrders();
      setRows(r);
    } catch {
      setRows([]);
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1a1a2e] tracking-tight">Offline queue & sync</h2>
          <p className="text-sm text-[#a0a8b2] font-medium mt-1 max-w-2xl">
            Orders saved in Dexie (IndexedDB) when the terminal is offline. On reconnect,{" "}
            <code className="font-bold text-[#1a1a2e]">POST /api/orders/sync</code> replays them in order;
            duplicate prevention uses <code className="font-bold text-[#1a1a2e]">local_id</code> UUIDs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1a1a2e] text-white text-xs font-black shadow-lg"
        >
          <Database size={16} />
          Refresh Dexie
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[28px] border border-[#EBEBF0] p-6 card-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-800">
              <CloudUpload size={22} />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-[#a0a8b2] tracking-wider">Store memory</p>
              <p className="text-lg font-black text-[#1a1a2e]">Zustand offline hints</p>
            </div>
          </div>
          {offlineMeta.length === 0 ? (
            <p className="text-sm text-[#a0a8b2] font-medium">No pending hints from this session.</p>
          ) : (
            <ul className="space-y-2">
              {offlineMeta.map((m) => (
                <li
                  key={m.localId}
                  className="flex justify-between text-xs font-mono bg-[#F5F6FA] rounded-xl px-3 py-2 border border-[#EBEBF0]"
                >
                  <span className="truncate">{m.localId}</span>
                  <span className="text-[#a0a8b2] shrink-0">{new Date(m.at).toLocaleTimeString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-[28px] border border-[#EBEBF0] p-6 card-shadow">
          <p className="text-[11px] font-black uppercase text-[#a0a8b2] tracking-wider mb-1">Branch</p>
          <p className="text-lg font-black text-[#1a1a2e]">{BRANCH.name}</p>
          <p className="text-xs text-[#a0a8b2] font-semibold mt-2">
            IndexedDB name: <span className="font-mono text-[#1a1a2e]">pos_offline_orders_v1</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[28px] border border-[#EBEBF0] overflow-hidden card-shadow">
        <div className="px-6 py-4 border-b border-[#F0F1F5] flex justify-between items-center">
          <h3 className="text-sm font-black text-[#1a1a2e]">Dexie table · queuedOrders</h3>
          <span className="text-[11px] font-black text-[#a0a8b2]">{rows.length} row(s)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAFAFC] text-[11px] font-black uppercase tracking-wider text-[#a0a8b2]">
              <tr>
                <th className="px-6 py-3">local_id</th>
                <th className="px-6 py-3">Queued at</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F1F5]">
              {rows.map((r) => (
                <tr key={r.localId}>
                  <td className="px-6 py-3 font-mono text-xs font-bold">{r.localId}</td>
                  <td className="px-6 py-3 text-xs text-[#a0a8b2]">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      type="button"
                      onClick={async () => {
                        await removeQueuedOrder(r.localId);
                        clearOfflineSynced(r.localId);
                        await refresh();
                      }}
                      className="inline-flex items-center gap-1 text-xs font-black text-rose-700 hover:underline"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <p className="text-center text-sm text-[#a0a8b2] font-medium py-12">
            No IndexedDB rows yet — toggle offline on the cashier and send an order to kitchen.
          </p>
        )}
      </div>
    </div>
  );
}
