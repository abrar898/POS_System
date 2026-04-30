import { create } from 'zustand';

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  size?: string;
  note?: string;
  status?: OrderStatus;
}

export interface KDSOrder {
  id: string;
  table: string;
  type: 'Dine-in' | 'Takeaway' | 'Delivery';
  timePlaced: string;
  elapsedTime: string;
  status: OrderStatus;
  items: OrderItem[];
  notes?: string;
}

interface KDSStore {
  activeFilter: 'all' | OrderStatus;
  setActiveFilter: (filter: 'all' | OrderStatus) => void;
  
  orders: KDSOrder[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  selectedOrder: KDSOrder | null;
  setSelectedOrder: (order: KDSOrder | null) => void;
}

const INITIAL_ORDERS: KDSOrder[] = [
  {
    id: '#CHZ-1025',
    table: 'Table 12',
    type: 'Dine-in',
    timePlaced: '12:45 PM',
    elapsedTime: '00:45',
    status: 'new',
    items: [
      { id: '1', name: 'Crown Crust Pizza', quantity: 1, size: 'Large' },
      { id: '2', name: 'Zinger Burger', quantity: 1 },
      { id: '3', name: 'Loaded Fries', quantity: 1 },
      { id: '4', name: 'Coke 500ml', quantity: 1 }
    ],
    notes: 'No onion in burger'
  },
  {
    id: '#CHZ-1024',
    table: 'Takeaway',
    type: 'Takeaway',
    timePlaced: '12:35 PM',
    elapsedTime: '01:20',
    status: 'preparing',
    items: [
      { id: '5', name: 'Malai Boti Pizza', quantity: 1, size: 'Regular' },
      { id: '6', name: 'Chicken Wings (6pc)', quantity: 1 }
    ]
  },
  {
    id: '#CHZ-1023',
    table: 'Table 07',
    type: 'Dine-in',
    timePlaced: '12:15 PM',
    elapsedTime: '01:50',
    status: 'preparing',
    items: [
      { id: '7', name: 'Club Sandwich', quantity: 1 },
      { id: '8', name: 'Mint Margarita', quantity: 1 }
    ]
  },
  {
    id: '#CHZ-1022',
    table: 'Delivery',
    type: 'Delivery',
    timePlaced: '11:55 AM',
    elapsedTime: '02:05',
    status: 'ready',
    items: [
      { id: '9', name: 'Cheesy Fries', quantity: 1 },
      { id: '10', name: 'Zinger Burger', quantity: 1 },
      { id: '11', name: 'Coke 500ml', quantity: 1 }
    ]
  },
  {
    id: '#CHZ-1021',
    table: 'Table 03',
    type: 'Dine-in',
    timePlaced: '11:30 AM',
    elapsedTime: '02:45',
    status: 'completed',
    items: [
      { id: '12', name: 'Pasta Alfredo', quantity: 1 }
    ]
  }
];

export const useKDSStore = create<KDSStore>((set) => ({
  activeFilter: 'all',
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  
  orders: INITIAL_ORDERS,
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o),
    selectedOrder: null
  })),
  
  selectedOrder: null,
  setSelectedOrder: (order) => set({ selectedOrder: order }),
}));
