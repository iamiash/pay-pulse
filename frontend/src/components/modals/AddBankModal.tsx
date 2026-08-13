import React, { useState } from 'react';
import { walletApi } from '../../api/walletApi';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../common/ConfirmModal';
import { X, Landmark, CheckCircle2, AlertCircle } from 'lucide-react';

export const AddBankModal: React.FC<{ isOpen: boolean; onClose: () => void; onSuccess: () => void }> = ({
  isOpen, onClose, onSuccess
}) => {
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [branchName, setBranchName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleValidation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!bankName || !accountNumber || !branchName || !routingNumber) {
      setErrorMessage('All bank details are required.');
      return;
    }
    setShowConfirm(true);
  };

  const handleExecuteAdd = async () => {
    try {
      await walletApi.addBank({ 
        bank_name: bankName, 
        account_number: accountNumber, 
        branch_name: branchName, 
        routing_number: routingNumber 
      });
      showToast('Bank account registered successfully!', 'success');
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
        setErrorMessage('Failed to save bank account');
      }
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
        <div className="glass-card-lighter-zenta border border-indigo-500/40 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative text-white my-auto bg-gradient-to-b from-[#2A2D3E]/95 via-[#222533]/98 to-[#1A1D27]/98">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#171E25] text-[#B8B8AC] hover:text-white transition border border-[#CBA378]/20"
          >
            <X className="w-4 h-4"/>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Add Bank Account</h3>
              <p className="text-[10px] text-[#B8B8AC]">Register bank profile to wallet</p>
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
              <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Bank Name *</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. City Bank / HSBC" 
                value={bankName} 
                onChange={(e) => setBankName(e.target.value)} 
                className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]" 
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Account Name</label>
              <input 
                type="text" 
                placeholder="Account Holder Name" 
                value={accountName} 
                onChange={(e) => setAccountName(e.target.value)} 
                className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]" 
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Account Number *</label>
              <input 
                type="text" 
                required 
                placeholder="110293849201" 
                value={accountNumber} 
                onChange={(e) => setAccountNumber(e.target.value)} 
                className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]" 
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Branch Name *</label>
              <input 
                type="text" 
                required 
                placeholder="Gulshan Branch" 
                value={branchName} 
                onChange={(e) => setBranchName(e.target.value)} 
                className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]" 
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Routing Number *</label>
              <input 
                type="text" 
                required 
                placeholder="09027182" 
                value={routingNumber} 
                onChange={(e) => setRoutingNumber(e.target.value)} 
                className="w-full mt-1 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FECB6E]" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full mt-2 py-2.5 rounded-xl btn-modern-left-3d text-xs font-bold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Bank Account
            </button>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm New Bank Account"
        message="Are you sure you want to register this bank profile to your payment wallet?"
        onConfirm={handleExecuteAdd}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};