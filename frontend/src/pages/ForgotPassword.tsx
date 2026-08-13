import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useToast } from '../context/ToastContext';

export const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await authApi.forgotPassword({ email: email.trim().toLowerCase() });
      showToast('Check your email for password reset instructions.', 'info');
      setStep(2);
    } catch (err: any) {
      showToast('Check your email for password reset instructions.', 'info');
      setStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await authApi.resetPassword({
        email: email.trim().toLowerCase(),
        reset_token: resetToken.trim(),
        new_password: newPassword,
      });
      showToast('Password reset successful! Please login.', 'success');
      navigate('/login');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to reset password';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 auth-bg-wrapper ${isFocused ? 'is-focused' : ''}`}>
      <div className="glass-card-lighter-zenta p-5 sm:p-6 rounded-2xl w-full max-w-[340px] space-y-4 relative overflow-hidden">
        
        <div className="text-center space-y-1">
          <Link to="/">
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD89B] via-[#FECB6E] to-[#19547B]">
              PAYPULSE
            </h1>
          </Link>
          <p className="text-[10px] text-[#FFD89B]">Account Password Reset</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleForgot} className="space-y-3">
            <p className="text-[11px] text-[#B8B8AC] text-center">
              Step 1: Enter your registered email to receive reset instructions.
            </p>

            <div className="floating-input-group">
              <input
                type="email"
                required
                placeholder=" "
                value={email}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setEmail(e.target.value)}
                className="floating-input-sm glow-amber"
              />
              <label className="floating-label-sm">Registered Email</label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 rounded-lg btn-3d-jupiter-sm text-xs font-bold uppercase transition-all btn-outline-amber disabled:opacity-50"
            >
              {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-3">
            <p className="text-[11px] text-emerald-400 text-center font-semibold">
              Step 2: Check your email for the token and set a new password.
            </p>

            <div className="floating-input-group">
              <input
                type="text"
                required
                placeholder=" "
                value={resetToken}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setResetToken(e.target.value)}
                className="floating-input-sm glow-cyan text-center font-mono tracking-wider"
              />
              <label className="floating-label-sm">Reset Token</label>
            </div>

            <div className="floating-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder=" "
                value={newPassword}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setNewPassword(e.target.value)}
                className="floating-input-sm glow-rose"
              />
              <label className="floating-label-sm">New Password</label>
            </div>

            <div className="floating-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder=" "
                value={confirmPassword}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="floating-input-sm glow-rose"
              />
              <label className="floating-label-sm">Confirm Password</label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 rounded-lg btn-3d-jupiter-sm text-xs font-bold uppercase transition-all btn-outline-cyan disabled:opacity-50"
            >
              {isSubmitting ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="pt-1 text-center">
          <Link to="/login" className="text-[10px] text-[#B8B8AC] hover:text-[#FECB6E] transition">
            ← Remember your password? Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};