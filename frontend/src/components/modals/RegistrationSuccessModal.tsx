import React, { useState, useEffect } from 'react';

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  userId: string;
  emailSent: boolean;
  onClose: () => void;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  isOpen,
  userId,
  emailSent,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 280);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleConfirmClose}
      />

      <div
        className={`relative w-full max-w-[360px] glass-card-lighter-zenta p-6 rounded-2xl shadow-2xl border border-[#FECB6E]/40 z-10 text-center transform transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-95 translateY-2' : 'opacity-100 scale-100 translateY-0'
        }`}
      >
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#FECB6E]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="mx-auto w-12 h-12 rounded-full bg-[#FECB6E]/10 border border-[#FECB6E]/40 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-[#FECB6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-lg font-black text-[#FECB6E] tracking-tight">
          ✓ Account Created Successfully!
        </h2>
        <p className="text-[11px] text-[#B8B8AC] mt-1 leading-relaxed">
          Your permanent PayPulse User ID has been generated.
        </p>

        <div className="my-4 p-3.5 rounded-xl bg-[#141620]/90 border border-[#FECB6E]/30 relative">
          <p className="text-[9px] font-bold uppercase text-[#FECB6E]/80 tracking-wider">
            Your User ID
          </p>
          <div className="text-2xl font-mono font-black text-white tracking-widest mt-0.5 selection:bg-[#FECB6E] selection:text-black">
            {userId}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FECB6E]/15 hover:bg-[#FECB6E]/30 text-[#FECB6E] text-[11px] font-bold border border-[#FECB6E]/30 transition-all active:scale-95"
          >
            {copied ? (
              <span className="text-emerald-400 font-bold">✓ Copied to Clipboard!</span>
            ) : (
              <span>Copy User ID</span>
            )}
          </button>
        </div>

        <div className="text-[10px] p-2.5 rounded-lg bg-[#1D212F] border border-white/5 mb-4 text-left space-y-1">
          <div className="flex items-center gap-1.5 font-medium text-slate-300">
            {emailSent ? (
              <span className="text-emerald-400 font-bold">✓ Email Dispatched</span>
            ) : (
              <span className="text-amber-400 font-bold">⚠ Delivery Pending</span>
            )}
          </div>
          <p className="text-[9.5px] text-[#B8B8AC] leading-snug">
            {emailSent
              ? "We've also sent your User ID to your registered email address."
              : 'Could not send email automatically. Please copy and save your User ID manually.'}
          </p>
        </div>

        <p className="text-[9.5px] text-[#FECB6E]/70 mb-4 italic">
          This User ID is permanent and cannot be changed. Save it to log in.
        </p>

        <button
          type="button"
          onClick={handleConfirmClose}
          className="w-full py-2.5 rounded-xl btn-3d-jupiter-sm text-xs font-bold tracking-wider uppercase btn-outline-cyan transition-all active:scale-98"
        >
          OK — Continue to Login
        </button>
      </div>
    </div>
  );
};