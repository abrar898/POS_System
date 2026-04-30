import CustomerFlow from '@/modules/in_store/CustomerFlow';

export const metadata = {
  title: 'Customer Flow | In-Store Ordering',
};

export default function CustomerFlowPage() {
  return (
    <main className="min-h-screen bg-[#FDEFDE]">
      <CustomerFlow />
    </main>
  );
}
