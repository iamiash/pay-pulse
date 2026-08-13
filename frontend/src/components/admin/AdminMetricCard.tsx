import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminMetricCardProps {
  title: string;
  value: number | string;
  subtext?: string;
  icon: LucideIcon;
  badgeText?: string;
  colorScheme?: 'gold' | 'emerald' | 'rose' | 'amber' | 'indigo' | 'cyan';
  onClick?: () => void;
  isActive?: boolean;
}

export const AdminMetricCard: React.FC<AdminMetricCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  badgeText,
  colorScheme = 'gold',
  onClick,
  isActive = false,
}) => {
  const schemeStyles = {
    gold: {
      border: 'border-[#FECB6E]/40',
      bg: 'bg-[#2A2D3E]',
      iconBg: 'bg-[#FECB6E]/10 border-[#FECB6E]/30 text-[#FECB6E]',
      badge: 'bg-[#FECB6E]/20 text-[#FECB6E] border-[#FECB6E]/40',
      glow: 'hover:shadow-[0_0_20px_rgba(254,203,110,0.3)]',
    },
    emerald: {
      border: 'border-emerald-500/40',
      bg: 'bg-[#2A2D3E]',
      iconBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    },
    rose: {
      border: 'border-rose-500/40',
      bg: 'bg-[#2A2D3E]',
      iconBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      badge: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      glow: 'hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]',
    },
    amber: {
      border: 'border-amber-500/40',
      bg: 'bg-[#2A2D3E]',
      iconBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    },
    indigo: {
      border: 'border-indigo-500/40',
      bg: 'bg-[#2A2D3E]',
      iconBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
      badge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
      glow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]',
    },
    cyan: {
      border: 'border-cyan-500/40',
      bg: 'bg-[#2A2D3E]',
      iconBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
      glow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    },
  }[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-3xl ${schemeStyles.bg} border ${
        isActive ? 'border-white ring-2 ring-[#FECB6E] scale-[1.02]' : schemeStyles.border
      } ${schemeStyles.glow} transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl group relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none" />

      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-2xl border ${schemeStyles.iconBg} transition-transform group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
        {badgeText && (
          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${schemeStyles.badge}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-[10px] font-extrabold text-[#B8B8AC] uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-white tracking-tight">{value}</p>
        {subtext && <p className="text-[10px] font-semibold text-slate-400">{subtext}</p>}
      </div>
    </div>
  );
};