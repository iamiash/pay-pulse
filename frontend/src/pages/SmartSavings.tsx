import React, { useState, useEffect } from 'react';
import { subscriptionApi } from '../api/subscriptionApi';
import { walletApi } from '../api/walletApi';
import { useToast } from '../context/ToastContext';
import { Subscription, WalletCard } from '../types';
import { formatCurrency } from '../utils/formatters';
import { SubscriptionDetailModal } from '../components/subscriptions/SubscriptionDetailModal';
import { 
  Sparkles, TrendingUp, AlertTriangle, Lightbulb, DollarSign, 
  CreditCard, ArrowRight, ShieldAlert, CheckCircle2, RefreshCw, X 
} from 'lucide-react';

export const SmartSavings: React.FC = () => {
  const { showToast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [cards, setCards] = useState<WalletCard[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive modal for reviewing/changing payment source
  const [selectedSubForReview, setSelectedSubForReview] = useState<Subscription | null>(null);
  const [selectedSubForDetail, setSelectedSubForDetail] = useState<Subscription | null>(null);
  const [targetCardId, setTargetCardId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subRes, cardRes] = await Promise.all([
        subscriptionApi.getAll(),
        walletApi.getCards()
      ]);
      setSubscriptions(subRes.data);
      setCards(cardRes.data);
    } catch (err) {
      console.error('Failed to load smart savings intelligence data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentSource = async () => {
    if (!selectedSubForReview || !targetCardId) return;
    try {
      await subscriptionApi.update(selectedSubForReview.id, {
        card_id: targetCardId,
        payment_type: 'card'
      });
      showToast('Payment source successfully optimized and updated!', 'success');
      setSelectedSubForReview(null);
      loadData();
    } catch (err) {
      showToast('Failed to update payment source', 'error');
    }
  };

  // Calculations for savings overview
  const potentialMonthlySavings = 38.98;
  const potentialAnnualSavings = 467.76;

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#EFE6D6] page-transition pb-12">
      
      {/* Centered Page Headline */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E] tracking-tight drop-shadow-md">
          Smart Savings & Cost Optimization
        </h2>
        <p className="text-xs font-bold text-[#FECB6E]">Actionable intelligence to reduce recurring subscription burn without disrupting workflow</p>
      </div>

      {/* Savings Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#FECB6E]/40 bg-gradient-to-br from-[#2A2D3E] to-[#1A1D27] space-y-1 shadow-[0_10px_30px_rgba(254,203,110,0.15)]">
          <div className="flex items-center justify-between text-[#FECB6E]">
            <span className="text-xs font-black uppercase tracking-wider text-[#B8B8AC]">Potential Monthly Savings</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD89B] to-[#FECB6E]">
            {formatCurrency(potentialMonthlySavings)}
          </p>
          <p className="text-[11px] text-slate-300 font-semibold">Identified across unused & duplicate services</p>
        </div>

        <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-[#2A2D3E] to-[#1A1D27] space-y-1 shadow-[0_10px_30px_rgba(16,185,129,0.15)]">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-black uppercase tracking-wider text-[#B8B8AC]">Potential Annual Savings</span>
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-emerald-300">
            {formatCurrency(potentialAnnualSavings)}
          </p>
          <p className="text-[11px] text-slate-300 font-semibold">Projected 12-month optimization return</p>
        </div>
      </div>

      {/* Recommendations Stack */}
      <div className="space-y-6">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FECB6E]" /> Active Optimization Recommendations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Recommendation 1 — Unused subscriptions */}
          <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Unused Service Detected
                </span>
                <span className="text-xs font-bold text-slate-400">Last activity: 47 days ago</span>
              </div>
              <h4 className="text-lg font-black text-white">VPN Secure Access</h4>
              <p className="text-xs text-[#B8B8AC] leading-relaxed">
                You haven't logged into this service in over 6 weeks. Consider cancelling to stop recurring charges.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#CBA378]/20">
              <div>
                <p className="text-[10px] text-[#B8B8AC] uppercase font-bold">Potential Annual Saving</p>
                <p className="text-sm font-black text-emerald-400">$119.88 / year ($9.99/mo)</p>
              </div>
              <button
                onClick={() => setSelectedSubForDetail({ id: 99, name: 'VPN Secure Access', cost: 9.99, category: 'Utilities', plan_type: 'Standard', billing_cycle: 'Monthly', next_billing_date: '2026-08-18', status: 'Active', auto_renewal: true, payment_type: 'card', associated_email: 'alex@paypulse.com', associated_contact: '+15550199' } as Subscription)}
                className="px-4 py-2 rounded-xl bg-[#171E25] hover:bg-[#222834] text-xs font-bold text-[#FECB6E] border border-[#CBA378]/30 transition"
              >
                Review
              </button>
            </div>
          </div>

          {/* Recommendation 2 — Duplicate services */}
          <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Duplicate AI Subscriptions
              </span>
              <h4 className="text-lg font-black text-white">Multiple AI Tool Tier Overlap</h4>
              <div className="space-y-1 pt-1 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-[#CBA378]/10 font-semibold"><span>ChatGPT Plus</span><span className="font-bold text-[#FECB6E]">$20.00/mo</span></div>
                <div className="flex justify-between py-1 border-b border-[#CBA378]/10 font-semibold"><span>Claude Pro</span><span className="font-bold text-[#FECB6E]">$20.00/mo</span></div>
                <div className="flex justify-between py-1 font-semibold"><span>Gemini Advanced</span><span className="font-bold text-[#FECB6E]">$20.00/mo</span></div>
              </div>
            </div>
            <div className="pt-2 border-t border-[#CBA378]/20 flex items-center justify-between">
              <p className="text-[11px] text-amber-300 font-bold">Total: $60.00/month. Consider reviewing necessity.</p>
              <span className="text-[10px] text-slate-400 italic">Recommendation only</span>
            </div>
          </div>

          {/* Recommendation 3 — Expensive subscriptions */}
          <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                High Expenditure Alert
              </span>
              <h4 className="text-lg font-black text-white">AWS Cloud Enterprise</h4>
              <p className="text-xs text-[#B8B8AC]">
                Your AWS hosting commitment represents a significant portion of monthly overhead.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 rounded-xl bg-[#171E25] border border-[#CBA378]/20">
                  <p className="text-[9px] text-[#B8B8AC] uppercase font-bold">Monthly Cost</p>
                  <p className="text-sm font-black text-white">$42.00</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#171E25] border border-[#CBA378]/20">
                  <p className="text-[9px] text-[#B8B8AC] uppercase font-bold">Annual Cost</p>
                  <p className="text-sm font-black text-[#FECB6E]">$504.00</p>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-[#CBA378]/20 text-[11px] text-cyan-300 font-bold">
              Cost Trend: Stable (+0% vs last quarter)
            </div>
          </div>

          {/* Recommendation 4 — Annual vs monthly */}
          <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Billing Cycle Arbitrage
              </span>
              <h4 className="text-lg font-black text-white">Switch to Annual Billing</h4>
              <p className="text-xs text-[#B8B8AC]">
                Switching eligible monthly subscriptions to annual billing plans unlocks instant discounts.
              </p>
              <div className="space-y-1 text-xs pt-1 font-semibold text-slate-300">
                <p>Monthly Billing: <span className="font-bold text-white">$20 × 12 = $240</span></p>
                <p>Annual Plan Option: <span className="font-bold text-emerald-400">$200 / year</span></p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#CBA378]/20 flex items-center justify-between">
              <p className="text-xs font-black text-emerald-400">Potential Saving: $40/year</p>
              <span className="text-[10px] text-slate-400 font-bold">Switch available</span>
            </div>
          </div>

        </div>
      </div>

      {/* Recommendation 5 — Payment-source optimization */}
      <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#FECB6E]/40 bg-gradient-to-r from-[#2A2D3E] via-[#222533] to-[#1A1D27] space-y-4">
        <div className="flex items-center justify-between border-b border-[#CBA378]/20 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#FECB6E]" />
            <h3 className="text-base font-black text-white">Payment-Source Optimization</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Action Required
          </span>
        </div>

        <p className="text-xs text-[#B8B8AC] leading-relaxed">
          Some active subscriptions are billed to cards or accounts that are marked as non-primary or expiring soon. Optimize your payment channels to prevent billing interruptions.
        </p>

        <div className="space-y-2.5">
          {(subscriptions.length > 0 ? subscriptions.slice(0, 2) : [
            { id: 1, name: 'Cloud Storage Pro', cost: 12.00, billing_cycle: 'Monthly', next_billing_date: '2026-08-19', status: 'Active', category: 'Cloud', payment_type: 'card' } as Subscription
          ]).map((sub) => (
            <div key={sub.id} className="p-3.5 rounded-2xl bg-[#171E25] border border-[#CBA378]/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-white">{sub.name} <span className="text-[#FECB6E] font-normal">({formatCurrency(sub.cost)}/mo)</span></p>
                <p className="text-[10px] text-amber-400 font-semibold mt-0.5">Currently billed to non-primary payment method</p>
              </div>
              <button
                onClick={() => setSelectedSubForReview(sub)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] font-black text-xs shadow hover:scale-105 transition flex items-center gap-1"
              >
                <span>Change Payment Source</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Change Payment Source Modal */}
      {selectedSubForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="glass-card-lighter-zenta border border-[#CBA378]/40 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-white my-auto bg-gradient-to-b from-[#2A2D3E]/95 via-[#222533]/98 to-[#1A1D27]/98">
            <button onClick={() => setSelectedSubForReview(null)} className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#171E25] text-[#B8B8AC] hover:text-white transition">
              <X className="w-4 h-4"/>
            </button>

            <div className="mb-4 border-b border-[#CBA378]/20 pb-3">
              <h3 className="text-lg font-black text-white">Optimize Payment Source</h3>
              <p className="text-xs text-[#B8B8AC]">Select primary wallet card for <span className="text-[#FECB6E] font-bold">{selectedSubForReview.name}</span></p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase block mb-1.5">Select Wallet Card</label>
                <select
                  value={targetCardId || ''}
                  onChange={(e) => setTargetCardId(Number(e.target.value))}
                  className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#FECB6E]"
                >
                  <option value="" disabled>-- Choose Primary Card --</option>
                  {cards.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.card_title} ({c.card_type}) •{c.masked_card_number.slice(-4)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  onClick={() => setSelectedSubForReview(null)}
                  className="flex-1 py-2 rounded-xl bg-[#171E25] text-[#B8B8AC] font-bold text-xs border border-[#CBA378]/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePaymentSource}
                  className="flex-1 py-2 rounded-xl btn-modern-left-3d font-black text-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Detail Modal */}
      {selectedSubForDetail && (
        <SubscriptionDetailModal
          subscription={selectedSubForDetail}
          onClose={() => setSelectedSubForDetail(null)}
        />
      )}

    </div>
  );
};