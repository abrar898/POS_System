"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { DISHES } from "./constants";

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
  initialCheckoutStep = "delivery" 
}: { 
  initialScreen?: Screen, 
  initialCheckoutStep?: CheckoutStep 
}) {
  const router = useRouter();
  const { cart, addToCart, removeFromCart, deleteFromCart, clearCart, grandTotal, cartTotal, deliveryCharges } = useCart();
  
  const [activeCategory, setActiveCategory] = useState("popular");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [search, setSearch] = useState("");
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [activeVariation, setActiveVariation] = useState<number>(0);
  const [selectedAddress, setSelectedAddress] = useState("Home");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash on Delivery");
  const [orderId, setOrderId] = useState("#CHZ-39403");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handlePlaceOrder = () => {
    const newId = `#CHZ-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderId(newId);
    clearCart();
    router.push("/order/success");
  };

  return (
    <div className="h-screen flex flex-col bg-[#FEFDFA] relative overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar 
        initialScreen={initialScreen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        grandTotal={grandTotal}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar bg-[#FEFDFA] pb-32 relative">
          
          {initialScreen === "menu" && (
            <MenuScreen 
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              orderType={orderType}
              setOrderType={setOrderType}
              search={search}
              setSearch={setSearch}
              setSelectedDish={setSelectedDish}
              addToCart={addToCart}
            />
          )}

          {initialScreen === "cart" && (
            <CartScreen 
              cart={cart}
              removeFromCart={removeFromCart}
              deleteFromCart={deleteFromCart}
              addToCart={addToCart}
              cartTotal={cartTotal}
              deliveryCharges={deliveryCharges}
              grandTotal={grandTotal}
            />
          )}

          {initialScreen === "checkout" && (
            <CheckoutScreen 
              initialCheckoutStep={initialCheckoutStep}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
              cart={cart}
              removeFromCart={removeFromCart}
              deleteFromCart={deleteFromCart}
              addToCart={addToCart}
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
          cartTotal={cartTotal}
          deliveryCharges={deliveryCharges}
          grandTotal={grandTotal}
          clearCart={clearCart}
        />
      </div>
    </div>
  );
}
