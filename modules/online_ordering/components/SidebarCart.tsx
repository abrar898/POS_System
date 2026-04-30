import React from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, Ticket } from "lucide-react";
import { DISHES } from "../constants";

interface SidebarCartProps {
  initialScreen: string;
  cart: any[];
  removeFromCart: (id: string) => void;
  deleteFromCart: (id: string) => void;
  addToCart: (dish: any, variationIdx?: number) => void;
  cartTotal: number;
  deliveryCharges: number;
  grandTotal: number;
  clearCart: () => void;
}

export function SidebarCart({
  initialScreen,
  cart,
  removeFromCart,
  deleteFromCart,
  addToCart,
  cartTotal,
  deliveryCharges,
  grandTotal,
  clearCart
}: SidebarCartProps) {
  
  if (initialScreen !== "menu" && initialScreen !== "deals") {
    return null;
  }

  return (
    <>
      {/* Floating View Cart for Mobile */}
      {cart.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50">
          <Link href="/cart" className="flex items-center justify-between w-full bg-[#811920] text-white p-4 rounded-2xl shadow-xl shadow-maroon/20">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-black">{cart.length}</div>
              <span className="font-black text-sm uppercase tracking-wide">View Cart</span>
            </div>
            <span className="font-black text-base">Rs {grandTotal}</span>
          </Link>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[320px] lg:w-[360px] border-l border-gray-100 bg-[#FEFDFA] flex-col h-[calc(100vh-64px)] shrink-0 no-scrollbar overflow-y-auto">
        <div className="p-6 flex items-center justify-between sticky top-0 bg-[#FEFDFA] z-10 border-b border-gray-50">
          <h2 className="text-lg font-black text-gray-900">Your Order ({cart.length})</h2>
          <button onClick={clearCart} className="text-xs font-bold text-[#811920] hover:underline">Clear Cart</button>
        </div>
        <div className="flex-1 px-6 py-4 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex gap-4 p-3 bg-white rounded-2xl border border-gray-50 shadow-sm relative group">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <h4 className="text-sm font-black text-gray-900 leading-tight mb-2 pr-4">{item.name}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-gray-900"><Minus size={14} /></button>
                    <span className="text-sm font-black w-4 text-center">{item.qty}</span>
                    <button onClick={() => addToCart(DISHES.find(d => d.id === item.dishId) || DISHES[0], (DISHES.find(d => d.id === item.dishId) || DISHES[0]).variations?.findIndex(v => v.name === item.variation) ?? 0)} className="text-gray-400 hover:text-gray-900"><Plus size={14} /></button>
                  </div>
                  <span className="text-sm font-black text-gray-900">Rs {item.price * item.qty}</span>
                </div>
              </div>
              <button onClick={() => deleteFromCart(item.id)} className="absolute top-3 right-3 text-gray-300 hover:text-[#811920] opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
            </div>
          ))}
          {cart.length > 0 && (
            <div className="bg-[#FDEFDE]/50 border border-[#FDEFDE] rounded-2xl p-4 mt-6">
              <p className="text-[11px] font-bold text-gray-600 mb-2">We know you want to add those Fries.. 😉</p>
              <button className="text-[10px] font-black uppercase text-[#811920]">+ ADD FRIES for Rs 100</button>
            </div>
          )}
          <div className="relative mt-4"><Ticket size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Have a Promo Code?" className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-11 pr-16 outline-none focus:border-[#FECE04] text-xs font-bold" /><button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-[#811920]">Apply</button></div>
        </div>
        <div className="p-6 bg-white border-t border-gray-50 space-y-3 sticky bottom-0">
          <div className="flex justify-between text-xs font-bold text-gray-500"><span>Subtotal</span><span className="text-gray-900">Rs {cartTotal}</span></div>
          <div className="flex justify-between text-xs font-bold text-gray-500"><span>Delivery Charges</span><span className="text-gray-900">Rs {deliveryCharges}</span></div>
          <div className="flex justify-between pt-3 border-t border-gray-100"><span className="text-xl font-black text-gray-900">Total</span><span className="text-xl font-black text-[#811920]">Rs {grandTotal}</span></div>
          <Link href="/cart" className="block w-full text-center bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-4 rounded-2xl mt-4 shadow-lg shadow-yellow-200 transition-all hover:-translate-y-1 active:translate-y-0 text-lg uppercase tracking-wide">Go to Cart</Link>
        </div>
      </aside>
    </>
  );
}
