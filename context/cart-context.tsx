"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type CartItem = { id: string; name: string; price: number; image: string; qty: number; variation?: string; dishId: string };

type CartContextType = {
  cart: CartItem[];
  addToCart: (dish: any, variationIndex?: number) => void;
  removeFromCart: (id: string) => void;
  deleteFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  deliveryCharges: number;
  grandTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem("cheezious-cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("cheezious-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (dish: any, variationIndex?: number) => {
    setCart(prev => {
      const variation = dish.variations ? dish.variations[variationIndex ?? 0] : (dish.category === "drinks" || dish.category === "pizzas" ? { name: "Regular", price: dish.price } : null);
      const itemId = dish.id + (variation ? `-${variation.name}` : "");
      const itemName = dish.name;
      const itemPrice = variation ? variation.price : dish.price;

      const ex = prev.find(c => c.id === itemId);
      if (ex) return prev.map(c => c.id === itemId ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: itemId, dishId: dish.id, name: itemName, price: itemPrice, image: dish.image, qty: 1, variation: variation?.name }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === id);
      if (!ex) return prev;
      if (ex.qty === 1) return prev.filter(c => c.id !== id);
      return prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c);
    });
  };

  const deleteFromCart = (id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const deliveryCharges = 50;
  const grandTotal = cartTotal + deliveryCharges;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, deleteFromCart, clearCart, cartTotal, deliveryCharges, grandTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
