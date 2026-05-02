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
      case 'new': return 'bg-white border-l-[6px] border-l-[#811920]';
      case 'preparing': return 'bg-white border-l-[6px] border-l-[#FECE04]';
      case 'ready': return 'bg-white border-l-[6px] border-l-[#7ED957]';
      default: return 'bg-white border-l-[6px] border-l-slate-200';
    }
  };

  const getStatusButton = () => {
    switch(order.status) {
      case 'new': 
        return (
          <button 
            onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'preparing'); }}
            className="w-full py-4 bg-[#811920] text-white font-black rounded-2xl hover:bg-[#6b141a] transition-all transform active:scale-95 shadow-lg shadow-[#811920]/20 mt-4 text-[16px] uppercase tracking-wider"
          >
            Start Preparing
          </button>
        );
      case 'preparing': 
        return (
          <button 
            onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'ready'); }}
            className="w-full py-4 bg-[#FECE04] text-black font-black rounded-2xl hover:bg-[#e5b800] transition-all transform active:scale-95 shadow-lg shadow-[#FECE04]/20 mt-4 text-[16px] uppercase tracking-wider"
          >
            Mark as Ready
          </button>
        );
      case 'ready': 
        return (
          <button 
            onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'completed'); }}
            className="w-full py-4 bg-[#7ED957] text-white font-black rounded-2xl hover:bg-[#6bc24a] transition-all transform active:scale-95 shadow-lg shadow-[#7ED957]/20 mt-4 text-[16px] uppercase tracking-wider flex items-center justify-center gap-3"
          >
            Ready for Pickup <Bell size={18} />
          </button>
        );
      default: return null;
    }
  };

  const displayId = order.id.toString().slice(-6).toUpperCase();

  return (
    <div 
      onClick={() => setSelectedOrder(order)}
      className={`${getStatusColor()} rounded-3xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col h-full border border-slate-100 relative overflow-hidden`}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-widest">{order.type}</span>
             {order.status === 'new' && <span className="h-2 w-2 bg-[#811920] rounded-full animate-pulse" />}
          </div>
          <h3 className="font-black text-[22px] text-[#000000]">#{displayId}</h3>
          <p className="text-[13px] text-[#737373] font-bold mt-1">
             {order.table !== order.type ? `Table ${order.table}` : 'Takeaway Order'}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-[#811920] font-black bg-[#FDEFDE] px-3 py-1.5 rounded-xl text-[14px] shadow-inner">
            <Clock size={16} />
            <span>{order.elapsedTime}</span>
          </div>
          <span className="text-[10px] text-[#737373] mt-2 font-bold uppercase tracking-tighter">{order.timePlaced}</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-6 overflow-y-auto custom-scrollbar pr-2">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start group border-b border-slate-50 pb-3 last:border-0 last:pb-0">
            <div className="flex gap-4">
              <span className="font-black text-[18px] text-[#811920] w-8">{item.quantity}x</span>
              <div>
                <p className="font-black text-[#000000] text-[16px] leading-tight">{item.name}</p>
                {item.status && <p className="text-[11px] font-bold text-slate-400 uppercase mt-1">{item.status}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        {getStatusButton()}
      </div>
    </div>
  );
}
