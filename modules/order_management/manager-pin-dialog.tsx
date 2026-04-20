"use client";

import * as React from "react";
import { ShieldCheck, X } from "lucide-react";
import type { VoidReason } from "./types";

const VOID_REASONS: { id: VoidReason; label: string }[] = [
  { id: "customer_changed_mind", label: "Customer changed mind" },
  { id: "incorrect_order", label: "Incorrect order" },
  { id: "out_of_stock", label: "Out of stock" },
];

type Mode = "void_order" | "void_item";

type Props = {
  open: boolean;
  mode: Mode;
  onClose: () => void;
  /** Called only after PIN passes validation */
  onSubmit: (reason: string | VoidReason) => void;
};

export function ManagerPinDialog({ open, mode, onClose, onSubmit }: Props) {
  const [pin, setPin] = React.useState("");
  const [reason, setReason] = React.useState<VoidReason>("customer_changed_mind");
  const [freeReason, setFreeReason] = React.useState("");
  const [pinError, setPinError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setPin("");
      setFreeReason("");
      setPinError(null);
    }
  }, [open]);

  if (!open) return null;

  const title = mode === "void_order" ? "Void entire order" : "Void line item (KDS)";
  const subtitle =
    mode === "void_order"
      ? "Manager PIN required. KDS will show void notification."
      : "Manager PIN required for items already sent. Pick a reason for the ticket.";

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl border border-[#EBEBF0] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between px-6 pt-6 pb-2">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1a1a2e]">{title}</h2>
              <p className="text-xs font-medium text-[#a0a8b2] mt-1">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[#F5F6FA] flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="text-[11px] font-black uppercase tracking-wider text-[#a0a8b2]">
              Manager PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setPinError(null);
              }}
              placeholder="••••"
              className="mt-1.5 w-full px-4 py-3 rounded-2xl border border-[#EBEBF0] text-sm font-bold outline-none focus:ring-2 focus:ring-[#1a1a2e]/15"
            />
            {pinError && <p className="text-xs font-bold text-rose-600 mt-2">{pinError}</p>}
          </div>

          {mode === "void_item" && (
            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-[#a0a8b2]">
                Void reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as VoidReason)}
                className="mt-1.5 w-full px-4 py-3 rounded-2xl border border-[#EBEBF0] text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-[#1a1a2e]/15"
              >
                {VOID_REASONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === "void_order" && (
            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-[#a0a8b2]">
                Reason (audit)
              </label>
              <textarea
                value={freeReason}
                onChange={(e) => setFreeReason(e.target.value)}
                rows={3}
                placeholder="Short note for audit log…"
                className="mt-1.5 w-full px-4 py-3 rounded-2xl border border-[#EBEBF0] text-sm font-medium outline-none focus:ring-2 focus:ring-[#1a1a2e]/15 resize-none"
              />
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl border border-[#EBEBF0] text-sm font-black text-[#1a1a2e] bg-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (pin.length < 4) {
                setPinError("Enter at least 4 digits.");
                return;
              }
              if (pin !== "4242") {
                setPinError("Invalid PIN. Demo PIN: 4242");
                return;
              }
              setPinError(null);
              if (mode === "void_order") onSubmit(freeReason || "manager_void");
              else onSubmit(reason);
              onClose();
            }}
            className="flex-1 py-3.5 rounded-2xl bg-rose-600 text-white text-sm font-black shadow-lg"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
