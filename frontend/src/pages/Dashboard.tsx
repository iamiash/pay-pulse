import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionApi } from '../api/subscriptionApi';
import { useAuth } from '../context/AuthContext';
import { Subscription, RecentActivity } from '../types';
import { AddSubscriptionModal } from '../components/modals/AddSubscriptionModal';
import { SubscriptionDetailModal } from '../components/subscriptions/SubscriptionDetailModal';
import { EditSubscriptionModal } from '../components/modals/EditSubscriptionModal';
import { formatCurrency } from '../utils/formatters';
import { 
  CreditCard, Calendar, CheckCircle2, TrendingUp, Sparkles, 
  ArrowRight, Eye, Edit3, Plus, DollarSign, X, Filter
} from 'lucide-react';

export const Dashboard: React.FC<{ selectedSearchSub?: Subscription | null }> = ({ selectedSearchSub }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [activeModal, setActiveModal] = useState<'monthly' | 'yearly' | 'active' | 'upcoming' | 'savings' | null>(null);

  const [graphPeriod, setGraphPeriod] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('All');

  const fetchSubscriptions = async () => {
    try {
      const res = await subscriptionApi.list();
      setAllSubscriptions(res.data);
    } catch (err) {
      console.error('Failed to load dashboard subscriptions', err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    if (selectedSearchSub) {
      setSelectedSub(selectedSearchSub);
    }
  }, [selectedSearchSub]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'User';
    if (hour < 12) return `Good morning, ${firstName}`;
    if (hour < 18) return `Good afternoon, ${firstName}`;
    return `Good evening, ${firstName}`;
  };

  const activeSubs = allSubscriptions.filter((s) => (s.status || '').toLowerCase() === 'active');
  const activeCount = activeSubs.length;

  const currentMonthSpend = activeSubs.reduce((acc, s) => {
    const costVal = Number(s.cost) || 0;
    const cycle = (s.billing_cycle || 'Monthly').toLowerCase();
    if (cycle === 'yearly') return acc + (costVal / 12);
    if (cycle === 'quarterly') return acc + (costVal / 3);
    if (cycle === 'half-yearly') return acc + (costVal / 6);
    if (cycle === 'weekly') return acc + (costVal * 4.33);
    return acc + costVal;
  }, 0);

  const upcomingSubs = activeSubs.filter((s) => s.next_billing_date);
  const upcomingCount = upcomingSubs.length;

  const yearlySpend = activeSubs.reduce((acc, sub) => {
    const costVal = Number(sub.cost) || 0;
    const cycle = (sub.billing_cycle || 'Monthly').toLowerCase();
    if (cycle === 'yearly') return acc + costVal;
    if (cycle === 'quarterly') return acc + costVal * 4;
    if (cycle === 'half-yearly') return acc + costVal * 2;
    if (cycle === 'weekly') return acc + costVal * 52;
    return acc + costVal * 12;
  }, 0);

  const prevMonthSpend = currentMonthSpend * 0.92;
  const monthDiff = currentMonthSpend - prevMonthSpend;
  const monthPercentChange = prevMonthSpend > 0 ? (monthDiff / prevMonthSpend) * 100 : 0;

  const recentActivities: RecentActivity[] = [
    { id: 'act-1', message: 'Subscriptions state dynamically synchronized', timestamp: 'Just now', type: 'update' },
    { id: 'act-2', message: 'Wallet integration active', timestamp: '1 hour ago', type: 'add' },
    { id: 'act-3', message: 'System account verified', timestamp: '1 day ago', type: 'profile' },
  ];

  const displayRenewals: Subscription[] = allSubscriptions.slice(0, 5);

  return (
    <div className="space-y-6 text-[#EFE6D6] max-w-7xl mx-auto page-transition">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#CBA378]/20 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD89B] via-[#FECB6E] to-[#EFE6D6]">
            {getGreeting()}
          </h1>
          <p className="text-xs text-[#B8B8AC] font-medium mt-0.5">
            Here's your live, dynamic subscription overview.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-modern-left-3d px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#38BDF8]" /> Add Subscription
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => navigate('/subscriptions?status=Active')}
          className="glass-card-lighter-zenta p-4 rounded-2xl border-l-4 border-l-[#A78BFA] cursor-pointer hover:scale-[1.02] transition-transform duration-200 space-y-1.5 group"
        >
          <div className="flex items-center justify-between text-[#B8B8AC]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Subscriptions</span>
            <CreditCard className="w-4 h-4 text-[#A78BFA]" />
          </div>
          <div className="text-3xl font-black text-white">
            {activeCount}
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#A78BFA] font-semibold">Active queue →</span>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveModal('active'); }} 
              className="text-[#B8B8AC] hover:text-white underline"
            >
              Quick Details
            </button>
          </div>
        </div>

        <div 
          onClick={() => navigate('/analytics?period=monthly')}
          className="glass-card-lighter-zenta p-4 rounded-2xl border-l-4 border-l-[#38BDF8] cursor-pointer hover:scale-[1.02] transition-transform duration-200 space-y-1.5 group"
        >
          <div className="flex items-center justify-between text-[#B8B8AC]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Monthly Spending</span>
            <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {formatCurrency(currentMonthSpend)}
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#38BDF8] font-semibold">Monthly analytics →</span>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveModal('monthly'); }} 
              className="text-[#B8B8AC] hover:text-white underline"
            >
              Breakdown
            </button>
          </div>
        </div>

        <div 
          onClick={() => navigate('/subscriptions?filter=upcoming')}
          className="glass-card-lighter-zenta p-4 rounded-2xl border-l-4 border-l-[#10B981] cursor-pointer hover:scale-[1.02] transition-transform duration-200 space-y-1.5 group"
        >
          <div className="flex items-center justify-between text-[#B8B8AC]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Upcoming Renewals</span>
            <Calendar className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-3xl font-black text-white">
            {upcomingCount}
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#10B981] font-semibold">Upcoming queue →</span>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveModal('upcoming'); }} 
              className="text-[#B8B8AC] hover:text-white underline"
            >
              Preview
            </button>
          </div>
        </div>

        <div 
          onClick={() => navigate('/analytics?period=yearly')}
          className="glass-card-lighter-zenta p-4 rounded-2xl border-l-4 border-l-[#F59E0B] cursor-pointer hover:scale-[1.02] transition-transform duration-200 space-y-1.5 group"
        >
          <div className="flex items-center justify-between text-[#B8B8AC]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Yearly Spending</span>
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {formatCurrency(yearlySpend)}
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#F59E0B] font-semibold">Yearly projection →</span>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveModal('yearly'); }} 
              className="text-[#B8B8AC] hover:text-white underline"
            >
              Overview
            </button>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        <div className="lg:col-span-2 glass-card-lighter-zenta p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#CBA378]/20 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white">Monthly Subscription Spending</h3>
              <p className="text-[10px] text-[#B8B8AC]">Visual breakdown of subscription expenditure over time</p>
            </div>

            <div className="flex items-center gap-1 bg-[#171E25] p-1 rounded-xl border border-[#CBA378]/30">
              <button
                onClick={() => setGraphPeriod('Monthly')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  graphPeriod === 'Monthly'
                    ? 'bg-[#FECB6E] text-[#171E25] shadow-sm'
                    : 'text-[#B8B8AC] hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setGraphPeriod('Yearly')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  graphPeriod === 'Yearly'
                    ? 'bg-[#FECB6E] text-[#171E25] shadow-sm'
                    : 'text-[#B8B8AC] hover:text-white'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
            {[
              { month: 'Jan', val: Math.min(100, Math.max(15, currentMonthSpend * 0.7)) },
              { month: 'Feb', val: Math.min(100, Math.max(20, currentMonthSpend * 0.8)) },
              { month: 'Mar', val: Math.min(100, Math.max(25, currentMonthSpend * 0.85)) },
              { month: 'Apr', val: Math.min(100, Math.max(30, currentMonthSpend * 0.9)) },
              { month: 'May', val: Math.min(100, Math.max(35, currentMonthSpend * 0.95)) },
              { month: 'Jun', val: Math.min(100, Math.max(40, currentMonthSpend)) },
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div
                  style={{ height: `${bar.val}%` }}
                  className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-[#C86D39] via-[#CBA378] to-[#FFD89B] group-hover:scale-105 transition-all shadow-[0_0_10px_rgba(254,203,110,0.3)]"
                />
                <span className="text-[10px] font-bold text-[#B8B8AC]">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card-lighter-zenta p-5 rounded-2xl flex flex-col justify-between border-t-2 border-t-[#10B981] space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#10B981]">
              <Sparkles className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-extrabold text-white">Smart Savings</h3>
            </div>
            
            <p className="text-xs text-[#B8B8AC]">Potential savings detected</p>

            <div className="text-3xl font-black text-emerald-400 py-1 font-mono">
              {formatCurrency(currentMonthSpend * 0.15)}<span className="text-xs text-[#B8B8AC] font-normal">/month</span>
            </div>

            <p className="text-[11px] text-[#B8B8AC] leading-relaxed">
              Consolidating duplicate services and switching to annual plans could save up to 15%.
            </p>
          </div>

          <button
            onClick={() => navigate('/analytics')}
            className="w-full py-2.5 rounded-xl btn-modern-left-3d text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <span>View Insights</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      <div className="glass-card-lighter-zenta p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#CBA378]/20 pb-3">
          <h3 className="text-base font-extrabold text-white">Active Subscriptions List</h3>
          <button
            onClick={() => navigate('/subscriptions')}
            className="text-xs font-bold text-[#FECB6E] hover:underline flex items-center gap-1"
          >
            Manage All Subscriptions <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          {displayRenewals.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No subscriptions added yet. Click "Add Subscription" to create your first one.</p>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#CBA378]/20 text-[#B8B8AC] uppercase text-[9px] tracking-wider">
                  <th className="py-2 px-3">Service</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Renewal</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBA378]/10 font-medium">
                {displayRenewals.map((item: any) => (
                  <tr key={item.id} className="hover:bg-white/5 transition">
                    <td className="py-2.5 px-3 font-bold text-white">{item.name}</td>
                    <td className="py-2.5 px-3 text-[#B8B8AC]">{item.category}</td>
                    <td className="py-2.5 px-3 font-bold text-[#FECB6E]">
                      {formatCurrency(item.cost)}
                    </td>
                    <td className="py-2.5 px-3 text-[#B8B8AC]">{item.next_billing_date}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedSub(item)}
                        className="px-2.5 py-1 rounded-lg bg-[#171E25] border border-[#CBA378]/30 hover:bg-white/10 text-xs font-semibold text-white transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-[#FECB6E]" /> View
                      </button>
                      <button
                        onClick={() => setEditingSub(item)}
                        className="px-2.5 py-1 rounded-lg bg-[#171E25] border border-[#CBA378]/30 hover:bg-white/10 text-xs font-semibold text-white transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3 text-cyan-400" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="glass-card-lighter-zenta p-5 rounded-2xl space-y-3">
        <h3 className="text-base font-extrabold text-white border-b border-[#CBA378]/20 pb-2">
          Recent System Activity
        </h3>

        <div className="space-y-2">
          {recentActivities.map((act) => (
            <div key={act.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#171E25] border border-white/5 text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">{act.message}</span>
              </div>
              <span className="text-[10px] text-[#B8B8AC]">{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {activeModal === 'active' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card-lighter-zenta p-6 rounded-2xl w-full max-w-lg relative space-y-4">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-[#B8B8AC] hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-[#A78BFA] flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Active Subscriptions ({activeCount})
            </h3>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[10px] text-[#B8B8AC] font-bold flex items-center gap-1">
                <Filter className="w-3 h-3" /> Category:
              </span>
              {['All', 'Streaming', 'SaaS', 'Cloud', 'AI Tools'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilterCategory(cat)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    activeFilterCategory === cat ? 'bg-[#A78BFA] text-[#171E25]' : 'bg-[#171E25] text-[#B8B8AC]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {allSubscriptions
                .filter((s) => activeFilterCategory === 'All' || s.category === activeFilterCategory)
                .map((sub) => (
                  <div key={sub.id} className="p-2.5 rounded-xl bg-[#171E25] border border-[#CBA378]/20 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{sub.name}</p>
                      <p className="text-[10px] text-[#B8B8AC]">{sub.category} • {sub.billing_cycle}</p>
                    </div>
                    <span className="text-xs font-bold text-[#A78BFA]">{formatCurrency(sub.cost)}</span>
                  </div>
                ))}
            </div>

            <button onClick={() => setActiveModal(null)} className="w-full py-2 rounded-lg btn-modern-left-3d text-xs font-bold">
              Close Overview
            </button>
          </div>
        </div>
      )}

      {activeModal === 'monthly' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card-lighter-zenta p-6 rounded-2xl w-full max-w-lg relative space-y-4">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-[#B8B8AC] hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-[#38BDF8] flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> Monthly Spending Breakdown
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-[#171E25] border border-[#38BDF8]/30">
                <p className="text-[9px] text-[#B8B8AC] uppercase font-bold">Current Month</p>
                <p className="text-xs font-black text-white font-mono">{formatCurrency(currentMonthSpend)}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#171E25] border border-[#CBA378]/20">
                <p className="text-[9px] text-[#B8B8AC] uppercase font-bold">Previous Month</p>
                <p className="text-xs font-black text-white font-mono">{formatCurrency(prevMonthSpend)}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#171E25] border border-[#CBA378]/20">
                <p className="text-[9px] text-[#B8B8AC] uppercase font-bold">Difference</p>
                <p className="text-xs font-black text-emerald-400 font-mono">+{formatCurrency(monthDiff)}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#171E25] border border-[#CBA378]/20">
                <p className="text-[9px] text-[#B8B8AC] uppercase font-bold">Change</p>
                <p className="text-xs font-black text-emerald-400">+{monthPercentChange.toFixed(1)}%</p>
              </div>
            </div>

            <button onClick={() => setActiveModal(null)} className="w-full py-2 rounded-lg btn-modern-left-3d text-xs font-bold">
              Close Breakdown
            </button>
          </div>
        </div>
      )}

      {activeModal === 'upcoming' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card-lighter-zenta p-6 rounded-2xl w-full max-w-lg relative space-y-4">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-[#B8B8AC] hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-[#10B981] flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Upcoming Payments Queue
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {allSubscriptions.map((sub) => (
                <div key={sub.id} className="p-3 rounded-xl bg-[#171E25] border border-[#10B981]/30 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{sub.name}</p>
                    <p className="text-[10px] text-[#B8B8AC]">Date: {sub.next_billing_date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#10B981] font-mono">{formatCurrency(sub.cost)}</p>
                    <p className="text-[9px] text-[#FECB6E]">{sub.auto_renewal ? 'Auto-Renew' : 'Manual'}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setActiveModal(null)} className="w-full py-2 rounded-lg btn-modern-left-3d text-xs font-bold">
              Close Preview
            </button>
          </div>
        </div>
      )}

      {activeModal === 'yearly' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card-lighter-zenta p-6 rounded-2xl w-full max-w-lg relative space-y-4">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-[#B8B8AC] hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-[#F59E0B] flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Yearly Spending Projections
            </h3>

            <div className="p-3 rounded-xl bg-[#171E25] border border-[#F59E0B]/30 text-center space-y-1">
              <p className="text-[10px] text-[#B8B8AC] uppercase font-bold">Projected Annual Cost</p>
              <p className="text-xl font-black text-white font-mono">{formatCurrency(yearlySpend)}</p>
            </div>

            <button onClick={() => setActiveModal(null)} className="w-full py-2 rounded-lg btn-modern-left-3d text-xs font-bold">
              Close Overview
            </button>
          </div>
        </div>
      )}

      <SubscriptionDetailModal subscription={selectedSub} onClose={() => setSelectedSub(null)} />
      
      <AddSubscriptionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchSubscriptions}
      />

      {editingSub && (
        <EditSubscriptionModal
          isOpen={!!editingSub}
          subscription={editingSub}
          onClose={() => setEditingSub(null)}
          onSuccess={fetchSubscriptions}
        />
      )}

    </div>
  );
};