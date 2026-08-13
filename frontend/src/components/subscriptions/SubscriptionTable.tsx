import React from 'react';
import { Subscription } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Eye, Edit3, Trash2, Layers } from 'lucide-react';

interface Props {
  subscriptions: Subscription[];
  onSelect: (sub: Subscription) => void;
  onEdit?: (sub: Subscription) => void;
  onDelete?: (sub: Subscription) => void;
}

export const SubscriptionTable: React.FC<Props> = ({ subscriptions, onSelect, onEdit, onDelete }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Active</span>;
      case 'Paused':
        return <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">Paused</span>;
      case 'Cancelled':
      case 'Idle':
        return <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">Cancelled</span>;
      case 'Expired':
        return <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40">Expired</span>;
      default:
        return <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/40">{status}</span>;
    }
  };

  const getPaymentSourceText = (sub: Subscription) => {
    if (sub.payment_type === 'card' && sub.card) {
      return `${sub.card.card_type || 'Card'} •${sub.card.masked_card_number?.slice(-4) || '4921'}`;
    }
    if (sub.payment_type === 'bank' && sub.bank) {
      return `${sub.bank.bank_name || 'Bank'} •${sub.bank.masked_account_number?.slice(-4) || '1234'}`;
    }
    if (sub.payment_type === 'mobile_banking' && sub.mobile) {
      return `${sub.mobile.provider?.toUpperCase() || 'Mobile'} •${sub.mobile.mobile_number?.slice(-4) || '5678'}`;
    }
    return 'Visa •4921';
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#CBA378]/30 bg-[#171E25]/90 backdrop-blur-md shadow-2xl">
      <table className="w-full text-left text-xs text-[#EFE6D6]">
        <thead className="bg-[#1F2630] text-[10px] uppercase font-extrabold text-[#FECB6E] border-b border-[#CBA378]/20 tracking-wider">
          <tr>
            <th className="px-4 py-3.5">Service</th>
            <th className="px-4 py-3.5">Plan</th>
            <th className="px-4 py-3.5">Category</th>
            <th className="px-4 py-3.5">Amount</th>
            <th className="px-4 py-3.5">Billing</th>
            <th className="px-4 py-3.5">Renewal</th>
            <th className="px-4 py-3.5">Payment</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#CBA378]/10">
          {subscriptions.map((sub) => (
            <tr
              key={sub.id}
              onClick={() => onSelect(sub)}
              className="hover:bg-[#222A36] cursor-pointer transition-colors duration-150"
            >
              <td className="px-4 py-3.5 font-bold text-white">
                <div className="flex items-center gap-2">
                  {sub.logo_url ? (
                    <img src={sub.logo_url} alt={sub.name} className="w-6 h-6 rounded-lg object-contain bg-[#171E25] p-0.5 border border-[#CBA378]/20" />
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-[#171E25] border border-[#CBA378]/20 flex items-center justify-center">
                      <Layers className="w-3.5 h-3.5 text-[#FECB6E]" />
                    </div>
                  )}
                  <span>{sub.name}</span>
                </div>
              </td>
              <td className="px-4 py-3.5 text-[#FECB6E] font-bold">{sub.plan_type || 'Standard'}</td>
              <td className="px-4 py-3.5 text-[#B8B8AC] font-semibold">{sub.category}</td>
              <td className="px-4 py-3.5 font-black text-white">
                {sub.currency === 'BDT' ? '৳' : '$'}{sub.cost}
              </td>
              <td className="px-4 py-3.5 text-[#B8B8AC]">{sub.billing_cycle}</td>
              <td className="px-4 py-3.5 font-semibold text-[#FECB6E]">{formatDate(sub.next_billing_date)}</td>
              <td className="px-4 py-3.5 font-mono text-[11px] text-cyan-300">{getPaymentSourceText(sub)}</td>
              <td className="px-4 py-3.5">{getStatusBadge(sub.status)}</td>
              <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onSelect(sub)}
                    className="p-1.5 rounded-lg bg-[#222834] text-[#B8B8AC] hover:text-[#38BDF8] hover:bg-[#2A3342] transition border border-[#CBA378]/20"
                    title="View Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(sub)}
                      className="p-1.5 rounded-lg bg-[#222834] text-[#B8B8AC] hover:text-[#FECB6E] hover:bg-[#2A3342] transition border border-[#CBA378]/20"
                      title="Edit Subscription"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(sub)}
                      className="p-1.5 rounded-lg bg-[#222834] text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition border border-rose-500/30"
                      title="Delete Subscription"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};