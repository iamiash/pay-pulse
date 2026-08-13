import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot User ID Inline Modal State
  const [showForgotUserIdModal, setShowForgotUserIdModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const cleanUserId = userId.trim();
      const res = await authApi.login({ user_id: cleanUserId, password });

      login(res.data.access_token, res.data.user);
      showToast('Logged in successfully!', 'success');

      if (res.data.user.role === 'ADMIN' || res.data.user.role === 'SUPER_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      let errorMsg = 'Invalid credentials';
      if (typeof detail === 'string') {
        errorMsg = detail;
      } else if (Array.isArray(detail) && detail.length > 0) {
        errorMsg = detail.map((d: any) => d.msg || d).join(', ');
      }
      showToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecoverUserId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecovering) return;

    try {
      setIsRecovering(true);
      await authApi.resendUserId(recoveryEmail.trim().toLowerCase());
      showToast('If an account exists, your User ID has been emailed to you.', 'info');
      setShowForgotUserIdModal(false);
      setRecoveryEmail('');
    } catch (err: any) {
      showToast('If an account exists, your User ID has been emailed to you.', 'info');
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 auth-bg-wrapper ${isFocused ? 'is-focused' : ''}`}>
      <div className="glass-card-lighter-zenta p-5 sm:p-6 rounded-2xl w-full max-w-[340px] space-y-4 relative overflow-hidden">
        
        <div className="text-center space-y-1">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD89B] via-[#FECB6E] to-[#19547B]">
              PAYPULSE
            </h1>
          </Link>
          <p className="text-[10px] text-[#FFD89B]">Smart Subscription Tracker & Management Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* User ID or Email Field */}
          <div className="floating-input-group">
            <input
              type="text"
              required
              placeholder=" "
              value={userId}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setUserId(e.target.value)}
              className="floating-input-sm glow-amber font-mono tracking-wider"
            />
            <label className="floating-label-sm">UserID or Email</label>
          </div>

          {/* Password Field */}
          <div className="floating-input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder=" "
              value={password}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setPassword(e.target.value)}
              className="floating-input-sm glow-cyan"
            />
            <label className="floating-label-sm">Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="field-icon-right text-slate-400 hover:text-[#FECB6E]"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Remember Device Option */}
          <div className="flex items-center justify-between text-[10px] text-[#B8B8AC]">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="rounded border-[#CBA378] text-[#FECB6E] focus:ring-0"
              />
              <span>Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 rounded-lg btn-3d-jupiter-sm text-xs font-bold uppercase transition-all btn-outline-cyan disabled:opacity-50 mt-1"
          >
            {isSubmitting ? 'Signing In...' : 'Login'}
          </button>
        </form>

        {/* Forgot Actions */}
        <div className="flex items-center justify-between gap-2 pt-0.5 text-[10px]">
          <button
            type="button"
            onClick={() => setShowForgotUserIdModal(true)}
            className="btn-3d-row-item py-1.5 px-2 rounded-lg text-center flex-1 btn-outline-amber"
          >
            Forgot User ID?
          </button>

          <Link
            to="/forgot-password"
            className="btn-3d-row-item py-1.5 px-2 rounded-lg text-center flex-1 btn-outline-amber"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="pt-1 text-center">
          <Link to="/register" className="text-[10px] text-[#FECB6E] hover:underline">
            New to PayPulse? Register here
          </Link>
        </div>
      </div>

      {/* Forgot User ID Modal */}
      {showForgotUserIdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card-lighter-zenta p-5 rounded-2xl w-full max-w-[320px] space-y-3 border border-[#FECB6E]/30">
            <h3 className="text-sm font-bold text-[#FECB6E] text-center">Recover Your User ID</h3>
            <p className="text-[10px] text-[#B8B8AC] text-center">
              Enter your registered email address. We will dispatch your User ID if found.
            </p>

            <form onSubmit={handleRecoverUserId} className="space-y-2.5">
              <input
                type="email"
                required
                placeholder="Registered Email Address"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="w-full h-9 bg-[#141620] border border-[#FECB6E]/30 rounded-lg px-3 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotUserIdModal(false)}
                  className="flex-1 py-1.5 rounded-lg text-xs bg-[#2A2D3E] hover:bg-[#32364a] text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRecovering}
                  className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-[#FECB6E] text-black hover:bg-[#E0A32E]"
                >
                  {isRecovering ? 'Sending...' : 'Send User ID'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};