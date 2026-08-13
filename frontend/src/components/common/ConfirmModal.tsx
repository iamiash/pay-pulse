import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<Props> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 backdrop-blur-md p-4 overflow-hidden">
      <div className="glass-card-3d p-6 rounded-2xl max-w-md w-full shadow-[0_25px_50px_rgba(0,0,0,0.85)] text-white space-y-4 relative my-auto border border-[#FECB6E]/40 bg-gradient-to-b from-[#2A2D3E]/95 to-[#1A1D27]/98 backdrop-blur-2xl">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#1A1C25] text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-[#FECB6E]">{title}</h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{message}</p>

        <div className="flex justify-end gap-3 pt-2 border-t border-[#FECB6E]/20">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-[#1A1C25] text-slate-300 font-bold text-xs rounded-xl border border-white/20 hover:bg-[#2A2D3E] transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-black text-xs rounded-xl shadow-lg hover:scale-105 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};