import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, Loader2 } from 'lucide-react';
import { useCashierStore } from '../store/useCashierStore';
import { api } from '@/lib/api';

export default function OrderHistory() {
  const { setActiveScreen } = useCashierStore();
  const [filter, setFilter] = useState('All');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.orders.getAll();
        // Sort by created_at descending
        const sorted = data.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setOrders(sorted);
      } catch (err) {
        console.error("Failed to fetch order history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDateTime = (dateStr: string) => {
    try {
      // Force UTC interpretation by adding Z if not present
      const utcStr = dateStr.includes('Z') || dateStr.includes('+') ? dateStr : `${dateStr}Z`;
      const date = new Date(utcStr);
      
      return {
        date: date.toLocaleDateString('en-PK', { 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric' 
        }),
        time: date.toLocaleTimeString('en-PK', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      };
    } catch (e) {
      return { date: 'Invalid Date', time: '' };
    }
  };

  if (loading) return <div className="absolute inset-0 flex items-center justify-center bg-[#FDEFDE]"><Loader2 className="animate-spin text-[#811920]" size={40} /></div>;

  const filteredOrders = orders.filter(o => 
    filter === 'All' || 
    (o.type && o.type.toLowerCase().includes(filter.toLowerCase())) ||
    (o.table_number && o.table_number.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <motion.div
      key="history"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute inset-0 p-8 flex flex-col items-center overflow-y-auto bg-[#FDEFDE]"
    >
      <div className="bg-[#FEFDFA] rounded-3xl w-full max-w-2xl p-8 shadow-sm border border-[#737373]/20">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setActiveScreen('pos')}
            className="p-2 bg-[#FDEFDE] rounded-full text-[#811920] hover:bg-[#811920] hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-extrabold text-[#000000]">Order History</h2>
        </div>

        <div className="flex gap-2 mb-6 bg-[#FDEFDE]/50 p-2 rounded-2xl">
          {['All', 'Dine-in', 'Takeaway', 'Delivery'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === f ? 'bg-[#FECE04] text-black shadow-sm' : 'text-[#737373] hover:text-black'}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 text-[#737373] font-bold text-sm mb-6">
          <Calendar size={16} />
          <span>Recent Orders</span>
        </div>

        <div className="space-y-4">
          {filteredOrders.map(order => {
            const dt = formatDateTime(order.created_at);
            const displayId = (order.id || order._id || '000000').toString().slice(-6).toUpperCase();
            return (
              <div key={order.id || order._id} className="flex items-center justify-between p-5 bg-white border border-[#737373]/10 rounded-2xl hover:border-[#FECE04]/50 transition-colors">
                <div>
                  <h4 className="font-extrabold text-lg mb-1">#{displayId}</h4>
                  <p className="text-sm text-[#737373]">{order.type || 'Standard'} • {order.table_number || 'N/A'}</p>
                  <p className="text-[10px] text-[#737373] mt-1 uppercase font-bold tracking-wider">{dt.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-lg mb-1">Rs. {order.total_price?.toLocaleString()}</p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className={`text-xs font-bold ${order.status === 'completed' ? 'text-[#7ED957]' : 'text-[#811920]'}`}>{order.status}</span>
                    <span className="text-xs text-[#737373] font-black">{dt.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredOrders.length === 0 && <p className="text-center py-10 text-[#737373] font-bold">No orders found.</p>}
        </div>

        <button className="w-full mt-6 py-4 text-[#737373] font-bold hover:bg-[#FDEFDE] rounded-xl transition-colors">
          Load More
        </button>
      </div>
    </motion.div>
  );
}
