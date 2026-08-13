import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const newEmail = searchParams.get('new_email');

  const [status, setStatus] = useState<'loading' | 'success' | 'expired' | 'invalid'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      setMessage('Invalid verification link.');
      return;
    }

    authApi
      .verifyEmail(token, newEmail || undefined)
      .then((res) => {
        setStatus('success');
        setMessage(res.data.message || 'Your PayPulse account is now verified.');
      })
      .catch((err) => {
        const detail = err.response?.data?.detail || '';
        if (detail.includes('expired')) {
          setStatus('expired');
          setMessage('Verification link expired.');
        } else {
          setStatus('invalid');
          setMessage('Invalid verification link.');
        }
      });
  }, [token, newEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 auth-bg-wrapper">
      <div className="glass-card-lighter-zenta p-6 rounded-2xl w-full max-w-[360px] text-center space-y-4 relative overflow-hidden">
        
        <div>
          <Link to="/">
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD89B] via-[#FECB6E] to-[#19547B]">
              PAYPULSE
            </h1>
          </Link>
          <p className="text-[10px] text-[#FFD89B]">Email Verification Portal</p>
        </div>

        <div className="py-4 space-y-3">
          {status === 'loading' && (
            <div className="space-y-3">
              <div className="w-10 h-10 border-2 border-[#FECB6E] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-white/80">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                ✓
              </div>
              <h2 className="text-base font-bold text-white">✓ Email Verified</h2>
              <p className="text-xs text-[#B8B8AC]">{message}</p>
            </div>
          )}

          {status === 'expired' && (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
                ⚠
              </div>
              <h2 className="text-base font-bold text-amber-300">Verification Expired</h2>
              <p className="text-xs text-[#B8B8AC]">{message}</p>
            </div>
          )}

          {status === 'invalid' && (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
                ✕
              </div>
              <h2 className="text-base font-bold text-rose-300">Invalid Link</h2>
              <p className="text-xs text-[#B8B8AC]">{message}</p>
            </div>
          )}
        </div>

        <div className="pt-2">
          {status === 'expired' ? (
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 rounded-lg btn-3d-jupiter-sm text-xs font-bold uppercase btn-outline-amber"
            >
              Send New Verification Email
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 rounded-lg btn-3d-jupiter-sm text-xs font-bold uppercase btn-outline-cyan"
            >
              Continue to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};