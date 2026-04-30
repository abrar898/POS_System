'use client';

import { useCashierStore } from '../store/useCashierStore';

const CATEGORIES = [
  'Pizzas', 'Burgers', 'Sandwiches', 'Sides', 'Drinks', 'Desserts', 'Combos'
];

export default function SidebarCategories() {
  const { activeCategory, setActiveCategory } = useCashierStore();

  return (
    <div className="w-[220px] bg-[#FEFDFA] border-r border-[#737373]/20 flex flex-col shrink-0 z-10">
      <div className="p-6 pb-2">
        <img src="/cheezious_logo.jpeg" alt="Cheezious Logo" className="h-8 w-auto object-contain rounded-md mb-6" />
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`w-full text-left px-4 py-3.5 rounded-xl text-[15px] transition-all duration-200 ${
              activeCategory === cat 
                ? 'bg-[#FECE04] text-[#000000] shadow-sm font-bold' 
                : 'text-[#737373] font-semibold hover:bg-[#FDEFDE] hover:text-[#000000]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
