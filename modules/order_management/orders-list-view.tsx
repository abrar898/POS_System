import * as React from "react";
import { Bike, Filter, Search, ShoppingBag, UtensilsCrossed, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { OrderStatus, OrderType } from "./types";

const STATUS_OPTIONS: OrderStatus[] = [
  "draft",
  "sent",
  "in_prep",
  "ready",
  "served",
  "billed",
  "completed",
  "void",
];

const TYPE_ICON: Record<string, React.ReactNode> = {
  dine_in: <UtensilsCrossed size={16} />,
  takeaway: <ShoppingBag size={16} />,
  delivery: <Bike size={16} />,
};

const LABEL: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  in_prep: "In prep",
  ready: "Ready",
  served: "Served",
  billed: "Billed",
  completed: "Done",
  void: "Void",
  pending: "Pending"
};

export function OrdersListView() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<string | "all">("all");
  const [type, setType] = React.useState<string | "all">("all");
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.orders.getAll();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const rows = orders.filter((o) => {
    if (status !== "all" && o.status !== status) return false;
    if (type !== "all" && o.type !== type) return false;
    if (q.trim()) {
      const needle = q.toLowerCase();
      return (
        o.id.toLowerCase().includes(needle) ||
        (o.customer_name?.toLowerCase().includes(needle) ?? false)
      );
    }
    return true;
  });

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1a1a2e] tracking-tight">Live Orders</h2>
          <p className="text-sm text-[#a0a8b2] font-medium mt-1 max-w-xl">
            Real-time synchronization with the backend POS database.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a8b2]" size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Order id, name…"
              className="pl-9 pr-3 py-2.5 rounded-xl border border-[#EBEBF0] text-xs font-bold w-64 bg-white shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#a0a8b2]" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-[#EBEBF0] text-xs font-bold bg-white"
            >
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {LABEL[s]}
                </option>
              ))}
              <option value="pending">Pending</option>
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-[#EBEBF0] text-xs font-bold bg-white"
            >
              <option value="all">All channels</option>
              <option value="dine_in">Dine-in</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[28px] border border-[#EBEBF0] card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
              <p className="text-sm font-bold text-slate-400">Syncing with server...</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFAFC] text-[11px] font-black uppercase tracking-wider text-[#a0a8b2]">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Channel</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F1F5]">
                {rows.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAFAFC]/80">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-[#1a1a2e] truncate max-w-[120px]">{o.id}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 font-bold text-[#1a1a2e]">
                        {TYPE_ICON[o.type] || <ShoppingBag size={16} />}
                        {(o.type || 'dine_in').replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-[#1a1a2e]">
                      {o.customer_name || "Walk-in"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                        o.status === 'completed' 
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-100' 
                          : 'bg-orange-50 text-orange-900 border-orange-100'
                      }`}>
                        {LABEL[o.status] || o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black tabular-nums">
                      Rs. {o.total_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500 capitalize">
                      {o.payment_method || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && rows.length === 0 && (
          <p className="text-center text-sm text-[#a0a8b2] font-medium py-16">No orders match filters.</p>
        )}
      </div>
    </div>
  );
}
