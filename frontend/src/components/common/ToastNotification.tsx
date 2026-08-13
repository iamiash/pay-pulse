import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { ToastType } from '../../context/ToastContext';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}

export const ToastNotification: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  const isSuccess = type === 'success';
  const isError = type === 'error';

  const getBorderClass = () => {
    if (isSuccess) return 'toast-3d-success';
    if (isError) return 'toast-3d-error';
    return 'border-cyan-500/50 shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.3)]';
  };

  const getIconContainerClass = () => {
    if (isSuccess) return 'bg-emerald-500/20 text-emerald-400';
    if (isError) return 'bg-rose-500/20 text-rose-400';
    return 'bg-cyan-500/20 text-cyan-400';
  };

  const getTitle = () => {
    if (isSuccess) return 'Success';
    if (isError) return 'Error';
    return 'Information';
  };

  return (
    <div
      className={`toast-3d ${getBorderClass()} flex items-center gap-3 px-4 py-3 rounded-2xl w-80 text-white animate-in slide-in-from-top-5 duration-300 pointer-events-auto my-1`}
    >
      <div className={`p-1.5 rounded-xl shrink-0 ${getIconContainerClass()}`}>
        {isSuccess && <CheckCircle2 className="w-5 h-5" />}
        {isError && <AlertTriangle className="w-5 h-5" />}
        {!isSuccess && !isError && <Info className="w-5 h-5" />}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-xs font-bold truncate">{getTitle()}</p>
        <p className="text-[11px] text-slate-300 font-medium truncate">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="p-1 text-slate-400 hover:text-white rounded-lg transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};