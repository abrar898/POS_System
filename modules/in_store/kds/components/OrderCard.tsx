'use client';

import { useKDSStore, KDSOrder } from '../store/useKDSStore';
import { Clock, Bell } from 'lucide-react';

interface OrderCardProps {
  order: KDSOrder;
}

export default function OrderCard({ order }: OrderCardProps) {
  const { setSelectedOrder, updateOrderStatus } = useKDSStore();

  const getStatusColor = () => {
    switch(order.status) {
      case 'new': return 'bg-[#FEFDFA] border-t-4 border-t-[#811920]';
      case 'preparing': return 'bg-[#FEFDFA] border-t-4 border-t-[#F28C28]';
      case 'ready': return 'bg-[#FEFDFA] border-t-4 border-t-[#7ED957]';
      default: return 'bg-white';
    }
  };

  const getStatusButton = () => {
    switch(order.status) {
      case 'new': 
        return (
          <button 
            onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'preparing'); }}
            className="w-full py-3 bg-[#FECE04] text-black font-bold rounded-xl hover:bg-[#E5B800] transition-colors mt-4 text-[15px]"
          >
            Start Preparing
          </button>
        );
      case 'preparing': 
        return (
          <button 
            onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'ready'); }}
            className="w-full py-3 bg-[#7ED957] text-white font-bold rounded-xl hover:bg-[#6bc24a] transition-colors mt-4 text-[15px]"
          >
            Mark as Ready
          </button>
        );
      case 'ready': 
        return (
          <button 
            onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'completed'); }}
            className="w-full py-3 bg-[#7ED957] text-white font-bold rounded-xl hover:bg-[#6bc24a] transition-colors mt-4 text-[15px] flex items-center justify-center gap-2 shadow-md shadow-[#7ED957]/20"
          >
            Ready for Pickup <Bell size={16} />
          </button>
        );
      default: return null;
    }
  };

  return (
    <div 
      onClick={() => setSelectedOrder(order)}
      className={`${getStatusColor()} rounded-xl p-5 shadow-sm border-x border-b border-[#737373]/10 hover:shadow-md transition-all cursor-pointer flex flex-col h-full`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-extrabold text-[18px] text-[#811920] mb-1">{order.id}</h3>
          <p className="text-[13px] text-[#737373] font-medium">{order.type} {order.table !== order.type ? `• ${order.table}` : ''}</p>
        </div>
        <div className="flex items-center gap-1 text-[#811920] font-bold bg-[#FDEFDE] px-2 py-1 rounded-md text-[13px]">
          <Clock size={14} />
          <span>{order.elapsedTime}</span>
        </div>
      </div>

      <div className="flex-1 space-y-3 mb-4 overflow-y-auto custom-scrollbar pr-2">
        {order.items.map(item => (
          <div key={item.id} className="flex justify-between items-start group border-b border-[#737373]/5 pb-2 last:border-0 last:pb-0">
            <div className="flex gap-2">
              <span className="font-bold text-[#000000]">{item.quantity} x</span>
              <div>
                <p className="font-bold text-[#000000] text-[15px]">{item.name}</p>
                {item.size && <p className="text-[12px] text-[#737373]">{item.size}</p>}
                {item.note && <p className="text-[12px] text-[#811920] font-medium mt-0.5">* {item.note}</p>}
              </div>
            </div>
            {order.status === 'preparing' && (
               <span className="text-[11px] font-bold text-[#F28C28] bg-[#F28C28]/10 px-2 py-1 rounded">Preparing</span>
            )}
            {order.status === 'new' && (
               <span className="text-[11px] font-bold text-[#FECE04] bg-[#FECE04]/20 px-2 py-1 rounded text-black">New</span>
            )}
          </div>
        ))}
        {order.notes && (
          <div className="mt-4 p-3 bg-[#FDEFDE]/50 rounded-lg border border-[#811920]/20">
            <p className="text-[13px] text-[#811920] font-bold">Note: {order.notes}</p>
          </div>
        )}
      </div>

      <div className="pt-2 mt-auto">
        {getStatusButton()}
      </div>
    </div>
  );
}
