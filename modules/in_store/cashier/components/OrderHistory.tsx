'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Calendar } from 'lucide-react';
import { useCashierStore } from '../store/useCashierStore';
import { useState } from 'react';

const ORDERS = [
  { id: '#CHZ-1025', table: 'Dine-in • Table 12', time: '12:45 PM', total: 2710, status: 'Paid', statusColor: 'text-[#7ED957]' },
  { id: '#CHZ-1024', table: 'Takeaway', time: '12:35 PM', total: 1299, status: 'Paid', statusColor: 'text-[#7ED957]' },
  { id: '#CHZ-1023', table: 'Dine-in • Table 07', time: '12:15 PM', total: 2748, status: 'Paid', statusColor: 'text-[#7ED957]' },
  { id: '#CHZ-1022', table: 'Delivery', time: '11:55 AM', total: 3198, status: 'Paid', statusColor: 'text-[#7ED957]' },
  { id: '#CHZ-1021', table: 'Dine-in • Table 03', time: '11:30 AM', total: 1749, status: 'Cancelled', statusColor: 'text-[#811920]' },
];

export default function OrderHistory() {
  const { setActiveScreen } = useCashierStore();
  const [filter, setFilter] = useState('All');

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
          <span>Today, 24 May</span>
        </div>

        <div className="space-y-4">
          {ORDERS.filter(o => filter === 'All' || o.table.includes(filter)).map(order => (
            <div key={order.id} className="flex items-center justify-between p-5 bg-white border border-[#737373]/10 rounded-2xl hover:border-[#FECE04]/50 transition-colors">
              <div>
                <h4 className="font-extrabold text-lg mb-1">{order.id}</h4>
                <p className="text-sm text-[#737373]">{order.table}</p>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-lg mb-1">Rs. {order.total.toLocaleString()}</p>
                <div className="flex items-center gap-2 justify-end">
                  <span className={`text-xs font-bold ${order.statusColor}`}>{order.status}</span>
                  <span className="text-xs text-[#737373]">{order.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 py-4 text-[#737373] font-bold hover:bg-[#FDEFDE] rounded-xl transition-colors">
          Load More
        </button>
      </div>
    </motion.div>
  );
}
