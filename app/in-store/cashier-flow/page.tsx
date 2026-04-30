import CashierFlow from '@/modules/in_store/cashier/CashierFlow';

export const metadata = {
  title: 'Cashier Flow | In-Store Ordering',
};

export default function CashierFlowPage() {
  return (
    <main className="min-h-screen bg-[#FDEFDE]">
      <CashierFlow />
    </main>
  );
}
