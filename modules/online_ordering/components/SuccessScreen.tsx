import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface SuccessScreenProps {
  orderId: string;
}

export function SuccessScreen({ orderId }: SuccessScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-in zoom-in fade-in duration-700 relative min-h-[80vh]">
       <div className="relative mb-6 md:mb-8">
         <div className="w-20 h-20 md:w-24 md:h-24 bg-[#FECE04] rounded-full flex items-center justify-center shadow-xl shadow-yellow-100 relative z-10">
           <CheckCircle2 size={40} className="text-white md:w-12 md:h-12" />
         </div>
         <div className="absolute -top-4 -left-8 w-4 h-4 bg-red-400 rounded-sm rotate-12" />
         <div className="absolute top-10 -left-12 w-3 h-3 bg-blue-400 rounded-full" />
         <div className="absolute -bottom-2 -left-6 w-4 h-2 bg-yellow-400 rounded-full rotate-45" />
         <div className="absolute -top-6 right-0 w-3 h-3 bg-purple-400 rounded-sm -rotate-12" />
         <div className="absolute top-8 -right-10 w-4 h-4 bg-green-400 rounded-full" />
         <div className="absolute bottom-0 -right-8 w-3 h-3 bg-pink-400 rounded-full rotate-12" />
       </div>
       <h1 className="text-3xl md:text-5xl font-black text-[#811920] mb-4 text-center">Order Placed Successfully!</h1>
       <p className="text-base md:text-lg font-bold text-gray-500 mb-8 md:mb-12 text-center max-w-[500px]">Thank you! Your order has been placed and our chef is cooking up some magic.</p>
       <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 border-2 border-[#FECE04]/20 shadow-2xl shadow-yellow-50/50 flex flex-col items-center gap-4 md:gap-6 mb-8 md:mb-12 w-full max-w-[320px] md:min-w-[320px]">
          <div className="text-center"><p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 md:mb-2">Order Number</p><p className="text-2xl md:text-3xl font-black text-[#811920]">{orderId}</p></div>
          <div className="w-full h-px bg-gray-100" />
          <div className="text-center"><p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 md:mb-2">Estimated Delivery Time</p><p className="text-2xl md:text-3xl font-black text-gray-900">30-40 min</p></div>
       </div>
       <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[400px]">
          <Link href={`/orders/${orderId.replace('#','')}/track`} className="flex-1 text-center bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-4 rounded-2xl shadow-lg shadow-yellow-100 transition-all hover:-translate-y-1 active:translate-y-0 text-sm md:text-base">Track Order</Link>
          <Link href="/home" className="flex-1 text-center bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-900 font-black py-4 rounded-2xl transition-all text-sm md:text-base">Back to Home</Link>
       </div>
       <div className="absolute bottom-0 left-0 right-0 h-[150px] md:h-[250px] pointer-events-none -z-10 opacity-80 overflow-hidden">
          <div className="relative w-full h-full flex flex-col items-center justify-end">
            <div className="w-full flex justify-center mb-4"><img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=200&h=200&fit=crop" alt="Delivery Rider" className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full border-4 md:border-8 border-white shadow-2xl" /></div>
            <div className="w-full h-16 md:h-24 flex items-end gap-1 md:gap-2 px-4 md:px-10">{[40, 60, 45, 80, 55, 70, 90, 65, 50, 75].map((h, i) => (<div key={i} className="flex-1 bg-gray-50 rounded-t-lg" style={{ height: `${h}%` }} />))}</div>
          </div>
       </div>
    </div>
  );
}
