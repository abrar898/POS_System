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
}

export const useCashierStore = create<CashierStore>((set) => ({
  activeScreen: 'pos',
  setActiveScreen: (screen) => set({ activeScreen: screen }),
  
  activeCategory: 'Pizzas',
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
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    })
  })),
  removeFromCart: (cartId) => set((state) => ({
    cart: state.cart.filter(item => item.cartId !== cartId)
  })),
  clearCart: () => set({ cart: [] }),
  
  discount: 0,
  setDiscount: (val) => set({ discount: val }),
}));
