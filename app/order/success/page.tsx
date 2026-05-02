import { OnlineOrderingDashboard } from "@/modules/online_ordering/ordering-dashboard";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return <OnlineOrderingDashboard initialScreen="success" initialOrderId={id || ""} />;
}
