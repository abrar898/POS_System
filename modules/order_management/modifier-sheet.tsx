"use client";

import * as React from "react";
import { X } from "lucide-react";
import type { CartModifier, MenuItem, ModifierGroup } from "./types";

type Props = {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (modifiers: CartModifier[]) => void;
};

function groupSatisfied(groups: ModifierGroup[], selected: Record<string, string>): boolean {
  for (const g of groups) {
    if (g.required && !selected[g.id]) return false;
  }
  return true;
}

export function ModifierBottomSheet({ item, open, onClose, onConfirm }: Props) {
  const [selected, setSelected] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (item) setSelected({});
  }, [item?.id]);

  if (!open || !item) return null;

  const groups = item.modifierGroups;
  const canAdd = groupSatisfied(groups, selected);

  const buildModifiers = (): CartModifier[] => {
    const out: CartModifier[] = [];
    for (const g of groups) {
      const optId = selected[g.id];
      if (!optId) continue;
      const opt = g.options.find((o) => o.id === optId);
      if (!opt) continue;
      out.push({
        modifierOptionId: opt.id,
        nameSnapshot: `${g.name}: ${opt.name}`,
        priceAdjustment: opt.priceAdjustment,
      });
    }
    return out;
  };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Close modifiers"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-t-[32px] shadow-2xl border border-[#EBEBF0] max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#F0F1F5]">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#a0a8b2]">
              Customize
            </p>
            <h2 className="text-xl font-black text-[#1a1a2e]">{item.name}</h2>
            <p className="text-sm font-bold text-[#a0a8b2] mt-0.5">
              Base Rs. {item.price.toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 rounded-2xl bg-[#F5F6FA] flex items-center justify-center text-[#1a1a2e] hover:bg-[#EBEBF0]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">
          {groups.length === 0 && (
            <p className="text-sm text-[#a0a8b2] font-medium">No modifiers for this item.</p>
          )}
          {groups.map((g) => (
            <div key={g.id}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-black text-[#1a1a2e]">{g.name}</span>
                {g.required ? (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                    Required
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#F5F6FA] text-[#a0a8b2]">
                    Optional
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {g.options.map((opt) => {
                  const active = selected[g.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setSelected((prev) => ({
                          ...prev,
                          [g.id]: active && !g.required ? "" : opt.id,
                        }))
                      }
                      className={`px-4 py-2.5 rounded-2xl text-xs font-black border transition-all ${
                        active
                          ? "bg-[#1a1a2e] text-white border-[#1a1a2e] shadow-lg"
                          : "bg-white text-[#1a1a2e] border-[#EBEBF0] hover:border-[#1a1a2e]/30"
                      }`}
                    >
                      {opt.name}
                      {opt.priceAdjustment !== 0 && (
                        <span className="ml-1 opacity-80">
                          +Rs. {opt.priceAdjustment.toLocaleString()}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-5 border-t border-[#F0F1F5] flex flex-col gap-2 bg-[#FAFAFC] rounded-b-[32px]">
          <p className="text-[11px] text-[#a0a8b2] font-semibold text-center">
            Required groups must be chosen. Optional groups can be left blank — tap{" "}
            <span className="text-[#1a1a2e] font-black">Add to order</span> when ready.
          </p>
          <button
            type="button"
            disabled={!canAdd}
            onClick={() => onConfirm(buildModifiers())}
            className="w-full py-3.5 rounded-2xl bg-[#1a1a2e] text-white text-sm font-black shadow-xl shadow-[#1a1a2e]/20 disabled:opacity-40 disabled:pointer-events-none"
          >
            Add to order
          </button>
        </div>
      </div>
    </div>
  );
}
