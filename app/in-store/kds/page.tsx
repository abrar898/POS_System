import KDSFlow from '@/modules/in_store/kds/KDSFlow';

export const metadata = {
  title: 'Kitchen Display System | In-Store Ordering',
};

export default function KDSPage() {
  return (
    <main className="min-h-screen bg-[#FDEFDE]">
      <KDSFlow />
    </main>
  );
}
