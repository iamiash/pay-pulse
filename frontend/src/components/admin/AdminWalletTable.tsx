import React from 'react';
import { ShieldCheck, CreditCard, Landmark, Smartphone, Lock } from 'lucide-react';

export interface AdminWalletItem {
  id: number;
  user_id: string;
  user_name: string;
  type: 'card' | 'bank' | 'mobile_banking' | string;
  provider: string;
  masked_identifier: string;
  status: 'ACTIVE' | 'PRIMARY' | 'DEFAULT' | 'INACTIVE' | string;
  created_at: string;
  updated_at?: string;
}

export interface AdminWalletTableProps {
  items: AdminWalletItem[];
  loading: boolean;
}

export const AdminWalletTable: React.FC<AdminWalletTableProps> = ({ items, loading }) => {
  const getTypeIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('card') || t.includes('visa') || t.includes('mastercard')) {
      return <CreditCard className="w-4 h-4 text-cyan-400" />;
    }
    if (t.includes('bank')) {
      return <Landmark className="w-4 h-4 text-emerald-400" />;
    }
    return <Smartphone className="w-4 h-4 text-amber-400" />;
  };

  const getStatusBadge = (status: string) => {
    const st = status.toUpperCase();
    if (st === 'PRIMARY' || st === 'DEFAULT' || st === 'ACTIVE') {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
    return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="glass-card-lighter-zenta rounded-3xl border border-[#CBA378]/30 overflow-hidden shadow-2xl">
      <div className="p-4 bg-[#141620]/80 border-b border-[#CBA378]/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#FECB6E]" />
          <span className="text-xs font-black text-white uppercase tracking-wider">PCI-Compliant Masked Instruments</span>
        </div>
        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
          Zero Plain-Text Retention
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#CBA378]/20 bg-[#141620] text-[10px] font-black text-[#FECB6E] uppercase tracking-wider">
              <th className="py-3.5 px-4">User ID</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Provider / Name</th>
              <th className="py-3.5 px-4">Masked Identifier</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Created</th>
              <th className="py-3.5 px-4">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CBA378]/10 text-xs font-semibold text-slate-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#FECB6E] font-bold animate-pulse">
                  Loading PCI Security Encrypted Records...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No payment methods registered matching filters.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-[#2A2D3E]/50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-[#FECB6E]">
                    {item.user_id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 capitalize">
                      {getTypeIcon(item.type)}
                      <span>{item.type.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-white">
                    {item.provider}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-200 tracking-wider">
                    {item.masked_identifier}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A'}
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

export default AdminWalletTable;