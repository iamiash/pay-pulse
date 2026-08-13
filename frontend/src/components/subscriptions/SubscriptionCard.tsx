import React from 'react';
import { Subscription } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { RefreshCw, Calendar, CreditCard, Eye, Edit3, Trash2, Layers } from 'lucide-react';

interface Props {
  subscription: Subscription;
  onClick: () => void;
  onEdit?: (sub: Subscription) => void;
  onDelete?: (sub: Subscription) => void;
}

export const SubscriptionCard: React.FC<Props> = ({ subscription, onClick, onEdit, onDelete }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Active</span>;
      case 'Paused':
        return <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">Paused</span>;
      case 'Cancelled':
      case 'Idle':
        return <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">Cancelled</span>;
      case 'Expired':
        return <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40">Expired</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/40">{status}</span>;
    }
  };

  const getPaymentSourceText = () => {
    if (subscription.payment_type === 'card' && subscription.card) {
      return `${subscription.card.card_type || 'Card'} •${subscription.card.masked_card_number?.slice(-4) || '4921'}`;
    }
    if (subscription.payment_type === 'bank' && subscription.bank) {
      return `${subscription.bank.bank_name || 'Bank'} •${subscription.bank.masked_account_number?.slice(-4) || '1234'}`;
    }
    if (subscription.payment_type === 'mobile_banking' && subscription.mobile) {
      return `${subscription.mobile.provider?.toUpperCase() || 'Mobile'} •${subscription.mobile.mobile_number?.slice(-4) || '5678'}`;
    }
    return 'Visa •4921';
  };

  return (
    <div
      onClick={onClick}
      className="glass-card-lighter-zenta p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between border border-[#CBA378]/30 hover:border-[#FECB6E] hover:shadow-[0_0_20px_rgba(254,203,110,0.3)] hover:-translate-y-1 group relative overflow-hidden space-y-3"
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2.5">
            {subscription.logo_url ? (
              <img
                src={subscription.logo_url}
                alt={subscription.name}
                className="w-8 h-8 rounded-xl object-contain bg-[#171E25] p-1 border border-[#CBA378]/30 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-[#171E25] border border-[#CBA378]/30 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4 text-[#FECB6E]" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="text-sm font-black text-white group-hover:text-[#FECB6E] transition">{subscription.name}</h3>
                {getStatusBadge(subscription.status)}
              </div>
              <p className="text-[11px] text-[#FECB6E] font-bold">{subscription.plan_type || 'Standard'}</p>
            </div>
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onClick}
              className="p-1 rounded-lg bg-[#171E25] text-[#B8B8AC] hover:text-[#38BDF8] border border-[#CBA378]/20 transition"
              title="View Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(subscription)}
                className="p-1 rounded-lg bg-[#171E25] text-[#B8B8AC] hover:text-[#FECB6E] border border-[#CBA378]/20 transition"
                title="Edit Subscription"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(subscription)}
                className="p-1 rounded-lg bg-[#171E25] text-rose-400 hover:text-rose-200 border border-rose-500/30 transition"
                title="Delete Subscription"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-1 bg-[#171E25] p-2.5 rounded-xl border border-[#CBA378]/20 text-xs">
          <p className="text-[#B8B8AC] flex items-center gap-1.5 font-mono">
            <CreditCard className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            {getPaymentSourceText()}
          </p>
          <p className="text-[#B8B8AC] flex items-center gap-1.5 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            Next Renewal: <span className="text-white font-bold">{formatDate(subscription.next_billing_date)}</span>
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-[#CBA378]/20 flex justify-between items-center">
        <div>
          <span className="text-base font-black text-white">
            {subscription.currency === 'BDT' ? '৳' : '$'}{subscription.cost}
          </span>
          <span className="text-[10px] text-[#B8B8AC]">/{subscription.billing_cycle?.toLowerCase() || 'monthly'}</span>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
          subscription.auto_renewal 
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        }`}>
          <RefreshCw className={`w-3 h-3 ${subscription.auto_renewal ? 'animate-spin-slow' : ''}`} />
          {subscription.auto_renewal ? 'Auto-Renew' : 'Manual'}
        </div>
      </div>
    </div>
  );
};