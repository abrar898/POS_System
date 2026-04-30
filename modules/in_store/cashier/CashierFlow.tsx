'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useCashierStore } from './store/useCashierStore';

import SidebarCategories from './components/SidebarCategories';
import TopNavigation from './components/TopNavigation';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import PaymentScreen from './components/PaymentScreen';
import ConfirmationScreen from './components/ConfirmationScreen';
import OrderHistory from './components/OrderHistory';
import HoldOrders from './components/HoldOrders';
import DiscountsPromos from './components/DiscountsPromos';

export default function CashierFlow() {
  const { activeScreen } = useCashierStore();

  return (
    <div className="flex h-screen bg-[#FDEFDE] font-sans overflow-hidden">
      <SidebarCategories />

      <div className="flex-1 flex flex-col relative z-0">
        <TopNavigation />

        <div className="flex-1 overflow-hidden relative bg-[#FDEFDE]">
          <AnimatePresence mode="wait">
            {activeScreen === 'pos' && <ProductGrid key="pos" />}
            {activeScreen === 'payment' && <PaymentScreen key="payment" />}
            {activeScreen === 'confirmation' && <ConfirmationScreen key="confirmation" />}
            {activeScreen === 'history' && <OrderHistory key="history" />}
            {activeScreen === 'hold' && <HoldOrders key="hold" />}
            {activeScreen === 'discounts' && <DiscountsPromos key="discounts" />}
          </AnimatePresence>
        </div>
      </div>

      <CartSidebar />
    </div>
  );
}
