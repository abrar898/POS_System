'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useCashierStore } from '../store/useCashierStore';
import { useState } from 'react';

export default function DiscountsPromos() {
  const { setActiveScreen, setDiscount } = useCashierStore();
  const [tab, setTab] = useState('Discount');
  const [type, setType] = useState('Flat Discount');
  const [amount, setAmount] = useState('0');

  const handleApply = () => {
    setDiscount(parseInt(amount) || 0);
    setActiveScreen('pos');
  };

  const handleClear = () => {
    setDiscount(0);
    setAmount('0');
    setActiveScreen('pos');
  };

  return (
    <motion.div
      key="discounts"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute inset-0 p-8 flex flex-col items-center overflow-y-auto bg-[#FDEFDE]"
    >
      <div className="bg-[#FEFDFA] rounded-3xl w-full max-w-md p-8 shadow-sm border border-[#737373]/20">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setActiveScreen('pos')}
            className="p-2 bg-[#FDEFDE] rounded-full text-[#811920] hover:bg-[#811920] hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-extrabold text-[#000000]">Discount & Promos</h2>
        </div>

        <div className="flex gap-2 mb-6 bg-[#FDEFDE]/50 p-2 rounded-2xl">
          {['Discount', 'Promo Code'].map(t => (
            <button 
              key={t} 
              onClick={() => setTab(t)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === t ? 'bg-[#FECE04] text-black shadow-sm' : 'text-[#737373] hover:text-black'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Discount' && (
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setType('Flat Discount')}
                className={`py-3 rounded-xl font-bold border-2 transition-all ${type === 'Flat Discount' ? 'border-[#FECE04] bg-[#FECE04]/10 text-black' : 'border-[#737373]/20 text-[#737373]'}`}
              >
                Flat Discount
              </button>
              <button 
                onClick={() => setType('Percentage')}
                className={`py-3 rounded-xl font-bold border-2 transition-all ${type === 'Percentage' ? 'border-[#FECE04] bg-[#FECE04]/10 text-black' : 'border-[#737373]/20 text-[#737373]'}`}
              >
                Percentage
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#000000] mb-2">Discount Name</label>
              <input type="text" placeholder="e.g. Student Discount" className="w-full h-12 px-4 border-2 border-[#737373]/20 rounded-xl outline-none focus:border-[#FECE04] transition-colors bg-white" />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#000000] mb-2">Discount Amount (Rs.)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-12 px-4 border-2 border-[#737373]/20 rounded-xl outline-none focus:border-[#FECE04] transition-colors bg-white font-extrabold text-lg" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#000000] mb-3">Apply to Order</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="apply" defaultChecked className="w-5 h-5 accent-[#FECE04]" />
                  <span className="font-medium">Entire Order</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[#737373]">
                  <input type="radio" name="apply" className="w-5 h-5 accent-[#FECE04]" />
                  <span className="font-medium">Specific Items</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {tab === 'Promo Code' && (
          <div className="space-y-6 mb-8 min-h-[280px]">
            <div>
              <label className="block text-sm font-bold text-[#000000] mb-2">Enter Promo Code</label>
              <div className="flex gap-2">
                <input type="text" placeholder="e.g. SUMMER20" className="flex-1 h-12 px-4 border-2 border-[#737373]/20 rounded-xl outline-none focus:border-[#FECE04] transition-colors bg-white uppercase font-bold" />
                <button className="px-6 bg-[#FECE04] text-black font-bold rounded-xl hover:bg-[#E5B800]">Apply</button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleApply}
            className="w-full py-4 bg-[#811920] hover:bg-[#6a151a] text-white font-extrabold rounded-xl transition-all shadow-md"
          >
            Apply Discount
          </button>
          <button 
            onClick={handleClear}
            className="w-full py-4 bg-[#FECE04] hover:bg-[#E5B800] text-black font-extrabold rounded-xl transition-all shadow-sm"
          >
            Clear Discount
          </button>
        </div>
      </div>
    </motion.div>
  );
}
