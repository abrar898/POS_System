import { DeliveryDashboard } from "@/modules/online_ordering/delivery-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Dashboard | Live Order Tracking",
  description: "Track and manage all delivery orders in real-time.",
};

export default function DeliveryPage() {
  return <DeliveryDashboard />;
}
