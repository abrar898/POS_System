import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Truck, Wallet, CheckCircle2, Minus, Plus, Trash2 } from "lucide-react";
import { DISHES } from "../constants";

interface CheckoutScreenProps {
  initialCheckoutStep: "delivery" | "payment" | "review";
  selectedAddress: string;
  setSelectedAddress: (addr: string) => void;
  addresses: { id: string, address: string }[];
  setAddresses: React.Dispatch<React.SetStateAction<{ id: string, address: string }[]>>;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  cart: any[];
  removeFromCart: (id: string) => void;
  deleteFromCart: (id: string) => void;
  addToCart: (dish: any, variationIdx?: number) => void;
  incrementCartQty: (id: string) => void;
  cartTotal: number;
  deliveryCharges: number;
  grandTotal: number;
  handlePlaceOrder: () => void;
}

export function CheckoutScreen({
  initialCheckoutStep,
  selectedAddress,
  setSelectedAddress,
  addresses,
  setAddresses,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  cart,
  removeFromCart,
  deleteFromCart,
  addToCart,
  incrementCartQty,
  cartTotal,
  deliveryCharges,
  grandTotal,
  handlePlaceOrder
}: CheckoutScreenProps) {
  const router = useRouter();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState("");
  
  // State for new address form
  const [newAddress, setNewAddress] = React.useState({
    fullName: "Shehriar Ali",
    phoneNumber: "+92 312 304930",
    instructions: ""
  });

  const handleEdit = (id: string, currentVal: string) => {
    setEditingId(id);
    setEditValue(currentVal);
  };

  const handleSave = (id: string) => {
    setAddresses(prev => prev.map(a => a.id === id ? { ...a, address: editValue } : a));
    setEditingId(null);
  };

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
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8">Delivery Address</h2>
            <div className="space-y-4 md:space-y-5 mb-10 md:mb-16">
              {addresses.map(addr => (
                <div key={addr.id} onClick={() => setSelectedAddress(addr.id)} className={`bg-white rounded-2xl md:rounded-[32px] p-6 md:p-8 border transition-all cursor-pointer flex items-center justify-between ${selectedAddress === addr.id ? "border-[#FECE04]/50 shadow-2xl shadow-yellow-50/50" : "border-gray-100 hover:border-gray-200"}`}>
                  <div className="flex items-center gap-4 md:gap-6 flex-1">
                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center ${selectedAddress === addr.id ? "bg-[#FECE04]" : "bg-gray-100"}`}>
                       {selectedAddress === addr.id && <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-lg md:text-xl text-gray-900">{addr.id}</p>
                      {editingId === addr.id ? (
                        <input 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full mt-2 px-4 py-3 border border-gray-100 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#FECE04] bg-gray-50"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <p className="text-sm md:text-base font-bold text-gray-400 mt-1">{addr.address}</p>
                      )}
                    </div>
                  </div>
                  {editingId === addr.id ? (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSave(addr.id); }} 
                      className="text-[#7ED957] font-black text-xs md:text-sm uppercase tracking-wider hover:underline ml-4"
                    >
                      Save
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEdit(addr.id, addr.address); }} 
                      className="text-gray-900 font-black text-xs md:text-sm uppercase tracking-wider hover:underline ml-4"
                    >
                      Edit
                    </button>
                  )}
                </div>
              ))}
            </div>

            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8">Add New Address</h2>
            <div className="space-y-4 md:space-y-6">
               <div className="bg-white rounded-2xl md:rounded-[28px] p-6 border border-gray-100 shadow-sm focus-within:border-[#FECE04] focus-within:shadow-lg transition-all">
                  <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full text-base md:text-lg font-black text-gray-900 outline-none bg-transparent"
                    placeholder="Enter your name"
                  />
               </div>
               <div className="bg-white rounded-2xl md:rounded-[28px] p-6 border border-gray-100 shadow-sm focus-within:border-[#FECE04] focus-within:shadow-lg transition-all">
                  <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={newAddress.phoneNumber}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full text-base md:text-lg font-black text-gray-900 outline-none bg-transparent"
                    placeholder="+92 312 304930"
                  />
               </div>
               <div className="bg-white rounded-2xl md:rounded-[28px] p-6 border border-gray-100 shadow-sm focus-within:border-[#FECE04] focus-within:shadow-lg transition-all">
                  <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Instructions (Optional)</label>
                  <textarea 
                    rows={2}
                    value={newAddress.instructions}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full text-sm md:text-base font-bold text-gray-900 outline-none bg-transparent resize-none"
                    placeholder="Eg: Do not ring the bell (My parents didn't know I ordered)"
                  />
               </div>
               <button 
                onClick={() => {
                  if (newAddress.fullName && newAddress.phoneNumber) {
                    const id = `Address ${addresses.length + 1}`;
                    setAddresses(prev => [...prev, { id, address: `${newAddress.fullName}, ${newAddress.phoneNumber}` }]);
                    setSelectedAddress(id);
                    setNewAddress({ fullName: "", phoneNumber: "", instructions: "" });
                  } else {
                    alert("Please fill in Name and Phone Number");
                  }
                }}
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-[28px] text-gray-400 font-black uppercase tracking-widest hover:border-[#FECE04] hover:text-black transition-all"
               >
                 + Add this address
               </button>
            </div>
          </section>
          <button onClick={() => router.push("/checkout/payment")} className="w-full bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-4 md:py-6 rounded-[24px] md:rounded-[32px] shadow-2xl shadow-yellow-200/50 transition-all hover:-translate-y-1 active:translate-y-0 text-lg md:text-xl uppercase tracking-widest mt-8 md:mt-12">Continue</button>
        </div>
      )}

      {initialCheckoutStep === "payment" && (
        <div className="space-y-8 md:space-y-12">
           <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8">Payment Method</h2>
           <div className="space-y-4">
              {["Cash on Delivery", "Credit / Debit Card", "Easypaisa", "JazzCash", "Cheezious Wallet"].map(method => (
                <div key={method} onClick={() => setSelectedPaymentMethod(method)} className={`bg-white rounded-2xl md:rounded-[32px] p-6 border transition-all cursor-pointer flex items-center gap-4 ${selectedPaymentMethod === method ? "border-[#FECE04] shadow-xl shadow-yellow-50/50" : "border-gray-100 hover:border-gray-200"}`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selectedPaymentMethod === method ? "bg-[#FECE04]" : "bg-gray-100"}`}>
                     {selectedPaymentMethod === method && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className="font-black text-base md:text-lg text-gray-900">{method}</span>
                </div>
              ))}
           </div>
           <button onClick={() => router.push("/checkout/review")} className="w-full bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-4 md:py-6 rounded-[24px] md:rounded-[32px] shadow-2xl shadow-yellow-200/50 transition-all hover:-translate-y-1 active:translate-y-0 text-lg md:text-xl uppercase tracking-widest mt-8 md:mt-12">Continue</button>
        </div>
      )}

      {initialCheckoutStep === "review" && (
        <div className="space-y-8 md:space-y-10 animate-in fade-in duration-500">
           <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8">Review your Order</h2>
           <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-[28px] md:rounded-[36px] p-5 md:p-6 border border-gray-100 shadow-sm flex items-center gap-4 md:gap-8">
                   <img src={item.image} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover" />
                   <div className="flex-1 min-w-0">
                     <h4 className="font-black text-base md:text-lg text-gray-900 truncate">{item.name}</h4>
                     <p className="text-xs md:text-sm font-bold text-gray-500 mb-3">{item.variation || "Regular"}</p>
                     <div className="flex items-center gap-3 bg-gray-50 w-fit px-3 py-1.5 rounded-xl border border-gray-100">
                       <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-black"><Minus size={14} /></button>
                       <span className="text-sm md:text-base font-black w-6 text-center">{item.qty}</span>
                       <button onClick={() => incrementCartQty(item.id)} className="text-gray-400 hover:text-black"><Plus size={14} /></button>
                     </div>
                   </div>
                   <div className="text-right flex flex-col items-end gap-3 md:gap-4">
                      <span className="font-black text-gray-900 text-lg md:text-xl">Rs {item.price * item.qty}</span>
                      <button onClick={() => deleteFromCart(item.id)} className="text-red-100 hover:text-[#811920] bg-red-50 p-2 rounded-xl transition-colors"><Trash2 size={16} /></button>
                   </div>
                </div>
              ))}
           </div>
           <div className="space-y-4 pt-6 md:pt-10 border-t border-gray-100">
              <div className="flex justify-between text-sm md:text-base font-bold text-gray-500"><span>Subtotal</span><span className="text-gray-900">Rs {cartTotal}</span></div>
              <div className="flex justify-between text-sm md:text-base font-bold text-gray-500"><span>Delivery Charges</span><span className="text-gray-900">Rs {deliveryCharges}</span></div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-4"><span className="text-xl md:text-2xl font-black text-gray-900">Total</span><span className="text-2xl md:text-3xl font-black text-[#811920]">Rs {grandTotal}</span></div>
           </div>
           <div className="space-y-6 md:space-y-8 bg-gray-50/50 rounded-[32px] p-8 md:p-10 border border-gray-100">
              <div className="flex justify-between items-start gap-4"><div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivering to</p><p className="font-black text-base md:text-lg text-gray-900">{selectedAddress} — {addresses.find(a => a.id === selectedAddress)?.address}</p></div><button onClick={() => router.push("/checkout/delivery")} className="text-[#811920] font-black text-xs uppercase tracking-widest hover:underline shrink-0">Change</button></div>
              <div className="flex justify-between items-start gap-4"><div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Method</p><p className="font-black text-base md:text-lg text-gray-900">{selectedPaymentMethod}</p></div><button onClick={() => router.push("/checkout/payment")} className="text-[#811920] font-black text-xs uppercase tracking-widest hover:underline shrink-0">Change</button></div>
           </div>
           <button onClick={handlePlaceOrder} className="w-full bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-4 md:py-6 rounded-[24px] md:rounded-[32px] shadow-2xl shadow-yellow-200/50 transition-all hover:-translate-y-1 active:translate-y-0 text-xl md:text-2xl uppercase tracking-widest">Place Order</button>
        </div>
      )}
    </div>
  );
}
