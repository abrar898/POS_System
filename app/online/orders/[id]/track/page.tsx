import { OrderTrackPage } from "@/modules/online_ordering/order-track";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order Tracking #${id} | Real-time Delivery Status`,
    description: `Track your order from Royal Burger in real-time. Estimated time: 45-55 mins.`,
  };
}

export default async function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main>
      <OrderTrackPage orderId={id} />
    </main>
  );
}
