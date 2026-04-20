import type { MenuItem, PosOrder } from "./types";

export const BRANCH = {
  id: "br-main-gulberg",
  name: "Gulberg II — Main Hall",
  city: "Lahore",
};

export const CATEGORIES = [
  { id: "cat-starters", name: "Starters" },
  { id: "cat-mains", name: "Mains" },
  { id: "cat-breads", name: "Breads" },
  { id: "cat-drinks", name: "Drinks" },
  { id: "cat-combos", name: "Combos" },
];

const sizeGroup = {
  id: "mg-size",
  name: "Size",
  required: true,
  options: [
    { id: "mo-s", name: "Small", priceAdjustment: 0 },
    { id: "mo-m", name: "Medium", priceAdjustment: 120 },
    { id: "mo-l", name: "Large", priceAdjustment: 240 },
  ],
};

const spiceGroup = {
  id: "mg-spice",
  name: "Spice",
  required: false,
  options: [
    { id: "mo-mild", name: "Mild", priceAdjustment: 0 },
    { id: "mo-hot", name: "Hot", priceAdjustment: 0 },
    { id: "mo-extra", name: "Extra Hot", priceAdjustment: 0 },
  ],
};

const crustGroup = {
  id: "mg-crust",
  name: "Crust",
  required: false,
  options: [
    { id: "mo-thin", name: "Thin", priceAdjustment: 0 },
    { id: "mo-stuff", name: "Stuffed edge", priceAdjustment: 180 },
  ],
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "mi-chicken-karahi",
    name: "Chicken Karahi",
    categoryId: "cat-mains",
    price: 1890,
    available: true,
    prepMinutes: 18,
    imageEmoji: "🍲",
    modifierGroups: [sizeGroup, spiceGroup],
  },
  {
    id: "mi-mutton-handi",
    name: "Mutton Handi",
    categoryId: "cat-mains",
    price: 2490,
    available: true,
    prepMinutes: 22,
    imageEmoji: "🥘",
    modifierGroups: [spiceGroup],
  },
  {
    id: "mi-tikka-pizza",
    name: 'Chicken Tikka Pizza 12"',
    categoryId: "cat-mains",
    price: 1290,
    available: true,
    prepMinutes: 14,
    imageEmoji: "🍕",
    modifierGroups: [crustGroup],
  },
  {
    id: "mi-seekh",
    name: "Seekh Kabab (6 pcs)",
    categoryId: "cat-starters",
    price: 890,
    available: true,
    prepMinutes: 12,
    imageEmoji: "🍢",
    modifierGroups: [],
  },
  {
    id: "mi-naan",
    name: "Plain Naan",
    categoryId: "cat-breads",
    price: 80,
    available: true,
    prepMinutes: 6,
    imageEmoji: "🫓",
    modifierGroups: [],
  },
  {
    id: "mi-garlic-naan",
    name: "Garlic Naan",
    categoryId: "cat-breads",
    price: 140,
    available: true,
    prepMinutes: 7,
    imageEmoji: "🧄",
    modifierGroups: [],
  },
  {
    id: "mi-lassi",
    name: "Sweet Lassi",
    categoryId: "cat-drinks",
    price: 220,
    available: true,
    prepMinutes: 4,
    imageEmoji: "🥛",
    modifierGroups: [
      {
        id: "mg-lassi-size",
        name: "Glass",
        required: true,
        options: [
          { id: "mo-reg", name: "Regular", priceAdjustment: 0 },
          { id: "mo-jumbo", name: "Jumbo", priceAdjustment: 80 },
        ],
      },
    ],
  },
  {
    id: "mi-combo-family",
    name: "Family Feast Combo",
    categoryId: "cat-combos",
    price: 4490,
    available: true,
    prepMinutes: 24,
    imageEmoji: "🍽️",
    modifierGroups: [],
    comboBundlePrice: 4490,
    comboChildren: [
      { menuItemId: "mi-chicken-karahi", name: "Chicken Karahi", qty: 1 },
      { menuItemId: "mi-naan", name: "Plain Naan", qty: 4 },
      { menuItemId: "mi-lassi", name: "Sweet Lassi", qty: 2 },
    ],
  },
];

export const MOCK_HISTORY_ORDERS: PosOrder[] = [
  {
    id: "ord-h1",
    localId: "local-h1",
    branchId: BRANCH.id,
    tableId: "tbl-4",
    tableLabel: "4",
    orderType: "dine_in",
    status: "in_prep",
    staffId: "st-1",
    guestCount: 4,
    customerName: null,
    customerPhone: null,
    notes: "Extra raita on the side",
    subtotal: 4200,
    discountAmount: 0,
    taxAmount: 630,
    totalAmount: 4830,
    isHeld: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    items: [
      {
        id: "li-1",
        menuItemId: "mi-chicken-karahi",
        nameSnapshot: "Chicken Karahi (Large)",
        priceSnapshot: 2130,
        quantity: 1,
        notes: null,
        isVoided: false,
        voidReason: null,
        modifiers: [
          { modifierOptionId: "mo-l", nameSnapshot: "Large", priceAdjustment: 240 },
        ],
      },
    ],
  },
  {
    id: "ord-h2",
    localId: "local-h2",
    branchId: BRANCH.id,
    tableId: null,
    tableLabel: null,
    orderType: "takeaway",
    status: "ready",
    staffId: "st-1",
    guestCount: 1,
    customerName: "Hassan",
    customerPhone: "0300-778899",
    notes: null,
    subtotal: 2490,
    discountAmount: 0,
    taxAmount: 374,
    totalAmount: 2864,
    isHeld: false,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    items: [
      {
        id: "li-2",
        menuItemId: "mi-mutton-handi",
        nameSnapshot: "Mutton Handi",
        priceSnapshot: 2490,
        quantity: 1,
        notes: null,
        isVoided: false,
        voidReason: null,
        modifiers: [],
      },
    ],
  },
];

export function findMenuItem(id: string): MenuItem | undefined {
  return MENU_ITEMS.find((m) => m.id === id);
}
