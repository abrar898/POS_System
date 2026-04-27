import { OrderTrackPage } from "@/modules/online_ordering/order-track";

export default async function TrackingRoute({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <OrderTrackPage orderId={orderId} />;
}
