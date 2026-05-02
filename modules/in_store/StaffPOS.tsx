"use client";
import React, { useState, useEffect } from 'react';
import { Search, Pause, ShoppingBag, MoreHorizontal, Plus, Minus, Trash2, CheckCircle2, User, Wallet, CreditCard, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

export default function StaffPOS() {
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number; image: string; size?: string }[]>([]);
  const [activeScreen, setActiveScreen] = useState<'pos' | 'payment' | 'confirmation'>('pos');
  const [loading, setLoading] = useState(true);
  const [orderNo, setOrderNo] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.products.getAll();
        setProducts(data);
        const uniqueCategories = Array.from(new Set(data.map((p: any) => p.category))) as string[];
        setCategories(uniqueCategories);
        if (uniqueCategories.length > 0) setActiveCategory(uniqueCategories[0]);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = products.filter(p => 
    (activeCategory ? p.category === activeCategory : true) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1, 
        image: product.image_url || '/banner-food.png', 
        size: 'Regular' 
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 0; 
  const tax = subtotal * 0.12;
  const total = subtotal - discount + tax;

  const handleCheckout = () => {
    setActiveScreen('payment');
  };

  const completeOrder = async (method: string) => {
    try {
      const orderData = {
        customer_name: "Walk-in Customer",
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_price: total,
        status: "pending",
        payment_method: method,
        type: "dine_in"
      };
      
      const response = await api.orders.create(orderData);
      setOrderNo(response.id || 'CHZ-' + Math.floor(Math.random() * 10000));
      setActiveScreen('confirmation');
    } catch (err) {
      console.error("Failed to create order:", err);
      alert("Failed to complete order. Is the backend running?");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#FDEFDE]">Loading POS System...</div>;

  return (
    <div className="flex h-screen bg-[#FDEFDE] font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR - CATEGORIES */}
      <div className="w-[200px] bg-[#FEFDFA] border-r border-[#737373]/20 flex flex-col shrink-0 relative z-10">
        <div className="p-6 font-bold text-xl tracking-tight text-[#811920]">
          CHEEZIOUS<span className="text-[#FECE04]">.</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full text-left px-4 py-3 rounded-lg text-[14px] font-medium transition-all duration-200 ${
                activeCategory === cat 
                  ? 'bg-[#FECE04] text-[#000000] shadow-sm font-semibold' 
                  : 'text-[#737373] hover:bg-[#FDEFDE] hover:text-[#000000]'
              }`}
            >
              {cat}
            </button>
          ))}
          {categories.length === 0 && <p className="text-xs text-gray-400 p-4">No categories found</p>}
        </div>
        <div className="p-4 border-t border-[#737373]/20">
          <div className="flex items-center gap-3 text-[13px] text-[#737373]">
            <div className="w-8 h-8 rounded-full bg-[#FDEFDE] flex items-center justify-center text-[#811920]">
              <User size={16} />
            </div>
            <div>
              <p className="font-semibold text-[#000000]">Cashier 1</p>
              <p>Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative z-0">
        {/* TOP NAV */}
        <div className="h-[72px] bg-[#FEFDFA] border-b border-[#737373]/20 flex items-center justify-between px-6 shrink-0">
          <div className="relative w-[340px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" size={18} />
            <input 
              type="text" 
              placeholder="Search item..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[#FDEFDE]/50 border border-[#737373]/20 rounded-lg text-[14px] focus:outline-none focus:border-[#FECE04] focus:ring-1 focus:ring-[#FECE04] transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-[#737373] hover:text-[#000000] hover:bg-[#FDEFDE] rounded-lg transition-colors text-[14px] font-medium">
              <Pause size={18} />
              Hold Orders
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-[#737373] hover:text-[#000000] hover:bg-[#FDEFDE] rounded-lg transition-colors text-[14px] font-medium">
              <ShoppingBag size={18} />
              Orders
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-[#737373] hover:text-[#000000] hover:bg-[#FDEFDE] rounded-lg transition-colors text-[14px] font-medium">
              <MoreHorizontal size={18} />
              More
            </button>
          </div>
        </div>

        {/* DYNAMIC SCREENS */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            
            {activeScreen === 'pos' && (
              <motion.div 
                key="pos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute inset-0 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 content-start pb-24"
              >
                {filteredProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="bg-[#FEFDFA] rounded-xl p-4 shadow-sm border border-[#737373]/10 hover:border-[#FECE04] transition-all duration-300 group cursor-pointer flex flex-col h-[220px]"
                    onClick={() => addToCart(product)}
                  >
                    <div className="h-[100px] w-full bg-[#FDEFDE]/50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      <img src={product.image_url || '/banner-food.png'} alt={product.name} className="h-[80%] object-contain group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#000000] text-[15px] leading-tight mb-1">{product.name}</h3>
                      <p className="text-[#000000] font-bold">Rs. {product.price.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button 
                        className="w-8 h-8 bg-[#FECE04] text-[#000000] rounded-lg flex items-center justify-center hover:bg-[#E5B800] transition-colors shadow-sm"
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#737373]">
                    <ShoppingBag size={48} strokeWidth={1} className="mb-4 opacity-20" />
                    <p>No products found in this category.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeScreen === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute inset-0 p-8 flex justify-center items-start overflow-y-auto"
              >
                <div className="bg-[#FEFDFA] rounded-2xl w-[480px] p-8 shadow-sm border border-[#737373]/20">
                  <h2 className="text-2xl font-bold text-[#000000] mb-6">Payment Screen</h2>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="text-[#737373]">Subtotal</span>
                      <span className="font-semibold text-[#000000]">Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="text-[#737373]">Discount</span>
                      <span className="font-semibold text-[#7ED957]">- Rs. {discount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="text-[#737373]">Tax (12%)</span>
                      <span className="font-semibold text-[#000000]">Rs. {tax.toLocaleString()}</span>
                    </div>
                    <div className="pt-4 border-t border-[#737373]/20 flex justify-between items-center text-[18px]">
                      <span className="font-bold text-[#000000]">Total Amount</span>
                      <span className="font-bold text-[#811920]">Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-8">
                    <button onClick={() => completeOrder('cash')} className="flex flex-col items-center justify-center py-3 border border-[#737373]/20 rounded-xl gap-2 text-[#737373] hover:border-[#FECE04] hover:text-[#000000] hover:bg-[#FDEFDE]/50 transition-all">
                      <Banknote size={24} />
                      <span className="text-[13px] font-semibold">Cash</span>
                    </button>
                    <button onClick={() => completeOrder('card')} className="flex flex-col items-center justify-center py-3 border border-[#737373]/20 rounded-xl gap-2 text-[#737373] hover:border-[#FECE04] hover:text-[#000000] hover:bg-[#FDEFDE]/50 transition-all">
                      <CreditCard size={24} />
                      <span className="text-[13px] font-medium">Card</span>
                    </button>
                    <button onClick={() => completeOrder('wallet')} className="flex flex-col items-center justify-center py-3 border border-[#737373]/20 rounded-xl gap-2 text-[#737373] hover:border-[#FECE04] hover:text-[#000000] hover:bg-[#FDEFDE]/50 transition-all">
                      <Wallet size={24} />
                      <span className="text-[13px] font-medium">Wallet</span>
                    </button>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setActiveScreen('pos')}
                      className="flex-1 py-4 text-[#000000] border border-[#737373]/20 rounded-xl font-bold hover:bg-[#FDEFDE] transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeScreen === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 p-8 flex justify-center items-center"
              >
                <div className="bg-[#FEFDFA] rounded-2xl w-[480px] p-10 shadow-sm border border-[#737373]/20 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#FECE04] rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={32} className="text-[#000000]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#811920] mb-2">Order Placed Successfully!</h2>
                  <p className="text-[#737373] mb-6">Order ID: <span className="font-bold text-[#000000]">#{orderNo}</span></p>
                  
                  <div className="w-full bg-[#FDEFDE]/50 rounded-xl p-4 mb-8">
                    <p className="text-[#000000] font-medium mb-4">Dine-in • Walk-in</p>
                    <div className="flex justify-between items-center text-[15px] mb-2">
                      <span className="text-[#737373]">Paid Amount</span>
                      <span className="font-bold text-[#000000]">Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 w-full">
                    <button 
                      onClick={() => { setCart([]); setActiveScreen('pos'); }}
                      className="py-3 bg-[#FECE04] rounded-xl font-bold text-[#000000] hover:bg-[#E5B800] transition-colors"
                    >
                      New Order
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT SIDEBAR - CART */}
      <div className="w-[340px] bg-[#FEFDFA] border-l border-[#737373]/20 flex flex-col shrink-0 z-10">
        <div className="p-5 border-b border-[#737373]/20 flex justify-between items-center">
          <h2 className="font-bold text-[18px] text-[#000000]">Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</h2>
          <button 
            onClick={() => setCart([])}
            className="text-[13px] text-[#811920] font-medium hover:underline"
          >
            Clear
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-3 relative"
              >
                <div className="w-14 h-14 bg-[#FDEFDE]/50 rounded-lg flex items-center justify-center shrink-0">
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#000000] text-[14px] truncate pr-6">{item.name}</h4>
                  <p className="text-[12px] text-[#737373] mb-1">{item.size || 'Regular'}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="font-bold text-[#000000] text-[14px]">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    
                    <div className="flex items-center gap-3 bg-[#FDEFDE]/50 rounded-lg px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-[#737373] hover:text-[#811920] transition-colors"
                      >
                        {item.quantity <= 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                      </button>
                      <span className="text-[13px] font-bold text-[#000000] w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-[#737373] hover:text-[#7ED957] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-[#737373] opacity-50 space-y-3">
              <ShoppingBag size={48} strokeWidth={1} />
              <p>Cart is empty</p>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-[#737373]/20 bg-[#FEFDFA] shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            <div className="space-y-2 mb-4 text-[14px]">
              <div className="flex justify-between text-[#737373]">
                <span>Subtotal</span>
                <span className="font-medium text-[#000000]">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#737373]">
                <span>Discount</span>
                <span className="font-medium text-[#7ED957]">- Rs. {discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#737373]">
                <span>Tax (12%)</span>
                <span className="font-medium text-[#000000]">Rs. {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#737373]/20 mt-3 text-[16px]">
                <span className="font-bold text-[#000000]">Total</span>
                <span className="font-bold text-[#811920]">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 border border-[#737373]/30 rounded-xl text-[#000000] font-medium hover:bg-[#FDEFDE] transition-colors text-[14px]">
                Hold Order
              </button>
              <button 
                onClick={handleCheckout}
                className="py-3 bg-[#FECE04] rounded-xl text-[#000000] font-bold hover:bg-[#E5B800] transition-colors text-[14px] shadow-sm"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
