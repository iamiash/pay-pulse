import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  onClick?: () => void;
  accentGlow?: 'indigo' | 'cyan' | 'violet' | 'emerald' | 'rose' | 'amber';
  isActive?: boolean;
}

export const AnalyticsMetricCard: React.FC<Props> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  onClick,
  accentGlow = 'indigo',
  isActive = false
}) => {
  const glowStyles = {
    indigo: 'hover:border-indigo-400 hover:shadow-[0_0_25px_rgba(99,102,241,0.7)]',
    cyan: 'hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.7)]',
    violet: 'hover:border-violet-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]',
    emerald: 'hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.7)]',
    rose: 'hover:border-rose-400 hover:shadow-[0_0_25px_rgba(244,63,94,0.7)]',
    amber: 'hover:border-[#FECB6E] hover:shadow-[0_0_25px_rgba(254,203,110,0.8)]',
  };

  const activeRing = isActive 
    ? 'border-[#FECB6E] shadow-[0_0_25px_rgba(254,203,110,0.8)] scale-[1.02]' 
    : 'border-[#FECB6E]/30';

  return (
    <div
      onClick={onClick}
      className={`bg-[#2A2D3E] p-5 rounded-2xl cursor-pointer hover:-translate-y-1 transition-all duration-300 relative overflow-hidden border shadow-lg ${glowStyles[accentGlow]} ${activeRing}`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-black text-[#FECB6E] uppercase tracking-wider">{title}</span>
        <div className="p-2.5 rounded-xl bg-gradient-to-b from-[#FFE093] to-[#FECB6E] text-[#1A1C23] shadow-[0_3px_0_#9E6F13]">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-black text-white tracking-tight mb-1">{value}</p>
      <p className="text-xs font-bold text-slate-300">{subtitle}</p>
    </div>
  );
};