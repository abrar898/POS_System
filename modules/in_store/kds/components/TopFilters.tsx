'use client';

import { useKDSStore } from '../store/useKDSStore';
import { ChefHat } from 'lucide-react';

export default function TopFilters() {
  const { activeFilter, setActiveFilter, orders } = useKDSStore();

  const counts = {
    all: orders.filter(o => o.status !== 'delivered').length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
  };

  const filters = [
    { id: 'all', label: 'All', count: counts.all, color: 'bg-[#FECE04]' },
    { id: 'pending', label: 'New', count: counts.pending, color: 'bg-[#811920] text-white' },
    { id: 'preparing', label: 'Preparing', count: counts.preparing, color: 'bg-[#F28C28] text-white' },
    { id: 'ready', label: 'Ready', count: counts.ready, color: 'bg-[#7ED957] text-white' },
  ];

  return (
    <div className="h-[72px] bg-[#FEFDFA] border-b border-[#737373]/20 flex items-center justify-between px-8 shrink-0 z-10">
      <div className="flex items-center gap-3">
        <img src="/cheezious_logo.jpeg" alt="Cheezious Logo" className="h-8 w-auto object-contain rounded-md" />
        <h2 className="font-extrabold text-[#000000] text-xl tracking-tight">
          KITCHEN DISPLAY
        </h2>
      </div>

      <div className="flex gap-3">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[14px] transition-all ${
              activeFilter === f.id 
                ? f.color + ' shadow-md scale-105'
                : 'bg-[#FDEFDE] text-[#737373] hover:bg-[#FECE04]/20 hover:text-black'
            }`}
          >
            <span>{f.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeFilter === f.id ? 'bg-white/20' : 'bg-white'}`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
