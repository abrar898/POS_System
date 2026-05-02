import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useCashierStore } from '../store/useCashierStore';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

export default function ProductGrid() {
  const { activeCategory, searchQuery, addToCart } = useCashierStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.products.getAll();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="absolute inset-0 flex items-center justify-center bg-[#FDEFDE]"><Loader2 className="animate-spin text-[#811920]" size={40} /></div>;
  
  const filteredProducts = products.filter(p => 
    (activeCategory === 'All' || !activeCategory ? true : p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      key="pos"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute inset-0 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 content-start pb-24"
    >
      {filteredProducts.map(product => (
        <div 
          key={product.id || product._id} 
          className="bg-[#FEFDFA] rounded-2xl p-4 shadow-sm border border-[#737373]/10 hover:border-[#FECE04] hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col h-[220px]"
          onClick={() => addToCart({ ...product, id: product.id || product._id, image: product.image_url || product.image })}
        >
          <div className="h-[100px] w-full bg-[#FDEFDE]/50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
            <img src={product.image_url || product.image || '/banner-food.png'} alt={product.name} className="h-[80%] object-contain group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#000000] text-[15px] leading-tight mb-1 group-hover:text-[#811920] transition-colors">{product.name}</h3>
            <p className="text-[#000000] font-extrabold text-[15px]">Rs. {product.price.toLocaleString()}</p>
          </div>
          <div className="flex justify-end mt-2">
            <button 
              className="w-8 h-8 bg-[#FECE04]/20 text-[#FECE04] group-hover:bg-[#FECE04] group-hover:text-[#000000] rounded-lg flex items-center justify-center transition-colors shadow-sm"
              onClick={(e) => { e.stopPropagation(); addToCart({ ...product, id: product.id || product._id, image: product.image_url || product.image }); }}
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      ))}
      {filteredProducts.length === 0 && (
        <div className="col-span-full h-40 flex items-center justify-center text-[#737373] font-medium">
          No items found in {activeCategory}.
        </div>
      )}
    </motion.div>
  );
}
