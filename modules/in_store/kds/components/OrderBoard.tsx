'use client';

import { useKDSStore } from '../store/useKDSStore';
import OrderCard from './OrderCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderBoard() {
  const { orders, activeFilter } = useKDSStore();

  const filteredOrders = orders.filter(o => 
    o.status !== 'delivered' && 
    (activeFilter === 'all' || o.status === activeFilter)
  );

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#FDEFDE] h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 items-start">
        <AnimatePresence>
          {filteredOrders.map(order => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="h-[480px]"
            >
              <OrderCard order={order} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredOrders.length === 0 && (
          <div className="col-span-full h-40 flex items-center justify-center text-[#737373] font-medium text-lg">
            No orders in this queue.
          </div>
        )}
      </div>
    </div>
  );
}
