'use client';

import { useKDSStore } from '../store/useKDSStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Bell } from 'lucide-react';

export default function OrderDetailModal() {
  const { selectedOrder, setSelectedOrder, updateOrderStatus } = useKDSStore();

  if (!selectedOrder) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#FEFDFA] rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh]"
        >
          <div className={`p-6 border-b border-[#737373]/10 flex justify-between items-start ${
            selectedOrder.status === 'new' ? 'bg-[#FECE04]/10' : 
            selectedOrder.status === 'preparing' ? 'bg-[#F28C28]/10' : 
            selectedOrder.status === 'ready' ? 'bg-[#7ED957]/10' : 'bg-white'
          }`}>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-extrabold text-[#811920]">{selectedOrder.id}</h2>
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  selectedOrder.status === 'new' ? 'bg-[#FECE04] text-black' : 
                  selectedOrder.status === 'preparing' ? 'bg-[#F28C28] text-white' : 
                  'bg-[#7ED957] text-white'
                }`}>
                  {selectedOrder.status.toUpperCase()}
                </span>
              </div>
              <p className="text-[#737373] font-medium">{selectedOrder.type} {selectedOrder.table !== selectedOrder.type ? `• ${selectedOrder.table}` : ''}</p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#737373] hover:text-black shadow-sm"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-1 text-[#811920] font-bold bg-white px-3 py-1.5 rounded-lg text-sm shadow-sm">
                <Clock size={16} />
                <span>{selectedOrder.elapsedTime}</span>
              </div>
            </div>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {selectedOrder.items.map(item => (
              <div key={item.id} className="flex justify-between items-start border-b border-[#737373]/10 pb-4 last:border-0">
                <div className="flex gap-4">
                  <span className="font-extrabold text-xl text-[#000000] w-6">{item.quantity}x</span>
                  <div>
                    <p className="font-bold text-lg text-[#000000]">{item.name}</p>
                    {item.size && <p className="text-sm text-[#737373] font-medium">{item.size}</p>}
                    {item.note && <p className="text-sm text-[#811920] font-bold mt-1 bg-[#FDEFDE] inline-block px-2 py-0.5 rounded">* {item.note}</p>}
                  </div>
                </div>
              </div>
            ))}
            
            {selectedOrder.notes && (
              <div className="mt-6 p-4 bg-[#FDEFDE]/50 rounded-xl border border-[#811920]/20">
                <p className="text-sm text-[#811920] font-bold">Order Note: {selectedOrder.notes}</p>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-[#737373]/10">
            {selectedOrder.status === 'new' && (
              <button 
                onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}
                className="w-full py-4 bg-[#FECE04] text-black font-extrabold text-lg rounded-xl hover:bg-[#E5B800] transition-colors shadow-sm"
              >
                Start Preparing
              </button>
            )}
            {selectedOrder.status === 'preparing' && (
              <button 
                onClick={() => updateOrderStatus(selectedOrder.id, 'ready')}
                className="w-full py-4 bg-[#7ED957] text-white font-extrabold text-lg rounded-xl hover:bg-[#6bc24a] transition-colors shadow-sm"
              >
                Mark as Ready
              </button>
            )}
             {selectedOrder.status === 'ready' && (
              <button 
                onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                className="w-full py-4 bg-[#7ED957] text-white font-extrabold text-lg rounded-xl hover:bg-[#6bc24a] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Ready for Pickup <Bell size={20} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
