import { create } from 'zustand';
import { api } from '@/lib/api';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  status?: OrderStatus;
  note?: string;
}

export interface KDSOrder {
  id: string;
  table: string;
  type: 'dine-in' | 'takeaway' | 'delivery';
  timePlaced: string;
  elapsedTime: string; // Added this
  status: OrderStatus;
  items: OrderItem[];
  notes?: string;
}

interface KDSStore {
  activeFilter: 'all' | OrderStatus;
  setActiveFilter: (filter: 'all' | OrderStatus) => void;
  
  orders: KDSOrder[];
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  
  selectedOrder: KDSOrder | null;
  setSelectedOrder: (order: KDSOrder | null) => void;
}

export const useKDSStore = create<KDSStore>((set, get) => ({
  activeFilter: 'all',
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  
  orders: [],
  
  fetchOrders: async () => {
    try {
      const [ordersData, productsData] = await Promise.all([
        api.orders.getAll(),
        api.products.getAll()
      ]);
      
      const productMap = new Map();
      if (Array.isArray(productsData)) {
        productsData.forEach((p: any) => {
          productMap.set(p.id || p._id, p.name);
        });
      }

      const kdsOrders: KDSOrder[] = ordersData.map((o: any) => {
        const timePlaced = new Date(o.created_at);
        const diffMs = Math.abs(new Date().getTime() - timePlaced.getTime());
        const diffMins = Math.floor(diffMs / 60000);
        const elapsedTime = `${diffMins}m`;

        const MOCK_NAMES: Record<string, string> = {
          p1: 'Crown Crust Pizza', p2: 'Zinger Burger', p3: 'Loaded Fries', p4: 'Cheesy Fries',
          p5: 'Cheezious Signature', p6: 'Mint Margarita', p7: 'Chicken Wings', p8: 'Pasta Alfredo',
          d1: 'Crown Crust Pizza', d2: 'Beef Pepperoni', d3: 'Behari Kabab', d4: 'Chicken Tandoori',
          d5: 'Calzone Chunks', d6: 'Bazinga Burger', d7: 'Special Roasted', d8: 'Soft Drink',
          a1: 'Burger Combo', a2: 'Pizza Combo', a3: 'Snack Combo'
        };

        return {
          id: o.id || o._id,
          table: o.table_number || (o.type === 'delivery' ? 'Delivery' : 'Takeaway'),
          type: o.type,
          timePlaced: timePlaced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          elapsedTime,
          status: o.status as OrderStatus,
          items: o.items.map((item: any) => ({
            id: item.product_id,
            name: item.product_name || productMap.get(item.product_id) || MOCK_NAMES[item.product_id] || 'Item',
            quantity: item.quantity,
            price: item.price
          })),
          notes: o.notes
        };
      });
      set({ orders: kdsOrders });
    } catch (err) {
      console.error("KDS failed to fetch orders:", err);
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      await api.orders.update(orderId, { status });
      // Update local state
      set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o),
        selectedOrder: null
      }));
    } catch (err) {
      console.error("KDS failed to update order status:", err);
    }
  },
  
  selectedOrder: null,
  setSelectedOrder: (order) => set({ selectedOrder: order }),
}));
