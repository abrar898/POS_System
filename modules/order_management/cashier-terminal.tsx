"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Banknote,
  Bike,
  ChefHat,
  GripVertical,
  Loader2,
  MessageCircle,
  Megaphone,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  StickyNote,
  UtensilsCrossed,
} from "lucide-react";
import { MenuCommandPalette } from "./command-palette";
import { ModifierBottomSheet } from "./modifier-sheet";
import { ManagerPinDialog } from "./manager-pin-dialog";
import { CATEGORIES, findMenuItem, MENU_ITEMS } from "./mock-data";
import { COUNTER_SCRIPTS, estimateReadyMinutes } from "./counter-workflow";
import { queueOrderOffline } from "./offline-db";
import { STATUS_FLOW, useOrderCashierStore } from "./order-store";
import type { CartModifier, MenuItem, OrderType, VoidReason } from "./types";

const TYPE_ICON: Record<OrderType, React.ReactNode> = {
  dine_in: <UtensilsCrossed size={14} />,
  takeaway: <ShoppingBag size={14} />,
  delivery: <Bike size={14} />,
};

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  sent: "Sent to kitchen",
  in_prep: "In preparation",
  ready: "Ready",
  served: "Served",
  billed: "Billed",
  completed: "Completed",
  void: "Void",
};

function statusIndex(status: string): number {
  const i = STATUS_FLOW.indexOf(status as (typeof STATUS_FLOW)[number]);
  return i < 0 ? 0 : i;
}

export function CashierTerminal() {
  const pathname = usePathname();
  const isCounter = pathname?.startsWith("/counter") ?? false;

  const orders = useOrderCashierStore((s) => s.orders);
  const activeOrderId = useOrderCashierStore((s) => s.activeOrderId);
  const networkOnline = useOrderCashierStore((s) => s.networkOnline);

  const setActiveOrder = useOrderCashierStore((s) => s.setActiveOrder);
  const addOrderTab = useOrderCashierStore((s) => s.addOrderTab);
  const closeOrderTab = useOrderCashierStore((s) => s.closeOrderTab);
  const updateActiveOrder = useOrderCashierStore((s) => s.updateActiveOrder);
  const addLineFromMenu = useOrderCashierStore((s) => s.addLineFromMenu);
  const addComboLine = useOrderCashierStore((s) => s.addComboLine);
  const updateLine = useOrderCashierStore((s) => s.updateLine);
  const removeLine = useOrderCashierStore((s) => s.removeLine);
  const toggleHold = useOrderCashierStore((s) => s.toggleHold);
  const sendToKitchen = useOrderCashierStore((s) => s.sendToKitchen);
  const advanceStatus = useOrderCashierStore((s) => s.advanceStatus);
  const voidOrder = useOrderCashierStore((s) => s.voidOrder);
  const voidLine = useOrderCashierStore((s) => s.voidLine);

  const active = orders.find((o) => o.id === activeOrderId) ?? orders[0];

  const [cat, setCat] = React.useState<string>(CATEGORIES[0]?.id ?? "all");
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [modifierItem, setModifierItem] = React.useState<MenuItem | null>(null);
  const [modifierOpen, setModifierOpen] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const [voidMode, setVoidMode] = React.useState<"order" | "item" | null>(null);
  const [voidLineId, setVoidLineId] = React.useState<string | null>(null);
  const [syncBusy, setSyncBusy] = React.useState(false);

  /** Counter-only: mirror real counter ↔ guest ↔ payment ↔ kitchen */
  const [counterFlow, setCounterFlow] = React.useState({
    quoteOpen: false,
    guestAck: false,
    paymentOk: false,
  });
  const prevItemCount = React.useRef(0);

  React.useEffect(() => {
    setCounterFlow({ quoteOpen: false, guestAck: false, paymentOk: false });
  }, [activeOrderId]);

  React.useEffect(() => {
    const n = active.items.length;
    if (n === 0) {
      setCounterFlow({ quoteOpen: false, guestAck: false, paymentOk: false });
      prevItemCount.current = 0;
      return;
    }
    if (isCounter && prevItemCount.current === 0 && n > 0) {
      setToast(`${COUNTER_SCRIPTS.hasItem} ${COUNTER_SCRIPTS.hasItemEn}`);
      window.setTimeout(() => setToast(null), 4500);
    }
    prevItemCount.current = n;
  }, [active.items.length, isCounter]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))
        return;
      if (e.key === "/") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const gridItems = MENU_ITEMS.filter((m) => (cat === "all" ? true : m.categoryId === cat));

  const handlePickMenuItem = (item: MenuItem) => {
    if (!item.available) {
      if (isCounter) {
        setToast("Maazrat — yeh item ab available nahi. Guest ko doosra option sujha dein.");
        window.setTimeout(() => setToast(null), 4000);
      }
      return;
    }
    if (item.comboChildren?.length) {
      addComboLine(item);
      return;
    }
    if (item.modifierGroups.length) {
      setModifierItem(item);
      setModifierOpen(true);
      return;
    }
    addLineFromMenu(item, []);
  };

  const onModifiersConfirm = (mods: CartModifier[]) => {
    if (!modifierItem) return;
    addLineFromMenu(modifierItem, mods);
    setModifierOpen(false);
    setModifierItem(null);
  };

  const fireToKitchen = async () => {
    const o = useOrderCashierStore.getState().orders.find((x) => x.id === activeOrderId);
    if (!o || o.isHeld || o.items.length === 0) return;
    if (isCounter) {
      if (!counterFlow.quoteOpen || !counterFlow.guestAck || !counterFlow.paymentOk) {
        setToast("Counter flow: quote kholein → guest ko total/wait batayein → confirm → payment → phir kitchen.");
        window.setTimeout(() => setToast(null), 4800);
        return;
      }
    }
    sendToKitchen();
    const after = useOrderCashierStore.getState().orders.find((x) => x.id === activeOrderId);
    if (isCounter) {
      setCounterFlow({ quoteOpen: false, guestAck: false, paymentOk: false });
    }
    if (!networkOnline && after) {
      try {
        await queueOrderOffline(after);
        setToast("Saved locally — will sync when back online (UUID dedup).");
        window.setTimeout(() => setToast(null), 4500);
      } catch {
        setToast("Could not write to IndexedDB.");
        window.setTimeout(() => setToast(null), 3500);
      }
    } else if (isCounter) {
      setToast("Order kitchen ko chala gaya — guest ko seat / pickup bata dein.");
      window.setTimeout(() => setToast(null), 4000);
    }
  };

  const kitchenSent = statusIndex(active.status) >= statusIndex("sent");
  const etaMin = estimateReadyMinutes(active);
  const totalStr = `Rs. ${active.totalAmount.toLocaleString()}`;
  return (
    <div className={`flex h-full min-h-0 flex-col ${isCounter ? "bg-slate-900/30" : ""}`}>
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-[100] max-w-[min(92vw,28rem)] -translate-x-1/2 rounded-2xl px-5 py-3 text-center text-sm font-bold shadow-2xl animate-in slide-in-from-bottom-4 ${
            isCounter ? "bg-teal-950 text-teal-50 ring-2 ring-teal-500/40" : "bg-[#1a1a2e] text-white"
          }`}
        >
          {toast}
        </div>
      )}

      <MenuCommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        items={MENU_ITEMS}
        onPick={handlePickMenuItem}
      />

      <ModifierBottomSheet
        item={modifierItem}
        open={modifierOpen}
        onClose={() => {
          setModifierOpen(false);
          setModifierItem(null);
        }}
        onConfirm={onModifiersConfirm}
      />

      <ManagerPinDialog
        open={voidMode !== null}
        mode={voidMode === "item" ? "void_item" : "void_order"}
        onClose={() => {
          setVoidMode(null);
          setVoidLineId(null);
        }}
        onSubmit={(reason) => {
          if (voidMode === "order") voidOrder(String(reason));
          else if (voidLineId) voidLine(voidLineId, reason as VoidReason);
        }}
      />

      {/* Order tabs — up to 8 */}
      <div
        className={`flex shrink-0 items-center gap-2 overflow-x-auto border-b px-4 py-2 ${
          isCounter ? "border-slate-800 bg-slate-900/70" : "border-[#EBEBF0] bg-white"
        }`}
      >
        <span
          className={`mr-1 shrink-0 text-[10px] font-black uppercase tracking-wider ${
            isCounter ? "text-teal-500/90" : "text-[#a0a8b2]"
          }`}
        >
          {isCounter ? "Counter tickets" : "Open orders"}
        </span>
        {orders.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setActiveOrder(o.id)}
            className={`flex shrink-0 items-center gap-2 rounded-2xl border py-2 pl-3 pr-3 text-xs font-black transition-all ${
              o.id === activeOrderId
                ? isCounter
                  ? "border-teal-500 bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/25"
                  : "border-[#1a1a2e] bg-[#1a1a2e] text-white shadow-lg"
                : isCounter
                  ? "border-slate-700 bg-slate-800/80 text-slate-200 hover:border-teal-600/50"
                  : "border-[#EBEBF0] bg-[#F5F6FA] text-[#1a1a2e] hover:border-[#1a1a2e]/25"
            }`}
          >
            <span className="opacity-90">{TYPE_ICON[o.orderType]}</span>
            <span className="max-w-[100px] truncate">
              {o.tableLabel
                ? `Table ${o.tableLabel}`
                : o.orderType === "dine_in"
                  ? "Dine-in"
                  : o.orderType === "takeaway"
                    ? "Takeaway"
                    : "Delivery"}
            </span>
            {o.isHeld && (
              <span className="text-[9px] uppercase bg-amber-400/90 text-amber-950 px-1.5 py-0.5 rounded-md">
                Hold
              </span>
            )}
          </button>
        ))}
        <button
          type="button"
          disabled={orders.length >= 8}
          onClick={() => addOrderTab("dine_in", String((orders.length % 12) + 1))}
          className={`shrink-0 rounded-2xl border border-dashed px-3 py-2 text-xs font-black disabled:opacity-40 ${
            isCounter
              ? "border-slate-600 text-slate-400 hover:border-teal-500 hover:text-teal-200"
              : "border-[#c5c8d0] text-[#a0a8b2] hover:border-[#1a1a2e] hover:text-[#1a1a2e]"
          }`}
        >
          + Tab
        </button>
        <button
          type="button"
          onClick={() => closeOrderTab(activeOrderId)}
          className="ml-auto text-[11px] font-bold text-rose-600 hover:underline shrink-0"
        >
          Close tab
        </button>
      </div>

      {/* Counter: guest-facing workflow (hear → quote → pay → kitchen) */}
      {isCounter && (
        <div className="shrink-0 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 px-3 py-3 sm:px-4">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-teal-400/90">
            Counter workflow — bol bol kar
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {[
              {
                n: 1,
                t: "Sun'ain / ask",
                d: "Guest kya chahta hai — phir item tap karein.",
                ok: active.items.length > 0,
              },
              {
                n: 2,
                t: "Ticket banayein",
                d: "Modifiers, note, quantity.",
                ok: active.items.length > 0,
              },
              {
                n: 3,
                t: "Total + wait",
                d: "Neeche quote kholein aur Roman Urdu + English padhein.",
                ok: counterFlow.quoteOpen && counterFlow.guestAck,
              },
              {
                n: 4,
                t: "Payment",
                d: "Paisay lein ya tab pe likhein.",
                ok: counterFlow.paymentOk,
              },
            ].map((s) => (
              <div
                key={s.n}
                className={`flex min-w-[140px] flex-1 items-start gap-2 rounded-2xl border px-3 py-2 sm:min-w-0 ${
                  s.ok
                    ? "border-teal-600/50 bg-teal-950/50"
                    : "border-slate-700/80 bg-slate-950/40"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                    s.ok ? "bg-teal-500 text-slate-950" : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {s.ok ? "✓" : s.n}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-white">{s.t}</p>
                  <p className="text-[10px] font-medium leading-snug text-slate-500">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order lifecycle (KDS) */}
      <div
        className={`flex shrink-0 flex-wrap items-center gap-2 border-b px-4 py-2 ${
          isCounter ? "border-slate-800 bg-slate-950/60" : "border-[#EBEBF0] bg-[#FAFAFC]"
        }`}
      >
        <span
          className={`text-[10px] font-black uppercase tracking-wider ${isCounter ? "text-slate-500" : "text-[#a0a8b2]"}`}
        >
          Kitchen lifecycle
        </span>
        {STATUS_FLOW.map((st) => {
          const activeStep = statusIndex(active.status) >= statusIndex(st);
          return (
            <span
              key={st}
              className={`rounded-lg border px-2 py-1 text-[10px] font-black ${
                active.status === st
                  ? isCounter
                    ? "border-teal-500 bg-teal-600 text-white"
                    : "border-[#1a1a2e] bg-[#1a1a2e] text-white"
                  : activeStep
                    ? isCounter
                      ? "border-teal-800 bg-teal-950/60 text-teal-200"
                      : "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : isCounter
                      ? "border-slate-800 bg-slate-900 text-slate-600"
                      : "border-[#EBEBF0] bg-white text-[#c5c8d0]"
              }`}
            >
              {STATUS_LABEL[st] ?? st}
            </span>
          );
        })}
        <span className={`ml-auto text-[10px] font-black ${isCounter ? "text-rose-400" : "text-rose-600"}`}>
          Any → VOID (PIN)
        </span>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Left — menu */}
        <section
          className={`flex min-w-0 w-[58%] flex-col border-r ${
            isCounter ? "border-slate-800 bg-slate-950/50" : "border-[#EBEBF0] bg-white"
          }`}
        >
          <div
            className={`flex flex-wrap items-center gap-2 border-b p-4 ${
              isCounter ? "border-slate-800 bg-slate-900/60" : "border-[#F0F1F5]"
            }`}
          >
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-black shadow-lg ${
                isCounter ? "bg-teal-500 text-slate-950 shadow-teal-500/25" : "bg-[#1a1a2e] text-white"
              }`}
            >
              <Search size={16} /> Search
              <kbd className="hidden rounded bg-black/10 px-1.5 py-0.5 text-[10px] sm:inline">/</kbd>
            </button>
            <div className="flex flex-1 flex-wrap justify-end gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCat(c.id)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-black transition-all ${
                    cat === c.id
                      ? isCounter
                        ? "border-teal-400 bg-teal-500 text-slate-950"
                        : "border-[#1a1a2e] bg-[#1a1a2e] text-white"
                      : isCounter
                        ? "border-slate-700 bg-slate-800/80 text-slate-300 hover:border-teal-600/40"
                        : "border-[#EBEBF0] bg-[#F5F6FA] text-[#1a1a2e] hover:border-[#1a1a2e]/20"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 content-start gap-3 overflow-y-auto p-4 xl:grid-cols-3">
            {gridItems.map((item) => {
              const prep = item.prepMinutes ?? findMenuItem(item.id)?.prepMinutes ?? 12;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={!item.available}
                  onClick={() => handlePickMenuItem(item)}
                  className={`rounded-[24px] border p-4 text-left transition-all disabled:opacity-40 ${
                    isCounter
                      ? "border-slate-700 bg-slate-900/90 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-900/20"
                      : "border-[#EBEBF0] bg-[#FAFAFC] hover:border-[#1a1a2e]/25 hover:shadow-lg"
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="text-2xl">{item.imageEmoji ?? "🍽️"}</span>
                    <div className="flex flex-col items-end gap-1">
                      {item.comboChildren?.length ? (
                        <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-indigo-200">
                          Combo
                        </span>
                      ) : null}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-black ${
                          isCounter ? "bg-teal-950 text-teal-300 ring-1 ring-teal-800" : "bg-emerald-50 text-emerald-800"
                        }`}
                      >
                        ~{prep} min
                      </span>
                    </div>
                  </div>
                  <p
                    className={`line-clamp-2 text-sm font-black leading-snug ${
                      isCounter ? "text-white" : "text-[#1a1a2e]"
                    }`}
                  >
                    {item.name}
                  </p>
                  <p
                    className={`mt-2 text-sm font-black tabular-nums ${isCounter ? "text-teal-200" : "text-[#1a1a2e]"}`}
                  >
                    Rs. {(item.comboBundlePrice ?? item.price).toLocaleString()}
                  </p>
                  {!item.available && (
                    <p className="mt-1 text-[10px] font-black text-rose-500">Unavailable</p>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Right — cart + counter guest script */}
        <section
          className={`flex min-w-0 flex-1 flex-col ${
            isCounter ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" : "bg-[#F5F6FA]"
          }`}
        >
          <div
            className={`flex flex-wrap items-end gap-3 border-b p-4 ${
              isCounter ? "border-slate-800 bg-slate-900/80" : "border-[#EBEBF0] bg-white"
            }`}
          >
            <div>
              <label
                className={`text-[10px] font-black uppercase ${isCounter ? "text-teal-500/90" : "text-[#a0a8b2]"}`}
              >
                Channel
              </label>
              <select
                value={active.orderType}
                onChange={(e) => updateActiveOrder({ orderType: e.target.value as OrderType })}
                className={`mt-1 block w-40 rounded-xl border px-3 py-2 text-xs font-bold ${
                  isCounter
                    ? "border-slate-700 bg-slate-950 text-white"
                    : "border-[#EBEBF0] bg-white"
                }`}
              >
                <option value="dine_in">Dine-in</option>
                <option value="takeaway">Takeaway</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
            <div>
              <label
                className={`text-[10px] font-black uppercase ${isCounter ? "text-teal-500/90" : "text-[#a0a8b2]"}`}
              >
                Table / label
              </label>
              <input
                value={active.tableLabel ?? ""}
                onChange={(e) =>
                  updateActiveOrder({
                    tableLabel: e.target.value || null,
                    tableId: e.target.value ? `tbl-${e.target.value.replace(/\D/g, "")}` : null,
                  })
                }
                placeholder="e.g. 4"
                className={`mt-1 w-24 rounded-xl border px-3 py-2 text-xs font-bold ${
                  isCounter ? "border-slate-700 bg-slate-950 text-white" : "border-[#EBEBF0]"
                }`}
              />
            </div>
            <div>
              <label
                className={`text-[10px] font-black uppercase ${isCounter ? "text-teal-500/90" : "text-[#a0a8b2]"}`}
              >
                Guests
              </label>
              <input
                type="number"
                min={1}
                value={active.guestCount}
                onChange={(e) => updateActiveOrder({ guestCount: Math.max(1, Number(e.target.value)) })}
                className={`mt-1 w-20 rounded-xl border px-3 py-2 text-xs font-bold ${
                  isCounter ? "border-slate-700 bg-slate-950 text-white" : "border-[#EBEBF0]"
                }`}
              />
            </div>
            <div className="min-w-[200px] flex-1">
              <label
                className={`flex items-center gap-1 text-[10px] font-black uppercase ${
                  isCounter ? "text-teal-500/90" : "text-[#a0a8b2]"
                }`}
              >
                <StickyNote size={12} /> Kitchen note (order)
              </label>
              <input
                value={active.notes ?? ""}
                onChange={(e) => updateActiveOrder({ notes: e.target.value || null })}
                placeholder="Allergies, pacing, Urdu/English…"
                className={`mt-1 w-full rounded-xl border px-3 py-2 text-xs font-medium ${
                  isCounter
                    ? "border-slate-700 bg-slate-950 text-white placeholder:text-slate-600"
                    : "border-[#EBEBF0]"
                }`}
              />
            </div>
          </div>

          {isCounter && active.items.length > 0 && (
            <div className="shrink-0 border-b border-slate-800 bg-slate-900/90 px-4 py-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-white">
                  <Megaphone className="text-teal-400" size={20} />
                  <span className="text-sm font-black">Guest ko yeh bolain</span>
                </div>
                <span className="rounded-full bg-teal-500/20 px-2.5 py-1 text-[10px] font-black uppercase text-teal-200">
                  Step 3–4
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-teal-800/60 bg-teal-950/40 p-4">
                  <p className="text-[10px] font-black uppercase text-teal-400/90">Urdu (Roman)</p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-teal-50">
                    {COUNTER_SCRIPTS.ur(totalStr, etaMin)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
                  <p className="text-[10px] font-black uppercase text-slate-500">English</p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-200">
                    {COUNTER_SCRIPTS.en(totalStr, etaMin)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCounterFlow((f) => ({ ...f, quoteOpen: true }))}
                  className={`rounded-2xl px-4 py-3 text-xs font-black ${
                    counterFlow.quoteOpen
                      ? "border border-teal-600 bg-teal-600 text-white"
                      : "border border-teal-500/50 bg-teal-500/10 text-teal-100 hover:bg-teal-500/20"
                  }`}
                >
                  1 · Quote screen khol di (guest ko dikhayein)
                </button>
                <button
                  type="button"
                  disabled={!counterFlow.quoteOpen}
                  onClick={() => setCounterFlow((f) => ({ ...f, guestAck: true }))}
                  className={`rounded-2xl px-4 py-3 text-xs font-black ${
                    counterFlow.guestAck
                      ? "border border-emerald-600 bg-emerald-700 text-white"
                      : "border border-slate-600 bg-slate-800 text-slate-200 disabled:opacity-40"
                  }`}
                >
                  2 · Guest ne total + time sun liya / samajh liya
                </button>
                <button
                  type="button"
                  disabled={!counterFlow.guestAck}
                  onClick={() => setCounterFlow((f) => ({ ...f, paymentOk: true }))}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-black ${
                    counterFlow.paymentOk
                      ? "border border-amber-500 bg-amber-500 text-slate-950"
                      : "border border-amber-700/50 bg-amber-950/40 text-amber-100 disabled:opacity-40"
                  }`}
                >
                  <Banknote size={16} /> 3 · Payment le li / card machine
                </button>
                {active.orderType === "dine_in" && (
                  <button
                    type="button"
                    disabled={!counterFlow.guestAck}
                    onClick={() => setCounterFlow((f) => ({ ...f, paymentOk: true }))}
                    className="rounded-2xl border border-slate-600 bg-slate-800 px-3 py-3 text-[11px] font-bold text-slate-300 disabled:opacity-40"
                  >
                    Tab / room charge (baad mein bill)
                  </button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-slate-800 pt-3 text-center sm:text-left">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500">Total (tax shamil)</p>
                  <p className="text-2xl font-black tabular-nums text-white">{totalStr}</p>
                </div>
                <div className="h-10 w-px bg-slate-700" />
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500">Kitchen wait (estimate)</p>
                  <p className="text-2xl font-black tabular-nums text-teal-300">~{etaMin} min</p>
                </div>
              </div>
            </div>
          )}

          <div className={`min-h-0 flex-1 space-y-3 overflow-y-auto p-4 ${isCounter ? "" : ""}`}>
            {active.items.length === 0 && (
              <div
                className={`flex h-full flex-col items-center justify-center py-16 text-center ${
                  isCounter ? "text-slate-500" : "text-[#a0a8b2]"
                }`}
              >
                {isCounter ? (
                  <>
                    <MessageCircle className="mb-3 text-teal-500/60" size={44} />
                    <p className="text-base font-black text-white">Pehle sun&apos;ain — cart khali hai</p>
                    <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-400">
                      Misal: guest &quot;pizza chaahiye&quot; kahe → aap bol dein &quot;ji haan, tikka pizza maujood
                      hai&quot; → left se <span className="text-teal-300">Mains</span> mein pizza tap karein.
                      Phir neeche quote guest ko dikha kar total aur minute batayein.
                    </p>
                  </>
                ) : (
                  <>
                    <ChefHat className="mb-3 opacity-40" size={40} />
                    <p className="text-sm font-bold">Cart is empty</p>
                    <p className="mt-1 max-w-xs text-xs">Tap items on the left or press / to search.</p>
                  </>
                )}
              </div>
            )}
            {active.items.map((line) => (
              <div
                key={line.id}
                className={`rounded-2xl border p-4 shadow-sm ${
                  line.isVoided
                    ? "border-rose-800/50 bg-rose-950/30 opacity-60"
                    : isCounter
                      ? "border-slate-700 bg-slate-900/90"
                      : "border-[#EBEBF0] bg-white"
                }`}
              >
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm font-black ${isCounter ? "text-white" : "text-[#1a1a2e]"}`}
                    >
                      {line.nameSnapshot}
                    </p>
                    {line.modifiers.length > 0 && (
                      <p
                        className={`mt-1 text-[11px] font-semibold ${isCounter ? "text-slate-400" : "text-[#a0a8b2]"}`}
                      >
                        {line.modifiers.map((m) => m.nameSnapshot).join(" · ")}
                      </p>
                    )}
                    {line.fromComboParentId && (
                      <p
                        className={`mt-1 text-[10px] font-black ${isCounter ? "text-indigo-300" : "text-indigo-600"}`}
                      >
                        Combo component
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`text-sm font-black ${isCounter ? "text-teal-200" : ""}`}>
                      Rs. {line.priceSnapshot.toLocaleString()}
                    </p>
                    <div className="mt-2 flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          isCounter ? "bg-slate-800 text-white" : "bg-[#F5F6FA]"
                        }`}
                        onClick={() =>
                          updateLine(line.id, { quantity: Math.max(1, line.quantity - 1) })
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span
                        className={`w-6 text-center text-xs font-black ${isCounter ? "text-white" : ""}`}
                      >
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          isCounter ? "bg-slate-800 text-white" : "bg-[#F5F6FA]"
                        }`}
                        onClick={() => updateLine(line.id, { quantity: line.quantity + 1 })}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={line.notes ?? ""}
                    onChange={(e) => updateLine(line.id, { notes: e.target.value || null })}
                    placeholder="Item note → KDS highlighted"
                    className={`flex-1 rounded-xl border px-3 py-2 text-[11px] font-medium ${
                      isCounter
                        ? "border-amber-800/50 bg-amber-950/40 text-amber-50 placeholder:text-amber-900/50"
                        : "border-amber-200 bg-amber-50/50 placeholder:text-amber-800/40"
                    }`}
                  />
                  {!line.fromComboParentId && (
                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      className={`rounded-xl border px-3 py-2 text-[11px] font-black ${
                        isCounter
                          ? "border-rose-900/50 text-rose-300 hover:bg-rose-950/50"
                          : "border-rose-100 text-rose-600 hover:bg-rose-50"
                      }`}
                    >
                      Remove
                    </button>
                  )}
                  {kitchenSent && !line.isVoided && !line.fromComboParentId && (
                    <button
                      type="button"
                      onClick={() => {
                        setVoidLineId(line.id);
                        setVoidMode("item");
                      }}
                      className="text-[11px] font-black text-rose-700 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50"
                    >
                      Void item
                    </button>
                  )}
                </div>
                {line.isVoided && (
                  <p className="text-[11px] font-bold text-rose-700 mt-2">
                    Voided — {line.voidReason ?? "—"}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div
            className={`shrink-0 space-y-3 border-t p-4 ${
              isCounter ? "border-slate-800 bg-slate-950/90" : "border-[#EBEBF0] bg-white"
            }`}
          >
            <div className={`flex justify-between text-sm ${isCounter ? "text-slate-400" : ""}`}>
              <span className={`font-bold ${isCounter ? "text-slate-500" : "text-[#a0a8b2]"}`}>Subtotal</span>
              <span className={`font-black tabular-nums ${isCounter ? "text-white" : ""}`}>
                Rs. {active.subtotal.toLocaleString()}
              </span>
            </div>
            <div className={`flex justify-between text-sm ${isCounter ? "text-slate-400" : ""}`}>
              <span className={`font-bold ${isCounter ? "text-slate-500" : "text-[#a0a8b2]"}`}>Tax (est.)</span>
              <span className={`font-black tabular-nums ${isCounter ? "text-white" : ""}`}>
                Rs. {active.taxAmount.toLocaleString()}
              </span>
            </div>
            <div
              className={`flex justify-between border-t pt-1 text-lg ${
                isCounter ? "border-slate-800 text-white" : "border-[#F0F1F5]"
              }`}
            >
              <span className="font-black">Total</span>
              <span className="font-black tabular-nums">Rs. {active.totalAmount.toLocaleString()}</span>
            </div>

            {isCounter && active.items.length > 0 && active.status === "draft" && (
              <p className="rounded-xl border border-teal-800/50 bg-teal-950/30 px-3 py-2 text-[11px] font-semibold text-teal-100/90">
                Kitchen button tab is locked until quote + guest confirm + payment (ya tab) — asli counter flow.
              </p>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={toggleHold}
                className={`rounded-2xl border py-3 text-xs font-black ${
                  active.isHeld
                    ? isCounter
                      ? "border-amber-700 bg-amber-950 text-amber-100"
                      : "border-amber-300 bg-amber-100 text-amber-950"
                    : isCounter
                      ? "border-slate-700 bg-slate-800 text-slate-200"
                      : "border-[#EBEBF0] bg-white text-[#1a1a2e]"
                }`}
              >
                {active.isHeld ? "Release hold" : "Hold order"}
              </button>
              <button
                type="button"
                onClick={() => setVoidMode("order")}
                className={`rounded-2xl border py-3 text-xs font-black ${
                  isCounter
                    ? "border-rose-900/60 bg-rose-950/50 text-rose-200"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                Void order
              </button>
              <button
                type="button"
                disabled={
                  active.isHeld ||
                  active.items.length === 0 ||
                  active.status !== "draft" ||
                  (isCounter &&
                    (!counterFlow.quoteOpen || !counterFlow.guestAck || !counterFlow.paymentOk))
                }
                onClick={fireToKitchen}
                className={`col-span-2 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black shadow-xl disabled:opacity-40 ${
                  isCounter ? "bg-teal-500 text-slate-950 shadow-teal-500/20" : "bg-[#1a1a2e] text-white"
                }`}
              >
                <ChefHat size={18} />
                {isCounter ? "Ab kitchen bhejein (KDS)" : "Send to kitchen (KDS)"}
              </button>
              <button
                type="button"
                disabled={active.status === "draft" || active.status === "completed" || active.status === "void"}
                onClick={() => advanceStatus()}
                className="col-span-2 py-3 rounded-2xl border border-[#EBEBF0] text-xs font-black text-[#1a1a2e] flex items-center justify-center gap-2"
              >
                <GripVertical size={16} />
                Advance status (demo)
              </button>
              <button
                type="button"
                disabled={networkOnline || syncBusy}
                onClick={async () => {
                  setSyncBusy(true);
                  await new Promise((r) => setTimeout(r, 800));
                  setSyncBusy(false);
                  setToast("Sync queue flushed to Supabase (mock).");
                  setTimeout(() => setToast(null), 3000);
                }}
                className="col-span-2 py-2.5 rounded-2xl text-[11px] font-black border border-indigo-200 bg-indigo-50 text-indigo-900 flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {syncBusy ? <Loader2 className="animate-spin" size={16} /> : null}
                POST /api/orders/sync (bulk) — tap when reconnected
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
