"use client";

import * as React from "react";
import { 
  ChevronLeft, 
  Banknote, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Flame,
  LayoutGrid,
  ShoppingBag,
  List,
  User,
  MoreVertical
} from "lucide-react";
import { useRouter } from "next/navigation";

export function PaymentPage() {
  const router = useRouter();
  const [method, setMethod] = React.useState<"cash" | "card" | "qris">("cash");
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handlePay = () => {
    setIsSuccess(true);
    setTimeout(() => {
      router.push('/counter/dashboard');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white p-8">
        <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
           <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-xl shadow-emerald-500/10">
              <CheckCircle2 size={48} strokeWidth={3} />
           </div>
           <h1 className="text-3xl font-black text-slate-800">Payment Successful!</h1>
           <p className="mt-2 text-slate-400 font-bold uppercase tracking-widest text-xs">Receipt #RN-99283 printed</p>
           <p className="mt-8 text-sm font-medium text-slate-500">Returning to dashboard in 2 seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#EDEDED] font-sans selection:bg-black/10 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-[80px] bg-white border-r border-slate-200 flex flex-col items-center py-8">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg mb-8">
          <Flame size={20} fill="white" />
        </div>
        
        <div className="w-1 h-1 bg-slate-200 rounded-full mb-8" />

        <div className="flex flex-col gap-8 opacity-40">
            <button onClick={() => router.push('/counter')}><LayoutGrid size={22} /></button>
            <button onClick={() => router.push('/counter/menu-order')}><ShoppingBag size={22} /></button>
            <button onClick={() => router.push('/counter/orders')}><List size={22} /></button>
            <button><User size={22} /></button>
        </div>

        <div className="w-1 h-1 bg-slate-200 rounded-full mt-8" />
        
        <button className="mt-auto opacity-40 hover:opacity-100 transition-opacity"><MoreVertical size={20} /></button>
      </aside>

      {/* Sidebar - Mobile/Bottom Nav */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-20 bg-white shadow-2xl rounded-[30px] border border-slate-100 z-50 flex items-center justify-around px-4">
          <button onClick={() => router.push('/counter')} className="text-slate-300"><LayoutGrid size={24} /></button>
          <button onClick={() => router.push('/counter/menu-order')} className="text-slate-300"><ShoppingBag size={24} /></button>
          <button onClick={() => router.push('/counter/orders')} className="text-slate-300"><List size={24} /></button>
          <button className="text-slate-300"><User size={24} /></button>
      </nav>

      <main className="flex-1 overflow-y-auto px-6 lg:px-10 py-8 lg:py-12 flex justify-center pb-32 lg:pb-12">
        <div className="max-w-[1200px] w-full flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left - Payment Selection */}
          <div className="flex-1 space-y-8 lg:space-y-12">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-3 text-slate-400 font-black hover:text-black transition-all"
            >
              <ChevronLeft size={20} /> <span className="text-xs uppercase tracking-widest">Back to order</span>
            </button>

            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tighter">Checkout</h1>
              <p className="mt-3 text-sm font-bold text-slate-400 uppercase tracking-widest leading-loose">Choose your payment method</p>
            </div>

            <div className="space-y-4">
              {[
                { id: "cash", label: "Cash Payment", icon: Banknote, desc: "Direct hand-to-hand" },
                { id: "card", label: "Credit Card", icon: CreditCard, desc: "Visa / Mastercard / Amex" },
                { id: "qris", label: "QRIS", icon: QrCode, desc: "Instant scan-to-pay" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id as any)}
                  className={`flex items-center gap-4 lg:gap-6 p-6 lg:p-8 rounded-[25px] lg:rounded-[30px] border-2 transition-all text-left ${
                    method === m.id 
                    ? "border-black bg-white shadow-2xl shadow-black/5 scale-[1.01] lg:scale-[1.02]" 
                    : "border-transparent bg-white/50 hover:bg-white hover:border-slate-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className={`h-12 w-12 lg:h-16 lg:w-16 rounded-[15px] lg:rounded-[20px] flex items-center justify-center ${
                    method === m.id ? "bg-black text-white shadow-lg" : "bg-white text-slate-300 shadow-sm"
                  }`}>
                    <m.icon size={24} className="lg:hidden" />
                    <m.icon size={28} className="hidden lg:block" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-lg lg:text-xl font-black ${method === m.id ? "text-slate-800" : "text-slate-600"}`}>{m.label}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">{m.desc}</p>
                  </div>
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                    method === m.id ? "border-black bg-black shadow-lg" : "border-slate-200"
                  }`}>
                    {method === m.id && <div className="h-2 w-2 bg-white rounded-full" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-6 lg:p-8 bg-slate-100/50 rounded-[25px] lg:rounded-[30px] border border-slate-200 flex items-center gap-6">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-400">
                <ShieldCheck size={20} />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Secured checkout with cloud encryption</p>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="w-full lg:w-[480px] space-y-8">
            <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 lg:p-10 flex flex-col">
              <h2 className="text-2xl font-black text-slate-800 mb-10 tracking-tight">Order Details</h2>
              
              <div className="space-y-6 flex-1 min-h-[200px] lg:min-h-[300px]">
                <div className="flex justify-between items-center group cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-all">
                  <div className="flex items-center gap-4">
                      <div className="h-12 w-12 lg:h-14 lg:w-14 bg-[#EDEDED] rounded-xl lg:rounded-2xl flex items-center justify-center text-2xl lg:text-3xl shadow-inner group-hover:scale-105 transition-transform">🍔</div>
                      <div>
                        <p className="text-[14px] lg:text-[15px] font-black text-slate-800">Classic Beef Burger</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty: 01 • Regular</p>
                      </div>
                  </div>
                  <p className="text-[14px] lg:text-[15px] font-black text-slate-800">Rp. 45,000</p>
                </div>
                <div className="flex justify-between items-center group cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-all">
                  <div className="flex items-center gap-4">
                      <div className="h-12 w-12 lg:h-14 lg:w-14 bg-[#EDEDED] rounded-xl lg:rounded-2xl flex items-center justify-center text-2xl lg:text-3xl shadow-inner group-hover:scale-105 transition-transform">🍹</div>
                      <div>
                        <p className="text-[14px] lg:text-[15px] font-black text-slate-800">Es Cendol Ijo</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty: 01 • Large</p>
                      </div>
                  </div>
                  <p className="text-[14px] lg:text-[15px] font-black text-slate-800">Rp. 20,000</p>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t-2 border-dashed border-slate-100 space-y-5">
                <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-slate-800">Rp. 65,000</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-widest">
                  <span>VAT (11%)</span>
                  <span className="text-slate-800">Rp. 7,150</span>
                </div>
                <div className="flex justify-between items-center pt-8 mt-5 border-t border-slate-100">
                  <span className="text-[18px] font-black text-slate-400 uppercase tracking-[0.2em]">Total</span>
                  <span className="text-4xl font-black text-slate-800 tracking-tighter">Rp. 72,150</span>
                </div>

                <button 
                  onClick={handlePay}
                  className="w-full mt-6 h-[70px] bg-black text-white text-lg font-black rounded-[25px] shadow-2xl shadow-black/20 hover:scale-[1.02] flex items-center justify-center gap-4 transition-all group active:scale-95"
                >
                  Confirm & Pay <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            
            <div className="bg-orange-500 rounded-[30px] p-8 text-white relative overflow-hidden shadow-xl shadow-orange-500/20 group cursor-pointer">
               <div className="relative z-10">
                  <p className="text-xs font-black uppercase tracking-widest opacity-60">Reward Points</p>
                  <p className="text-2xl font-black mt-1">+120 Points earned</p>
               </div>
               <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
