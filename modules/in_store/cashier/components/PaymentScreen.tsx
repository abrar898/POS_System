'use client';

import { motion } from 'framer-motion';
import { Banknote, CreditCard, Wallet, ChevronLeft } from 'lucide-react';
import { useCashierStore } from '../store/useCashierStore';

export default function PaymentScreen() {
  const { cart, discount, setActiveScreen } = useCashierStore();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal - discount + tax;

  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute inset-0 p-8 flex justify-center items-start overflow-y-auto bg-[#FDEFDE]"
    >
      <div className="bg-[#FEFDFA] rounded-3xl w-[480px] p-8 shadow-sm border border-[#737373]/20">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setActiveScreen('pos')}
            className="p-2 bg-[#FDEFDE] rounded-full text-[#811920] hover:bg-[#811920] hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-extrabold text-[#000000]">Payment Screen</h2>
        </div>

        <div className="space-y-4 mb-8 bg-[#FDEFDE]/30 p-6 rounded-2xl border border-[#737373]/10">
          <p className="text-[#737373] text-sm font-bold mb-2">Order Summary <span className="text-black ml-2">#CHZ-1025</span></p>
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#737373] font-medium">Subtotal</span>
            <span className="font-bold text-[#000000]">Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#737373] font-medium">Discount</span>
            <span className="font-bold text-[#7ED957]">- Rs. {discount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#737373] font-medium">Tax (12%)</span>
            <span className="font-bold text-[#000000]">Rs. {tax.toLocaleString()}</span>
          </div>
          <div className="pt-4 border-t border-[#737373]/20 flex justify-between items-center text-[18px]">
            <span className="font-extrabold text-[#000000]">Total Amount</span>
            <span className="font-extrabold text-[#811920]">Rs. {total.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-5 mb-8">
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#737373] font-medium">Amount Received</span>
            <input 
              type="text" 
              defaultValue="3,000" 
              className="w-[140px] h-12 px-4 bg-[#FDEFDE] border border-[#737373]/20 rounded-xl text-right font-extrabold text-[#000000] focus:border-[#FECE04] outline-none text-lg transition-colors" 
            />
          </div>
          <div className="flex justify-between items-center text-[15px] p-4 bg-white border border-[#737373]/10 rounded-xl shadow-sm">
            <span className="text-[#737373] font-bold">Return/Due</span>
            <span className="font-extrabold text-2xl text-[#000000]">Rs. 290</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <button className="flex flex-col items-center justify-center py-4 border-2 border-[#FECE04] bg-[#FECE04]/10 rounded-2xl gap-2 transition-all shadow-sm">
            <Banknote size={28} className="text-[#000000]" />
            <span className="text-[13px] font-bold text-[#000000]">Cash</span>
          </button>
          <button className="flex flex-col items-center justify-center py-4 border-2 border-[#737373]/10 bg-white rounded-2xl gap-2 text-[#737373] hover:border-[#FECE04] hover:text-[#000000] transition-all">
            <CreditCard size={28} />
            <span className="text-[13px] font-bold">Card</span>
          </button>
          <button className="flex flex-col items-center justify-center py-4 border-2 border-[#737373]/10 bg-white rounded-2xl gap-2 text-[#737373] hover:border-[#FECE04] hover:text-[#000000] transition-all">
            <Wallet size={28} />
            <span className="text-[13px] font-bold">Wallet</span>
          </button>
        </div>

        <button 
          onClick={() => setActiveScreen('confirmation')}
          className="w-full py-5 bg-[#811920] hover:bg-[#6a151a] text-[#FEFDFA] rounded-2xl font-extrabold text-lg transition-all shadow-md"
        >
          Complete Payment
        </button>
      </div>
    </motion.div>
  );
}
