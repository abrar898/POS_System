import type { PosOrder } from "./types";
import { findMenuItem } from "./mock-data";

const DEFAULT_PREP = 12;

/** Rough ETA: longest item drives base time; extra items add a few minutes (parallel kitchen). */
export function estimateReadyMinutes(order: PosOrder): number {
  const lines = order.items.filter((l) => !l.isVoided);
  if (lines.length === 0) return 8;

  let maxPrep = 10;
  for (const line of lines) {
    if (line.fromComboParentId) continue;
    const mi = findMenuItem(line.menuItemId);
    const base = mi?.prepMinutes ?? DEFAULT_PREP;
    maxPrep = Math.max(maxPrep, base);
  }

  const parents = lines.filter((l) => !l.fromComboParentId).length;
  const bundle = Math.min(16, Math.max(0, parents - 1) * 4);

  return Math.min(55, Math.round(maxPrep + bundle));
}

export const COUNTER_SCRIPTS = {
  ur: (total: string, minutes: number) =>
    `Aap ka bill tax ke sath ${total} hai. Kitchen se takreeban ${minutes} minute lag sakte hain — zyada rush par thora aur.`,
  en: (total: string, minutes: number) =>
    `Your total with tax is ${total}. The kitchen needs about ${minutes} minutes — a few more if we are very busy.`,
  hasItem: "Haan, yeh menu par available hai — main screen par add kar raha hoon.",
  hasItemEn: "Yes, we have that on the menu — adding it to your order now.",
};
