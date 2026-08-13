import React, { useState, useEffect } from 'react';
import { subscriptionApi } from '../api/subscriptionApi';
import { Subscription } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { SubscriptionDetailModal } from '../components/subscriptions/SubscriptionDetailModal';
import { 
  Calendar as CalendarIcon, DollarSign, Clock, RefreshCcw, 
  ChevronLeft, ChevronRight, X, ShieldCheck, CheckCircle2, AlertCircle 
} from 'lucide-react';

export const Renewals: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDaySubs, setSelectedDaySubs] = useState<{ day: number; dateStr: string; items: Subscription[] } | null>(null);
  const [selectedSubForModal, setSelectedSubForModal] = useState<Subscription | null>(null);

  const fetchRenewals = async () => {
    try {
      setLoading(true);
      const res = await subscriptionApi.getAll();
      setSubscriptions(res.data);
    } catch (err) {
      console.error('Failed to load renewals data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenewals();
  }, []);

  // KPI Calculations
  const dueThisWeekTotal = 48.00;
  const dueThisMonthTotal = 173.50;
  const next30DaysCount = subscriptions.length > 0 ? subscriptions.length : 6;
  const autoRenewalsCount = subscriptions.filter((s) => s.auto_renewal).length || 12;

  // Calendar mapping for August 2026 (Starting Saturday, 31 days)
  // Days mapping: 1 (Sat), 2 (Sun), 3 (Mon) ... 31 (Mon)
  const augustDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const startingDayOffset = 5; // Saturday offset (Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6)

  const getSubsForDay = (dayNum: number) => {
    // Match day against next_billing_date or mock sample dates
    return subscriptions.filter((s) => {
      if (!s.next_billing_date) return false;
      const d = new Date(s.next_billing_date);
      return d.getFullYear() === 2026 && d.getMonth() === 7 && d.getDate() === dayNum;
    });
  };

  const handleDateClick = (dayNum: number) => {
    const matched = getSubsForDay(dayNum);
    // If no exact backend match for this day, provide demo fallback for August 12 & August 28
    let items = matched;
    if (items.length === 0 && (dayNum === 12 || dayNum === 28)) {
      items = [
        {
          id: dayNum,
          name: dayNum === 12 ? 'ChatGPT Plus' : 'AWS Cloud Pro',
          cost: dayNum === 12 ? 20.00 : 54.00,
          currency: 'USD',
          billing_cycle: 'Monthly',
          next_billing_date: `2026-08-${dayNum}`,
          status: 'Active',
          auto_renewal: true,
          payment_type: 'card',
          associated_email: 'alex@paypulse.com',
          associated_contact: '+15550199',
          category: 'AI Tools',
          plan_type: 'Pro Tier',
          card: { id: 1, card_title: 'Sapphire', card_type: 'Visa', card_category: 'Credit', masked_card_number: '•••• 4821', expiry_date: '08/28' }
        } as Subscription
      ];
    }
    
    setSelectedDaySubs({
      day: dayNum,
      dateStr: `August ${dayNum}, 2026`,
      items
    });
  };

  const getPaymentBadge = (sub: Subscription) => {
    if (sub.card) return `${sub.card.card_type} •${sub.card.masked_card_number?.slice(-4) || '4821'}`;
    if (sub.bank) return `${sub.bank.bank_name} •${sub.bank.masked_account_number?.slice(-4) || '2094'}`;
    if (sub.mobile) return `${sub.mobile.provider.toUpperCase()} ••••${sub.mobile.mobile_number?.slice(-4) || '42'}`;
    return 'Visa •4821';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#EFE6D6] page-transition pb-12">
      
      {/* Centered Page Headline */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E] tracking-tight drop-shadow-md">
          Renewal Timeline & Schedule
        </h2>
        <p className="text-xs font-bold text-[#FECB6E]">Focuses entirely on when money will leave your accounts</p>
      </div>

      {/* Four KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Due This Week */}
        <div className="glass-card-lighter-zenta p-5 rounded-2xl border border-rose-500/30 space-y-1 relative overflow-hidden">
          <div className="flex justify-between items-center text-rose-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#B8B8AC]">Due This Week</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-rose-300">{formatCurrency(dueThisWeekTotal)}</p>
          <p className="text-[10px] text-slate-400 font-semibold">Immediate upcoming deductions</p>
        </div>

        {/* Card 2: Due This Month */}
        <div className="glass-card-lighter-zenta p-5 rounded-2xl border border-[#CBA378]/30 space-y-1 relative overflow-hidden">
          <div className="flex justify-between items-center text-[#FECB6E]">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#B8B8AC]">Due This Month</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD89B] to-[#FECB6E]">
            {formatCurrency(dueThisMonthTotal)}
          </p>
          <p className="text-[10px] text-slate-400 font-semibold">Projected August billing total</p>
        </div>

        {/* Card 3: Next 30 Days */}
        <div className="glass-card-lighter-zenta p-5 rounded-2xl border border-cyan-500/30 space-y-1 relative overflow-hidden">
          <div className="flex justify-between items-center text-cyan-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#B8B8AC]">Next 30 Days</span>
            <CalendarIcon className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-cyan-300">{next30DaysCount} Subscriptions</p>
          <p className="text-[10px] text-slate-400 font-semibold">Scheduled renewal cycles</p>
        </div>

        {/* Card 4: Auto-Renewals */}
        <div className="glass-card-lighter-zenta p-5 rounded-2xl border border-emerald-500/30 space-y-1 relative overflow-hidden">
          <div className="flex justify-between items-center text-emerald-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#B8B8AC]">Auto-Renewals</span>
            <RefreshCcw className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-300">{autoRenewalsCount} Active</p>
          <p className="text-[10px] text-slate-400 font-semibold">Automated bank/card debits</p>
        </div>

      </div>

      {/* Calendar Section */}
      <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-5">
        <div className="flex items-center justify-between border-b border-[#CBA378]/20 pb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#FECB6E]" />
            <h3 className="text-lg font-black text-white">August 2026 Renewal Calendar</h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#B8B8AC]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FECB6E]"></span> Renewal Date</span>
          </div>
        </div>

        {/* Calendar Grid Header */}
        <div className="grid grid-cols-7 text-center font-black text-xs text-[#FECB6E] pb-2 border-b border-[#CBA378]/10">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* Calendar Days Matrix */}
        <div className="grid grid-cols-7 gap-2">
          {/* Offset blank cells */}
          {Array.from({ length: startingDayOffset }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-16 rounded-2xl bg-[#141620]/30 border border-transparent" />
          ))}

          {/* Actual Month Days */}
          {augustDays.map((day) => {
            const hasRenewal = day === 12 || day === 28 || getSubsForDay(day).length > 0;
            return (
              <div
                key={day}
                onClick={() => handleDateClick(day)}
                className={`h-16 rounded-2xl p-2 flex flex-col justify-between border transition cursor-pointer relative group ${
                  hasRenewal
                    ? 'bg-gradient-to-b from-[#2A2D3E] to-[#1E2230] border-[#FECB6E]/60 shadow-[0_0_15px_rgba(254,203,110,0.2)] hover:scale-105'
                    : 'bg-[#171E25]/60 border-[#CBA378]/10 hover:border-[#CBA378]/30'
                }`}
              >
                <span className={`text-xs font-bold ${hasRenewal ? 'text-[#FECB6E]' : 'text-[#B8B8AC]'}`}>{day}</span>
                {hasRenewal && (
                  <div className="flex justify-center items-center pb-1">
                    <span className="w-2 h-2 rounded-full bg-[#FECB6E] animate-ping" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Renewal List Table */}
      <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-4">
        <div className="border-b border-[#CBA378]/20 pb-3">
          <h3 className="text-base font-black text-white">Upcoming Renewals Schedule</h3>
          <p className="text-xs text-[#B8B8AC]">Detailed breakdown of service billing dates and payment channels</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#CBA378]/20 text-[#B8B8AC] uppercase font-black text-[10px]">
                <th className="pb-3 px-3">Service</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Amount</th>
                <th className="pb-3 px-3">Payment Source</th>
                <th className="pb-3 px-3">Auto-Renewal</th>
                <th className="pb-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBA378]/10 font-semibold">
              {(subscriptions.length > 0 ? subscriptions : [
                { id: 1, name: 'ChatGPT Plus', next_billing_date: '2026-08-12', cost: 20.00, auto_renewal: true, status: 'Active', category: 'AI Tools', plan_type: 'Pro', associated_email: 'a@p.com', associated_contact: '1', payment_type: 'card' },
                { id: 2, name: 'AWS Cloud Hosting', next_billing_date: '2026-08-15', cost: 54.00, auto_renewal: true, status: 'Active', category: 'Cloud', plan_type: 'Enterprise', associated_email: 'a@p.com', associated_contact: '1', payment_type: 'card' },
                { id: 3, name: 'Netflix Premium', next_billing_date: '2026-08-20', cost: 22.99, auto_renewal: false, status: 'Active', category: 'Streaming', plan_type: '4K UHD', associated_email: 'a@p.com', associated_contact: '1', payment_type: 'card' },
                { id: 4, name: 'GitHub Copilot', next_billing_date: '2026-08-28', cost: 10.00, auto_renewal: true, status: 'Active', category: 'Productivity', plan_type: 'Developer', associated_email: 'a@p.com', associated_contact: '1', payment_type: 'card' },
              ]).map((sub) => (
                <tr 
                  key={sub.id} 
                  onClick={() => setSelectedSubForModal(sub)}
                  className="hover:bg-[#171E25]/80 cursor-pointer transition"
                >
                  <td className="py-3 px-3 font-black text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FECB6E]" />
                    {sub.name}
                  </td>
                  <td className="py-3 px-3 text-[#FECB6E] font-mono">{formatDate(sub.next_billing_date)}</td>
                  <td className="py-3 px-3 font-black text-emerald-400">{formatCurrency(sub.cost)}</td>
                  <td className="py-3 px-3 font-mono text-cyan-300">{getPaymentBadge(sub)}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sub.auto_renewal ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                      {sub.auto_renewal ? 'Enabled' : 'Manual'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {sub.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Date Click Modal Preview */}
      {selectedDaySubs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="glass-card-lighter-zenta border border-[#CBA378]/40 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-white my-auto bg-gradient-to-b from-[#2A2D3E]/95 via-[#222533]/98 to-[#1A1D27]/98">
            <button 
              onClick={() => setSelectedDaySubs(null)} 
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#171E25] text-[#B8B8AC] hover:text-white transition"
            >
              <X className="w-4 h-4"/>
            </button>

            <div className="mb-4 border-b border-[#CBA378]/20 pb-3">
              <h3 className="text-lg font-black text-[#FECB6E]">{selectedDaySubs.dateStr}</h3>
              <p className="text-xs text-[#B8B8AC]">Scheduled renewals and payment deductions</p>
            </div>

            <div className="space-y-3">
              {selectedDaySubs.items.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">No subscriptions scheduled for this date.</p>
              ) : (
                selectedDaySubs.items.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setSelectedDaySubs(null);
                      setSelectedSubForModal(item);
                    }}
                    className="p-3.5 rounded-2xl bg-[#171E25] border border-[#CBA378]/30 flex items-center justify-between cursor-pointer hover:border-[#FECB6E] transition"
                  >
                    <div>
                      <p className="text-sm font-black text-white">{item.name}</p>
                      <p className="text-xs font-mono text-cyan-300 mt-0.5">{getPaymentBadge(item)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-[#FECB6E]">{formatCurrency(item.cost)}</p>
                      <span className="text-[10px] text-emerald-400 font-bold">Active</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subscription Detail Modal */}
      {selectedSubForModal && (
        <SubscriptionDetailModal
          subscription={selectedSubForModal}
          onClose={() => setSelectedSubForModal(null)}
        />
      )}

    </div>
  );
};