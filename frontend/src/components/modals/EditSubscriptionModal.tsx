import React, { useState, useEffect } from 'react';
import { subscriptionApi } from '../../api/subscriptionApi';
import { walletApi } from '../../api/walletApi';
import { Subscription, WalletBank, WalletCard, WalletMobile } from '../../types';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../common/ConfirmModal';
import { X, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';

interface EditSubscriptionModalProps {
  isOpen: boolean;
  subscription: Subscription | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({
  isOpen,
  subscription,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [associatedEmail, setAssociatedEmail] = useState('');
  const [associatedContact, setAssociatedContact] = useState('');
  const [planType, setPlanType] = useState('Standard');
  const [accountType, setAccountType] = useState('Personal');
  const [cost, setCost] = useState<number>(0);
  const [currency, setCurrency] = useState('USD');
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [purchasedDate, setPurchasedDate] = useState('');
  const [nextBillingDate, setNextBillingDate] = useState('');
  const [autoRenewal, setAutoRenewal] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderDays, setReminderDays] = useState(3);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Active');
  
  const [paymentType, setPaymentType] = useState('card');
  const [cardId, setCardId] = useState<number | null>(null);
  const [bankId, setBankId] = useState<number | null>(null);
  const [mobileId, setMobileId] = useState<number | null>(null);

  const [cards, setCards] = useState<WalletCard[]>([]);
  const [banks, setBanks] = useState<WalletBank[]>([]);
  const [mobiles, setMobiles] = useState<WalletMobile[]>([]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen && subscription) {
      setName(subscription.name || '');
      setCategory(subscription.category || '');
      setAssociatedEmail(subscription.associated_email || '');
      setAssociatedContact(subscription.associated_contact || '');
      setPlanType(subscription.plan_type || 'Standard');
      setAccountType(subscription.account_type || 'Personal');
      setCost(subscription.cost || 0);
      setCurrency(subscription.currency || 'USD');
      setBillingCycle(subscription.billing_cycle || 'Monthly');
      setPurchasedDate(subscription.purchased_date ? subscription.purchased_date.substring(0, 10) : '');
      setNextBillingDate(subscription.next_billing_date ? subscription.next_billing_date.substring(0, 10) : '');
      setAutoRenewal(subscription.auto_renewal ?? true);
      setReminderEnabled(subscription.reminder_enabled ?? true);
      setReminderDays(subscription.reminder_days ?? 3);
      setNotes(subscription.notes || '');
      setStatus(subscription.status || 'Active');
      
      setPaymentType(subscription.payment_type || 'card');
      setCardId(subscription.card_id ?? null);
      setBankId(subscription.bank_id ?? null);
      setMobileId(subscription.mobile_id ?? null);

      Promise.all([
        walletApi.getCards(),
        walletApi.getBanks(),
        walletApi.getMobile()
      ]).then(([cRes, bRes, mRes]) => {
        setCards(cRes.data);
        setBanks(bRes.data);
        setMobiles(mRes.data);
      }).catch(console.error);
    }
  }, [isOpen, subscription]);

  if (!isOpen || !subscription) return null;

  const handleValidation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Subscription name is required.');
      return;
    }
    if (cost <= 0) {
      setErrorMessage('Cost must be greater than 0.');
      return;
    }

    if (status.toLowerCase() === 'active') {
      const todayStr = new Date().toISOString().split('T')[0];
      if (!nextBillingDate || nextBillingDate < todayStr) {
        setErrorMessage('Next billing date must be set to today or a future date when subscription is Active.');
        showToast('Please select a valid future Next Billing Date for Active status.', 'error');
        return;
      }
    }

    setShowConfirm(true);
  };

  const handleExecuteUpdate = async () => {
    try {
      await subscriptionApi.update(subscription.id, {
        name,
        category,
        associated_email: associatedEmail,
        associated_contact: associatedContact,
        plan_type: planType,
        account_type: accountType,
        cost: Number(cost),
        currency,
        billing_cycle: billingCycle,
        purchased_date: purchasedDate,
        next_billing_date: nextBillingDate,
        auto_renewal: autoRenewal,
        reminder_enabled: reminderEnabled,
        reminder_days: reminderDays,
        notes,
        status,
        payment_type: paymentType,
        card_id: paymentType === 'card' ? cardId : null,
        bank_id: paymentType === 'bank' ? bankId : null,
        mobile_id: (paymentType === 'mfs' || paymentType === 'mobile_banking') ? mobileId : null
      });

      showToast('Subscription updated successfully!', 'success');
      onSuccess();
      onClose();
      setShowConfirm(false);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.detail || 'Failed to update subscription');
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
        <div className="glass-card-lighter-zenta border border-[#CBA378]/40 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative text-white my-auto bg-gradient-to-b from-[#2A2D3E]/95 via-[#222533]/98 to-[#1A1D27]/98">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#171E25] text-[#B8B8AC] hover:text-white transition">
            <X className="w-4 h-4"/>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-2xl bg-[#FECB6E]/20 text-[#FECB6E] border border-[#FECB6E]/40 shrink-0">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Edit Subscription</h3>
              <p className="text-[10px] text-[#B8B8AC]">Modify plan, cost, dates & payment source</p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-3 p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleValidation} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Service Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]" 
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Category</label>
                <input 
                  type="text" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]" 
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Cost *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={cost} 
                  onChange={(e) => setCost(parseFloat(e.target.value) || 0)} 
                  className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#FECB6E]" 
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Currency</label>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)} 
                  className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                >
                  <option value="USD">USD ($)</option>
                  <option value="BDT">BDT (৳)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Billing Cycle</label>
                <select 
                  value={billingCycle} 
                  onChange={(e) => setBillingCycle(e.target.value)} 
                  className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half-Yearly">Half-Yearly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Start Date</label>
                <input 
                  type="date" 
                  value={purchasedDate} 
                  onChange={(e) => setPurchasedDate(e.target.value)} 
                  className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]" 
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Next Billing Date *</label>
                <input 
                  type="date" 
                  value={nextBillingDate} 
                  onChange={(e) => setNextBillingDate(e.target.value)} 
                  className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Payment Method Type</label>
                <select 
                  value={paymentType} 
                  onChange={(e) => {
                    setPaymentType(e.target.value);
                    setCardId(null);
                    setBankId(null);
                    setMobileId(null);
                  }} 
                  className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                >
                  <option value="card">Credit / Debit Card</option>
                  <option value="bank">Bank Account</option>
                  <option value="mobile_banking">Mobile Banking (MFS)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Linked Payment Source</label>
                {paymentType === 'card' && (
                  <select 
                    value={cardId || ''} 
                    onChange={(e) => setCardId(e.target.value ? Number(e.target.value) : null)} 
                    className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                  >
                    <option value="">Select Card...</option>
                    {cards.map(c => (
                      <option key={c.id} value={c.id}>{c.card_title || c.card_type} ({c.masked_card_number})</option>
                    ))}
                  </select>
                )}

                {paymentType === 'bank' && (
                  <select 
                    value={bankId || ''} 
                    onChange={(e) => setBankId(e.target.value ? Number(e.target.value) : null)} 
                    className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                  >
                    <option value="">Select Bank...</option>
                    {banks.map(b => (
                      <option key={b.id} value={b.id}>{b.bank_name} ({b.masked_account_number})</option>
                    ))}
                  </select>
                )}

                {(paymentType === 'mfs' || paymentType === 'mobile_banking') && (
                  <select 
                    value={mobileId || ''} 
                    onChange={(e) => setMobileId(e.target.value ? Number(e.target.value) : null)} 
                    className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                  >
                    <option value="">Select Mobile Wallet...</option>
                    {mobiles.map(m => (
                      <option key={m.id} value={m.id}>{m.provider.toUpperCase()} ({m.mobile_number})</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)} 
                  className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#FECB6E]"
                >
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Paused">Paused</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Idle">Idle</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={autoRenewal} 
                    onChange={(e) => setAutoRenewal(e.target.checked)} 
                    className="rounded border-[#CBA378] text-[#FECB6E] focus:ring-0" 
                  />
                  <span>Auto Renewal</span>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] font-black text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Changes
            </button>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Updates"
        message="Are you sure you want to save changes to this subscription?"
        onConfirm={handleExecuteUpdate}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};