import React from 'react';
import { WalletBank } from '../../types';
import { BankIcon } from '../icons/BankIcon';
import { Eye, Edit3, Trash2, CheckCircle2 } from 'lucide-react';

interface Props {
  bank: WalletBank;
  usageCount?: number;
  onView?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
}

export const BankCard: React.FC<Props> = ({ bank, usageCount = 0, onView, onEdit, onRemove }) => (
  <div className="glass-card-lighter-zenta p-5 rounded-3xl border border-[#CBA378]/30 hover:border-indigo-400/60 transition flex flex-col justify-between h-52 bg-gradient-to-br from-[#1E2230] via-[#171E25] to-[#12151C] shadow-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shrink-0">
          <BankIcon />
        </div>
        <div className="overflow-hidden">
          <h4 className="text-sm font-black text-white truncate">{bank.bank_name}</h4>
          <p className="text-[10px] text-[#B8B8AC] font-semibold">{bank.branch_name}</p>
        </div>
      </div>
      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1 shrink-0">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active ✓
      </span>
    </div>

    <div className="space-y-1 text-xs">
      <div className="flex justify-between font-semibold">
        <span className="text-[#B8B8AC]">Account:</span>
        <span className="text-[#FECB6E] font-mono font-bold">{bank.masked_account_number}</span>
      </div>
      <div className="flex justify-between font-semibold">
        <span className="text-[#B8B8AC]">Routing:</span>
        <span className="text-white font-mono">{bank.routing_number}</span>
      </div>
      <p className="text-[10px] text-cyan-300 font-bold pt-0.5">
        Used by {usageCount} subscription{usageCount === 1 ? '' : 's'}
      </p>
    </div>

    {/* Action Buttons */}
    <div className="flex items-center gap-2 pt-2 border-t border-[#CBA378]/15">
      <button
        type="button"
        onClick={onView}
        className="flex-1 py-1 rounded-xl bg-[#171E25] hover:bg-[#222834] text-[10px] font-bold text-slate-200 border border-[#CBA378]/20 transition flex items-center justify-center gap-1"
      >
        <Eye className="w-3 h-3 text-cyan-400" /> View
      </button>
      <button
        type="button"
        onClick={onEdit}
        className="flex-1 py-1 rounded-xl bg-[#171E25] hover:bg-[#222834] text-[10px] font-bold text-slate-200 border border-[#CBA378]/20 transition flex items-center justify-center gap-1"
      >
        <Edit3 className="w-3 h-3 text-[#FECB6E]" /> Edit
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="flex-1 py-1 rounded-xl bg-[#171E25] hover:bg-[#222834] text-[10px] font-bold text-rose-300 border border-rose-500/30 transition flex items-center justify-center gap-1"
      >
        <Trash2 className="w-3 h-3 text-rose-400" /> Remove
      </button>
    </div>
  </div>
);