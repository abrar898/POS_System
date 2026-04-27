import { OnlineOrderingDashboard } from "@/modules/online_ordering/ordering-dashboard";

export default function DeliveryPage() {
  return <OnlineOrderingDashboard initialScreen="checkout" initialCheckoutStep="delivery" />;
}
