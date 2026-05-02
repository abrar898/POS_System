'use client';

import { useState, useEffect } from 'react';
import { useKDSStore } from '../store/useKDSStore';
import { Clock, Timer, FileText } from 'lucide-react';

export default function CompletedSidebar() {
  const { orders } = useKDSStore();

  // Dynamic Stats from store
  const totalOrders = orders.length;
  const newOrders = orders.filter(o => o.status === 'pending').length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;
  const readyOrders = orders.filter(o => o.status === 'ready').length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;

  // Timer logic
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsActive(true);
  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const [note, setNote] = useState('');

  return (
    <div className="w-[320px] bg-[#FEFDFA] border-l border-black/10 flex flex-col shrink-0 z-10 p-5 space-y-4 overflow-y-auto no-scrollbar">
      <h2 className="font-extrabold text-[16px] text-black mb-2 tracking-tight">
        ORDER SUMMARY
      </h2>

      {/* Summary Card */}
      <div className="bg-[#FEFDFA] border border-black rounded-[24px] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-black">
          <div className="text-[36px] font-bold leading-none text-black">{totalOrders}</div>
          <div className="text-[13px] text-[#737373] mt-1 font-semibold">Total Orders</div>
        </div>
        <div className="grid grid-cols-2">
          <div className="p-4 border-r border-b border-black">
            <div className="text-[28px] font-bold text-[#FECE04] leading-none">{newOrders}</div>
            <div className="text-[13px] text-[#FECE04] mt-1 font-bold">New</div>
          </div>
          <div className="p-4 border-b border-black">
            <div className="text-[28px] font-bold text-[#E67E22] leading-none">{preparingOrders}</div>
            <div className="text-[13px] text-[#E67E22] mt-1 font-bold">Preparing</div>
          </div>
          <div className="p-4 border-r border-black">
            <div className="text-[28px] font-bold text-[#7ED957] leading-none">{readyOrders}</div>
            <div className="text-[13px] text-[#7ED957] mt-1 font-bold">Ready</div>
          </div>
          <div className="p-4">
            <div className="text-[28px] font-bold text-[#737373] leading-none">{completedOrders}</div>
            <div className="text-[13px] text-[#737373] mt-1 font-bold">Completed</div>
          </div>
        </div>
      </div>

      {/* Average Prep Time */}
      <div className="bg-[#FEFDFA] border border-black rounded-[24px] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={18} className="text-black" />
          <span className="text-[11px] font-black uppercase tracking-wider text-black">AVERAGE PREP TIME</span>
        </div>
        <div className="text-[32px] font-bold leading-none text-black">07:45 min</div>
        <div className="text-[12px] text-[#737373] mt-2 font-medium">Todays average prep time</div>
      </div>

      {/* Kitchen Timer */}
      <div className="bg-[#FEFDFA] border border-black rounded-[24px] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Timer size={18} className="text-black" />
          <span className="text-[11px] font-black uppercase tracking-wider text-black">KITCHEN TIMER</span>
        </div>
        <div className="text-[44px] font-bold leading-none text-black mb-4">{formatTime(seconds)}</div>
        <div className="flex gap-2">
          <button
            onClick={handleStart}
            className="flex-1 bg-[#FECE04] text-black font-bold py-2.5 rounded-xl text-[14px] border border-black transition-transform active:scale-95 shadow-sm"
          >
            Start
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-[#737373] text-white font-bold py-2.5 rounded-xl text-[14px] border border-black transition-transform active:scale-95 shadow-sm"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-[#FEFDFA] border border-black rounded-[24px] p-5 shadow-sm flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={18} className="text-black" />
          <span className="text-[11px] font-black uppercase tracking-wider text-black">NOTES</span>
        </div>
        <div className="relative">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add kitchen note..."
            className="w-full h-24 bg-[#FEFDFA] border border-black rounded-[18px] p-3 text-[13px] font-medium placeholder:text-[#737373]/50 focus:outline-none focus:ring-1 focus:ring-[#FECE04] transition-all resize-none no-scrollbar"
          />
          {note && (
            <button
              onClick={() => {
                // Here we could add logic to actually save the note to a persistent store or broadcast it
                console.log('Note added:', note);
                setNote('');
              }}
              className="absolute bottom-2 right-2 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full hover:bg-[#FECE04] hover:text-black transition-colors"
            >
              ADD
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
