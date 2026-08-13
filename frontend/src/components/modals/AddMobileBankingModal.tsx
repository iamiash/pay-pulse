import React, { useState } from 'react';
import { walletApi } from '../../api/walletApi';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../common/ConfirmModal';
import { X, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';

export const AddMobileBankingModal: React.FC<{ isOpen: boolean; onClose: () => void; onSuccess: () => void }> = ({
  isOpen, onClose, onSuccess
}) => {
  const [provider, setProvider] = useState('bkash');
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleValidation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!mobileNumber) {
      setErrorMessage('Mobile Number is required.');
      return;
    }
    setShowConfirm(true);
  };

  const handleExecuteAdd = async () => {
    try {
      await walletApi.addMobile({ provider, mobile_number: mobileNumber });
      showToast('Mobile banking account saved!', 'success');
      onSuccess();
      onClose();
      setShowConfirm(false);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setErrorMessage(detail);
      } else if (Array.isArray(detail)) {
        setErrorMessage(detail.map((d: any) => d.msg || JSON.stringify(d)).join(' | '));
      } else {
        setErrorMessage('Failed to save account');
      }
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
        <div className="glass-card-lighter-zenta border border-[#FECB6E]/40 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative text-white my-auto bg-gradient-to-b from-[#2A2D3E]/95 via-[#222533]/98 to-[#1A1D27]/98">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#171E25] text-[#B8B8AC] hover:text-white transition border border-[#CBA378]/20"
          >
            <X className="w-4 h-4"/>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Add Mobile Banking</h3>
              <p className="text-[10px] text-[#B8B8AC]">bKash, Nagad, or Rocket channel</p>
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
              <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Provider</label>
              <select 
                value={provider} 
                onChange={(e) => setProvider(e.target.value)} 
                className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#FECB6E]"
              >
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="rocket">Rocket</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Mobile Account Number *</label>
              <input 
                type="text" 
                required 
                placeholder="+8801700000000" 
                value={mobileNumber} 
                onChange={(e) => setMobileNumber(e.target.value)} 
                className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full mt-2 py-2.5 rounded-xl btn-modern-left-3d text-xs font-bold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Mobile Account
            </button>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Mobile Account"
        message="Are you sure you want to add this mobile banking account?"
        onConfirm={handleExecuteAdd}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};