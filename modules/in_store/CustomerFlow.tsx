'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, CheckCircle2, ChevronLeft, CreditCard, Banknote, Wallet, Phone, ShoppingBag, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

type Step = 'welcome' | 'menu' | 'customize' | 'cart' | 'addons' | 'details' | 'payment' | 'confirmed';

const CATEGORIES = ['Pizzas', 'Burgers', 'Sides', 'Drinks', 'Deals'];

export default function CustomerFlow() {
  const [step, setStep] = useState<Step>('welcome');
  const [activeCategory, setActiveCategory] = useState('Pizzas');
  
  // Data State
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Customization State
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [size, setSize] = useState('Regular');
  const [crust, setCrust] = useState('Crown Crust');
  const [extras, setExtras] = useState<string[]>([]);
  const [itemQty, setItemQty] = useState(1);
  
  // Cart State
  const [cart, setCart] = useState<any[]>([]);
  
  // Details State
  const [orderType, setOrderType] = useState('Dine-in');
  const [tableNo, setTableNo] = useState(12);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [orderId, setOrderId] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.products.getAll();
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const slideVariants = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  const handleAddToCart = () => {
    const newItem = {
      ...selectedItem,
      cartId: Math.random().toString(),
      size,
      crust,
      extras,
      quantity: itemQty,
      finalPrice: selectedItem.price + (size === 'Large' ? 500 : size === 'Family' ? 1000 : 0) + (extras.length * 100)
    };
    setCart([...cart, newItem]);
    setStep('menu');
  };

  const updateCartQty = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeCartItem = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const orderData = {
        customer_name: "In-Store Customer",
        table_number: orderType === 'Dine-in' ? tableNo.toString() : "Takeaway",
        items: cart.map(item => ({
          product_id: item.id || item._id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.finalPrice
        })),
        total_price: total,
        status: "pending",
        payment_method: paymentMethod,
        type: orderType.toLowerCase()
      };
      
      const response = await api.orders.create(orderData);
      const rawId = response.id || response._id || "";
      const newOrderId = rawId || `#CHZ-${Math.floor(10000 + Math.random() * 90000)}`;
      
      setOrderId(newOrderId);
      setStep('confirmed');
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#FDEFDE] font-sans">
      <div className="w-full h-screen overflow-hidden relative flex flex-col">
        
        {/* HEADER FOR WEB VIEW */}
        <header className="h-[72px] bg-white border-b border-[#737373]/10 flex items-center justify-between px-8 shrink-0 z-20">
          <div className="flex items-center gap-2">
            <img src="/cheezious_logo.jpeg" alt="Cheezious Logo" className="h-10 w-auto object-contain rounded-lg" />
            <span className="ml-4 text-sm font-semibold text-[#737373] bg-[#FDEFDE] px-3 py-1 rounded-full">In-Store Ordering</span>
          </div>
          <div className="flex items-center gap-4">
            {step !== 'welcome' && (
              <button 
                onClick={() => setCart([])}
                className="text-sm font-semibold text-[#811920] hover:underline"
              >
                Start Over
              </button>
            )}
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-white border border-[#737373]/20 rounded-lg text-sm font-bold text-black hover:border-[#FECE04]">English</button>
              <button className="px-3 py-1.5 bg-[#FDEFDE] border border-[#737373]/20 rounded-lg text-sm font-bold text-[#737373] font-arabic hover:text-black">اردو</button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            
            {/* 1. WELCOME SCREEN */}
            {step === 'welcome' && (
              <motion.div 
                key="welcome"
                className="absolute inset-0 bg-[#FDEFDE] flex items-center justify-center p-8 lg:p-24"
                variants={slideVariants} initial="initial" animate="animate" exit="exit"
              >
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8">
                    <h2 className="text-6xl xl:text-7xl font-extrabold text-[#000000] leading-tight">
                      Craving<br/><span className="text-[#811920]">Something</span><br/>Cheezy?
                    </h2>
                    <p className="text-[#737373] text-xl font-medium max-w-md">
                      Experience the best taste in town. Tap below to start customizing your meal.
                    </p>
                    <button 
                      onClick={() => setStep('menu')}
                      className="px-12 py-5 bg-[#FECE04] text-[#000000] hover:bg-[#E5B800] rounded-2xl font-bold text-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      Start Order
                    </button>
                  </div>
                  <div className="relative h-[400px] lg:h-[600px] w-full flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#FECE04]/20 rounded-full blur-3xl scale-90"></div>
                    <img src="/banner-food.png" alt="Burger" className="relative z-10 h-full object-contain drop-shadow-2xl" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. MENU BROWSING */}
            {step === 'menu' && (
              <motion.div 
                key="menu"
                className="absolute inset-0 bg-[#FEFDFA] flex"
                variants={slideVariants} initial="initial" animate="animate" exit="exit"
              >
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="p-8 pb-4 bg-white z-10 shrink-0">
                    <div className="max-w-7xl mx-auto flex gap-6 items-center">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373]" size={20} />
                        <input type="text" placeholder="Search your favorite..." className="w-full bg-[#FDEFDE]/30 py-3.5 pl-12 pr-4 rounded-xl text-base outline-none border border-[#737373]/20 focus:border-[#FECE04] transition-colors" />
                      </div>
                      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                        {CATEGORIES.map(cat => (
                          <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-full whitespace-nowrap text-[15px] font-semibold transition-all ${
                              activeCategory === cat ? 'bg-[#FECE04] text-[#000000] shadow-sm' : 'bg-white border border-[#737373]/20 text-[#737373] hover:border-[#FECE04] hover:text-black'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 pt-4">
                    <div className="max-w-7xl mx-auto">
                      <div className="flex justify-between items-end mb-6">
                        <h3 className="font-bold text-2xl flex items-center gap-2">🔥 Bestsellers</h3>
                        <button className="text-base text-[#811920] font-bold hover:underline">View All</button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-32">
                        {loading ? (
                          <div className="col-span-full flex justify-center items-center py-20">
                            <Loader2 size={40} className="animate-spin text-[#811920]" />
                          </div>
                        ) : (
                          products.filter(p => activeCategory === 'Pizzas' ? true : p.category?.toLowerCase() === activeCategory.toLowerCase()).map(item => (
                            <div 
                              key={item.id || item._id} 
                              onClick={() => { setSelectedItem({ ...item, id: item.id || item._id }); setStep('customize'); }}
                              className="bg-white p-5 rounded-2xl border border-[#737373]/10 shadow-sm flex flex-col cursor-pointer hover:border-[#FECE04] hover:shadow-md transition-all group h-[280px]"
                            >
                              <div className="h-[120px] w-full bg-[#FDEFDE]/40 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                                <img src={item.image_url || item.image || '/banner-food.png'} alt={item.name} className="h-[90%] object-contain group-hover:scale-110 transition-transform duration-300" />
                              </div>
                              <h4 className="font-bold text-lg leading-tight mb-1 group-hover:text-[#811920] transition-colors">{item.name}</h4>
                              <p className="text-sm text-[#737373] line-clamp-2 mb-3">{item.description || item.desc}</p>
                              <div className="mt-auto flex justify-between items-center">
                                <span className="font-extrabold text-lg">Rs. {item.price}</span>
                                <button className="w-10 h-10 bg-[#FECE04] rounded-xl flex items-center justify-center text-black shadow-sm group-hover:bg-[#E5B800]">
                                  <Plus size={20} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Persistent Sidebar Cart on Desktop when there are items, or a bottom banner if preferred. Let's use a sidebar for better web view */}
                {cart.length > 0 && (
                  <div className="w-[380px] bg-white border-l border-[#737373]/10 shadow-2xl flex flex-col shrink-0 z-20">
                    <div className="p-6 border-b border-[#737373]/10">
                      <h2 className="font-bold text-xl flex items-center gap-2">
                        <ShoppingBag className="text-[#811920]" /> 
                        Your Cart ({cart.length})
                      </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {cart.map(item => (
                        <div key={item.cartId} className="flex gap-4">
                          <div className="w-16 h-16 bg-[#FDEFDE]/50 rounded-xl flex items-center justify-center shrink-0">
                            <img src={item.image} alt={item.name} className="w-12 object-contain" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-[15px]">{item.name}</h4>
                            <p className="text-xs text-[#737373] mb-2">{item.size} • {item.crust}</p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold">Rs. {item.finalPrice * item.quantity}</span>
                              <div className="flex items-center gap-3 bg-white border border-[#737373]/20 rounded-lg px-2 py-1">
                                <button onClick={() => updateCartQty(item.cartId, -1)} className="text-[#737373] hover:text-[#811920]"><Minus size={14} /></button>
                                <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateCartQty(item.cartId, 1)} className="text-[#737373] hover:text-[#7ED957]"><Plus size={14} /></button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 bg-white border-t border-[#737373]/10">
                      <div className="flex justify-between text-base font-bold mb-4">
                        <span>Total (inc. tax)</span>
                        <span className="text-[#811920]">Rs. {total.toLocaleString()}</span>
                      </div>
                      <button 
                        onClick={() => setStep('cart')}
                        className="w-full bg-[#811920] hover:bg-[#6a151a] text-white font-bold py-4 rounded-xl shadow-md transition-colors text-lg"
                      >
                        Review & Checkout
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. CUSTOMIZE ITEM */}
            {step === 'customize' && selectedItem && (
              <motion.div 
                key="customize"
                className="absolute inset-0 bg-[#FEFDFA] flex flex-col items-center p-8 overflow-y-auto"
                variants={slideVariants} initial="initial" animate="animate" exit="exit"
              >
                <div className="max-w-5xl w-full">
                  <button onClick={() => setStep('menu')} className="mb-6 flex items-center gap-2 text-[#737373] hover:text-black font-semibold">
                    <ChevronLeft size={20} /> Back to Menu
                  </button>

                  <div className="bg-white rounded-3xl border border-[#737373]/10 shadow-sm p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Image & Info */}
                    <div className="flex flex-col items-center">
                      <div className="w-full h-[350px] bg-[#FDEFDE]/40 rounded-3xl flex items-center justify-center p-8 mb-8">
                        <img src={selectedItem.image} alt={selectedItem.name} className="h-full object-contain drop-shadow-xl" />
                      </div>
                      <div className="w-full text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold mb-2">{selectedItem.name}</h2>
                        <p className="text-2xl text-[#811920] font-bold mb-4">Rs. {selectedItem.price}</p>
                        <p className="text-[#737373] text-lg leading-relaxed">{selectedItem.desc}</p>
                      </div>
                    </div>

                    {/* Right: Customization Form */}
                    <div className="space-y-8">
                      <div>
                        <h4 className="font-bold text-lg mb-4">Select Size</h4>
                        <div className="grid grid-cols-3 gap-4">
                          {['Regular', 'Large', 'Family'].map(s => (
                            <button 
                              key={s} onClick={() => setSize(s)}
                              className={`py-4 rounded-2xl border-2 text-base font-semibold flex flex-col items-center justify-center gap-1 transition-all ${size === s ? 'border-[#FECE04] bg-[#FECE04]/10 text-black shadow-sm' : 'border-[#737373]/10 text-[#737373] hover:border-[#FECE04]/50 hover:bg-[#FDEFDE]/50'}`}
                            >
                              <span>{s}</span>
                              {s === 'Large' && <span className="text-xs opacity-80">+ Rs. 500</span>}
                              {s === 'Family' && <span className="text-xs opacity-80">+ Rs. 1000</span>}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-lg mb-4">Select Crust</h4>
                        <div className="grid grid-cols-3 gap-4">
                          {['Thin Crust', 'Crown Crust', 'Stuffed Crust'].map(c => (
                            <button 
                              key={c} onClick={() => setCrust(c)}
                              className={`py-4 px-2 rounded-2xl border-2 text-base font-semibold flex flex-col items-center justify-center gap-1 transition-all text-center ${crust === c ? 'border-[#FECE04] bg-[#FECE04]/10 text-black shadow-sm' : 'border-[#737373]/10 text-[#737373] hover:border-[#FECE04]/50 hover:bg-[#FDEFDE]/50'}`}
                            >
                              <span>{c}</span>
                              {c === 'Stuffed Crust' && <span className="text-xs opacity-80">+ Rs. 200</span>}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-lg mb-4">Add Extras</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { name: 'Extra Cheese', price: 200 },
                            { name: 'Chicken Tikka', price: 250 },
                            { name: 'Jalapenos', price: 100 },
                            { name: 'Cheese Sauce', price: 150 }
                          ].map(ext => (
                            <label key={ext.name} className="flex items-center justify-between p-4 border-2 border-[#737373]/10 rounded-2xl cursor-pointer hover:border-[#FECE04]/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <input 
                                  type="checkbox" 
                                  className="w-5 h-5 accent-[#FECE04] rounded"
                                  checked={extras.includes(ext.name)}
                                  onChange={(e) => {
                                    if (e.target.checked) setExtras([...extras, ext.name]);
                                    else setExtras(extras.filter(x => x !== ext.name));
                                  }}
                                />
                                <span className="font-bold text-base">{ext.name}</span>
                              </div>
                              <span className="text-sm font-bold text-[#737373]">Rs. {ext.price}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#737373]/10">
                        <div className="flex items-center gap-4 bg-white border-2 border-[#737373]/10 rounded-2xl px-4 py-2">
                          <button onClick={() => setItemQty(Math.max(1, itemQty - 1))} className="p-2 text-[#737373] hover:text-[#811920]"><Minus size={20} /></button>
                          <span className="font-extrabold text-xl w-8 text-center">{itemQty}</span>
                          <button onClick={() => setItemQty(itemQty + 1)} className="p-2 text-[#737373] hover:text-[#7ED957]"><Plus size={20} /></button>
                        </div>
                        <button 
                          onClick={handleAddToCart}
                          className="bg-[#FECE04] hover:bg-[#E5B800] text-black font-extrabold py-4 px-8 rounded-2xl shadow-md transition-all flex items-center gap-4 text-lg"
                        >
                          <span>Add to Cart</span>
                          <span className="bg-black/10 px-3 py-1 rounded-lg">Rs. {(selectedItem.price + (size==='Large'?500:size==='Family'?1000:0) + (extras.length*100)) * itemQty}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. YOUR ORDER (CART FULL VIEW) */}
            {step === 'cart' && (
              <motion.div 
                key="cart"
                className="absolute inset-0 bg-[#FEFDFA] flex flex-col items-center p-8 overflow-y-auto"
                variants={slideVariants} initial="initial" animate="animate" exit="exit"
              >
                <div className="max-w-4xl w-full">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-extrabold text-black">Your Order</h2>
                    <button onClick={() => setStep('menu')} className="flex items-center gap-2 text-[#737373] font-bold hover:text-black hover:underline">
                      Add more items
                    </button>
                  </div>

                  <div className="bg-white border border-[#737373]/10 rounded-3xl p-8 shadow-sm mb-8 space-y-6">
                    {cart.map(item => (
                      <div key={item.cartId} className="flex gap-6 items-center p-4 rounded-2xl hover:bg-[#FDEFDE]/30 transition-colors border border-transparent hover:border-[#737373]/10">
                        <div className="w-24 h-24 bg-[#FDEFDE]/50 rounded-2xl flex items-center justify-center shrink-0">
                          <img src={item.image} alt={item.name} className="w-16 object-contain" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-xl mb-1">{item.name}</h4>
                          <p className="text-sm text-[#737373] mb-2">{item.size} • {item.crust} {item.extras.length > 0 ? `• +${item.extras.length} extras` : ''}</p>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-4 bg-white border border-[#737373]/20 rounded-xl px-3 py-2">
                            <button onClick={() => updateCartQty(item.cartId, -1)} className="text-[#737373] hover:text-[#811920]"><Minus size={18} /></button>
                            <span className="font-bold text-lg w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.cartId, 1)} className="text-[#737373] hover:text-[#7ED957]"><Plus size={18} /></button>
                          </div>
                          <div className="w-32 text-right">
                            <span className="font-extrabold text-xl">Rs. {item.finalPrice * item.quantity}</span>
                          </div>
                          <button onClick={() => removeCartItem(item.cartId)} className="p-3 bg-[#FDEFDE] hover:bg-red-100 text-[#811920] rounded-xl transition-colors">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#FECE04]/10 border border-[#FECE04]/30 rounded-3xl p-8 mb-8 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xl mb-2">Make it a Combo! 🔥</h4>
                      <p className="text-[#737373]">Add a drink & fries to save up to Rs. 200</p>
                    </div>
                    <button onClick={() => setStep('addons')} className="px-6 py-3 bg-white border-2 border-[#FECE04] rounded-xl font-bold text-black hover:bg-[#FECE04] transition-colors">
                      View Offers
                    </button>
                  </div>

                  <div className="bg-white border border-[#737373]/10 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row justify-between gap-8 items-end">
                    <div className="w-full md:w-1/2 space-y-4 text-lg">
                      <div className="flex justify-between text-[#737373]">
                        <span>Subtotal</span>
                        <span className="font-medium text-black">Rs. {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[#737373]">
                        <span>Tax (12%)</span>
                        <span className="font-medium text-black">Rs. {tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-2xl font-extrabold pt-4 mt-4 border-t border-[#737373]/20">
                        <span>Total</span>
                        <span className="text-[#811920]">Rs. {total.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-full md:w-auto">
                      <button 
                        onClick={() => setStep('details')}
                        className="w-full md:w-auto bg-[#811920] hover:bg-[#6a151a] text-white font-bold py-5 px-12 rounded-2xl shadow-md transition-all text-xl"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. ADD-ON OFFERS */}
            {step === 'addons' && (
              <motion.div 
                key="addons"
                className="absolute inset-0 bg-[#FEFDFA] flex flex-col items-center p-8 overflow-y-auto"
                variants={slideVariants} initial="initial" animate="animate" exit="exit"
              >
                <div className="max-w-5xl w-full">
                  <div className="flex flex-col items-center text-center mt-12 mb-12">
                    <h2 className="text-4xl font-extrabold text-[#811920] mb-3">Make it a Combo! 🔥</h2>
                    <p className="text-xl text-[#737373] font-medium">Get more. Save more.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {ADDONS.map(addon => (
                      <div key={addon.id} className="bg-white border-2 border-[#FECE04]/30 hover:border-[#FECE04] rounded-3xl p-6 flex flex-col items-center text-center transition-all shadow-sm hover:shadow-md cursor-pointer group">
                        <img src={addon.image} alt={addon.name} className="w-32 h-32 object-contain mix-blend-multiply mb-6 group-hover:scale-110 transition-transform" />
                        <h4 className="font-extrabold text-xl mb-2">{addon.name}</h4>
                        <p className="text-sm text-[#737373] mb-4">{addon.desc}</p>
                        <span className="font-extrabold text-[#811920] text-2xl mb-6">Rs. {addon.price}</span>
                        <button className="w-full py-3 bg-[#FECE04] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#E5B800] transition-colors">
                          <Plus size={20} /> Add to Order
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button 
                      onClick={() => setStep('details')}
                      className="text-lg text-[#737373] font-bold hover:text-black hover:underline py-4 px-8"
                    >
                      No thanks, continue to checkout
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 6. ORDER DETAILS */}
            {step === 'details' && (
              <motion.div 
                key="details"
                className="absolute inset-0 bg-[#FEFDFA] flex flex-col items-center p-8 overflow-y-auto"
                variants={slideVariants} initial="initial" animate="animate" exit="exit"
              >
                <div className="max-w-3xl w-full">
                  <button onClick={() => setStep('cart')} className="mb-8 flex items-center gap-2 text-[#737373] hover:text-black font-semibold text-lg">
                    <ChevronLeft size={24} /> Back to Cart
                  </button>

                  <h2 className="text-3xl font-extrabold mb-8">Order Details</h2>

                  <div className="bg-white border border-[#737373]/10 rounded-3xl p-10 shadow-sm space-y-10">
                    <div>
                      <h3 className="font-bold text-xl mb-6">How would you like your order?</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <button 
                          onClick={() => setOrderType('Dine-in')}
                          className={`py-8 rounded-2xl font-bold flex flex-col items-center justify-center gap-4 border-2 transition-all text-xl ${orderType === 'Dine-in' ? 'border-[#FECE04] bg-[#FECE04]/10 text-black shadow-sm' : 'border-[#737373]/20 text-[#737373] hover:border-[#FECE04]/50'}`}
                        >
                          <span className="text-4xl">🍽️</span>
                          Dine-in
                        </button>
                        <button 
                          onClick={() => setOrderType('Takeaway')}
                          className={`py-8 rounded-2xl font-bold flex flex-col items-center justify-center gap-4 border-2 transition-all text-xl ${orderType === 'Takeaway' ? 'border-[#FECE04] bg-[#FECE04]/10 text-black shadow-sm' : 'border-[#737373]/20 text-[#737373] hover:border-[#FECE04]/50'}`}
                        >
                          <span className="text-4xl">🛍️</span> 
                          Takeaway
                        </button>
                      </div>
                    </div>

                    {orderType === 'Dine-in' && (
                      <div>
                        <h3 className="font-bold text-xl mb-6">Enter Table Number</h3>
                        <div className="flex items-center justify-between border-2 border-[#737373]/20 rounded-2xl p-4 bg-white max-w-sm mx-auto">
                          <button onClick={() => setTableNo(Math.max(1, tableNo - 1))} className="p-4 text-[#811920] bg-[#FDEFDE] hover:bg-[#811920] hover:text-white transition-colors rounded-xl"><Minus size={24} /></button>
                          <span className="text-3xl font-extrabold">{tableNo}</span>
                          <button onClick={() => setTableNo(tableNo + 1)} className="p-4 text-[#811920] bg-[#FDEFDE] hover:bg-[#811920] hover:text-white transition-colors rounded-xl"><Plus size={24} /></button>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-xl mb-4">Special Instructions <span className="text-base font-normal text-[#737373]">(Optional)</span></h3>
                      <textarea 
                        className="w-full bg-[#FDEFDE]/30 border-2 border-[#737373]/20 rounded-2xl p-6 text-lg focus:border-[#FECE04] outline-none h-40 resize-none transition-colors"
                        placeholder="E.g. No onion, extra sauce, allergies..."
                      ></textarea>
                    </div>

                    <button 
                      onClick={() => setStep('payment')}
                      className="w-full bg-[#FECE04] hover:bg-[#E5B800] text-black font-extrabold py-5 rounded-2xl shadow-md transition-colors text-xl"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 7. PAYMENT */}
            {step === 'payment' && (
              <motion.div 
                key="payment"
                className="absolute inset-0 bg-[#FEFDFA] flex flex-col items-center p-8 overflow-y-auto"
                variants={slideVariants} initial="initial" animate="animate" exit="exit"
              >
                <div className="max-w-3xl w-full">
                  <button onClick={() => setStep('details')} className="mb-8 flex items-center gap-2 text-[#737373] hover:text-black font-semibold text-lg">
                    <ChevronLeft size={24} /> Back to Details
                  </button>

                  <div className="flex justify-between items-end mb-8">
                    <h2 className="text-3xl font-extrabold">Payment</h2>
                    <div className="text-right">
                      <p className="text-[#737373] text-sm font-bold">Total Amount</p>
                      <p className="text-3xl font-extrabold text-[#811920]">Rs. {total.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-white border border-[#737373]/10 rounded-3xl p-10 shadow-sm">
                    <h3 className="font-bold text-xl mb-6">Select Payment Method</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                      {[
                        { id: 'cash', name: 'Cash', desc: 'Pay at counter', icon: <Banknote size={32} className="text-[#7ED957]" /> },
                        { id: 'card', name: 'Card', desc: 'Visa, Mastercard', icon: <CreditCard size={32} className="text-[#737373]" /> },
                        { id: 'easypaisa', name: 'EasyPaisa', desc: 'Pay with EasyPaisa', icon: <div className="w-10 h-10 rounded-full bg-[#7ED957] text-white flex items-center justify-center font-bold text-xl italic">e</div> },
                        { id: 'jazzcash', name: 'JazzCash', desc: 'Pay with JazzCash', icon: <div className="w-10 h-10 rounded-full bg-[#811920] text-white flex items-center justify-center font-bold text-xl">J</div> },
                      ].map((method, idx) => (
                        <div key={method.id} className={`flex items-center gap-6 p-6 rounded-2xl border-2 cursor-pointer transition-all hover:border-[#FECE04] hover:shadow-md ${idx === 0 ? 'border-[#FECE04] bg-[#FECE04]/5 shadow-sm' : 'border-[#737373]/10 bg-white'}`}>
                          <div className="w-16 h-16 bg-[#FDEFDE] rounded-xl flex items-center justify-center shrink-0">
                            {method.icon}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xl mb-1">{method.name}</h4>
                            <p className="text-sm text-[#737373]">{method.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                      className="w-full bg-[#811920] hover:bg-[#6a151a] text-white font-extrabold py-5 rounded-2xl shadow-md transition-colors text-xl flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPlacingOrder ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />} 
                      {isPlacingOrder ? 'Processing...' : `Pay Rs. ${total.toLocaleString()} Now`}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 8. ORDER CONFIRMED */}
            {step === 'confirmed' && (
              <motion.div 
                key="confirmed"
                className="absolute inset-0 bg-[#FEFDFA] flex flex-col items-center justify-center p-8"
                variants={slideVariants} initial="initial" animate="animate" exit="exit"
              >
                <div className="max-w-2xl w-full bg-white border border-[#737373]/10 rounded-3xl p-16 shadow-xl text-center flex flex-col items-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="w-32 h-32 bg-[#7ED957] rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-[#7ED957]/40"
                  >
                    <CheckCircle2 size={64} className="text-white" />
                  </motion.div>
                  
                  <h2 className="text-4xl font-extrabold text-black mb-3">Thank you! 🎉</h2>
                  <p className="text-xl text-[#737373] font-medium mb-10">Your order has been placed successfully.</p>
                  
                  <div className="bg-[#FDEFDE]/50 w-full rounded-2xl p-8 mb-10 border border-[#FECE04]/30">
                    <p className="text-lg text-[#737373] mb-2 font-medium">Your Order Number</p>
                    <h3 className="text-5xl font-extrabold text-[#811920] tracking-wider mb-6">#{orderId.toString().slice(-6).toUpperCase()}</h3>
                    <p className="text-base text-[#737373] mb-6">Please keep your receipt. We've received your order and it's currently being prepared by our kitchen staff.</p>
                    <div className="border-t border-[#737373]/20 pt-6 flex justify-between items-center px-4">
                      <p className="text-lg text-[#737373] font-medium">Estimated Time</p>
                      <p className="font-extrabold text-2xl text-black">15 - 20 min</p>
                    </div>
                  </div>

                  <div className="w-full flex gap-6">
                    <button className="flex-1 bg-[#FECE04] hover:bg-[#E5B800] text-black font-extrabold py-5 rounded-2xl shadow-md transition-colors text-xl">
                      Track Order
                    </button>
                    <button 
                      onClick={() => { setCart([]); setStep('welcome'); }}
                      className="flex-1 bg-white border-2 border-[#737373]/20 hover:bg-[#FDEFDE] hover:border-[#737373]/40 text-black font-extrabold py-5 rounded-2xl transition-colors text-xl"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

