import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { walletApi } from '../../api/walletApi';
import { subscriptionApi } from '../../api/subscriptionApi';
import { useToast } from '../../context/ToastContext';
import { WalletBank, WalletCard, WalletMobile } from '../../types';
import { 
  Plus, X, AlertCircle, CreditCard, Landmark, Smartphone, 
  CheckCircle2, Sparkles, Bell, DollarSign, Globe
} from 'lucide-react';

export const AddSubscriptionModal: React.FC<{ isOpen: boolean; onClose: () => void; onSuccess: () => void }> = ({ 
  isOpen, onClose, onSuccess 
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Streaming');
  const [planType, setPlanType] = useState('Standard');
  const [associatedEmail, setAssociatedEmail] = useState('');
  const [associatedContact, setAssociatedContact] = useState('');
  const [cost, setCost] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [purchasedDate, setPurchasedDate] = useState('');
  const [nextBillingDate, setNextBillingDate] = useState('');
  const [autoRenewal, setAutoRenewal] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderDays, setReminderDays] = useState(3);
  const [notes, setNotes] = useState('');

  const [provider, setProvider] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [accountType, setAccountType] = useState<'Personal' | 'Official' | 'Shared'>('Personal');
  const [username, setUsername] = useState('');
  const [accountReference, setAccountReference] = useState('');
  const [status, setStatus] = useState<'Active' | 'Paused' | 'Cancelled'>('Active');

  const [paymentType, setPaymentType] = useState<'bank' | 'card' | 'mobile_banking' | 'add_new' | null>(null);
  const [banks, setBanks] = useState<WalletBank[]>([]);
  const [cards, setCards] = useState<WalletCard[]>([]);
  const [mobiles, setMobiles] = useState<WalletMobile[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);

  const [addNewType, setAddNewType] = useState<'card' | 'bank' | 'mobile_banking'>('card');
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardBrand, setNewCardBrand] = useState('Visa');
  const [newCardCategory, setNewCardCategory] = useState('Debit');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardCvc, setNewCardCvc] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');

  const [newBankName, setNewBankName] = useState('');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [newRoutingNumber, setNewRoutingNumber] = useState('');

  const [newMobileProvider, setNewMobileProvider] = useState('bkash');
  const [newMobileNumber, setNewMobileNumber] = useState('');

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (user) {
      setAssociatedEmail(user.email || '');
      setAssociatedContact(user.contact_no || '');
    }
  }, [user]);

  const loadPaymentMethods = async () => {
    try {
      const [b, c, m] = await Promise.all([
        walletApi.getBanks(),
        walletApi.getCards(),
        walletApi.getMobile()
      ]);
      setBanks(b.data);
      setCards(c.data);
      setMobiles(m.data);
    } catch (err) {
      console.error('Failed to load payment channels', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setFieldErrors({});
      setErrorMessage(null);
      setPaymentType(null);
      setSelectedPaymentId(null);
      setShowConfirmModal(false);
      loadPaymentMethods();
    }
  }, [isOpen]);

  const handleSelectPaymentType = (type: 'bank' | 'card' | 'mobile_banking' | 'add_new') => {
    setPaymentType(type);
    setErrorMessage(null);
    setFieldErrors((prev) => ({ ...prev, paymentType: '' }));
    setSelectedPaymentId(null);

    if (type === 'card' && cards.length > 0) setSelectedPaymentId(cards[0].id);
    if (type === 'bank' && banks.length > 0) setSelectedPaymentId(banks[0].id);
    if (type === 'mobile_banking' && mobiles.length > 0) setSelectedPaymentId(mobiles[0].id);
  };

  const handleQuickAddSource = async (): Promise<{ type: 'bank' | 'card' | 'mobile_banking'; id: number } | null> => {
    setErrorMessage(null);
    try {
      if (addNewType === 'card') {
        if (!newCardTitle || !newCardNumber || !newCardCvc || !newCardExpiry) {
          setErrorMessage('Please fill out all required card fields.');
          return null;
        }
        const res = await walletApi.addCard({
          card_title: newCardTitle,
          card_type: newCardBrand,
          card_category: newCardCategory,
          card_number: newCardNumber,
          cvc: newCardCvc,
          expiry_date: newCardExpiry
        });
        showToast('Card added to wallet!', 'success');
        await loadPaymentMethods();
        return { type: 'card', id: res.data.id };
      } else if (addNewType === 'bank') {
        if (!newBankName || !newAccountName || !newAccountNumber) {
          setErrorMessage('Please fill out all required bank details.');
          return null;
        }
        const res = await walletApi.addBank({
          bank_name: newBankName,
          account_number: newAccountNumber,
          branch_name: newBranchName || 'Main',
          routing_number: newRoutingNumber || '0000000'
        });
        showToast('Bank account added to wallet!', 'success');
        await loadPaymentMethods();
        return { type: 'bank', id: res.data.id };
      } else if (addNewType === 'mobile_banking') {
        if (!newMobileNumber) {
          setErrorMessage('Mobile number is required.');
          return null;
        }
        const res = await walletApi.addMobile({
          provider: newMobileProvider,
          mobile_number: newMobileNumber
        });
        showToast('Mobile banking added to wallet!', 'success');
        await loadPaymentMethods();
        return { type: 'mobile_banking', id: res.data.id };
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.detail || 'Failed to create payment source in wallet.');
    }
    return null;
  };

  const handleValidationAndPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const errors: { [key: string]: string } = {};

    if (!name.trim()) errors.name = 'Service Name is required.';
    if (!category.trim()) errors.category = 'Category is required.';
    if (!cost || isNaN(Number(cost)) || Number(cost) <= 0) {
      errors.cost = 'Amount must be greater than 0.';
    }
    if (!currency) errors.currency = 'Currency is required.';
    if (!billingCycle) errors.billingCycle = 'Billing Cycle is required.';
    if (!paymentType) errors.paymentType = 'Payment Source is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage('Please fill in all required fields highlighted below.');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);

    let activePaymentType = paymentType;
    let activePaymentId = selectedPaymentId;

    if (paymentType === 'add_new') {
      const createdChannel = await handleQuickAddSource();
      if (!createdChannel) return;
      activePaymentType = createdChannel.type;
      activePaymentId = createdChannel.id;
    } else if (!activePaymentId) {
      setFieldErrors({ paymentType: 'Please choose an active Card, Bank, or Mobile account from your wallet.' });
      setErrorMessage('Please choose an active payment source.');
      return;
    }

    try {
      const payload: any = {
        name,
        category,
        plan_type: planType,
        associated_email: associatedEmail,
        associated_contact: associatedContact,
        cost: parseFloat(cost),
        currency,
        billing_cycle: billingCycle,
        purchased_date: purchasedDate || new Date().toISOString().split('T')[0],
        next_billing_date: nextBillingDate || new Date().toISOString().split('T')[0],
        auto_renewal: autoRenewal,
        payment_type: activePaymentType,
        bank_id: activePaymentType === 'bank' ? activePaymentId : null,
        card_id: activePaymentType === 'card' ? activePaymentId : null,
        mobile_id: activePaymentType === 'mobile_banking' ? activePaymentId : null,
        reminder_enabled: reminderEnabled,
        reminder_days: reminderDays,
        notes,
        provider,
        logo_url: logoUrl,
        website,
        account_type: accountType,
        username,
        account_reference: accountReference,
        status,
      };

      await subscriptionApi.create(payload);
      showToast('Subscription added successfully!', 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.detail || 'Failed to create subscription.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass-card-lighter-zenta rounded-3xl w-full max-w-2xl flex flex-col max-h-[85vh] shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative text-white my-auto border border-[#CBA378]/40 overflow-hidden bg-gradient-to-b from-[#2A2D3E]/95 via-[#222533]/98 to-[#1A1D27]/98 backdrop-blur-2xl">
        
        {showConfirmModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-hidden">
            <div className="glass-card-lighter-zenta border border-[#FECB6E]/40 p-6 rounded-2xl max-w-md w-full shadow-2xl text-white space-y-4 text-center my-auto">
              <h3 className="text-lg font-black text-[#FECB6E]">Confirm New Subscription</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Add <span className="text-white font-bold">{name}</span> with a recurring cost of <span className="text-[#FECB6E] font-bold">{currency} {cost}</span> ({billingCycle})?
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-[#1A1C25] text-slate-300 font-bold text-xs rounded-xl border border-white/20 hover:bg-[#2A2D3E]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] font-black text-xs rounded-xl shadow-lg hover:scale-105 transition"
                >
                  Confirm & Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-b border-[#CBA378]/20 bg-[#171E25]/80 shrink-0 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-[#FFD89B] via-[#FECB6E] to-[#19547B] text-[#171E25] font-black">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">Add Subscription</h2>
              <p className="text-[10px] text-[#B8B8AC]">Enter subscription details and link payment source</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#171E25] text-[#B8B8AC] hover:text-[#FECB6E] transition border border-[#CBA378]/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 grow custom-scrollbar max-h-[calc(85vh-120px)]">
          
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-start gap-2 shadow-md">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleValidationAndPrompt} id="add-sub-form" className="space-y-5">
            
            <div className="p-4 rounded-2xl bg-[#171E25]/80 border border-[#CBA378]/20 space-y-3">
              <div className="flex items-center gap-2 border-b border-[#CBA378]/10 pb-2">
                <Globe className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-xs font-black text-[#FFD89B] uppercase tracking-wider">Service & Category</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#B8B8AC] uppercase">Service Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Netflix, ChatGPT, Spotify"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setFieldErrors((p) => ({ ...p, name: '' }));
                    }}
                    className={`w-full mt-1 bg-[#141620] border ${fieldErrors.name ? 'border-rose-500' : 'border-[#CBA378]/30'} rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#FECB6E]`}
                  />
                  {fieldErrors.name && <p className="text-[9px] text-rose-400 font-bold mt-0.5">{fieldErrors.name}</p>}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#B8B8AC] uppercase">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                  >
                    <option value="Streaming">Streaming</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Cloud">Cloud</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Productivity">Productivity</option>
                    <option value="AI Tools">AI Tools</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#B8B8AC] uppercase">Plan Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Premium 4K, Pro Tier"
                    value={planType}
                    onChange={(e) => setPlanType(e.target.value)}
                    className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#B8B8AC] uppercase">Account Email</label>
                  <input
                    type="email"
                    placeholder="user@domain.com"
                    value={associatedEmail}
                    onChange={(e) => setAssociatedEmail(e.target.value)}
                    className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#B8B8AC] uppercase">Contact Number</label>
                  <input
                    type="text"
                    placeholder="+1 555-0199"
                    value={associatedContact}
                    onChange={(e) => setAssociatedContact(e.target.value)}
                    className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#171E25]/80 border border-[#CBA378]/20 space-y-3">
              <div className="flex items-center gap-2 border-b border-[#CBA378]/10 pb-2">
                <DollarSign className="w-4 h-4 text-[#10B981]" />
                <h3 className="text-xs font-black text-[#FFD89B] uppercase tracking-wider">Pricing & Renewal Schedule</h3>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#B8B8AC] uppercase">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="15.99"
                    value={cost}
                    onChange={(e) => {
                      setCost(e.target.value);
                      setFieldErrors((p) => ({ ...p, cost: '' }));
                    }}
                    className={`w-full mt-1 bg-[#141620] border ${fieldErrors.cost ? 'border-rose-500' : 'border-[#CBA378]/30'} rounded-xl px-3 py-2 text-xs font-black text-white focus:outline-none focus:border-[#FECB6E]`}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#B8B8AC] uppercase">Currency *</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="BDT">BDT (৳)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#B8B8AC] uppercase">Billing Cycle *</label>
                  <select
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value)}
                    className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#B8B8AC] uppercase">Start Date</label>
                  <input
                    type="date"
                    value={purchasedDate}
                    onChange={(e) => setPurchasedDate(e.target.value)}
                    className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#B8B8AC] uppercase">Next Renewal Date</label>
                  <input
                    type="date"
                    value={nextBillingDate}
                    onChange={(e) => setNextBillingDate(e.target.value)}
                    className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs text-[#B8B8AC]">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                  <input
                    type="checkbox"
                    checked={autoRenewal}
                    onChange={(e) => setAutoRenewal(e.target.checked)}
                    className="rounded border-[#CBA378] text-[#FECB6E] focus:ring-0"
                  />
                  <span>Auto Renewal Enabled</span>
                </label>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#171E25]/80 border border-[#CBA378]/20 space-y-3">
              <div className="flex items-center gap-2 border-b border-[#CBA378]/10 pb-2">
                <CreditCard className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="text-xs font-black text-[#FFD89B] uppercase tracking-wider">Payment Source *</h3>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'card', label: 'Cards', icon: CreditCard },
                  { id: 'bank', label: 'Banks', icon: Landmark },
                  { id: 'mobile_banking', label: 'Mobile', icon: Smartphone },
                  { id: 'add_new', label: '+ Add New', icon: Plus }
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = paymentType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectPaymentType(opt.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                        isSelected
                          ? 'bg-[#FECB6E] text-[#171E25] border-[#FECB6E] shadow-md'
                          : 'bg-[#141620] text-[#B8B8AC] border-[#CBA378]/20 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {paymentType === 'card' && (
                <select
                  value={selectedPaymentId || ''}
                  onChange={(e) => setSelectedPaymentId(Number(e.target.value))}
                  className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="" disabled>-- Select Card (e.g. Visa ****4921, Mastercard ****7218) --</option>
                  {cards.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.card_type} ({c.card_category}) •{c.masked_card_number.slice(-4)}
                    </option>
                  ))}
                </select>
              )}

              {paymentType === 'bank' && (
                <select
                  value={selectedPaymentId || ''}
                  onChange={(e) => setSelectedPaymentId(Number(e.target.value))}
                  className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="" disabled>-- Select Bank (e.g. DBBL ****1234) --</option>
                  {banks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bank_name} •{b.masked_account_number.slice(-4)}
                    </option>
                  ))}
                </select>
              )}

              {paymentType === 'mobile_banking' && (
                <select
                  value={selectedPaymentId || ''}
                  onChange={(e) => setSelectedPaymentId(Number(e.target.value))}
                  className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="" disabled>-- Select Mobile Account (e.g. bKash ****5678) --</option>
                  {mobiles.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.provider.toUpperCase()} ••••{m.mobile_number.slice(-4)}
                    </option>
                  ))}
                </select>
              )}

              {paymentType === 'add_new' && (
                <div className="p-3 bg-[#141620] rounded-xl border border-[#CBA378]/30 space-y-2">
                  <div className="flex gap-2">
                    {(['card', 'bank', 'mobile_banking'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAddNewType(t)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                          addNewType === t ? 'bg-[#FECB6E] text-[#171E25]' : 'bg-[#1F2630] text-[#B8B8AC]'
                        }`}
                      >
                        {t === 'mobile_banking' ? 'Mobile' : t}
                      </button>
                    ))}
                  </div>

                  {addNewType === 'card' && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Card Label (e.g. Primary Visa)"
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        className="bg-[#1F2630] border border-[#CBA378]/20 rounded-lg p-1.5 text-white"
                      />
                      <input
                        type="text"
                        placeholder="16-Digit Card Number"
                        value={newCardNumber}
                        onChange={(e) => setNewCardNumber(e.target.value)}
                        className="bg-[#1F2630] border border-[#CBA378]/20 rounded-lg p-1.5 text-white"
                      />
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={newCardExpiry}
                        onChange={(e) => setNewCardExpiry(e.target.value)}
                        className="bg-[#1F2630] border border-[#CBA378]/20 rounded-lg p-1.5 text-white"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        value={newCardCvc}
                        onChange={(e) => setNewCardCvc(e.target.value)}
                        className="bg-[#1F2630] border border-[#CBA378]/20 rounded-lg p-1.5 text-white"
                      />
                    </div>
                  )}

                  {addNewType === 'bank' && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Bank Name (e.g. DBBL, City Bank)"
                        value={newBankName}
                        onChange={(e) => setNewBankName(e.target.value)}
                        className="bg-[#1F2630] border border-[#CBA378]/20 rounded-lg p-1.5 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Account Name"
                        value={newAccountName}
                        onChange={(e) => setNewAccountName(e.target.value)}
                        className="bg-[#1F2630] border border-[#CBA378]/20 rounded-lg p-1.5 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Account Number"
                        value={newAccountNumber}
                        onChange={(e) => setNewAccountNumber(e.target.value)}
                        className="bg-[#1F2630] border border-[#CBA378]/20 rounded-lg p-1.5 text-white col-span-2"
                      />
                    </div>
                  )}

                  {addNewType === 'mobile_banking' && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <select
                        value={newMobileProvider}
                        onChange={(e) => setNewMobileProvider(e.target.value)}
                        className="bg-[#1F2630] border border-[#CBA378]/20 rounded-lg p-1.5 text-white"
                      >
                        <option value="bkash">bKash</option>
                        <option value="nagad">Nagad</option>
                        <option value="rocket">Rocket</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Mobile Number (017...)"
                        value={newMobileNumber}
                        onChange={(e) => setNewMobileNumber(e.target.value)}
                        className="bg-[#1F2630] border border-[#CBA378]/20 rounded-lg p-1.5 text-white"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[#171E25]/80 border border-[#CBA378]/20 space-y-3">
              <div className="flex items-center gap-2 border-b border-[#CBA378]/10 pb-2">
                <Bell className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-xs font-black text-[#FFD89B] uppercase tracking-wider">Reminder & Notes</h3>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                  <input
                    type="checkbox"
                    checked={reminderEnabled}
                    onChange={(e) => setReminderEnabled(e.target.checked)}
                    className="rounded border-[#CBA378] text-[#FECB6E] focus:ring-0"
                  />
                  <span>Send Renewal Reminder</span>
                </label>

                {reminderEnabled && (
                  <select
                    value={reminderDays}
                    onChange={(e) => setReminderDays(Number(e.target.value))}
                    className="bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value={1}>1 day before</option>
                    <option value={3}>3 days before</option>
                    <option value={7}>7 days before</option>
                    <option value={14}>14 days before</option>
                  </select>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#B8B8AC] uppercase">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Additional notes or account references..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                />
              </div>
            </div>

          </form>
        </div>

        <div className="p-4 bg-[#171E25] border-t border-[#CBA378]/20 shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#222834] text-slate-300 hover:text-white text-xs font-bold border border-[#CBA378]/20"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-sub-form"
            className="px-6 py-2 rounded-xl btn-modern-left-3d text-xs font-bold flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Save Subscription
          </button>
        </div>

      </div>
    </div>
  );
};