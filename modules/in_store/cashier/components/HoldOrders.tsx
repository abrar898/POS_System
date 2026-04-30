'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useCashierStore } from '../store/useCashierStore';

const HOLD_ORDERS = [
  { id: '#CHZ-2012', table: 'Dine-in • Table 05', time: '10 min ago', total: 1890 },
  { id: '#CHZ-2013', table: 'Takeaway', time: '18 min ago', total: 1299 },
  { id: '#CHZ-2014', table: 'Dine-in • Table 09', time: '20 min ago', total: 2449 },
];

export default function HoldOrders() {
  const { setActiveScreen } = useCashierStore();

  return (
    <motion.div
      key="hold"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute inset-0 p-8 flex flex-col items-center overflow-y-auto bg-[#FDEFDE]"
    >
      <div className="bg-[#FEFDFA] rounded-3xl w-full max-w-xl p-8 shadow-sm border border-[#737373]/20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveScreen('pos')}
              className="p-2 bg-[#FDEFDE] rounded-full text-[#811920] hover:bg-[#811920] hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-2xl font-extrabold text-[#000000]">Hold Orders</h2>
          </div>
          <button className="text-[#811920] font-bold text-sm hover:underline">
            Clear All
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {HOLD_ORDERS.map(order => (
            <div key={order.id} className="flex items-center justify-between p-5 bg-white border border-[#737373]/10 rounded-2xl hover:border-[#FECE04]/50 transition-colors">
              <div>
                <h4 className="font-extrabold text-lg mb-1">{order.id}</h4>
                <p className="text-sm text-[#737373] mb-1">{order.table}</p>
                <p className="text-xs text-[#737373]">{order.time}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-3">
                <p className="font-extrabold text-lg">Rs. {order.total.toLocaleString()}</p>
                <button 
                  onClick={() => setActiveScreen('pos')}
                  className="px-6 py-2 border-2 border-[#FECE04] text-black font-bold rounded-lg hover:bg-[#FECE04] transition-colors text-sm"
                >
                  Resume
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
