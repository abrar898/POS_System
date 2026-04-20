import type { ReactNode } from "react";
import { WaiterShell } from "@/modules/waiter/waiter-shell";

export default function WaiterLayout({ children }: { children: ReactNode }) {
  return <WaiterShell>{children}</WaiterShell>;
}
