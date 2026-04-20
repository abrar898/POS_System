import { OnlineOrderingDashboard } from "@/modules/online_ordering/ordering-dashboard";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const restaurantName = slug.replace("-", " ").toUpperCase();
  return {
    title: `${restaurantName} | Order Online with Low Commission`,
    description: `Order delicious food directly from ${restaurantName}. Fast delivery and exclusive online-only discounts.`,
    openGraph: {
      title: `${restaurantName} Online Ordering`,
      description: `Get the best deals from ${restaurantName} with direct ordering.`,
      type: "website",
    },
  };
}

export default function OnlineOrderingPage() {
  return (
    <main>
      <OnlineOrderingDashboard />
    </main>
  );
}
