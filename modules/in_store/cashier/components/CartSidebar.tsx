'use client';

import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCashierStore } from '../store/useCashierStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartSidebar() {
  const { cart, clearCart, updateQuantity, discount, setActiveScreen, holdCurrentOrder } = useCashierStore();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal - discount + tax;

  return (
    <div className="w-[340px] bg-[#FEFDFA] border-l border-[#737373]/20 flex flex-col shrink-0 z-10 shadow-[-4px_0_15px_rgba(0,0,0,0.02)]">
      <div className="p-5 border-b border-[#737373]/10 flex justify-between items-center bg-white z-10 shrink-0">
        <h2 className="font-extrabold text-[18px] text-[#000000] flex items-center gap-2">
          Cart <span className="bg-[#FECE04] text-black text-xs px-2 py-0.5 rounded-full">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
        </h2>
        <button 
          onClick={clearCart}
          className="text-[13px] text-[#811920] font-bold hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        <AnimatePresence>
          {cart.map(item => (
            <motion.div 
              key={item.cartId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex gap-3 relative p-2 rounded-xl hover:bg-[#FDEFDE]/30 transition-colors border border-transparent hover:border-[#737373]/10 group"
            >
              <div className="w-16 h-16 bg-[#FDEFDE]/60 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-[#000000] text-[14px] leading-tight pr-2">{item.name}</h4>
                  <p className="font-extrabold text-[#000000] text-[14px]">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <p className="text-[11px] text-[#737373] mb-2">{item.size || 'Regular'}</p>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-3 bg-white border border-[#737373]/20 rounded-lg px-2 py-1 shadow-sm">
                    <button 
                      onClick={() => updateQuantity(item.cartId, -1)}
                      className="text-[#737373] hover:text-[#811920] transition-colors"
                    >
                      {item.quantity <= 1 ? <Trash2 size={14} /> : <Minus size={14} strokeWidth={3} />}
                    </button>
                    <span className="text-[13px] font-extrabold text-[#000000] w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.cartId, 1)}
                      className="text-[#737373] hover:text-[#7ED957] transition-colors"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {cart.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-[#737373] opacity-40 space-y-4">
            <ShoppingBag size={64} strokeWidth={1} />
            <p className="font-medium">Cart is empty</p>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-[#737373]/10 bg-white shrink-0">
        <div className="space-y-3 mb-6 text-[14px]">
          <div className="flex justify-between text-[#737373] font-medium">
            <span>Subtotal</span>
            <span className="text-[#000000]">Rs. {subtotal.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-[#737373] font-medium">
              <span>Discount</span>
              <span className="text-[#7ED957] font-bold">- Rs. {discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-[#737373] font-medium">
            <span>Tax (12%)</span>
            <span className="text-[#000000]">Rs. {tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-4 border-t border-[#737373]/10 mt-2 text-[18px]">
            <span className="font-extrabold text-[#000000]">Total</span>
            <span className="font-extrabold text-[#811920]">Rs. {total.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            disabled={cart.length === 0}
            onClick={holdCurrentOrder}
            className="py-4 border-2 border-[#737373]/20 rounded-xl text-[#000000] font-bold hover:bg-[#FDEFDE] hover:border-[#FECE04] transition-all text-[14px] disabled:opacity-50 disabled:pointer-events-none"
          >
            Hold Order
          </button>
          <button 
            disabled={cart.length === 0}
            onClick={() => setActiveScreen('payment')}
            className="py-4 bg-[#FECE04] rounded-xl text-[#000000] font-bold hover:bg-[#E5B800] hover:shadow-md transition-all text-[14px] shadow-sm disabled:opacity-50 disabled:pointer-events-none"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
