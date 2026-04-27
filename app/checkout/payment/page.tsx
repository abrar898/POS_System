import { OnlineOrderingDashboard } from "@/modules/online_ordering/ordering-dashboard";

export default function PaymentPage() {
  return <OnlineOrderingDashboard initialScreen="checkout" initialCheckoutStep="payment" />;
}
