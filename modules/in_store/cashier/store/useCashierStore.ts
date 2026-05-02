import { create } from 'zustand';

export type ScreenType = 'pos' | 'payment' | 'confirmation' | 'history' | 'hold' | 'discounts';

export interface CartItem {
  id: string;
  cartId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface CashierStore {
  activeScreen: ScreenType;
  setActiveScreen: (screen: ScreenType) => void;
  
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  
  discount: number;
  setDiscount: (val: number) => void;
  
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  
  lastOrderNumber: string;
  setLastOrderNumber: (num: string) => void;

  placeOrder: () => Promise<void>;

  holdOrders: { id: string; items: CartItem[]; total: number; time: string }[];
  holdCurrentOrder: () => void;
  resumeHoldOrder: (id: string) => void;
  removeHoldOrder: (id: string) => void;
}

export const useCashierStore = create<CashierStore>((set) => ({
  activeScreen: 'pos',
  setActiveScreen: (screen) => set({ activeScreen: screen }),
  
  activeCategory: 'All',
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  cart: [],
  addToCart: (product) => set((state) => {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    return {
      cart: [...state.cart, { ...product, cartId: Math.random().toString(), quantity: 1, size: 'Regular' }]
    };
  }),
  updateQuantity: (cartId, delta) => set((state) => ({
    cart: state.cart.map(item => {
      if (item.cartId === cartId) {
        return { ...item, quantity: item.quantity + delta };
      }
      return item;
    }).filter(item => item.quantity > 0)
  })),
  removeFromCart: (cartId) => set((state) => ({
    cart: state.cart.filter(item => item.cartId !== cartId)
  })),
  clearCart: () => set({ cart: [] }),
  
  discount: 0,
  setDiscount: (val) => set({ discount: val }),
  
  paymentMethod: 'Cash',
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  
  lastOrderNumber: '',
  setLastOrderNumber: (num) => set({ lastOrderNumber: num }),

  placeOrder: async () => {
    const state = useCashierStore.getState();
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.12);
    const total = subtotal - state.discount + tax;

    const orderData = {
      items: state.cart.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total_price: total,
      payment_method: state.paymentMethod,
      type: 'takeaway', // Default for cashier flow
      customer_name: 'Cashier Order',
      status: 'pending'
    };

    console.log("Placing cashier order with data:", orderData);
    try {
      const { api } = await import('@/lib/api');
      const result = await api.orders.create(orderData);
      console.log("Order placed successfully:", result);
    } catch (err) {
      console.error("Failed to place cashier order. Order Data:", orderData);
      console.error("Error details:", err);
      throw err;
    }
  },

  holdOrders: [],
  holdCurrentOrder: () => set((state) => {
    if (state.cart.length === 0) return state;
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.12);
    const total = subtotal - state.discount + tax;
    
    const newHoldOrder = {
      id: `#HLD-${Math.floor(Math.random() * 9000) + 1000}`,
      items: [...state.cart],
      total,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    return {
      holdOrders: [newHoldOrder, ...state.holdOrders],
      cart: [],
      discount: 0
    };
  }),
  resumeHoldOrder: (id) => set((state) => {
    const order = state.holdOrders.find(o => o.id === id);
    if (!order) return state;
    return {
      cart: order.items,
      holdOrders: state.holdOrders.filter(o => o.id !== id),
      activeScreen: 'pos'
    };
  }),
  removeHoldOrder: (id) => set((state) => ({
    holdOrders: state.holdOrders.filter(o => o.id !== id)
  })),
}));
