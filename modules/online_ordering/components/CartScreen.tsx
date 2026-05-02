import React from "react";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, Trash2, Ticket } from "lucide-react";
import { DISHES } from "../constants";

interface CartScreenProps {
  cart: any[];
  removeFromCart: (id: string) => void;
  deleteFromCart: (id: string) => void;
  addToCart: (dish: any, variationIdx?: number) => void;
  incrementCartQty: (id: string) => void;
  cartTotal: number;
  deliveryCharges: number;
  grandTotal: number;
}

export function CartScreen({
  cart,
  removeFromCart,
  deleteFromCart,
  addToCart,
  incrementCartQty,
  cartTotal,
  deliveryCharges,
  grandTotal
}: CartScreenProps) {
  
  const recommendations = DISHES.filter(d => !cart.some(c => c.dishId === d.id)).slice(0, 3);

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto animate-in slide-in-from-right duration-300">
      <h1 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8">Your Cart ({cart.length})</h1>
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
        <div className="flex-1 space-y-4">
          {cart.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 md:p-20 flex flex-col items-center justify-center border border-gray-100 shadow-sm text-center">
              <ShoppingBag size={64} className="text-gray-200 mb-6" />
              <p className="text-lg md:text-xl font-black text-gray-900 mb-2">Your cart is empty</p>
              <Link href="/home" className="text-[#811920] font-bold hover:underline">Go back to menu</Link>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-3xl p-4 md:p-5 border border-gray-100 shadow-sm flex items-center gap-4 md:gap-6">
                  <img src={item.image} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-black text-gray-900 truncate">{item.name}</h3>
                    <p className="text-xs md:text-sm font-bold text-gray-500 mb-2 md:mb-4">{item.variation || "Regular"}</p>
                    <div className="flex items-center gap-3 md:gap-4 bg-gray-50 w-fit rounded-xl px-2 md:px-3 py-1 border border-gray-100">
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-gray-900"><Minus size={14} /></button>
                      <span className="text-sm md:text-base font-black w-6 text-center">{item.qty}</span>
                      <button onClick={() => incrementCartQty(item.id)} className="text-gray-400 hover:text-gray-900"><Plus size={14} /></button>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-3 md:gap-4">
                     <span className="text-base md:text-lg font-black text-gray-900 whitespace-nowrap">Rs {item.price * item.qty}</span>
                     <button onClick={() => deleteFromCart(item.id)} className="text-red-100 hover:text-[#811920] bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              <div className="mt-8 md:mt-12">
                <p className="text-base md:text-lg font-black text-gray-900 mb-4 md:mb-6">Don't be shy - you can add these too:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {recommendations.map(dish => (
                    <div key={dish.id} className="bg-white rounded-3xl p-3 md:p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                      <img src={dish.image} alt={dish.name} className="w-full aspect-video object-cover rounded-2xl mb-3 md:mb-4" />
                      <h4 className="font-black text-gray-900 text-[11px] md:text-sm mb-1 line-clamp-1">{dish.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] md:text-xs font-bold text-gray-500">Rs {dish.price}</span>
                        <button onClick={() => addToCart(dish)} className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#811920] flex items-center justify-center text-white shadow-lg"><Plus size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-white rounded-[32px] p-6 md:p-8 border border-gray-100 shadow-xl lg:sticky lg:top-24">
            <h2 className="text-lg md:text-xl font-black text-gray-900 mb-6 md:mb-8">Order Summary</h2>
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <div className="flex justify-between text-xs md:text-sm font-bold text-gray-500"><span>Subtotal</span><span className="text-gray-900">Rs {cartTotal}</span></div>
              <div className="flex justify-between text-xs md:text-sm font-bold text-gray-500"><span>Delivery Charges</span><span className="text-gray-900">Rs {deliveryCharges}</span></div>
            </div>
            <div className="pt-4 md:pt-6 border-t border-gray-100 mb-6 md:mb-8">
               <div className="flex justify-between items-center"><span className="text-base md:text-lg font-black text-gray-900">Total</span><span className="text-xl md:text-2xl font-black text-[#811920]">Rs {grandTotal}</span></div>
            </div>
            <div className="relative mb-6 md:mb-8">
               <Ticket size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
               <input type="text" placeholder="Have a Promo Code?" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 md:py-3.5 pl-12 pr-16 outline-none focus:border-[#FECE04] text-xs md:text-sm font-bold" />
               <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] md:text-xs font-black uppercase text-[#811920]">Apply</button>
            </div>
            <div className="space-y-3">
              <Link href="/checkout/delivery" className={`block w-full text-center bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-3.5 md:py-4 rounded-2xl shadow-lg shadow-yellow-100 transition-all hover:-translate-y-1 active:translate-y-0 text-sm md:text-base uppercase tracking-wide ${cart.length === 0 ? "opacity-50 pointer-events-none" : ""}`}>Checkout</Link>
              <Link href="/home" className="block w-full text-center bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-900 font-black py-3.5 md:py-4 rounded-2xl transition-all text-sm md:text-base uppercase tracking-wide">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
