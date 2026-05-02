'use client';

import { useKDSStore } from '../store/useKDSStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Bell } from 'lucide-react';

export default function OrderDetailModal() {
  const { selectedOrder, setSelectedOrder, updateOrderStatus } = useKDSStore();

  if (!selectedOrder) return null;

  const displayId = selectedOrder.id.toString().slice(-6).toUpperCase();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#811920]/40 backdrop-blur-md"
          onClick={() => setSelectedOrder(null)}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-[#FEFDFA] w-full h-full md:h-auto md:max-h-[90vh] md:max-w-xl md:rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">{selectedOrder.type}</span>
                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                   selectedOrder.status === 'new' ? 'bg-[#811920] text-white' : 
                   selectedOrder.status === 'preparing' ? 'bg-[#FECE04] text-black' : 
                   'bg-[#7ED957] text-white'
                 }`}>
                   {selectedOrder.status}
                 </span>
              </div>
              <h2 className="text-4xl font-black text-[#000000]">Order #{displayId}</h2>
              <p className="text-[#737373] font-bold mt-2 text-lg">
                 {selectedOrder.table !== selectedOrder.type ? `Table ${selectedOrder.table}` : 'Takeaway Order'}
              </p>
            </div>
            
            <button 
              onClick={() => setSelectedOrder(null)}
              className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-[#737373] hover:bg-slate-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Items List */}
          <div className="p-8 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Order Items</h3>
            {selectedOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start border-b border-slate-50 pb-6 last:border-0">
                <div className="flex gap-6">
                  <span className="font-black text-3xl text-[#811920] w-12">{item.quantity}x</span>
                  <div>
                    <p className="font-black text-2xl text-[#000000]">{item.name}</p>
                    {item.status && <p className="text-xs font-bold text-slate-400 uppercase mt-1">{item.status}</p>}
                    {item.note && (
                      <div className="mt-3 p-3 bg-[#FDEFDE] rounded-2xl border border-[#FECE04]/20 inline-flex items-center gap-2">
                        <span className="text-sm font-black text-[#811920]">Special Note:</span>
                        <span className="text-sm font-bold text-[#811920]">{item.note}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {selectedOrder.notes && (
              <div className="mt-8 p-6 bg-[#811920]/5 rounded-[30px] border border-[#811920]/10">
                <p className="text-sm font-black text-[#811920] uppercase tracking-widest mb-2 opacity-50">Global Instructions</p>
                <p className="text-lg text-[#811920] font-bold leading-relaxed">{selectedOrder.notes}</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-8 bg-white border-t border-slate-50 grid grid-cols-1 gap-4">
            {selectedOrder.status === 'new' && (
              <button 
                onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}
                className="w-full py-6 bg-[#811920] text-white font-black text-xl rounded-[24px] hover:bg-[#6b141a] transition-all transform active:scale-[0.98] shadow-xl shadow-[#811920]/20 uppercase tracking-widest"
              >
                Start Preparing
              </button>
            )}
            {selectedOrder.status === 'preparing' && (
              <button 
                onClick={() => updateOrderStatus(selectedOrder.id, 'ready')}
                className="w-full py-6 bg-[#FECE04] text-black font-black text-xl rounded-[24px] hover:bg-[#e5b800] transition-all transform active:scale-[0.98] shadow-xl shadow-[#FECE04]/20 uppercase tracking-widest"
              >
                Mark as Ready
              </button>
            )}
             {selectedOrder.status === 'ready' && (
              <button 
                onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                className="w-full py-6 bg-[#7ED957] text-white font-black text-xl rounded-[24px] hover:bg-[#6bc24a] transition-all transform active:scale-[0.98] shadow-xl shadow-[#7ED957]/20 flex items-center justify-center gap-4 uppercase tracking-widest"
              >
                Ready for Pickup <Bell size={24} />
              </button>
            )}
            <button 
               onClick={() => setSelectedOrder(null)}
               className="w-full py-4 bg-slate-50 text-slate-400 font-bold rounded-2xl md:hidden"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
