import React, { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Save, CheckCircle } from 'lucide-react';
import { adminApi } from '../api/adminApi';

export const AdminSystemSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'security' | 'sessions' | 'notifications'>('system');
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    allow_user_registration: true,
    require_email_verification: true,
    maintenance_mode: false,
    max_failed_login_attempts: 5,
    session_timeout_minutes: 60,
  });

  useEffect(() => {
    adminApi
      .getSettings()
      .then((res) => {
        if (res.data) setSettings((prev) => ({ ...prev, ...res.data }));
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async () => {
    try {
      await adminApi.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-6 px-4 max-w-5xl mx-auto space-y-6 page-transition w-full">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E]">
            Platform System Settings
          </h1>
          <p className="text-xs font-bold text-[#FECB6E] mt-0.5">
            Global access policies, session constraints, and maintenance toggles
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] text-xs font-black flex items-center gap-2 hover:opacity-90 transition shadow-lg"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      {saved && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> System settings persisted successfully.
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-[#141620] p-1.5 rounded-2xl border border-[#CBA378]/20 overflow-x-auto">
        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'system' ? 'bg-[#2A2D3E] text-[#FECB6E]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" /> System Policy
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'security' ? 'bg-[#2A2D3E] text-[#FECB6E]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" /> Access Controls
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'notifications' ? 'bg-[#2A2D3E] text-[#FECB6E]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" /> Notifications
        </button>
      </div>

      {/* Tab Panels */}
      <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-6 shadow-xl">
        {activeTab === 'system' && (
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white border-b border-slate-700/50 pb-2">Registration & Environment</h3>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141620] border border-slate-700/50">
              <div>
                <p className="text-xs font-extrabold text-white">Allow Public User Registration</p>
                <p className="text-[11px] text-slate-400">Controls public access to sign-up endpoints</p>
              </div>
              <input
                type="checkbox"
                checked={settings.allow_user_registration}
                onChange={(e) => setSettings({ ...settings, allow_user_registration: e.target.checked })}
                className="w-4 h-4 accent-[#FECB6E] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141620] border border-slate-700/50">
              <div>
                <p className="text-xs font-extrabold text-white">Require Email Verification</p>
                <p className="text-[11px] text-slate-400">Mandates verified email token before unlocking platform features</p>
              </div>
              <input
                type="checkbox"
                checked={settings.require_email_verification}
                onChange={(e) => setSettings({ ...settings, require_email_verification: e.target.checked })}
                className="w-4 h-4 accent-[#FECB6E] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141620] border border-slate-700/50">
              <div>
                <p className="text-xs font-extrabold text-white text-amber-400">Maintenance Mode</p>
                <p className="text-[11px] text-slate-400">Restricts non-admin user access across all endpoints</p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenance_mode}
                onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white border-b border-slate-700/50 pb-2">Login Limits & Sessions</h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-200">Max Failed Login Attempts</label>
              <input
                type="number"
                value={settings.max_failed_login_attempts}
                onChange={(e) => setSettings({ ...settings, max_failed_login_attempts: parseInt(e.target.value) || 5 })}
                className="w-full bg-[#141620] text-xs font-bold text-white px-4 py-2.5 rounded-2xl border border-slate-700/50 focus:outline-none focus:border-[#FECB6E]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-200">Session Timeout (Minutes)</label>
              <input
                type="number"
                value={settings.session_timeout_minutes}
                onChange={(e) => setSettings({ ...settings, session_timeout_minutes: parseInt(e.target.value) || 60 })}
                className="w-full bg-[#141620] text-xs font-bold text-white px-4 py-2.5 rounded-2xl border border-slate-700/50 focus:outline-none focus:border-[#FECB6E]"
              />
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <p className="text-xs text-slate-300">System broadcast notifications active.</p>
        )}
      </div>

    </div>
  );
};

export default AdminSystemSettingsPage;