import { WaiterTableDetail } from "@/modules/waiter/waiter-table-detail";

type Props = { params: Promise<{ id: string }> };

export default async function WaiterTablePage({ params }: Props) {
  const { id } = await params;
  return <WaiterTableDetail tableLabel={id} />;
}
