'use client';

import { Search, Pause, ShoppingBag, MoreHorizontal, Tags } from 'lucide-react';
import { useCashierStore } from '../store/useCashierStore';

export default function TopNavigation() {
  const { searchQuery, setSearchQuery, setActiveScreen } = useCashierStore();

  return (
    <div className="h-[72px] bg-[#FEFDFA] border-b border-[#737373]/20 flex items-center justify-between px-6 shrink-0 z-10">
      <div className="relative w-[340px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" size={18} />
        <input 
          type="text" 
          placeholder="Search items... (Ctrl+F)" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-4 bg-[#FDEFDE]/50 border border-[#737373]/20 rounded-xl text-[14px] focus:outline-none focus:border-[#FECE04] focus:ring-1 focus:ring-[#FECE04] transition-all"
        />
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => setActiveScreen('hold')}
          className="flex flex-col items-center justify-center w-16 h-12 text-[#737373] hover:text-[#000000] hover:bg-[#FDEFDE] rounded-lg transition-colors"
        >
          <Pause size={18} className="mb-1 text-[#811920]" />
          <span className="text-[10px] font-bold leading-none">Hold Orders</span>
        </button>
        <button 
          onClick={() => setActiveScreen('history')}
          className="flex flex-col items-center justify-center w-16 h-12 text-[#737373] hover:text-[#000000] hover:bg-[#FDEFDE] rounded-lg transition-colors"
        >
          <ShoppingBag size={18} className="mb-1 text-[#FECE04]" />
          <span className="text-[10px] font-bold leading-none">Orders</span>
        </button>
        <button 
          onClick={() => setActiveScreen('discounts')}
          className="flex flex-col items-center justify-center w-16 h-12 text-[#737373] hover:text-[#000000] hover:bg-[#FDEFDE] rounded-lg transition-colors"
        >
          <Tags size={18} className="mb-1 text-[#7ED957]" />
          <span className="text-[10px] font-bold leading-none">Promos</span>
        </button>
        <button 
          className="flex flex-col items-center justify-center w-16 h-12 text-[#737373] hover:text-[#000000] hover:bg-[#FDEFDE] rounded-lg transition-colors"
        >
          <MoreHorizontal size={18} className="mb-1" />
          <span className="text-[10px] font-bold leading-none">More</span>
        </button>
      </div>
    </div>
  );
}
