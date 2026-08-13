import React from 'react';
import { Subscription } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  X, Calendar, ShieldCheck, Mail, Phone, CreditCard as CardIcon, 
  Sparkles, Globe, ExternalLink, TrendingUp 
} from 'lucide-react';

interface Props {
  subscription: Subscription | null;
  onClose: () => void;
}

export const SubscriptionDetailModal: React.FC<Props> = ({ subscription, onClose }) => {
  if (!subscription) return null;

  const annualEquivalent = subscription.billing_cycle === 'Yearly' ? subscription.cost : subscription.cost * 12;

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

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-hidden">
      <div className="glass-card-lighter-zenta rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative text-white space-y-4 max-h-[88vh] overflow-y-auto my-auto border border-[#CBA378]/40 bg-gradient-to-b from-[#2A2D3E]/95 via-[#222533]/98 to-[#1A1D27]/98 backdrop-blur-2xl custom-scrollbar">
        
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#171E25] text-[#B8B8AC] hover:text-[#FECB6E] border border-[#CBA378]/20 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pr-8 space-y-1 border-b border-[#CBA378]/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-[#171E25] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#171E25]" />
              {subscription.category || 'Subscription'}
            </span>
            {getStatusBadge(subscription.status)}
          </div>
          <h2 className="text-2xl font-black text-white pt-1">{subscription.name}</h2>
          <p className="text-xs text-[#B8B8AC] font-semibold">{subscription.plan_type || 'Standard Plan'} • Provider: {subscription.provider || 'PayPulse Partner'}</p>
        </div>

        {/* Glossy Metrics Row */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="bg-[#171E25] p-3 rounded-xl border border-[#CBA378]/20">
            <p className="text-[9px] font-bold text-[#B8B8AC] uppercase">Billing Cost</p>
            <p className="text-base font-black text-[#FECB6E] mt-0.5">
              {subscription.currency === 'BDT' ? '৳' : '$'}{subscription.cost}
            </p>
          </div>
          <div className="bg-[#171E25] p-3 rounded-xl border border-[#CBA378]/20">
            <p className="text-[9px] font-bold text-[#B8B8AC] uppercase">Annual Cost</p>
            <p className="text-base font-black text-emerald-400 mt-0.5">{formatCurrency(annualEquivalent)}</p>
          </div>
          <div className="bg-[#171E25] p-3 rounded-xl border border-[#CBA378]/20">
            <p className="text-[9px] font-bold text-[#B8B8AC] uppercase">Cycle</p>
            <p className="text-base font-black text-cyan-400 mt-0.5">{subscription.billing_cycle || 'Monthly'}</p>
          </div>
        </div>

        {/* Account & Service Information */}
        <div className="p-3.5 rounded-xl bg-[#171E25] border border-[#CBA378]/20 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[#B8B8AC] flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#FECB6E]" /> Account Email:</span>
            <span className="font-bold text-white truncate max-w-[200px]">{subscription.associated_email || 'N/A'}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#B8B8AC] flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-cyan-400" /> Contact Number:</span>
            <span className="font-bold text-white">{subscription.associated_contact || 'N/A'}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#B8B8AC] flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-emerald-400" /> Next Renewal:</span>
            <span className="font-bold text-emerald-400">{formatDate(subscription.next_billing_date)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#B8B8AC] flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Renewal Policy:</span>
            <span className="font-bold text-white">{subscription.auto_renewal ? 'Auto-Renewal Enabled' : 'Manual Renewal'}</span>
          </div>

          {subscription.website && (
            <div className="flex justify-between items-center border-t border-[#CBA378]/10 pt-1.5">
              <span className="text-[#B8B8AC] flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-sky-400" /> Website:</span>
              <a href={subscription.website} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline font-bold flex items-center gap-1">
                Visit Link <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Connected Payment Source Box */}
        <div className="bg-[#171E25] border border-[#CBA378]/30 p-3 rounded-xl">
          <p className="text-[10px] font-black text-[#FECB6E] uppercase mb-1 flex items-center gap-1.5">
            <CardIcon className="w-3.5 h-3.5" /> Connected Payment Source ({(subscription.payment_type || 'CARD').toUpperCase()})
          </p>
          {subscription.bank && (
            <p className="text-xs text-white font-bold">{subscription.bank.bank_name} • {subscription.bank.masked_account_number}</p>
          )}
          {subscription.card && (
            <p className="text-xs text-white font-bold">{subscription.card.card_title} • {subscription.card.masked_card_number} ({subscription.card.card_type})</p>
          )}
          {subscription.mobile && (
            <p className="text-xs text-white font-bold">{subscription.mobile.provider.toUpperCase()} • {subscription.mobile.mobile_number}</p>
          )}
          {!subscription.bank && !subscription.card && !subscription.mobile && (
            <p className="text-xs text-[#B8B8AC]">Visa •4921</p>
          )}
        </div>

        {/* Notes Section if present */}
        {subscription.notes && (
          <div className="p-3 rounded-xl bg-[#171E25] border border-[#CBA378]/20 space-y-1 text-xs">
            <p className="text-[10px] font-black text-[#FECB6E] uppercase">Notes</p>
            <p className="text-[#B8B8AC] italic">{subscription.notes}</p>
          </div>
        )}

        {/* Spending History Projection */}
        <div className="p-3 rounded-xl bg-[#171E25] border border-[#CBA378]/20 space-y-2">
          <p className="text-[10px] font-black text-[#FECB6E] uppercase flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Spending History & Projection
          </p>
          <div className="h-16 flex items-end justify-between gap-2 pt-2 px-1">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full max-w-[16px] h-full rounded-t bg-gradient-to-t from-[#C86D39] to-[#FECB6E]" />
                <span className="text-[9px] text-[#B8B8AC] font-semibold">{m}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};