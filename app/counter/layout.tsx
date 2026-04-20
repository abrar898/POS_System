import type { ReactNode } from "react";
import { OrderManagementShell } from "@/modules/order_management/order-management-shell";

export default function CounterLayout({ children }: { children: ReactNode }) {
  return (
    <OrderManagementShell basePath="/counter" variant="counter" moduleLabel="Counter · Cashier terminal">
      {children}
    </OrderManagementShell>
  );
}
