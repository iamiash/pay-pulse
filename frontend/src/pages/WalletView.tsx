import React, { useState, useEffect } from 'react';
import { walletApi } from '../api/walletApi';
import { subscriptionApi } from '../api/subscriptionApi';
import { WalletBank, WalletCard, WalletMobile, Subscription } from '../types';
import { AddBankModal } from '../components/modals/AddBankModal';
import { AddCardModal } from '../components/modals/AddCardModal';
import { AddMobileBankingModal } from '../components/modals/AddMobileBankingModal';
import { CreditCard } from '../components/wallet/CreditCard';
import { BankCard } from '../components/wallet/BankCard';
import { MobileBankingCard } from '../components/wallet/MobileBankingCard';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { useToast } from '../context/ToastContext';
import { 
  Plus, CreditCard as CardHeaderIcon, Landmark, Smartphone, X, 
  Trash2, Edit3, ShieldCheck, CheckCircle2, Wallet, Layers, Eye, RefreshCw
} from 'lucide-react';

export const WalletView: React.FC = () => {
  const [banks, setBanks] = useState<WalletBank[]>([]);
  const [cards, setCards] = useState<WalletCard[]>([]);
  const [mobiles, setMobiles] = useState<WalletMobile[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'all' | 'cards' | 'banks' | 'mobiles'>('all');

  // Modals for Adding
  const [showBankModal, setShowBankModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);

  // Selected item detail state
  const [selectedCard, setSelectedCard] = useState<WalletCard | null>(null);
  const [selectedBank, setSelectedBank] = useState<WalletBank | null>(null);
  const [selectedMobile, setSelectedMobile] = useState<WalletMobile | null>(null);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  // Confirmations
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{ open: boolean; type: 'card' | 'bank' | 'mobile'; id: number } | null>(null);
  const [confirmUpdateModal, setConfirmUpdateModal] = useState<boolean>(false);

  const { showToast } = useToast();

  const fetchWallet = async () => {
    try {
      const [b, c, m, s] = await Promise.all([
        walletApi.getBanks(),
        walletApi.getCards(),
        walletApi.getMobile(),
        subscriptionApi.list()
      ]);
      setBanks(b.data);
      setCards(c.data);
      setMobiles(m.data);
      setSubscriptions(s.data);
    } catch (err) {
      console.error('Failed to fetch wallet or subscriptions data:', err);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  // Compute live linked subscription counts per channel
  const getCardUsageCount = (cardId: number) => {
    return subscriptions.filter(s => s.payment_type === 'card' && s.card_id === cardId).length;
  };

  const getBankUsageCount = (bankId: number) => {
    return subscriptions.filter(s => s.payment_type === 'bank' && s.bank_id === bankId).length;
  };

  const getMobileUsageCount = (mobileId: number) => {
    return subscriptions.filter(s => (s.payment_type === 'mfs' || s.payment_type === 'mobile_banking') && s.mobile_id === mobileId).length;
  };

  const closeDetailModals = () => {
    setSelectedCard(null);
    setSelectedBank(null);
    setSelectedMobile(null);
    setIsEditing(false);
    setEditFormData({});
  };

  const handleStartEdit = (type: 'card' | 'bank' | 'mobile', item: any) => {
    setIsEditing(true);
    setEditFormData({ ...item });
  };

  const handleExecuteUpdate = async () => {
    try {
      if (selectedCard) {
        await walletApi.updateCard(selectedCard.id, editFormData);
        showToast('Card details updated successfully!', 'success');
      } else if (selectedBank) {
        await walletApi.updateBank(selectedBank.id, editFormData);
        showToast('Bank details updated successfully!', 'success');
      } else if (selectedMobile) {
        await walletApi.updateMobile(selectedMobile.id, editFormData);
        showToast('Mobile banking account updated!', 'success');
      }
      fetchWallet();
      closeDetailModals();
      setConfirmUpdateModal(false);
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to update payment method', 'error');
    }
  };

  const handleExecuteDelete = async () => {
    if (!confirmDeleteModal) return;
    try {
      if (confirmDeleteModal.type === 'card') {
        await walletApi.deleteCard(confirmDeleteModal.id);
        showToast('Payment card deleted', 'success');
      } else if (confirmDeleteModal.type === 'bank') {
        await walletApi.deleteBank(confirmDeleteModal.id);
        showToast('Bank account removed', 'success');
      } else if (confirmDeleteModal.type === 'mobile') {
        await walletApi.deleteMobile(confirmDeleteModal.id);
        showToast('Mobile account deleted', 'success');
      }
      fetchWallet();
      closeDetailModals();
      setConfirmDeleteModal(null);
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to delete payment method', 'error');
    }
  };

  const totalPaymentMethods = cards.length + banks.length + mobiles.length;

  return (
    <div className="space-y-8 text-white max-w-7xl mx-auto pb-10 page-transition">
      
      {/* Centered Page Headline */}
      <div className="text-center space-y-1 border-b border-[#CBA378]/20 pb-4">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E] tracking-tight drop-shadow-md">
          Wallet Management
        </h2>
        <p className="text-xs font-semibold text-[#FECB6E]">Manage all payment sources used for active subscriptions</p>
      </div>

      {/* Summary KPI Cards Grid (Cards 1 to 4) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Card 1: Total Payment Methods */}
        <div 
          onClick={() => setActiveTab('all')}
          className={`glass-card-lighter-zenta p-4 rounded-2xl border cursor-pointer hover:scale-[1.02] transition-all duration-200 ${
            activeTab === 'all' ? 'border-[#FECB6E] ring-2 ring-[#FECB6E]/30' : 'border-[#CBA378]/30'
          }`}
        >
          <div className="flex justify-between items-center text-[#FECB6E]">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#B8B8AC]">Payment Methods</span>
            <Wallet className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white">{totalPaymentMethods}</p>
          <p className="text-[10px] text-[#FECB6E] font-semibold mt-1">
            {activeTab === 'all' ? '✓ Filter Active' : 'Click to view all'}
          </p>
        </div>

        {/* Card 2: Cards */}
        <div 
          onClick={() => setActiveTab('cards')}
          className={`glass-card-lighter-zenta p-4 rounded-2xl border cursor-pointer hover:scale-[1.02] transition-all duration-200 ${
            activeTab === 'cards' ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-rose-500/30'
          }`}
        >
          <div className="flex justify-between items-center text-rose-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#B8B8AC]">Cards</span>
            <CardHeaderIcon className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-rose-300">{cards.length}</p>
          <p className="text-[10px] text-rose-400 font-semibold mt-1">
            {activeTab === 'cards' ? '✓ Filter Active' : 'Click to view cards'}
          </p>
        </div>

        {/* Card 3: Bank Accounts */}
        <div 
          onClick={() => setActiveTab('banks')}
          className={`glass-card-lighter-zenta p-4 rounded-2xl border cursor-pointer hover:scale-[1.02] transition-all duration-200 ${
            activeTab === 'banks' ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-indigo-500/30'
          }`}
        >
          <div className="flex justify-between items-center text-indigo-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#B8B8AC]">Bank Accounts</span>
            <Landmark className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-indigo-300">{banks.length}</p>
          <p className="text-[10px] text-indigo-400 font-semibold mt-1">
            {activeTab === 'banks' ? '✓ Filter Active' : 'Click to view banks'}
          </p>
        </div>

        {/* Card 4: Mobile Banking */}
        <div 
          onClick={() => setActiveTab('mobiles')}
          className={`glass-card-lighter-zenta p-4 rounded-2xl border cursor-pointer hover:scale-[1.02] transition-all duration-200 ${
            activeTab === 'mobiles' ? 'border-[#FECB6E] ring-2 ring-[#FECB6E]/30' : 'border-[#FECB6E]/30'
          }`}
        >
          <div className="flex justify-between items-center text-[#FECB6E]">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#B8B8AC]">Mobile Banking</span>
            <Smartphone className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-[#FECB6E]">{mobiles.length}</p>
          <p className="text-[10px] text-[#FECB6E] font-semibold mt-1">
            {activeTab === 'mobiles' ? '✓ Filter Active' : 'Click to view mobile'}
          </p>
        </div>

      </div>

      {/* Tabs & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#CBA378]/20 pb-3">
        {/* Navigation Tabs */}
        <div className="flex bg-[#171E25] p-1 rounded-2xl border border-[#CBA378]/20 text-xs font-bold w-full sm:w-auto">
          {[
            { id: 'all', label: 'All', count: totalPaymentMethods },
            { id: 'cards', label: 'Cards', count: cards.length },
            { id: 'banks', label: 'Bank Accounts', count: banks.length },
            { id: 'mobiles', label: 'Mobile Banking', count: mobiles.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] font-black shadow-md'
                  : 'text-[#B8B8AC] hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id ? 'bg-[#171E25]/30 text-[#171E25]' : 'bg-[#222834] text-[#B8B8AC]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button 
            onClick={() => setShowCardModal(true)} 
            className="px-3 py-1.5 rounded-xl bg-[#171E25] border border-rose-500/40 text-rose-300 font-bold text-xs hover:bg-rose-950/40 transition flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Card
          </button>
          <button 
            onClick={() => setShowBankModal(true)} 
            className="px-3 py-1.5 rounded-xl bg-[#171E25] border border-indigo-500/40 text-indigo-300 font-bold text-xs hover:bg-indigo-950/40 transition flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Bank
          </button>
          <button 
            onClick={() => setShowMobileModal(true)} 
            className="px-3 py-1.5 rounded-xl bg-[#171E25] border border-[#CBA378]/40 text-[#FECB6E] font-bold text-xs hover:bg-[#FECB6E]/10 transition flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Mobile
          </button>
        </div>
      </div>

      {/* Payment Method Cards Display Container */}
      <div className="space-y-6">
        
        {/* Credit/Debit Cards */}
        {(activeTab === 'all' || activeTab === 'cards') && cards.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <CardHeaderIcon className="w-4 h-4" /> Credit & Debit Cards ({cards.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cards.map((c) => (
                <CreditCard 
                  key={c.id} 
                  card={c} 
                  usageCount={getCardUsageCount(c.id)}
                  onView={() => setSelectedCard(c)}
                  onEdit={() => handleStartEdit('card', c)}
                  onRemove={() => setConfirmDeleteModal({ open: true, type: 'card', id: c.id })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bank Accounts */}
        {(activeTab === 'all' || activeTab === 'banks') && banks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Landmark className="w-4 h-4" /> Bank Accounts ({banks.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {banks.map((b) => (
                <BankCard 
                  key={b.id} 
                  bank={b} 
                  usageCount={getBankUsageCount(b.id)}
                  onView={() => setSelectedBank(b)}
                  onEdit={() => handleStartEdit('bank', b)}
                  onRemove={() => setConfirmDeleteModal({ open: true, type: 'bank', id: b.id })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mobile Banking */}
        {(activeTab === 'all' || activeTab === 'mobiles') && mobiles.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#FECB6E] uppercase tracking-wider flex items-center gap-2">
              <Smartphone className="w-4 h-4" /> Mobile Banking Accounts ({mobiles.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mobiles.map((m) => (
                <MobileBankingCard 
                  key={m.id} 
                  mobile={m} 
                  usageCount={getMobileUsageCount(m.id)}
                  onView={() => setSelectedMobile(m)}
                  onEdit={() => handleStartEdit('mobile', m)}
                  onRemove={() => setConfirmDeleteModal({ open: true, type: 'mobile', id: m.id })}
                />
              ))}
            </div>
          </div>
        )}

        {totalPaymentMethods === 0 && (
          <div className="p-12 text-center glass-card-lighter-zenta rounded-2xl border border-[#CBA378]/20 space-y-3">
            <Wallet className="w-10 h-10 text-[#CBA378] mx-auto opacity-60" />
            <p className="text-sm font-bold text-[#B8B8AC]">No payment methods found in your wallet.</p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setShowCardModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#171E25] text-xs font-bold text-[#FECB6E] border border-[#CBA378]/30 hover:bg-[#222834] transition"
              >
                + Add First Card
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Item Detail & Edit Modal */}
      {(selectedCard || selectedBank || selectedMobile) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="glass-card-lighter-zenta border border-[#CBA378]/40 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-white my-auto bg-gradient-to-b from-[#2A2D3E]/95 via-[#222533]/98 to-[#1A1D27]/98">
            <button onClick={closeDetailModals} className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#171E25] text-[#B8B8AC] hover:text-white transition">
              <X className="w-4 h-4"/>
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#CBA378]/20">
              <div className="p-2.5 rounded-2xl bg-[#FECB6E]/20 text-[#FECB6E] border border-[#FECB6E]/40">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedCard ? 'Card Profile' : selectedBank ? 'Bank Profile' : 'Mobile Banking Profile'}
                </h3>
                <p className="text-[10px] text-[#B8B8AC] font-medium">Encrypted payment source reference</p>
              </div>
            </div>

            {!isEditing ? (
              <div className="space-y-3 text-xs">
                {selectedCard && (
                  <>
                    <div className="flex justify-between py-1.5 border-b border-[#CBA378]/10"><span className="text-[#B8B8AC]">Card Title:</span><span className="font-bold text-white">{selectedCard.card_title || 'N/A'}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-[#CBA378]/10"><span className="text-[#B8B8AC]">Brand:</span><span className="font-bold text-[#FECB6E]">{selectedCard.card_type}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-[#CBA378]/10"><span className="text-[#B8B8AC]">Category:</span><span className="font-bold text-white">{selectedCard.card_category}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-[#CBA378]/10"><span className="text-[#B8B8AC]">Number:</span><span className="font-mono font-bold text-white">{selectedCard.masked_card_number}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-[#CBA378]/10"><span className="text-[#B8B8AC]">Expiry Date:</span><span className="font-mono font-bold text-[#FECB6E]">{selectedCard.expiry_date}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-[#CBA378]/10"><span className="text-[#B8B8AC]">Active Subscriptions:</span><span className="font-bold text-cyan-300">{getCardUsageCount(selectedCard.id)} linked</span></div>
                  </>
                )}

                {selectedBank && (
                  <>
                    <div className="flex justify-between py-1.5 border-b border-[#CBA378]/10"><span className="text-[#B8B8AC]">Bank Name:</span><span className="font-bold text-white">{selectedBank.bank_name}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-[#CBA378]/10"><span className="text-[#B8B8AC]">Account Number:</span><span className="font-mono font-bold text-[#FECB6E]">{selectedBank.masked_account_number}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-[#CBA378]/10"><span className="text-[#B8B8AC]">Branch:</span><span className="font-bold text-white">{selectedBank.branch_name}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-[#CBA378]/10"><span className="text-[#B8B8AC]">Routing Number:</span><span className="font-mono font-bold text-white">{selectedBank.routing_number}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-[#CBA378]/10"><span className="text-[#B8B8AC]">Active Subscriptions:</span><span className="font-bold text-cyan-300">{getBankUsageCount(selectedBank.id)} linked</span></div>
                  </>
                )}

                {selectedMobile && (
                  <>
                    <div className="flex justify-between py-1.5 border-b border-[#CBA378]/10"><span className="text-[#B8B8AC]">Provider:</span><span className="font-bold text-[#FECB6E] uppercase">{selectedMobile.provider}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-[#CBA378]/10"><span className="text-[#B8B8AC]">Mobile Number:</span><span className="font-mono font-bold text-white">{selectedMobile.mobile_number}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-[#CBA378]/10"><span className="text-[#B8B8AC]">Active Subscriptions:</span><span className="font-bold text-cyan-300">{getMobileUsageCount(selectedMobile.id)} linked</span></div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleStartEdit(selectedCard ? 'card' : selectedBank ? 'bank' : 'mobile', selectedCard || selectedBank || selectedMobile)}
                    className="flex-1 py-2 rounded-xl bg-[#171E25] hover:bg-[#222834] border border-indigo-400/40 text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Info
                  </button>
                  <button
                    onClick={() => setConfirmDeleteModal({
                      open: true,
                      type: selectedCard ? 'card' : selectedBank ? 'bank' : 'mobile',
                      id: (selectedCard || selectedBank || selectedMobile)!.id
                    })}
                    className="flex-1 py-2 rounded-xl bg-[#171E25] hover:bg-[#222834] border border-rose-400/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedCard && (
                  <>
                    <div>
                      <label className="text-[10px] font-bold text-[#B8B8AC]">CARD TITLE</label>
                      <input type="text" value={editFormData.card_title || ''} onChange={(e) => setEditFormData({ ...editFormData, card_title: e.target.value })} className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#B8B8AC]">EXPIRY DATE</label>
                      <input type="text" value={editFormData.expiry_date || ''} onChange={(e) => setEditFormData({ ...editFormData, expiry_date: e.target.value })} className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white" />
                    </div>
                  </>
                )}

                {selectedBank && (
                  <>
                    <div>
                      <label className="text-[10px] font-bold text-[#B8B8AC]">BANK NAME</label>
                      <input type="text" value={editFormData.bank_name || ''} onChange={(e) => setEditFormData({ ...editFormData, bank_name: e.target.value })} className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#B8B8AC]">BRANCH NAME</label>
                      <input type="text" value={editFormData.branch_name || ''} onChange={(e) => setEditFormData({ ...editFormData, branch_name: e.target.value })} className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white" />
                    </div>
                  </>
                )}

                {selectedMobile && (
                  <div>
                    <label className="text-[10px] font-bold text-[#B8B8AC]">MOBILE NUMBER</label>
                    <input type="text" value={editFormData.mobile_number || ''} onChange={(e) => setEditFormData({ ...editFormData, mobile_number: e.target.value })} className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white" />
                  </div>
                )}

                <div className="flex gap-2 pt-3">
                  <button onClick={() => setIsEditing(false)} className="flex-1 py-2 rounded-xl bg-[#171E25] text-[#B8B8AC] font-bold text-xs">Cancel</button>
                  <button onClick={() => setConfirmUpdateModal(true)} className="flex-1 py-2 rounded-xl bg-[#FECB6E] text-[#171E25] font-black text-xs flex items-center justify-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> Save Changes</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={!!confirmDeleteModal}
        title="Confirm Removal"
        message="Are you sure you want to delete this payment source from your wallet?"
        onConfirm={handleExecuteDelete}
        onCancel={() => setConfirmDeleteModal(null)}
      />

      <ConfirmModal
        isOpen={confirmUpdateModal}
        title="Confirm Updates"
        message="Are you sure you want to update this payment source?"
        onConfirm={handleExecuteUpdate}
        onCancel={() => setConfirmUpdateModal(false)}
      />

      {/* Add Payment Method Modals */}
      <AddBankModal isOpen={showBankModal} onClose={() => setShowBankModal(false)} onSuccess={fetchWallet} />
      <AddCardModal isOpen={showCardModal} onClose={() => setShowCardModal(false)} onSuccess={fetchWallet} />
      <AddMobileBankingModal isOpen={showMobileModal} onClose={() => setShowMobileModal(false)} onSuccess={fetchWallet} />
    </div>
  );
};