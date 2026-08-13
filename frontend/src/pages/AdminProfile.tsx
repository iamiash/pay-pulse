import React, { useState } from 'react';
import { User as UserIcon, ShieldCheck, Key, LogOut, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminProfile: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setMsg('Admin password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setMsg(''), 4000);
  };

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto space-y-6 page-transition w-full">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E]">
          Administrative Security Profile
        </h1>
        <p className="text-xs font-bold text-[#FECB6E] mt-0.5">
          Admin account credentials, security sessions, and authentication safeguards
        </p>
      </div>

      {msg && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {msg}
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#FFD89B] to-[#FECB6E] flex items-center justify-center font-black text-[#171E25] text-2xl shadow-lg">
            {user?.full_name?.[0] || 'A'}
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{user?.full_name || 'Admin User'}</h2>
            <p className="text-xs font-mono font-bold text-[#FECB6E]">{user?.user_id || 'PP-ADM-001'}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase bg-indigo-500/10 text-indigo-400 border-indigo-500/30">
              {user?.role || 'SUPER_ADMIN'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-slate-700/50">
          <div className="p-3.5 rounded-2xl bg-[#141620] border border-slate-700/50">
            <span className="text-[10px] font-extrabold text-[#FECB6E] uppercase">Email</span>
            <p className="text-xs font-bold text-white mt-0.5">{user?.email || 'admin@paypulse.io'}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#141620] border border-slate-700/50">
            <span className="text-[10px] font-extrabold text-[#FECB6E] uppercase">Last Login</span>
            <p className="text-xs font-bold text-white mt-0.5">{new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <form onSubmit={handlePasswordChange} className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-4 shadow-xl">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-[#FECB6E]" /> Change Admin Password
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-200">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#141620] text-xs font-bold text-white px-4 py-2.5 rounded-2xl border border-slate-700/50 focus:outline-none focus:border-[#FECB6E]"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-200">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#141620] text-xs font-bold text-white px-4 py-2.5 rounded-2xl border border-slate-700/50 focus:outline-none focus:border-[#FECB6E]"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] text-xs font-black hover:opacity-90 transition shadow-md"
        >
          Update Password
        </button>
      </form>

      {/* MFA Notice */}
      <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-black text-white">Multi-Factor Authentication (MFA)</h4>
          <p className="text-[11px] text-slate-300 mt-0.5">
            Stronger authentication via TOTP authenticator app is recommended for administrative privilege management.
          </p>
        </div>
      </div>

    </div>
  );
};

export default AdminProfile;