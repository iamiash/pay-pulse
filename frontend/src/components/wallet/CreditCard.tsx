import React, { useState } from 'react';
import { WalletCard } from '../../types';
import { CardIcons } from '../icons/CardIcons';
import { ShieldCheck, Eye, EyeOff, Edit3, Trash2, CheckCircle2 } from 'lucide-react';

interface Props {
  card: WalletCard;
  usageCount?: number;
  onView?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
}

export const CreditCard: React.FC<Props> = ({ card, usageCount = 0, onView, onEdit, onRemove }) => {
  return (
    <div className="glass-card-lighter-zenta p-5 rounded-3xl border border-[#CBA378]/30 hover:border-rose-400/60 transition relative flex flex-col justify-between h-52 group bg-gradient-to-br from-[#1E2230] via-[#171E25] to-[#12151C] shadow-lg">
      
      {/* Brand & Type */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#FECB6E]">
            {card.card_type.toUpperCase()}
          </span>
          <p className="text-[11px] text-[#B8B8AC] font-semibold truncate max-w-[160px]">
            {card.card_title || `${card.card_type} Account`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active ✓
          </span>
          <div className="shrink-0">
            <CardIcons type={card.card_type} />
          </div>
        </div>
      </div>

      {/* Masked Card Number */}
      <div className="space-y-1">
        <p className="text-lg font-mono font-bold tracking-widest text-white drop-shadow-sm">
          {card.masked_card_number}
        </p>
        <div className="flex justify-between items-center text-xs text-[#B8B8AC] font-semibold">
          <p>Expires <span className="text-white font-mono font-bold">{card.expiry_date}</span></p>
          <p className="text-[10px] text-cyan-300 font-bold">
            Used by {usageCount} subscription{usageCount === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {/* Action Buttons: [View] [Edit] [Remove] */}
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
};