"use client";

import { use } from "react";
import { CashierTerminal } from "@/modules/order_management/cashier-terminal";
import { useOrderCashierStore } from "@/modules/order_management/order-store";
import { useEffect } from "react";

export default function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const setActiveOrder = useOrderCashierStore((s) => s.setActiveOrder);

  useEffect(() => {
    setActiveOrder(id);
  }, [id, setActiveOrder]);

  return <CashierTerminal />;
}
