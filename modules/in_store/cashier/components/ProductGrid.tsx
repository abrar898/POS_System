'use client';

import { Plus } from 'lucide-react';
import { useCashierStore } from '../store/useCashierStore';
import { motion } from 'framer-motion';

const PRODUCTS = [
  { id: 'p1', name: 'Crown Crust Pizza', price: 1499, category: 'Pizzas', image: '/banner-food.png' },
  { id: 'p2', name: 'Zinger Burger', price: 749, category: 'Burgers', image: '/banner-food.png' },
  { id: 'p3', name: 'Loaded Fries', price: 499, category: 'Sides', image: '/banner-food.png' },
  { id: 'p4', name: 'Malai Boti Pizza', price: 1299, category: 'Pizzas', image: '/banner-food.png' },
  { id: 'p5', name: 'Club Sandwich', price: 499, category: 'Sandwiches', image: '/banner-food.png' },
  { id: 'p6', name: 'Cheesy Fries', price: 399, category: 'Sides', image: '/banner-food.png' },
  { id: 'p7', name: 'Chicken Wings (6pc)', price: 399, category: 'Sides', image: '/banner-food.png' },
  { id: 'p8', name: 'Pasta Alfredo', price: 699, category: 'Sides', image: '/banner-food.png' },
  { id: 'p9', name: 'Chocolate Lava Cake', price: 399, category: 'Desserts', image: '/banner-food.png' },
];

export default function ProductGrid() {
  const { activeCategory, searchQuery, addToCart } = useCashierStore();

  const filteredProducts = PRODUCTS.filter(p => 
    (activeCategory ? p.category === activeCategory : true) &&
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
          key={product.id} 
          className="bg-[#FEFDFA] rounded-2xl p-4 shadow-sm border border-[#737373]/10 hover:border-[#FECE04] hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col h-[220px]"
          onClick={() => addToCart(product)}
        >
          <div className="h-[100px] w-full bg-[#FDEFDE]/50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
            <img src={product.image} alt={product.name} className="h-[80%] object-contain group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#000000] text-[15px] leading-tight mb-1 group-hover:text-[#811920] transition-colors">{product.name}</h3>
            <p className="text-[#000000] font-extrabold text-[15px]">Rs. {product.price.toLocaleString()}</p>
          </div>
          <div className="flex justify-end mt-2">
            <button 
              className="w-8 h-8 bg-[#FECE04]/20 text-[#FECE04] group-hover:bg-[#FECE04] group-hover:text-[#000000] rounded-lg flex items-center justify-center transition-colors shadow-sm"
              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      ))}
      {filteredProducts.length === 0 && (
        <div className="col-span-full h-40 flex items-center justify-center text-[#737373] font-medium">
          No items found.
        </div>
      )}
    </motion.div>
  );
}
