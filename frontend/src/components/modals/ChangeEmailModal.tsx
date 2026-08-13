import React, { useState } from 'react';
import { X, Lock, Mail } from 'lucide-react';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export interface ChangeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmNewEmail, setConfirmNewEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateUser } = useAuth();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newEmail.trim().toLowerCase() !== confirmNewEmail.trim().toLowerCase()) {
      showToast('New email addresses do not match.', 'error');
      return;
    }

    if (!currentPassword) {
      showToast('Current password is required.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await userApi.changeEmail({
        current_password: currentPassword,
        new_email: newEmail.trim().toLowerCase(),
        confirm_new_email: confirmNewEmail.trim().toLowerCase(),
      });

      updateUser(res.data);
      showToast('Email updated! Please complete verification.', 'success');
      if (onSuccess) onSuccess();
      onClose();

      setCurrentPassword('');
      setNewEmail('');
      setConfirmNewEmail('');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to update email address', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card-lighter-zenta p-6 rounded-3xl w-full max-w-md border border-[#FECB6E]/40 space-y-5 relative shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#FECB6E]/20 pb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#FECB6E]" />
            <h3 className="text-base font-black text-white">Change Account Email</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-[#2A2D3E] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase block mb-1">
              Current Password (Required for Security)
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-3.5 h-3.5 text-[#FECB6E]" />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase block mb-1">
              New Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-3.5 h-3.5 text-[#FECB6E]" />
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new.email@domain.com"
                className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase block mb-1">
              Confirm New Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-3.5 h-3.5 text-[#FECB6E]" />
              <input
                type="email"
                required
                value={confirmNewEmail}
                onChange={(e) => setConfirmNewEmail(e.target.value)}
                placeholder="Confirm new email address"
                className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
              />
            </div>
          </div>

          <p className="text-[10px] text-[#B8B8AC] leading-relaxed">
            🔒 Changing your email address requires password confirmation. A new email verification message will be issued automatically.
          </p>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#141620] text-xs font-bold text-white hover:bg-[#222834] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] text-xs font-black hover:opacity-95 transition shadow-lg flex items-center justify-center gap-1"
            >
              {isSubmitting ? 'Updating...' : 'Update Email'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};