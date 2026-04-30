'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useCashierStore } from '../store/useCashierStore';

export default function ConfirmationScreen() {
  const { cart, discount, clearCart, setActiveScreen } = useCashierStore();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal - discount + tax;

  return (
    <motion.div
      key="confirmation"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 p-8 flex justify-center items-center bg-[#FDEFDE]"
    >
      <div className="bg-[#FEFDFA] rounded-3xl w-[480px] p-10 shadow-sm border border-[#737373]/20 text-center flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, delay: 0.1 }}
          className="w-20 h-20 bg-[#FECE04] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#FECE04]/30"
        >
          <CheckCircle2 size={40} className="text-[#000000]" strokeWidth={2.5} />
        </motion.div>
        
        <h2 className="text-2xl font-extrabold text-[#811920] mb-2">Order Placed Successfully!</h2>
        <p className="text-[#737373] mb-8 font-medium">Order No. <span className="font-extrabold text-[#000000]">#CHZ-1025</span></p>
        
        <div className="w-full bg-[#FDEFDE]/50 border border-[#FECE04]/30 rounded-2xl p-6 mb-8 text-left">
          <p className="text-[#000000] font-bold mb-4 text-center text-lg">Dine-in • Table 12</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-[#737373] font-medium">Paid Amount</span>
              <span className="font-extrabold text-[#000000]">Rs. {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-[#737373] font-medium">Payment Method</span>
              <span className="font-extrabold text-[#000000]">Cash</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mb-4">
          <button className="py-4 border-2 border-[#737373]/20 bg-white rounded-xl font-bold text-[#000000] hover:bg-[#FDEFDE] transition-colors">
            Print Receipt
          </button>
          <button className="py-4 bg-[#FECE04] rounded-xl font-extrabold text-[#000000] hover:bg-[#E5B800] transition-colors shadow-sm">
            Send to Kitchen
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          <button 
            onClick={() => { clearCart(); setActiveScreen('pos'); }}
            className="py-4 border-2 border-[#737373]/20 bg-white rounded-xl font-bold text-[#000000] hover:bg-[#FDEFDE] transition-colors"
          >
            New Order
          </button>
          <button 
            onClick={() => setActiveScreen('history')}
            className="py-4 border-2 border-[#737373]/20 bg-white rounded-xl font-bold text-[#000000] hover:bg-[#FDEFDE] transition-colors"
          >
            View Orders
          </button>
        </div>
      </div>
    </motion.div>
  );
}
