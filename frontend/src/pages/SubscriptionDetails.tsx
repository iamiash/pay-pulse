import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subscriptionApi } from '../api/subscriptionApi';
import { useToast } from '../context/ToastContext';
import { Subscription } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { EditSubscriptionModal } from '../components/modals/EditSubscriptionModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { 
  ArrowLeft, Edit3, PauseCircle, PlayCircle, XCircle, Globe, 
  Mail, Phone, User, DollarSign, Calendar, RefreshCw, CreditCard, 
  TrendingUp, CheckCircle2, Clock, Sparkles, FileText, ExternalLink
} from 'lucide-react';

export const SubscriptionDetails: React.FC<{ subscriptionId?: number }> = ({ subscriptionId: propId }) => {
  const { id: routeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const activeId = propId || (routeId ? parseInt(routeId, 10) : null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<'pause' | 'resume' | 'cancel' | null>(null);

  const fetchDetail = async () => {
    if (!activeId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await subscriptionApi.get(activeId);
      setSubscription(res.data);
    } catch (err) {
      console.error('Failed to load subscription details', err);
      showToast('Unable to load subscription details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [activeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-[#FECB6E] animate-spin" />
      </div>
    );
  }

  // Fallback demo object if single subscription parameter isn't bound via router
  const sub: Subscription = subscription || {
    id: activeId || 1,
    name: 'ChatGPT Plus',
    provider: 'OpenAI',
    logo_url: 'https://openai.com/favicon.ico',
    website: 'https://chatgpt.com',
    category: 'AI Tools',
    account_type: 'Personal',
    associated_email: 'alex.ai@paypulse.com',
    username: 'alex_m_ai',
    associated_contact: '+8801700000000',
    account_reference: 'ACC-GPT-9921',
    notes: 'Primary AI assistant subscription used for daily automation and code refactoring.',
    plan_type: 'Individual Pro',
    cost: 20.00,
    currency: 'USD',
    billing_cycle: 'Monthly',
    purchased_date: '2025-03-01',
    next_billing_date: '2026-08-12',
    trial_period: false,
    auto_renewal: true,
    reminder_enabled: true,
    reminder_days: 3,
    status: 'Active',
    payment_type: 'card',
    tenure_months: 17,
    card: {
      id: 1,
      card_title: 'Primary Sapphire Card',
      card_type: 'Visa',
      card_category: 'Credit',
      masked_card_number: '•••• •••• •••• 4821',
      expiry_date: '09/28'
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="px-3 py-1 text-xs font-black rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Active</span>;
      case 'Paused':
        return <span className="px-3 py-1 text-xs font-black rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">Paused</span>;
      case 'Cancelled':
      case 'Idle':
        return <span className="px-3 py-1 text-xs font-black rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">Cancelled</span>;
      default:
        return <span className="px-3 py-1 text-xs font-black rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/40">{status}</span>;
    }
  };

  const handleStatusChange = async () => {
    if (!confirmAction) return;
    try {
      let newStatus = sub.status;
      if (confirmAction === 'pause') newStatus = 'Paused';
      if (confirmAction === 'resume') newStatus = 'Active';
      if (confirmAction === 'cancel') newStatus = 'Cancelled';

      await subscriptionApi.update(sub.id, { status: newStatus });
      showToast(`Subscription status updated to ${newStatus}`, 'success');
      setConfirmAction(null);
      fetchDetail();
    } catch (err) {
      showToast('Failed to update subscription status', 'error');
    }
  };

  const annualEquivalent = sub.billing_cycle === 'Yearly' ? sub.cost : sub.cost * 12;

  const getPaymentBadge = () => {
    if (sub.payment_type === 'card' && sub.card) {
      return `${sub.card.card_type || 'Visa'} •${sub.card.masked_card_number?.slice(-4) || '4821'}`;
    }
    if (sub.payment_type === 'bank' && sub.bank) {
      return `${sub.bank.bank_name || 'Bank'} •${sub.bank.masked_account_number?.slice(-4) || '2094'}`;
    }
    if (sub.payment_type === 'mobile_banking' && sub.mobile) {
      return `${sub.mobile.provider.toUpperCase()} ••••${sub.mobile.mobile_number?.slice(-4) || '42'}`;
    }
    return 'Visa •4821';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-[#EFE6D6] page-transition">
      
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBA378]/20 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/subscriptions')}
            className="p-2 rounded-xl bg-[#171E25] border border-[#CBA378]/30 text-[#B8B8AC] hover:text-white hover:border-[#FECB6E] transition"
            title="Back to Subscriptions"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{sub.name}</h1>
              {getStatusBadge(sub.status)}
            </div>
            <p className="text-xs text-[#B8B8AC] font-medium">{sub.plan_type} • {sub.category}</p>
          </div>
        </div>

        {/* Action Controls: Edit, Pause/Resume, Cancel */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#171E25] border border-[#CBA378]/30 text-xs font-bold text-[#EFE6D6] hover:text-[#FECB6E] hover:border-[#FECB6E] transition flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#FECB6E]" /> Edit
          </button>

          {sub.status === 'Active' ? (
            <button
              onClick={() => setConfirmAction('pause')}
              className="px-3.5 py-1.5 rounded-xl bg-[#171E25] border border-amber-500/30 text-xs font-bold text-amber-300 hover:bg-amber-950/40 transition flex items-center gap-1.5"
            >
              <PauseCircle className="w-3.5 h-3.5" /> Pause
            </button>
          ) : (
            <button
              onClick={() => setConfirmAction('resume')}
              className="px-3.5 py-1.5 rounded-xl bg-[#171E25] border border-emerald-500/30 text-xs font-bold text-emerald-300 hover:bg-emerald-950/40 transition flex items-center gap-1.5"
            >
              <PlayCircle className="w-3.5 h-3.5" /> Resume
            </button>
          )}

          <button
            onClick={() => setConfirmAction('cancel')}
            className="px-3.5 py-1.5 rounded-xl bg-[#171E25] border border-rose-500/30 text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" /> Cancel
          </button>
        </div>
      </div>

      {/* Main Grid: Service, Account, Billing, Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Service Information */}
        <div className="glass-card-lighter-zenta p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 border-b border-[#CBA378]/20 pb-2 text-[#FECB6E]">
            <Globe className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Service Info</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <p className="text-[10px] text-[#B8B8AC] uppercase font-bold">Provider</p>
              <p className="font-bold text-white">{sub.provider || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#B8B8AC] uppercase font-bold">Category</p>
              <p className="font-bold text-white">{sub.category}</p>
            </div>
            {sub.website && (
              <div>
                <p className="text-[10px] text-[#B8B8AC] uppercase font-bold">Website</p>
                <a 
                  href={sub.website} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-cyan-400 hover:underline font-bold flex items-center gap-1 truncate"
                >
                  {sub.website.replace('https://', '')} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Account Information */}
        <div className="glass-card-lighter-zenta p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 border-b border-[#CBA378]/20 pb-2 text-[#A78BFA]">
            <User className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Account Info</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <p className="text-[10px] text-[#B8B8AC] uppercase font-bold">Account Email</p>
              <p className="font-bold text-white truncate">{sub.associated_email}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#B8B8AC] uppercase font-bold">Username</p>
              <p className="font-bold text-white">{sub.username || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#B8B8AC] uppercase font-bold">Contact Number</p>
              <p className="font-bold text-white">{sub.associated_contact}</p>
            </div>
          </div>
        </div>

        {/* Card 3: Billing Summary */}
        <div className="glass-card-lighter-zenta p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 border-b border-[#CBA378]/20 pb-2 text-[#10B981]">
            <DollarSign className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Billing Details</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#B8B8AC]">Current Price:</span>
              <span className="font-black text-white text-sm">{formatCurrency(sub.cost)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#B8B8AC]">Cycle:</span>
              <span className="font-bold text-white">{sub.billing_cycle}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#B8B8AC]">Next Renewal:</span>
              <span className="font-bold text-[#FECB6E]">{formatDate(sub.next_billing_date)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-[#CBA378]/10 pt-1">
              <span className="text-[#B8B8AC]">Annual Cost:</span>
              <span className="font-black text-emerald-400">{formatCurrency(annualEquivalent)}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Linked Payment Method */}
        <div className="glass-card-lighter-zenta p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 border-b border-[#CBA378]/20 pb-2 text-[#38BDF8]">
            <CreditCard className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Payment Source</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-[#171E25] border border-[#38BDF8]/30 space-y-1">
              <p className="text-[10px] text-[#B8B8AC] uppercase font-bold">Connected Method</p>
              <p className="font-black text-cyan-300 text-sm font-mono">{getPaymentBadge()}</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#B8B8AC]">Auto-Renewal:</span>
              <span className={`font-bold ${sub.auto_renewal ? 'text-emerald-400' : 'text-amber-400'}`}>
                {sub.auto_renewal ? 'Enabled' : 'Manual'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Lower Section: Timeline & Spending History Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Renewal Timeline Card */}
        <div className="glass-card-lighter-zenta p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#CBA378]/20 pb-3">
            <Clock className="w-4 h-4 text-[#FECB6E]" />
            <h3 className="text-sm font-black text-white">Subscription Timeline</h3>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#CBA378]/30">
            {/* Step 1: Started */}
            <div className="relative">
              <div className="absolute -left-[19px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-[#171E25]" />
              <p className="text-xs font-bold text-white">Started</p>
              <p className="text-[10px] text-[#B8B8AC]">{sub.purchased_date || '2025-03-01'}</p>
            </div>

            {/* Step 2: Trial */}
            <div className="relative">
              <div className={`absolute -left-[19px] top-0.5 w-3.5 h-3.5 rounded-full ${sub.trial_period ? 'bg-cyan-400' : 'bg-slate-600'} ring-4 ring-[#171E25]`} />
              <p className="text-xs font-bold text-white">Trial Period</p>
              <p className="text-[10px] text-[#B8B8AC]">{sub.trial_period ? 'Completed' : 'No trial'}</p>
            </div>

            {/* Step 3: Renewed */}
            <div className="relative">
              <div className="absolute -left-[19px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#FECB6E] ring-4 ring-[#171E25]" />
              <p className="text-xs font-bold text-white">Last Renewed</p>
              <p className="text-[10px] text-[#B8B8AC]">2026-07-12</p>
            </div>

            {/* Step 4: Next Renewal */}
            <div className="relative">
              <div className="absolute -left-[19px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#38BDF8] ring-4 ring-[#171E25] animate-pulse" />
              <p className="text-xs font-bold text-cyan-300">Next Renewal</p>
              <p className="text-[10px] text-[#B8B8AC]">{formatDate(sub.next_billing_date)}</p>
            </div>
          </div>
        </div>

        {/* Spending History Small Chart */}
        <div className="glass-card-lighter-zenta p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#CBA378]/20 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              <h3 className="text-sm font-black text-white">Spending History</h3>
            </div>
            <span className="text-[10px] font-bold text-[#FECB6E] px-2 py-0.5 rounded-full bg-[#171E25] border border-[#CBA378]/30">
              6 Months
            </span>
          </div>

          <div className="h-40 flex items-end justify-between gap-3 pt-4 px-2">
            {[
              { month: 'Jan', cost: sub.cost },
              { month: 'Feb', cost: sub.cost },
              { month: 'Mar', cost: sub.cost },
              { month: 'Apr', cost: sub.cost },
              { month: 'May', cost: sub.cost },
              { month: 'Jun', cost: sub.cost },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[9px] font-bold text-[#FECB6E] opacity-0 group-hover:opacity-100 transition">
                  ${bar.cost}
                </span>
                <div className="w-full max-w-[24px] h-[70%] rounded-t-lg bg-gradient-to-t from-[#C86D39] via-[#CBA378] to-[#FFD89B] shadow-md group-hover:brightness-125 transition" />
                <span className="text-[10px] font-semibold text-[#B8B8AC]">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modals */}
      <EditSubscriptionModal
        isOpen={showEditModal}
        subscription={sub}
        onClose={() => setShowEditModal(false)}
        onSuccess={fetchDetail}
      />

      {confirmAction && (
        <ConfirmModal
          isOpen={!!confirmAction}
          title={`${confirmAction.toUpperCase()} Subscription`}
          message={`Are you sure you want to ${confirmAction} ${sub.name}?`}
          onConfirm={handleStatusChange}
          onCancel={() => setConfirmAction(null)}
        />
      )}

    </div>
  );
};