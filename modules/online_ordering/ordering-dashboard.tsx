"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { api } from "@/lib/api";

import { Navbar } from "./components/Navbar";
import { MenuScreen } from "./components/MenuScreen";
import { CartScreen } from "./components/CartScreen";
import { CheckoutScreen } from "./components/CheckoutScreen";
import { SuccessScreen } from "./components/SuccessScreen";
import { DealsScreen } from "./components/DealsScreen";
import { DishDetailModal } from "./components/DishDetailModal";
import { SidebarCart } from "./components/SidebarCart";

type CheckoutStep = "delivery" | "payment" | "review";
type Screen = "menu" | "cart" | "checkout" | "success" | "deals";

export function OnlineOrderingDashboard({ 
  initialScreen = "menu", 
  initialCheckoutStep = "delivery",
  initialOrderId = ""
}: { 
  initialScreen?: Screen, 
  initialCheckoutStep?: CheckoutStep,
  initialOrderId?: string
}) {
  const router = useRouter();
  const { 
    cart, addToCart, incrementCartQty, removeFromCart, deleteFromCart, clearCart, 
    grandTotal, cartTotal, deliveryCharges, 
    checkoutInfo, setCheckoutInfo,
    setLastOrderId 
  } = useCart();
  
  const [activeCategory, setActiveCategory] = useState("popular");
  const [search, setSearch] = useState("");
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [activeVariation, setActiveVariation] = useState<number>(0);
  const [orderId, setOrderId] = useState(initialOrderId);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          api.products.getAll(),
          api.products.getCategories()
        ]);
        console.log("Loaded products:", prodData);
        console.log("Loaded categories:", catData);
        setProducts(prodData || []);
        
        const validCategories = Array.isArray(catData) ? catData : [];
        setCategories([
          { id: "popular", name: "Popular", emoji: "🔥" },
          ...validCategories.map((c: string) => ({ id: c, name: c, emoji: "🍴" }))
        ]);
      } catch (err) {
        console.error("Failed to load online ordering data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        customer_name: "Online Customer",
        items: cart.map(item => {
          const productId = item.dishId || item.id || (item as any)._id;
          if (!productId) console.warn("Missing product ID for item:", item);
          return {
            product_id: productId,
            product_name: item.name,
            quantity: item.qty,
            price: item.price
          };
        }),
        total_price: grandTotal,
        status: "pending",
        payment_method: checkoutInfo.selectedPaymentMethod,
        type: checkoutInfo.orderType
      };
      
      const response = await api.orders.create(orderData);
      console.log("Order creation response:", response);
      // Backend might return id or _id depending on serialization
      const rawId = response.id || response._id || "";
      const newOrderId = rawId || `#CHZ-${Math.floor(10000 + Math.random() * 90000)}`;
      
      setOrderId(newOrderId);
      setLastOrderId(newOrderId);
      clearCart();
      
      // Clean ID for URL (remove # if it's a dummy ID)
      const urlId = newOrderId.startsWith('#') ? newOrderId.slice(5) : newOrderId;
      router.push(`/order/success?id=${urlId}`);
    } catch (err) {
      console.error("Failed to place order:", err);
      alert("Failed to place order. Please check your connection.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#FEFDFA]">Loading Menu...</div>;

  return (
    <div className="h-screen flex flex-col bg-[#FEFDFA] relative overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar 
        initialScreen={initialScreen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        grandTotal={grandTotal}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar bg-[#FEFDFA] pb-32 relative">
          
          {initialScreen === "menu" && (
            <MenuScreen 
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              orderType={checkoutInfo.orderType}
              setOrderType={(type) => setCheckoutInfo(prev => ({ ...prev, orderType: type as "delivery" | "pickup" }))}
              search={search}
              setSearch={setSearch}
              setSelectedDish={setSelectedDish}
              addToCart={addToCart}
              products={products}
              categories={categories}
            />
          )}

          {initialScreen === "cart" && (
            <CartScreen 
              cart={cart}
              removeFromCart={removeFromCart}
              deleteFromCart={deleteFromCart}
              addToCart={addToCart}
              incrementCartQty={incrementCartQty}
              cartTotal={cartTotal}
              deliveryCharges={deliveryCharges}
              grandTotal={grandTotal}
            />
          )}

          {initialScreen === "checkout" && (
            <CheckoutScreen 
              initialCheckoutStep={initialCheckoutStep}
              selectedAddress={checkoutInfo.selectedAddress}
              setSelectedAddress={(addr) => setCheckoutInfo(prev => ({ ...prev, selectedAddress: addr }))}
              addresses={checkoutInfo.addresses}
              setAddresses={(updater) => setCheckoutInfo(prev => ({ ...prev, addresses: typeof updater === 'function' ? updater(prev.addresses) : updater }))}
              selectedPaymentMethod={checkoutInfo.selectedPaymentMethod}
              setSelectedPaymentMethod={(method) => setCheckoutInfo(prev => ({ ...prev, selectedPaymentMethod: method }))}
              cart={cart}
              removeFromCart={removeFromCart}
              deleteFromCart={deleteFromCart}
              addToCart={addToCart}
              incrementCartQty={incrementCartQty}
              cartTotal={cartTotal}
              deliveryCharges={deliveryCharges}
              grandTotal={grandTotal}
              handlePlaceOrder={handlePlaceOrder}
            />
          )}

          {initialScreen === "success" && (
            <SuccessScreen orderId={orderId} />
          )}

          {initialScreen === "deals" && (
            <DealsScreen addToCart={addToCart} />
          )}

          <DishDetailModal 
            selectedDish={selectedDish}
            setSelectedDish={setSelectedDish}
            activeVariation={activeVariation}
            setActiveVariation={setActiveVariation}
            addToCart={addToCart}
          />
        </main>

        <SidebarCart 
          initialScreen={initialScreen}
          cart={cart}
          removeFromCart={removeFromCart}
          deleteFromCart={deleteFromCart}
          addToCart={addToCart}
          incrementCartQty={incrementCartQty}
          cartTotal={cartTotal}
          deliveryCharges={deliveryCharges}
          grandTotal={grandTotal}
          clearCart={clearCart}
        />
      </div>
    </div>
  );
}
