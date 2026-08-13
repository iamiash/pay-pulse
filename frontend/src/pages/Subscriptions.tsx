import React, { useState, useEffect } from 'react';
import { subscriptionApi } from '../api/subscriptionApi';
import { useToast } from '../context/ToastContext';
import { Subscription } from '../types';
import { SubscriptionCard } from '../components/subscriptions/SubscriptionCard';
import { SubscriptionTable } from '../components/subscriptions/SubscriptionTable';
import { SubscriptionDetailModal } from '../components/subscriptions/SubscriptionDetailModal';
import { AddSubscriptionModal } from '../components/modals/AddSubscriptionModal';
import { EditSubscriptionModal } from '../components/modals/EditSubscriptionModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { formatCurrency } from '../utils/formatters';
import { 
  Plus, Grid, List, Search, Filter, ArrowUpDown, 
  CheckCircle2, AlertOctagon, DollarSign, CalendarCheck, RefreshCw, XCircle, X
} from 'lucide-react';

export const Subscriptions: React.FC<{ selectedSearchSub?: Subscription | null }> = ({ selectedSearchSub }) => {
  const { showToast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [deletingSub, setDeletingSub] = useState<Subscription | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [costBreakdownModal, setCostBreakdownModal] = useState<'monthly' | 'yearly' | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [billingCycleFilter, setBillingCycleFilter] = useState<string>('All');
  const [paymentSourceFilter, setPaymentSourceFilter] = useState<string>('All');
  const [renewalDateFilter, setRenewalDateFilter] = useState<string>('All');
  const [currencyFilter, setCurrencyFilter] = useState<string>('All');
  const [autoRenewalFilter, setAutoRenewalFilter] = useState<string>('All');

  const [sortBy, setSortBy] = useState<
    'newest' | 'oldest' | 'highest_cost' | 'lowest_cost' | 'nearest_renewal' | 'alphabetical'
  >('nearest_renewal');

  const fetchSubscriptions = async () => {
    try {
      const res = await subscriptionApi.list();
      setSubscriptions(res.data);
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlStatus = params.get('status');
    if (urlStatus) {
      const formatted = urlStatus.charAt(0).toUpperCase() + urlStatus.slice(1).toLowerCase();
      setStatusFilter(formatted);
    }

    setSelectedSub(null);
    setShowAddModal(false);
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    if (selectedSearchSub) {
      setSelectedSub(selectedSearchSub);
    }
  }, [selectedSearchSub]);

  const activeSubs = subscriptions.filter((s) => (s.status || '').toLowerCase() === 'active');
  const activeCount = activeSubs.length;
  const expiredCount = subscriptions.filter((s) => (s.status || '').toLowerCase() === 'expired').length;

  const totalMonthlyCost = activeSubs.reduce((acc, sub) => {
    const costVal = Number(sub.cost) || 0;
    const cycle = (sub.billing_cycle || 'Monthly').toLowerCase();
    if (cycle === 'yearly') return acc + costVal / 12;
    if (cycle === 'quarterly') return acc + costVal / 3;
    if (cycle === 'half-yearly') return acc + costVal / 6;
    if (cycle === 'weekly') return acc + costVal * 4.33;
    return acc + costVal;
  }, 0);

  const totalYearlyCost = activeSubs.reduce((acc, sub) => {
    const costVal = Number(sub.cost) || 0;
    const cycle = (sub.billing_cycle || 'Monthly').toLowerCase();
    if (cycle === 'yearly') return acc + costVal;
    if (cycle === 'quarterly') return acc + costVal * 4;
    if (cycle === 'half-yearly') return acc + costVal * 2;
    if (cycle === 'weekly') return acc + costVal * 52;
    return acc + costVal * 12;
  }, 0);

  const filteredSubscriptions = subscriptions
    .filter((sub) => {
      if (!statusFilter || statusFilter.toLowerCase() === 'all') return true;
      return (sub.status || '').toLowerCase() === statusFilter.toLowerCase();
    })
    .filter((sub) => {
      if (!categoryFilter || categoryFilter.toLowerCase() === 'all') return true;
      return (sub.category || '').toLowerCase() === categoryFilter.toLowerCase();
    })
    .filter((sub) => {
      if (!billingCycleFilter || billingCycleFilter.toLowerCase() === 'all') return true;
      return (sub.billing_cycle || '').toLowerCase() === billingCycleFilter.toLowerCase();
    })
    .filter((sub) => {
      if (!paymentSourceFilter || paymentSourceFilter.toLowerCase() === 'all') return true;
      return (sub.payment_type || '').toLowerCase() === paymentSourceFilter.toLowerCase();
    })
    .filter((sub) => {
      if (!renewalDateFilter || renewalDateFilter.toLowerCase() === 'all') return true;
      const today = new Date();
      const renDate = new Date(sub.next_billing_date);
      const diffDays = Math.ceil((renDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

      if (renewalDateFilter === 'next_7') return diffDays >= 0 && diffDays <= 7;
      if (renewalDateFilter === 'next_30') return diffDays >= 0 && diffDays <= 30;
      if (renewalDateFilter === 'this_month') {
        return renDate.getMonth() === today.getMonth() && renDate.getFullYear() === today.getFullYear();
      }
      if (renewalDateFilter === 'past_due') return diffDays < 0;
      return true;
    })
    .filter((sub) => {
      if (!currencyFilter || currencyFilter.toLowerCase() === 'all') return true;
      return (sub.currency || 'USD').toLowerCase() === currencyFilter.toLowerCase();
    })
    .filter((sub) => {
      if (!autoRenewalFilter || autoRenewalFilter.toLowerCase() === 'all') return true;
      if (autoRenewalFilter.toLowerCase() === 'auto') return sub.auto_renewal === true;
      if (autoRenewalFilter.toLowerCase() === 'manual') return sub.auto_renewal === false;
      return true;
    })
    .filter((sub) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (sub.name || '').toLowerCase().includes(q) ||
        (sub.category || '').toLowerCase().includes(q) ||
        (sub.plan_type || '').toLowerCase().includes(q) ||
        (sub.associated_email || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.purchased_date || b.created_at || 0).getTime() - new Date(a.purchased_date || a.created_at || 0).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.purchased_date || a.created_at || 0).getTime() - new Date(b.purchased_date || b.created_at || 0).getTime();
      }
      if (sortBy === 'highest_cost') return (Number(b.cost) || 0) - (Number(a.cost) || 0);
      if (sortBy === 'lowest_cost') return (Number(a.cost) || 0) - (Number(b.cost) || 0);
      if (sortBy === 'nearest_renewal') {
        return new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime();
      }
      if (sortBy === 'alphabetical') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

  const handleDeleteConfirm = async () => {
    if (!deletingSub) return;
    try {
      await subscriptionApi.delete(deletingSub.id);
      showToast(`${deletingSub.name} deleted successfully`, 'info');
      setDeletingSub(null);
      fetchSubscriptions();
    } catch (err) {
      showToast('Failed to delete subscription', 'error');
    }
  };

  const resetAllFilters = () => {
    setStatusFilter('All');
    setCategoryFilter('All');
    setBillingCycleFilter('All');
    setPaymentSourceFilter('All');
    setRenewalDateFilter('All');
    setCurrencyFilter('All');
    setAutoRenewalFilter('All');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 text-white max-w-7xl mx-auto page-transition pb-10">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#CBA378]/20 pb-4 relative z-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD89B] via-[#FECB6E] to-[#EFE6D6] tracking-tight">
            Subscriptions
          </h1>
          <p className="text-xs text-[#B8B8AC] font-medium mt-0.5">
            Centralized subscription management, billing controls, and channel tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-20">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#CBA378]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#171E25] border border-[#CBA378]/30 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#B8B8AC] focus:outline-none focus:border-[#FECB6E] transition"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#171E25] border border-[#CBA378]/30 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#EFE6D6] focus:outline-none focus:border-[#FECB6E] appearance-none cursor-pointer"
            >
              <option value="nearest_renewal">Sort: Nearest Renewal</option>
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest_cost">Sort: Highest Cost</option>
              <option value="lowest_cost">Sort: Lowest Cost</option>
              <option value="alphabetical">Sort: Alphabetical (A-Z)</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#CBA378] pointer-events-none" />
          </div>

          <div className="bg-[#171E25] p-1 rounded-xl flex border border-[#CBA378]/30">
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'card'
                  ? 'bg-[#FECB6E] text-[#171E25] font-bold shadow-md'
                  : 'text-[#B8B8AC] hover:text-white'
              }`}
              title="Card View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-[#FECB6E] text-[#171E25] font-bold shadow-md'
                  : 'text-[#B8B8AC] hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-modern-left-3d px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#38BDF8]" /> Add Subscription
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => setStatusFilter(statusFilter.toLowerCase() === 'active' ? 'All' : 'Active')}
          className={`glass-card-lighter-zenta p-4 rounded-2xl border-l-4 border-l-emerald-500 cursor-pointer hover:scale-[1.02] transition-all duration-200 ${
            statusFilter.toLowerCase() === 'active' ? 'ring-2 ring-emerald-500/50 bg-[#222736]' : ''
          }`}
        >
          <div className="flex items-center justify-between text-[#B8B8AC] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{activeCount}</div>
          <p className="text-[10px] text-emerald-400 font-semibold mt-1">
            {statusFilter.toLowerCase() === 'active' ? '✓ Filter Active' : 'Click to filter Active'}
          </p>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter.toLowerCase() === 'expired' ? 'All' : 'Expired')}
          className={`glass-card-lighter-zenta p-4 rounded-2xl border-l-4 border-l-rose-500 cursor-pointer hover:scale-[1.02] transition-all duration-200 ${
            statusFilter.toLowerCase() === 'expired' ? 'ring-2 ring-rose-500/50 bg-[#222736]' : ''
          }`}
        >
          <div className="flex items-center justify-between text-[#B8B8AC] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Expired</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">{expiredCount}</div>
          <p className="text-[10px] text-rose-400 font-semibold mt-1">
            {statusFilter.toLowerCase() === 'expired' ? '✓ Filter Expired' : 'Click to filter Expired'}
          </p>
        </div>

        <div 
          onClick={() => setCostBreakdownModal('monthly')}
          className="glass-card-lighter-zenta p-4 rounded-2xl border-l-4 border-l-amber-500 cursor-pointer hover:scale-[1.02] transition-all duration-200"
        >
          <div className="flex items-center justify-between text-[#B8B8AC] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Monthly Cost</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-[#FECB6E]">{formatCurrency(totalMonthlyCost)}</div>
          <p className="text-[10px] text-amber-400 font-semibold mt-1">Click to view monthly breakdown →</p>
        </div>

        <div 
          onClick={() => setCostBreakdownModal('yearly')}
          className="glass-card-lighter-zenta p-4 rounded-2xl border-l-4 border-l-[#38BDF8] cursor-pointer hover:scale-[1.02] transition-all duration-200"
        >
          <div className="flex items-center justify-between text-[#B8B8AC] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Yearly Cost</span>
            <CalendarCheck className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-black text-[#38BDF8]">{formatCurrency(totalYearlyCost)}</div>
          <p className="text-[10px] text-[#38BDF8] font-semibold mt-1">Click to view yearly breakdown →</p>
        </div>

      </div>

      <div className="bg-[#171E25]/90 border border-[#CBA378]/30 p-3.5 rounded-2xl shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#FECB6E] uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-[#CBA378]" />
            <span>Subscription Filters</span>
          </div>
          <button
            onClick={resetAllFilters}
            className="text-[11px] font-bold text-[#B8B8AC] hover:text-[#FECB6E] transition flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
          <div>
            <label className="text-[9px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#1F2630] border border-[#CBA378]/30 rounded-xl px-2 py-1 text-xs text-[#EFE6D6] focus:outline-none focus:border-[#FECB6E]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Paused">Paused</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Idle">Idle</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#1F2630] border border-[#CBA378]/30 rounded-xl px-2 py-1 text-xs text-[#EFE6D6] focus:outline-none focus:border-[#FECB6E]"
            >
              <option value="All">All Categories</option>
              <option value="Streaming">Streaming</option>
              <option value="SaaS">SaaS</option>
              <option value="Cloud">Cloud</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Productivity">Productivity</option>
              <option value="AI Tools">AI Tools</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Billing Cycle</label>
            <select
              value={billingCycleFilter}
              onChange={(e) => setBillingCycleFilter(e.target.value)}
              className="w-full bg-[#1F2630] border border-[#CBA378]/30 rounded-xl px-2 py-1 text-xs text-[#EFE6D6] focus:outline-none focus:border-[#FECB6E]"
            >
              <option value="All">All Cycles</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half-Yearly">Half-Yearly</option>
              <option value="Yearly">Yearly</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Payment Source</label>
            <select
              value={paymentSourceFilter}
              onChange={(e) => setPaymentSourceFilter(e.target.value)}
              className="w-full bg-[#1F2630] border border-[#CBA378]/30 rounded-xl px-2 py-1 text-xs text-[#EFE6D6] focus:outline-none focus:border-[#FECB6E]"
            >
              <option value="All">All Sources</option>
              <option value="card">Cards</option>
              <option value="bank">Bank Accounts</option>
              <option value="mobile_banking">Mobile Banking</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Renewal Date</label>
            <select
              value={renewalDateFilter}
              onChange={(e) => setRenewalDateFilter(e.target.value)}
              className="w-full bg-[#1F2630] border border-[#CBA378]/30 rounded-xl px-2 py-1 text-xs text-[#EFE6D6] focus:outline-none focus:border-[#FECB6E]"
            >
              <option value="All">All Renewal Dates</option>
              <option value="next_7">Next 7 Days</option>
              <option value="next_30">Next 30 Days</option>
              <option value="this_month">This Month</option>
              <option value="past_due">Past Due / Overdue</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Currency</label>
            <select
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value)}
              className="w-full bg-[#1F2630] border border-[#CBA378]/30 rounded-xl px-2 py-1 text-xs text-[#EFE6D6] focus:outline-none focus:border-[#FECB6E]"
            >
              <option value="All">All Currencies</option>
              <option value="USD">USD ($)</option>
              <option value="BDT">BDT (৳)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Auto Renewal</label>
            <select
              value={autoRenewalFilter}
              onChange={(e) => setAutoRenewalFilter(e.target.value)}
              className="w-full bg-[#1F2630] border border-[#CBA378]/30 rounded-xl px-2 py-1 text-xs text-[#EFE6D6] focus:outline-none focus:border-[#FECB6E]"
            >
              <option value="All">All Modes</option>
              <option value="auto">Auto Renewal On</option>
              <option value="manual">Manual Renewal</option>
            </select>
          </div>
        </div>
      </div>

      {filteredSubscriptions.length === 0 ? (
        <div className="p-12 text-center glass-card-lighter-zenta rounded-2xl border border-[#CBA378]/20 space-y-3">
          <XCircle className="w-10 h-10 text-[#CBA378] mx-auto opacity-60" />
          <p className="text-sm font-bold text-[#B8B8AC]">No subscriptions found matching the active criteria.</p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-1.5 rounded-xl bg-[#171E25] text-xs font-bold text-[#FECB6E] border border-[#CBA378]/30 hover:bg-[#222834] transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <SubscriptionTable
          subscriptions={filteredSubscriptions}
          onSelect={(sub) => setSelectedSub(sub)}
          onEdit={(sub) => setEditingSub(sub)}
          onDelete={(sub) => setDeletingSub(sub)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubscriptions.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onClick={() => setSelectedSub(sub)}
              onEdit={(s) => setEditingSub(s)}
              onDelete={(s) => setDeletingSub(s)}
            />
          ))}
        </div>
      )}

      {costBreakdownModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card-lighter-zenta p-6 rounded-2xl w-full max-w-2xl relative space-y-4 border border-[#CBA378]/40 bg-[#1A1D27]/98 text-white">
            <button 
              onClick={() => setCostBreakdownModal(null)} 
              className="absolute top-4 right-4 p-1 rounded-xl bg-[#171E25] text-[#B8B8AC] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#FECB6E]" />
              <h3 className="text-lg font-black text-[#FECB6E] capitalize">
                Itemized {costBreakdownModal} Cost Breakdown
              </h3>
            </div>

            <p className="text-xs text-[#B8B8AC]">
              Normalized calculation breakdown for all active subscriptions.
            </p>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#CBA378]/20 text-[#B8B8AC] uppercase text-[9px] tracking-wider">
                    <th className="py-2 px-3">Subscription</th>
                    <th className="py-2 px-3">Billing Cycle</th>
                    <th className="py-2 px-3">Original Cost</th>
                    <th className="py-2 px-3 text-right">
                      Normalized {costBreakdownModal === 'monthly' ? 'Monthly' : 'Yearly'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBA378]/10">
                  {activeSubs.map((sub) => {
                    const originalCost = Number(sub.cost) || 0;
                    const cycle = (sub.billing_cycle || 'Monthly').toLowerCase();
                    let normalized = originalCost;

                    if (costBreakdownModal === 'monthly') {
                      if (cycle === 'yearly') normalized = originalCost / 12;
                      else if (cycle === 'quarterly') normalized = originalCost / 3;
                      else if (cycle === 'half-yearly') normalized = originalCost / 6;
                      else if (cycle === 'weekly') normalized = originalCost * 4.33;
                    } else {
                      if (cycle === 'yearly') normalized = originalCost;
                      else if (cycle === 'quarterly') normalized = originalCost * 4;
                      else if (cycle === 'half-yearly') normalized = originalCost * 2;
                      else if (cycle === 'weekly') normalized = originalCost * 52;
                      else normalized = originalCost * 12;
                    }

                    return (
                      <tr key={sub.id} className="hover:bg-white/5 transition">
                        <td className="py-2 px-3 font-bold text-white">{sub.name}</td>
                        <td className="py-2 px-3 text-[#B8B8AC] capitalize">{sub.billing_cycle || 'Monthly'}</td>
                        <td className="py-2 px-3 text-[#B8B8AC]">{sub.currency || 'USD'} {originalCost.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-[#FECB6E]">
                          {formatCurrency(normalized)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-[#CBA378]/20 flex justify-between items-center text-sm font-black">
              <span>Total Aggregate ({costBreakdownModal === 'monthly' ? 'Monthly' : 'Yearly'}):</span>
              <span className="text-[#FECB6E] font-mono text-base">
                {formatCurrency(costBreakdownModal === 'monthly' ? totalMonthlyCost : totalYearlyCost)}
              </span>
            </div>
          </div>
        </div>
      )}

      <SubscriptionDetailModal subscription={selectedSub} onClose={() => setSelectedSub(null)} />

      <AddSubscriptionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchSubscriptions}
      />

      <EditSubscriptionModal
        isOpen={!!editingSub}
        subscription={editingSub}
        onClose={() => setEditingSub(null)}
        onSuccess={fetchSubscriptions}
      />

      {deletingSub && (
        <ConfirmModal
          isOpen={!!deletingSub}
          title={`Delete ${deletingSub.name}?`}
          message={`This will remove this subscription from your PayPulse records.`}
          confirmText="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingSub(null)}
        />
      )}

    </div>
  );
};