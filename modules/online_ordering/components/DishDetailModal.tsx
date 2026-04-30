import React from "react";
import { X, Star } from "lucide-react";

interface DishDetailModalProps {
  selectedDish: any;
  setSelectedDish: (dish: any) => void;
  activeVariation: number;
  setActiveVariation: (idx: number) => void;
  addToCart: (dish: any, variationIdx?: number) => void;
}

export function DishDetailModal({
  selectedDish,
  setSelectedDish,
  activeVariation,
  setActiveVariation,
  addToCart
}: DishDetailModalProps) {
  if (!selectedDish) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedDish(null)} />
      <div className="bg-white rounded-[24px] md:rounded-[40px] w-full max-w-[850px] max-h-[90vh] relative overflow-y-auto md:overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in duration-300">
        <button onClick={() => setSelectedDish(null)} className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-gray-500 hover:text-black transition-colors"><X size={20} /></button>
        <div className="w-full md:w-1/2 relative bg-gray-50 flex items-center justify-center p-6 md:p-8 shrink-0">
          <div className="relative w-full aspect-square max-w-[300px] md:max-w-none">
            <img src={selectedDish.image} alt={selectedDish.name} className="w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          <div className="mb-4 md:mb-6"><h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-1 md:mb-2">{selectedDish.name}</h2><div className="flex items-center gap-2"><Star size={16} className="fill-[#FECE04] text-[#FECE04] md:w-5 md:h-5" /><span className="text-base md:text-lg font-black text-gray-700">{selectedDish.rating}</span></div></div>
          <p className="text-sm md:text-base text-gray-500 font-medium mb-6 md:mb-8 leading-relaxed">{selectedDish.description}</p>
          <div className="mb-6 md:mb-8"><span className="text-[#811920] font-black text-base md:text-lg">Starting Price Rs {selectedDish.price}</span></div>
          {selectedDish.variations && (
            <div className="mb-8 md:mb-10">
              <p className="text-[10px] md:text-sm font-black text-gray-900 uppercase tracking-widest mb-3 md:mb-4">Choose your variation</p>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {selectedDish.variations.map((v: any, i: number) => (
                  <button key={v.name} onClick={() => setActiveVariation(i)} className={`flex flex-col items-center justify-center py-3 md:py-4 rounded-xl md:rounded-2xl border-2 transition-all ${activeVariation === i ? "border-[#811920] bg-[#811920]/5" : "border-gray-100 hover:border-gray-200"}`}>
                    <span className={`text-[10px] md:text-sm font-black ${activeVariation === i ? "text-[#811920]" : "text-gray-900"}`}>{v.name}</span>
                    <span className="text-[8px] md:text-[11px] font-bold text-gray-400">Rs {v.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <button 
            onClick={() => {
              addToCart(selectedDish, activeVariation);
              setSelectedDish(null);
            }} 
            className="w-full bg-[#FECE04] hover:bg-[#E5B800] text-black font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl shadow-xl shadow-yellow-100 transition-all hover:-translate-y-1 active:translate-y-0 text-base md:text-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
