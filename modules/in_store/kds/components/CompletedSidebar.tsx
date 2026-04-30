'use client';

import { useKDSStore } from '../store/useKDSStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompletedSidebar() {
  const { orders } = useKDSStore();
  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <div className="w-[320px] bg-[#FEFDFA] border-l border-[#737373]/20 flex flex-col shrink-0 z-10 shadow-[-4px_0_15px_rgba(0,0,0,0.02)]">
      <div className="p-6 border-b border-[#737373]/10 bg-white z-10 shrink-0">
        <h2 className="font-extrabold text-[18px] text-[#000000] flex items-center justify-between">
          Completed Orders
          <span className="bg-[#7ED957] text-white text-xs px-2.5 py-0.5 rounded-full">{completedOrders.length}</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-white/50">
        <AnimatePresence>
          {completedOrders.map(order => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-white border border-[#737373]/10 rounded-xl hover:shadow-sm transition-shadow flex justify-between items-start"
            >
              <div>
                <h4 className="font-extrabold text-[#000000] text-[15px] mb-1">{order.id}</h4>
                <p className="text-[12px] text-[#737373]">{order.type} {order.table !== order.type ? `• ${order.table}` : ''}</p>
              </div>
              <span className="text-[12px] text-[#737373] font-medium">{order.timePlaced}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {completedOrders.length === 0 && (
          <div className="h-full flex items-center justify-center text-[#737373] text-sm font-medium">
            No completed orders yet.
          </div>
        )}
      </div>
    </div>
  );
}
