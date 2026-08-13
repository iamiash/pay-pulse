import React, { useState, useEffect } from 'react';
import { reportApi } from '../api/reportApi';
import { subscriptionApi } from '../api/subscriptionApi';
import { AnalyticsResponse, Subscription } from '../types';
import { formatCurrency } from '../utils/formatters';
import { SubscriptionDetailModal } from '../components/subscriptions/SubscriptionDetailModal';
import { 
  TrendingUp, Sparkles, DollarSign, PieChart, Activity, 
  CreditCard, Calendar, AlertTriangle, Layers, Filter, CheckCircle2, X, ExternalLink 
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const [period, setPeriod] = useState<'This Month' | 'Last 3 Months' | 'This Year' | 'Custom'>('This Month');
  const [customStart, setCustomStart] = useState<string>('2026-01-01');
  const [customEnd, setCustomEnd] = useState<string>('2026-08-31');
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Drilldown Modal
  const [selectedSubForDetail, setSelectedSubForDetail] = useState<Subscription | null>(null);

  useEffect(() => {
    fetchAnalytics();
    fetchSubscriptions();
  }, [period, customStart, customEnd]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await reportApi.getAnalytics(
        period, 
        period === 'Custom' ? customStart : undefined, 
        period === 'Custom' ? customEnd : undefined
      );
      setAnalyticsData(res.data);
    } catch (err) {
      console.error('Failed to load analytics data', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const res = await subscriptionApi.list();
      setSubscriptions(res.data);
    } catch (err) {
      console.error('Failed to fetch subscriptions', err);
    }
  };

  // Fallback defaults if data is loading
  const metrics = analyticsData?.metrics || {
    total_spending: 12450,
    average_monthly_spending: 12450,
    highest_subscription: { name: 'AWS Cloud', cost: 5400, category: 'Cloud' },
    active_subscriptions_count: 12,
    potential_savings: 6000
  };

  const charts = analyticsData?.charts || {
    spending_over_time: [
      { month: 'Mar', amount: 9800 },
      { month: 'Apr', amount: 10500 },
      { month: 'May', amount: 11200 },
      { month: 'Jun', amount: 11800 },
      { month: 'Jul', amount: 12100 },
      { month: 'Aug', amount: 12450 },
    ],
    spending_by_category: [
      { category: 'AI', amount: 3360, percentage: 27 },
      { category: 'Entertainment', amount: 3110, percentage: 25 },
      { category: 'Cloud', amount: 2240, percentage: 18 },
      { category: 'Software', amount: 1860, percentage: 15 },
      { category: 'Education', amount: 1240, percentage: 10 },
      { category: 'Other', amount: 640, percentage: 5 },
    ],
    billing_cycle_distribution: [
      { cycle: 'Monthly', count: 12 },
      { cycle: 'Yearly', count: 4 },
      { cycle: 'Quarterly', count: 2 },
    ],
    payment_source_distribution: [
      { source: 'Card', count: 8 },
      { source: 'Bank', count: 4 },
      { source: 'Mobile Banking', count: 6 },
    ]
  };

  const smartSavings = analyticsData?.smart_savings || {
    similar_subscriptions: { category: 'AI Tools', items: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'] },
    high_cost_subscriptions: { top_count: 3, percentage_of_total: 68, top_names: ['AWS Cloud', 'ChatGPT', 'Adobe'] },
    annual_billing_opportunity: { estimated_annual_savings: 6000 },
    upcoming_spending_30_days: 8450
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#EFE6D6] page-transition pb-12">
      
      {/* Header & Period Filter Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#CBA378]/20 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E] tracking-tight">
            Financial Analytics & Smart Insights
          </h2>
          <p className="text-xs font-bold text-[#B8B8AC] mt-0.5">Real-time expenditure distributions and dynamic savings intelligence</p>
        </div>

        {/* Top Filter: Period Selection */}
        <div className="flex flex-wrap items-center gap-2 bg-[#171E25] p-1.5 rounded-2xl border border-[#CBA378]/30">
          {(['This Month', 'Last 3 Months', 'This Year', 'Custom'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                period === p
                  ? 'bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] shadow-md scale-105'
                  : 'text-[#B8B8AC] hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Inputs if Custom Selected */}
      {period === 'Custom' && (
        <div className="flex flex-wrap items-center gap-4 bg-[#171E25] p-4 rounded-2xl border border-[#FECB6E]/40 animate-in fade-in duration-300">
          <div>
            <label className="text-[10px] font-bold text-[#B8B8AC] uppercase block mb-1">Start Date</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="bg-[#10141D] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#B8B8AC] uppercase block mb-1">End Date</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="bg-[#10141D] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white"
            />
          </div>
        </div>
      )}

      {/* Five Useful Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total Spending */}
        <div className="glass-card-lighter-zenta p-4 rounded-2xl border-l-4 border-l-[#FECB6E] space-y-1 hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between text-[#B8B8AC]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Spending</span>
            <DollarSign className="w-4 h-4 text-[#FECB6E]" />
          </div>
          <div className="text-xl font-black text-white">
            ৳{metrics.total_spending.toLocaleString()}
          </div>
          <p className="text-[9px] text-[#B8B8AC] font-medium">{period} total burn</p>
        </div>

        {/* Card 2: Average Monthly Spending */}
        <div className="glass-card-lighter-zenta p-4 rounded-2xl border-l-4 border-l-[#38BDF8] space-y-1 hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between text-[#B8B8AC]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Avg Monthly</span>
            <Activity className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-xl font-black text-cyan-300">
            ৳{metrics.average_monthly_spending.toLocaleString()}
          </div>
          <p className="text-[9px] text-[#B8B8AC] font-medium">Recurring monthly mean</p>
        </div>

        {/* Card 3: Highest Subscription */}
        <div className="glass-card-lighter-zenta p-4 rounded-2xl border-l-4 border-l-[#A78BFA] space-y-1 hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between text-[#B8B8AC]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Highest Sub</span>
            <TrendingUp className="w-4 h-4 text-[#A78BFA]" />
          </div>
          <div className="text-base font-black text-white truncate">
            {metrics.highest_subscription.name}
          </div>
          <p className="text-[9px] text-[#A78BFA] font-bold">
            ৳{metrics.highest_subscription.cost.toLocaleString()}/mo
          </p>
        </div>

        {/* Card 4: Active Subscriptions */}
        <div className="glass-card-lighter-zenta p-4 rounded-2xl border-l-4 border-l-[#10B981] space-y-1 hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between text-[#B8B8AC]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Subs</span>
            <CreditCard className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-xl font-black text-white">
            {metrics.active_subscriptions_count}
          </div>
          <p className="text-[9px] text-[#10B981] font-medium">Currently operational</p>
        </div>

        {/* Card 5: Potential Savings */}
        <div className="glass-card-lighter-zenta p-4 rounded-2xl border-l-4 border-l-[#F59E0B] space-y-1 hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between text-[#B8B8AC]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Potential Savings</span>
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-xl font-black text-amber-300">
            ৳{metrics.potential_savings.toLocaleString()}
          </div>
          <p className="text-[9px] text-[#B8B8AC] font-medium">Identified optimizations</p>
        </div>

      </div>

      {/* ANALYTICS CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Spending Over Time */}
        <div className="glass-card-lighter-zenta p-5 rounded-3xl border border-[#CBA378]/30 space-y-4">
          <div className="flex items-center justify-between border-b border-[#CBA378]/20 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FECB6E]" /> Spending Over Time
            </h3>
            <span className="text-[10px] font-bold text-[#B8B8AC]">Monthly Trend</span>
          </div>

          <div className="h-52 flex items-end justify-between gap-2 pt-6 px-2 bg-[#171E25]/60 rounded-2xl border border-[#CBA378]/10">
            {charts.spending_over_time.map((pt, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[9px] font-bold text-[#FECB6E] opacity-0 group-hover:opacity-100 transition duration-200">
                  ৳{pt.amount}
                </span>
                <div 
                  className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-[#C86D39] via-[#CBA378] to-[#FFD89B] shadow-[0_0_12px_rgba(254,203,110,0.3)] group-hover:brightness-125 transition-all duration-300"
                  style={{ height: `${(pt.amount / (Math.max(...charts.spending_over_time.map(p => p.amount)) || 1)) * 100}%` }}
                />
                <span className="text-[10px] font-semibold text-[#B8B8AC]">{pt.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Spending by Category */}
        <div className="glass-card-lighter-zenta p-5 rounded-3xl border border-[#CBA378]/30 space-y-4">
          <div className="border-b border-[#CBA378]/20 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#38BDF8]" /> Spending by Category
            </h3>
          </div>

          <div className="space-y-2.5">
            {charts.spending_by_category.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white">{cat.category}</span>
                  <span className="text-[#FECB6E]">৳{cat.amount.toLocaleString()} ({cat.percentage}%)</span>
                </div>
                <div className="w-full bg-[#171E25] rounded-full h-2 overflow-hidden border border-[#CBA378]/20">
                  <div 
                    className="bg-gradient-to-r from-[#38BDF8] via-[#A78BFA] to-[#FECB6E] h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Billing Cycle Distribution */}
        <div className="glass-card-lighter-zenta p-5 rounded-3xl border border-[#CBA378]/30 space-y-4">
          <div className="border-b border-[#CBA378]/20 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#10B981]" /> Billing Cycle Distribution
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {charts.billing_cycle_distribution.map((bc) => (
              <div key={bc.cycle} className="p-3 rounded-2xl bg-[#171E25] border border-[#10B981]/30 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#B8B8AC]">{bc.cycle}</span>
                <p className="text-xl font-black text-white">{bc.count}</p>
                <span className="text-[9px] text-[#10B981] font-semibold">Subscriptions</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Payment Source Distribution */}
        <div className="glass-card-lighter-zenta p-5 rounded-3xl border border-[#CBA378]/30 space-y-4">
          <div className="border-b border-[#CBA378]/20 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#A78BFA]" /> Payment Source Distribution
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {charts.payment_source_distribution.map((ps) => (
              <div key={ps.source} className="p-3 rounded-2xl bg-[#171E25] border border-[#A78BFA]/30 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#B8B8AC]">{ps.source}</span>
                <p className="text-xl font-black text-white">{ps.count}</p>
                <span className="text-[9px] text-[#A78BFA] font-semibold">Connected</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SMART SAVINGS SECTION */}
      <div id="smart-savings" className="glass-card-lighter-zenta p-6 rounded-3xl border-2 border-[#FECB6E]/40 space-y-5 bg-gradient-to-r from-[#2A2D3E] via-[#222533] to-[#1A1D27]">
        <div className="flex items-center gap-2 border-b border-[#CBA378]/20 pb-3">
          <Sparkles className="w-5 h-5 text-[#FECB6E] animate-pulse" />
          <h3 className="text-lg font-black text-white">Smart Savings Intelligence</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          {/* Section 1: Multiple Similar Subscriptions */}
          <div className="p-4 rounded-2xl bg-[#171E25] border border-amber-500/30 space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Layers className="w-4 h-4" />
              <span>Multiple Similar Services</span>
            </div>
            <p className="text-[#B8B8AC] text-[11px]">Detected overlap in {smartSavings.similar_subscriptions.category}:</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {smartSavings.similar_subscriptions.items.map((item) => (
                <span key={item} className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Section 2: High-cost Subscriptions */}
          <div className="p-4 rounded-2xl bg-[#171E25] border border-rose-500/30 space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>High-Cost Subscriptions</span>
            </div>
            <p className="text-white font-black text-sm">
              Your top {smartSavings.high_cost_subscriptions.top_count} subscriptions represent {smartSavings.high_cost_subscriptions.percentage_of_total}% of your monthly spending.
            </p>
            <p className="text-[10px] text-[#B8B8AC]">Top: {smartSavings.high_cost_subscriptions.top_names.join(', ')}</p>
          </div>

          {/* Section 3: Annual Billing Opportunity */}
          <div className="p-4 rounded-2xl bg-[#171E25] border border-emerald-500/30 space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <DollarSign className="w-4 h-4" />
              <span>Annual Billing Opportunity</span>
            </div>
            <p className="text-[11px] text-[#B8B8AC]">Potential estimated annual savings:</p>
            <p className="text-2xl font-black text-emerald-400">
              ৳{smartSavings.annual_billing_opportunity.estimated_annual_savings.toLocaleString()}
            </p>
          </div>

          {/* Section 4: Upcoming Spending */}
          <div className="p-4 rounded-2xl bg-[#171E25] border border-[#38BDF8]/30 space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-[#38BDF8] font-bold">
              <Calendar className="w-4 h-4" />
              <span>Upcoming Spending</span>
            </div>
            <p className="text-[11px] text-[#B8B8AC]">Expected next 30 days:</p>
            <p className="text-2xl font-black text-cyan-300">
              ৳{smartSavings.upcoming_spending_30_days.toLocaleString()}
            </p>
          </div>

        </div>
      </div>

      {/* Subscription Detail Modal Trigger if clicked from list */}
      {selectedSubForDetail && (
        <SubscriptionDetailModal
          subscription={selectedSubForDetail}
          onClose={() => setSelectedSubForDetail(null)}
        />
      )}

    </div>
  );
};