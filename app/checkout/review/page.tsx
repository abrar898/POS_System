import { OnlineOrderingDashboard } from "@/modules/online_ordering/ordering-dashboard";

export default function ReviewPage() {
  return <OnlineOrderingDashboard initialScreen="checkout" initialCheckoutStep="review" />;
}
