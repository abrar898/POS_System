'use client';

import React from 'react';
import TopFilters from './components/TopFilters';
import OrderBoard from './components/OrderBoard';
import CompletedSidebar from './components/CompletedSidebar';
import OrderDetailModal from './components/OrderDetailModal';

export default function KDSFlow() {
  return (
    <div className="flex h-screen bg-[#FDEFDE] font-sans overflow-hidden">
      <div className="flex-1 flex flex-col relative z-0">
        <TopFilters />
        <OrderBoard />
      </div>
      <CompletedSidebar />
      <OrderDetailModal />
    </div>
  );
}
