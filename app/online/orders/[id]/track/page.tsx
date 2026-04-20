import { OrderTrackPage } from "@/modules/online_ordering/order-track";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Order Tracking #${params.id} | Real-time Delivery Status`,
    description: `Track your order from Royal Burger in real-time. Estimated time: 45-55 mins.`,
  };
}

export default function TrackingPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <OrderTrackPage orderId={params.id} />
    </main>
  );
}
