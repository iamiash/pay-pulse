import React, { useState } from 'react';
import { walletApi } from '../../api/walletApi';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../common/ConfirmModal';
import { X, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

export const AddCardModal: React.FC<{ isOpen: boolean; onClose: () => void; onSuccess: () => void }> = ({
  isOpen, onClose, onSuccess
}) => {
  const [nickname, setNickname] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [bank, setBank] = useState('');
  const [cardBrand, setCardBrand] = useState('Visa');
  const [lastFour, setLastFour] = useState('');
  const [expiry, setExpiry] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isDefault, setIsDefault] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleValidation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!nickname.trim()) {
      setErrorMessage('Card nickname is required.');
      return;
    }
    if (lastFour.length !== 4) {
      setErrorMessage('Please provide exactly the last 4 digits.');
      return;
    }
    
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiry)) {
      setErrorMessage('Expiry date must be formatted as MM/YY (e.g. 08/28).');
      return;
    }

    setShowConfirm(true);
  };

  const handleExecuteAdd = async () => {
    try {
      await walletApi.addCard({
        card_title: nickname, 
        card_type: cardBrand, 
        card_category: 'Credit',
        card_number: `400000000000${lastFour}`, 
        cvc: '123', 
        expiry_date: expiry
      });
      showToast('Payment card added successfully!', 'success');
      onSuccess();
      onClose();
      setShowConfirm(false);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setErrorMessage(detail);
      } else {
        setErrorMessage('Failed to save payment card');
      }
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
        <div className="glass-card-lighter-zenta border border-[#CBA378]/40 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-white my-auto bg-gradient-to-b from-[#2A2D3E]/95 via-[#222533]/98 to-[#1A1D27]/98">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#171E25] text-[#B8B8AC] hover:text-white transition border border-[#CBA378]/20">
            <X className="w-4 h-4"/>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] font-black shadow-lg shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Add Payment Card</h3>
              <p className="text-[10px] text-[#B8B8AC]">Masked card tracking reference</p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-3 p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleValidation} className="space-y-3">
            <div>
              <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Card Nickname *</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Personal Visa, Sapphire Amex" 
                value={nickname} 
                onChange={(e) => setNickname(e.target.value)} 
                className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]" 
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Cardholder Name</label>
                <input 
                  type="text" 
                  placeholder="Alex Morgan" 
                  value={cardholderName} 
                  onChange={(e) => setCardholderName(e.target.value)} 
                  className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]" 
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Bank</label>
                <input 
                  type="text" 
                  placeholder="e.g. Chase, City Bank" 
                  value={bank} 
                  onChange={(e) => setBank(e.target.value)} 
                  className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Card Type</label>
                <select 
                  value={cardBrand} 
                  onChange={(e) => setCardBrand(e.target.value)} 
                  className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="American Express">American Express</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Last Four Digits *</label>
                <input 
                  type="text" 
                  required 
                  maxLength={4}
                  placeholder="4821" 
                  value={lastFour} 
                  onChange={(e) => setLastFour(e.target.value.replace(/\D/g, '').slice(0, 4))} 
                  className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#FECB6E]" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Expiry Date (MM/YY) *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="08/28" 
                  value={expiry} 
                  onChange={(e) => setExpiry(e.target.value)} 
                  className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#FECB6E]" 
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Currency</label>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)} 
                  className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                >
                  <option value="USD">USD ($)</option>
                  <option value="BDT">BDT (৳)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isDefault} 
                  onChange={(e) => setIsDefault(e.target.checked)} 
                  className="rounded border-[#CBA378] text-[#FECB6E] focus:ring-0" 
                />
                <span>Set as default payment method</span>
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full mt-3 py-2.5 rounded-xl btn-modern-left-3d text-xs font-bold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Payment Card
            </button>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Payment Method"
        message="Are you sure you want to add this payment method to your wallet?"
        onConfirm={handleExecuteAdd}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};