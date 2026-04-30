import React from "react";
import { Plus } from "lucide-react";
import { DEALS } from "../constants";

interface DealsScreenProps {
  addToCart: (dish: any) => void;
}

export function DealsScreen({ addToCart }: DealsScreenProps) {
  return (
    <div className="animate-in fade-in duration-500">
       <div className="w-full bg-[#FECE04] h-[200px] md:h-[300px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="flex flex-col items-center gap-2 md:gap-4 relative z-10">
            <div className="flex items-center gap-3 md:gap-4">
              <img src="/cheezious_logo.jpeg" alt="Cheezious Logo" className="h-16 md:h-24 w-auto object-contain rounded-xl shadow-2xl" />
            </div>
            <p className="text-[10px] md:text-xl font-black text-[#811920]/70 tracking-[0.1em] md:tracking-[0.2em] uppercase">spreading cheezy khushiyan</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 md:h-20 bg-white rounded-t-[50px] md:rounded-t-[100px]" />
       </div>
       <div className="p-6 md:p-12 max-w-[1200px] mx-auto">
          <h2 className="text-2xl md:text-4xl font-black text-[#811920] mb-8 md:mb-12">Deals & Offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
             {DEALS.map(deal => (
               <div key={deal.id} className="bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-5 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-[#FECE04]/30 transition-all group cursor-pointer">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 md:mb-6"><img src={deal.image} alt={deal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
                  <div className="flex justify-between items-end"><div><h3 className="font-black text-gray-900 text-base md:text-lg leading-tight mb-1">{deal.name}</h3><p className="text-xs md:text-sm font-bold text-[#811920]">Rs {deal.price}</p></div><button onClick={() => addToCart({ ...deal, category: 'deals' })} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#811920] flex items-center justify-center text-white shadow-lg shadow-maroon/10 hover:scale-110 transition-transform"><Plus size={18} /></button></div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
}
