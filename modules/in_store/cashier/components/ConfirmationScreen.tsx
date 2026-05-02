'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useCashierStore } from '../store/useCashierStore';

export default function ConfirmationScreen() {
  const { cart, discount, clearCart, setActiveScreen, paymentMethod, lastOrderNumber, placeOrder } = useCashierStore();
  const [isSending, setIsSending] = React.useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal - discount + tax;

  const handleSendToKitchen = async () => {
    setIsSending(true);
    try {
      await placeOrder();
      alert("Order sent to kitchen!");
    } catch (err) {
      alert("Failed to send order to kitchen");
    } finally {
      setIsSending(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-receipt, #print-receipt * {
            visibility: visible;
          }
          #print-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    <motion.div
      key="confirmation"
      id="print-receipt"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 p-8 flex justify-center items-center bg-[#FDEFDE] print:bg-white print:p-0"
    >
      <div className="bg-[#FEFDFA] rounded-3xl w-[480px] p-10 shadow-sm border border-[#737373]/20 text-center flex flex-col items-center print:shadow-none print:border-none print:w-full print:p-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, delay: 0.1 }}
          className="w-20 h-20 bg-[#FECE04] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#FECE04]/30 no-print"
        >
          <CheckCircle2 size={40} className="text-[#000000]" strokeWidth={2.5} />
        </motion.div>
        
        <h2 className="text-2xl font-extrabold text-[#811920] mb-2 print:text-black">Order Placed Successfully!</h2>
        <p className="text-[#737373] mb-8 font-medium print:text-black">Order No. <span className="font-extrabold text-[#000000]">#{lastOrderNumber}</span></p>
        
        <div className="w-full bg-[#FDEFDE]/50 border border-[#FECE04]/30 rounded-2xl p-6 mb-8 text-left print:bg-white print:border-black/20 print:p-2">
          <p className="text-[#000000] font-black mb-4 text-center text-lg uppercase tracking-widest border-b border-[#737373]/10 pb-2">CHEEZIOUS POS RECEIPT</p>
          <div className="space-y-3 mb-6 border-b border-dashed border-[#737373]/40 pb-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-[15px]">
                <span className="font-bold text-[#000000]">{item.quantity}x {item.name}</span>
                <span className="font-bold text-[#000000]">Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-[#737373] font-bold print:text-black">Subtotal</span>
              <span className="font-bold text-[#000000]">Rs. {subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-[#737373] font-bold print:text-black">Discount</span>
                <span className="font-bold text-[#811920]">- Rs. {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-[#737373] font-bold print:text-black">Tax (12%)</span>
              <span className="font-bold text-[#000000]">Rs. {tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[18px] border-t border-[#737373]/10 pt-3 mt-3">
              <span className="text-[#000000] font-black">Total Amount</span>
              <span className="font-black text-[#811920]">Rs. {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[15px] pt-2">
              <span className="text-[#737373] font-bold print:text-black">Payment Method</span>
              <span className="font-black text-[#000000] uppercase">{paymentMethod || 'Cash'}</span>
            </div>
          </div>
          <div className="mt-8 text-center text-[10px] text-[#737373] font-bold uppercase tracking-widest border-t border-[#737373]/10 pt-4">
            Thank you for choosing Cheezious!
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mb-4 no-print">
          <button 
            onClick={handlePrint}
            className="py-4 border-2 border-[#737373]/20 bg-white rounded-xl font-bold text-[#000000] hover:bg-[#FDEFDE] transition-colors"
          >
            Print Receipt
          </button>
          <button 
            disabled={isSending}
            onClick={handleSendToKitchen}
            className="py-4 bg-[#FECE04] rounded-xl font-extrabold text-[#000000] hover:bg-[#E5B800] transition-colors shadow-sm disabled:opacity-50"
          >
            {isSending ? "Sending..." : "Send to Kitchen"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full no-print">
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
    </>
  );
}
