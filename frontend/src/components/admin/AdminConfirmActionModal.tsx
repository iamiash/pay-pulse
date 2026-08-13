import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';

export interface AdminConfirmActionModalProps {
  isOpen: boolean;
  action: string;
  userId: number;
  userDisplayId?: string;
  userName?: string;
  onClose: () => void;
  onConfirm: (userId: number, action: string, reason: string) => void;
}

export const AdminConfirmActionModal: React.FC<AdminConfirmActionModalProps> = ({
  isOpen,
  action,
  userId,
  userDisplayId,
  userName,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirmSubmit = () => {
    if (!reason.trim()) {
      setError('Administrative justification reason is mandatory.');
      return;
    }
    setError('');
    onConfirm(userId, action, reason);
    setReason('');
    onClose();
  };

  const getActionTitle = () => {
    const act = action.toUpperCase();
    if (act === 'SUSPEND') return 'Suspend Account Access';
    if (act === 'BAN') return 'Ban User Permanently';
    if (act === 'DELETE') return 'Delete User Profile';
    if (act === 'FORCE_LOGOUT') return 'Force Session Logout';
    return `Execute ${action}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#1A1D27] border border-[#FECB6E]/40 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#FECB6E]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">{getActionTitle()}</h3>
              <p className="text-[10px] font-bold text-[#FECB6E]">Requires Administrative Justification</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-[#2A2D3E] text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-3.5 rounded-2xl bg-[#141620] border border-slate-700/50 space-y-1">
          <span className="text-[10px] font-extrabold text-[#FECB6E] uppercase">Target User</span>
          <p className="text-sm font-bold text-white">{userName || 'User Account'}</p>
          <p className="text-xs font-mono font-extrabold text-cyan-400">{userDisplayId || `PP-USR-${userId}`}</p>
        </div>

        {/* Reason Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-slate-200 flex items-center justify-between">
            <span>Reason for Action <span className="text-rose-400">*</span></span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => { setReason(e.target.value); setError(''); }}
            placeholder="Type administrative justification for compliance audit..."
            rows={3}
            className="w-full bg-[#141620] text-xs font-semibold text-white p-3 rounded-2xl border border-[#CBA378]/30 focus:outline-none focus:border-[#FECB6E] transition"
          />
          {error && <p className="text-[11px] font-bold text-rose-400">{error}</p>}
        </div>

        {/* Warning Callout */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold text-amber-300">
            This action will immediately restrict or update account state and record an immutable event in system audit logs.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2A2D3E] text-slate-300 text-xs font-bold hover:bg-[#32364a] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSubmit}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-700 text-white text-xs font-bold shadow-lg hover:opacity-90 transition"
          >
            Confirm Execution
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminConfirmActionModal;