import React from 'react';
import { CreditCard, Calendar, Tag, ShieldCheck, RefreshCw } from 'lucide-react';
import { AdminGlobalSubscriptionItem } from '../../types';

interface AdminSubscriptionTableProps {
  subscriptions: AdminGlobalSubscriptionItem[];
  loading: boolean;
}

export const AdminSubscriptionTable: React.FC<AdminSubscriptionTableProps> = ({
  subscriptions,
  loading,
}) => {
  const getStatusBadgeClass = (status: string) => {
    const st = (status || 'ACTIVE').toUpperCase();
    if (st === 'ACTIVE') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
    if (st === 'PAUSED' || st === 'IDLE') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    if (st === 'EXPIRED' || st === 'CANCELLED') return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
  };

  return (
    <div className="glass-card-lighter-zenta rounded-3xl border border-[#CBA378]/30 overflow-hidden shadow-2xl backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#CBA378]/20 bg-[#141620]/90 text-[10px] font-black text-[#FECB6E] uppercase tracking-wider">
              <th className="py-3.5 px-4">User ID</th>
              <th className="py-3.5 px-4">Service</th>
              <th className="py-3.5 px-4">Plan</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Currency</th>
              <th className="py-3.5 px-4">Renewal</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Payment Type</th>
              <th className="py-3.5 px-4">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CBA378]/10 text-xs font-semibold text-slate-200">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-[#FECB6E] font-bold">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#FECB6E]" />
                    <span>Fetching Global Subscriptions...</span>
                  </div>
                </td>
              </tr>
            ) : subscriptions.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                  No subscriptions match the applied filter criteria.
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#2A2D3E]/50 transition duration-200">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#FECB6E] whitespace-nowrap">
                    {sub.user_id}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-white whitespace-nowrap flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#2A2D3E] border border-[#FECB6E]/30 flex items-center justify-center text-[#FECB6E]">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    {sub.service}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-lg bg-[#141620] border border-slate-700/60 text-[11px]">
                      {sub.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                    ${sub.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                    {sub.currency}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap font-mono text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Calendar className="w-3 h-3 text-[#FECB6E]" />
                      {sub.next_billing_date}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase ${getStatusBadgeClass(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#141620] text-slate-200 font-medium text-[11px] border border-slate-700/50">
                      <ShieldCheck className="w-3 h-3 text-[#FECB6E]" />
                      {sub.payment_type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px] font-mono">
                    {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};