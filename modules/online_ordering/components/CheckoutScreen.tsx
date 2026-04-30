import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Truck, Wallet, CheckCircle2, Minus, Plus, Trash2 } from "lucide-react";
import { DISHES } from "../constants";

interface CheckoutScreenProps {
  initialCheckoutStep: "delivery" | "payment" | "review";
  selectedAddress: string;
  setSelectedAddress: (addr: string) => void;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  cart: any[];
  removeFromCart: (id: string) => void;
  deleteFromCart: (id: string) => void;
  addToCart: (dish: any, variationIdx?: number) => void;
  cartTotal: number;
  deliveryCharges: number;
  grandTotal: number;
  handlePlaceOrder: () => void;
}

export function CheckoutScreen({
  initialCheckoutStep,
  selectedAddress,
  setSelectedAddress,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  cart,
  removeFromCart,
  deleteFromCart,
  addToCart,
  cartTotal,
  deliveryCharges,
  grandTotal,
  handlePlaceOrder
}: CheckoutScreenProps) {
  const router = useRouter();

  return (
    <div className="p-4 md:p-8 max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-center mb-8 md:mb-16 relative overflow-x-auto no-scrollbar pb-4 md:pb-0">
         <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10 hidden md:block" />
         <div className="flex gap-8 md:gap-20 bg-[#FEFDFA] px-4 md:px-10">
            {[
              { id: "delivery", label: "Delivery", icon: <Truck size={18} />, href: "/checkout/delivery" },
              { id: "payment", label: "Payment", icon: <Wallet size={18} />, href: "/checkout/payment" },
              { id: "review", label: "Review", icon: <CheckCircle2 size={18} />, href: "/checkout/review" },
            ].map((step, i) => (
              <Link key={step.id} href={step.href} className="flex flex-col md:flex-row items-center gap-2 md:gap-3 cursor-pointer shrink-0">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all ${initialCheckoutStep === step.id ? "bg-[#FECE04] text-black shadow-lg shadow-yellow-200" : i < ["delivery","payment","review"].indexOf(initialCheckoutStep) ? "bg-[#7ED957] text-white" : "bg-gray-100 text-gray-400"}`}>
                   {step.icon}
                </div>
                <span className={`text-[10px] md:text-sm font-black uppercase tracking-widest ${initialCheckoutStep === step.id ? "text-gray-900" : "text-gray-400"}`}>{step.label}</span>
              </Link>
            ))}
         </div>
      </div>

      {initialCheckoutStep === "delivery" && (
        <div className="space-y-8 md:space-y-12">
          <section>
            <h2 className="text-lg md:text-xl font-black text-gray-900 mb-4 md:mb-6">Delivery Address</h2>
            <div className="space-y-3 md:space-y-4">
              {[{ id: "Home", address: "Emaar DHA 5, Islamabad" }, { id: "Work", address: "Blue Area, Islamabad" }].map(addr => (
                <div key={addr.id} onClick={() => setSelectedAddress(addr.id)} className={`bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 transition-all cursor-pointer flex items-center justify-between ${selectedAddress === addr.id ? "border-[#FECE04] shadow-xl shadow-yellow-50/50" : "border-gray-100 hover:border-gray-200"}`}>
                  <div className="flex items-center gap-3 md:gap-4"><div className={`w-3 h-3 rounded-full ${selectedAddress === addr.id ? "bg-[#FECE04]" : "bg-gray-200"}`} /><div><p className="font-black text-sm md:text-base text-gray-900">{addr.id}</p><p className="text-xs md:text-sm font-bold text-gray-500">{addr.address}</p></div></div>
                  <button className="text-[#811920] font-black text-[10px] md:text-sm hover:underline">Edit</button>
                </div>
              ))}
            </div>
          </section>
          <button onClick={() => router.push("/checkout/payment")} className="w-full bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-4 md:py-5 rounded-2xl md:rounded-3xl shadow-2xl shadow-yellow-200 transition-all hover:-translate-y-1 active:translate-y-0 text-base md:text-lg">Continue</button>
        </div>
      )}

      {initialCheckoutStep === "payment" && (
        <div className="space-y-8 md:space-y-12">
           <h2 className="text-lg md:text-xl font-black text-gray-900 mb-4 md:mb-6">Payment Method</h2>
           <div className="space-y-3 md:space-y-4">
              {["Cash on Delivery", "Credit / Debit Card", "Easypaisa", "JazzCash", "Cheezious Wallet"].map(method => (
                <div key={method} onClick={() => setSelectedPaymentMethod(method)} className={`bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 transition-all cursor-pointer flex items-center gap-3 md:gap-4 ${selectedPaymentMethod === method ? "border-[#FECE04] shadow-xl shadow-yellow-50/50" : "border-gray-100 hover:border-gray-200"}`}>
                  <div className={`w-3 h-3 rounded-full ${selectedPaymentMethod === method ? "border-[#FECE04]" : "bg-gray-200"}`} /><span className="font-black text-sm md:text-base text-gray-900">{method}</span>
                </div>
              ))}
           </div>
           <button onClick={() => router.push("/checkout/review")} className="w-full bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-4 md:py-5 rounded-2xl md:rounded-3xl shadow-2xl shadow-yellow-200 transition-all hover:-translate-y-1 active:translate-y-0 text-base md:text-lg">Continue</button>
        </div>
      )}

      {initialCheckoutStep === "review" && (
        <div className="space-y-8 md:space-y-10 animate-in fade-in duration-500">
           <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 md:mb-6">Review your Order</h2>
           <div className="space-y-3 md:space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-6 border border-gray-100 shadow-sm flex items-center gap-4 md:gap-6">
                   <img src={item.image} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover" />
                   <div className="flex-1 min-w-0">
                     <h4 className="font-black text-sm md:text-base text-gray-900 truncate">{item.name}</h4>
                     <p className="text-xs md:text-sm font-bold text-gray-500 mb-2">{item.variation || "Regular"}</p>
                     <div className="flex items-center gap-2 md:gap-3 bg-gray-50 w-fit px-2 py-1 rounded-lg border border-gray-100">
                       <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-black"><Minus size={12} /></button>
                       <span className="text-xs md:text-sm font-black w-4 text-center">{item.qty}</span>
                       <button onClick={() => addToCart(DISHES.find(d => d.id === item.dishId) || DISHES[0], (DISHES.find(d => d.id === item.dishId) || DISHES[0]).variations?.findIndex(v => v.name === item.variation) ?? 0)} className="text-gray-400 hover:text-black"><Plus size={12} /></button>
                     </div>
                   </div>
                   <div className="text-right flex flex-col items-end gap-2 md:gap-3">
                      <span className="font-black text-gray-900 text-base md:text-lg">Rs {item.price * item.qty}</span>
                      <button onClick={() => deleteFromCart(item.id)} className="text-red-100 hover:text-[#811920] bg-red-50 p-1.5 rounded-lg transition-colors"><Trash2 size={14} /></button>
                   </div>
                </div>
              ))}
           </div>
           <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t border-gray-100">
              <div className="flex justify-between text-xs md:text-sm font-bold text-gray-500"><span>Subtotal</span><span className="text-gray-900">Rs {cartTotal}</span></div>
              <div className="flex justify-between text-xs md:text-sm font-bold text-gray-500"><span>Delivery Charges</span><span className="text-gray-900">Rs {deliveryCharges}</span></div>
              <div className="flex justify-between items-center pt-2"><span className="text-xl md:text-2xl font-black text-gray-900">Total</span><span className="text-2xl md:text-3xl font-black text-[#811920]">Rs {grandTotal}</span></div>
           </div>
           <div className="space-y-4 md:space-y-6 bg-gray-50/50 rounded-3xl p-6 md:p-8 border border-gray-100">
              <div className="flex justify-between items-start gap-4"><div><p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivering to</p><p className="font-black text-sm md:text-base text-gray-900">{selectedAddress} — {selectedAddress === "Home" ? "Emaar DHA 5, Islamabad" : "Blue Area, Islamabad"}</p></div><button onClick={() => router.push("/checkout/delivery")} className="text-[#811920] font-black text-[10px] uppercase tracking-tighter hover:underline shrink-0">Change</button></div>
              <div className="flex justify-between items-start gap-4"><div><p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Method</p><p className="font-black text-sm md:text-base text-gray-900">{selectedPaymentMethod}</p></div><button onClick={() => router.push("/checkout/payment")} className="text-[#811920] font-black text-[10px] uppercase tracking-tighter hover:underline shrink-0">Change</button></div>
           </div>
           <button onClick={handlePlaceOrder} className="w-full bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-4 md:py-5 rounded-[20px] md:rounded-[24px] shadow-2xl shadow-yellow-200 transition-all hover:-translate-y-1 active:translate-y-0 text-lg md:text-xl">Place Order</button>
        </div>
      )}
    </div>
  );
}
