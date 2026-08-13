import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import { useToast } from '../context/ToastContext';
import { ChangeEmailModal } from '../components/modals/ChangeEmailModal';
import { 
  User, Bell, Shield, Database, Camera, Trash2, 
  Lock, AlertTriangle, ShieldAlert, CheckCircle2, KeyRound, Mail
} from 'lucide-react';

export const AccountSettings: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'email' | 'password' | 'notifications' | 'account'>('profile');

  // Change Email Modal Toggle
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);

  // Field edit unlock states for Profile tab
  const [enabledFields, setEnabledFields] = useState({
    fullName: false,
    contactNo: false,
    address: false,
  });

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [contactNo, setContactNo] = useState(user?.contact_no || '');

  // Notifications Category States
  const [notifCategories, setNotifCategories] = useState({
    renewal: true,
    payment: true,
    account: true,
    security: true,
    system: true,
  });

  // Change Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Modals & Confirmations
  const [showProfileSaveConfirm, setShowProfileSaveConfirm] = useState(false);
  const [showPasswordChangeConfirm, setShowPasswordChangeConfirm] = useState(false);

  // Delete Account Multi-Step Modal States
  const [deleteModalStep, setDeleteModalStep] = useState<0 | 1 | 2 | 3>(0);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [typeConfirmText, setTypeConfirmText] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const toggleField = (field: keyof typeof enabledFields) => {
    setEnabledFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowProfileSaveConfirm(true);
  };

  const executeProfileUpdate = async () => {
    try {
      const payload: any = {
        full_name: fullName.trim(),
        contact_no: contactNo.trim(),
      };
      const res = await userApi.updateProfile(payload);
      updateUser(res.data);
      showToast('Profile details updated successfully!', 'success');
      setEnabledFields({ fullName: false, contactNo: false, address: false });
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to update profile details', 'error');
    } finally {
      setShowProfileSaveConfirm(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    setShowPasswordChangeConfirm(true);
  };

  const executePasswordChange = async () => {
    try {
      await userApi.changePassword({ current_password: currentPassword, new_password: newPassword });
      showToast('Password updated successfully! Audit logged.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to update password', 'error');
    } finally {
      setShowPasswordChangeConfirm(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      try {
        const res = await userApi.uploadAvatar(formData);
        updateUser(res.data);
        showToast('Profile picture updated!', 'success');
      } catch (err) {
        showToast('Avatar media upload failed', 'error');
      }
    }
  };

  const handleAvatarDelete = async () => {
    try {
      const res = await userApi.deleteAvatar();
      updateUser(res.data);
      showToast('Profile picture removed', 'info');
    } catch (err) {
      showToast('Failed to remove profile picture', 'error');
    }
  };

  const handleVerifyCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifying) return;
    try {
      setIsVerifying(true);
      await userApi.verifyCredentials({ email: confirmEmail.trim().toLowerCase(), password: confirmPassword });
      setDeleteModalStep(2);
      showToast('Credentials verified.', 'info');
    } catch (err) {
      showToast('Check email and password', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTypedTextCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeConfirmText.trim() !== 'delete') {
      showToast("Type 'delete' correctly", 'error');
      return;
    }
    setDeleteModalStep(3);
  };

  const handleFinalDeleteAccount = async () => {
    try {
      await userApi.deleteAccount();
      showToast('Account deleted permanently.', 'success');
      logout();
      navigate('/login');
    } catch (err) {
      showToast('Deletion failed', 'error');
    }
  };

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto space-y-6 page-transition w-full">
      
      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E]">
          Account Settings
        </h2>
        <p className="text-xs font-bold text-[#FECB6E]">
          Configure account parameters, security credentials, and system notifications
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap justify-center bg-[#171E25] p-1.5 rounded-2xl border border-[#CBA378]/20 gap-1 shadow-lg">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'email', label: 'Email', icon: Mail },
          { id: 'password', label: 'Password', icon: KeyRound },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'account', label: 'Account', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] font-black shadow-md'
                  : 'text-[#B8B8AC] hover:text-white hover:bg-[#222834]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION: PROFILE */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Avatar Card */}
          <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 flex flex-col sm:flex-row items-center gap-5 shadow-xl">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-[#FECB6E] shadow-md" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD89B] to-[#FECB6E] text-[#171E25] flex items-center justify-center font-black text-2xl shadow-md">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <label className="px-4 py-2 rounded-xl bg-[#FECB6E] text-[#1A1D27] hover:bg-[#e0b25c] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-md">
                  <Camera className="w-4 h-4" /> Change Profile Picture
                  <input type="file" onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                </label>
                {user?.avatar_url && (
                  <button onClick={handleAvatarDelete} className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/50 text-xs font-bold flex items-center gap-1.5 transition">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                )}
              </div>
              <p className="text-[10px] text-[#B8B8AC]">JPG or PNG format. Max file size 5MB.</p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleProfileSubmit} className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-5 shadow-xl">
            <h3 className="text-sm font-black text-white border-b border-[#CBA378]/20 pb-2">User Profile Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* User ID (Immutable) */}
              <div className="md:col-span-2 bg-[#141620]/80 p-3.5 rounded-2xl border border-[#FECB6E]/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-[#FECB6E] uppercase block">User ID</span>
                  <p className="text-base font-mono font-black text-white tracking-widest mt-0.5">
                    {user?.user_id || 'PP-7K4M9X2Q'}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Cannot be changed
                </span>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Name</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    disabled={!enabledFields.fullName}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                  />
                  <input type="checkbox" checked={enabledFields.fullName} onChange={() => toggleField('fullName')} title="Unlock Name" className="cursor-pointer accent-[#FECB6E]" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Email</label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-[#141620]/60 border border-[#CBA378]/20 rounded-xl px-3 py-2 text-xs text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowChangeEmailModal(true)}
                    className="px-3 py-2 bg-[#FECB6E] text-[#171E25] rounded-xl text-xs font-bold shrink-0 hover:bg-[#e0b25c] transition"
                  >
                    Change Email
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Contact</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    disabled={!enabledFields.contactNo}
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                  />
                  <input type="checkbox" checked={enabledFields.contactNo} onChange={() => toggleField('contactNo')} title="Unlock Contact" className="cursor-pointer accent-[#FECB6E]" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Date of Birth</label>
                <input
                  type="text"
                  disabled
                  value={user?.dob || 'Not specified'}
                  className="w-full bg-[#141620]/60 border border-[#CBA378]/20 rounded-xl px-3 py-2 text-xs text-slate-400"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#1A1D27] text-xs font-black hover:opacity-95 transition shadow-lg">
                Save Profile Changes
              </button>
            </div>
          </form>

        </div>
      )}

      {/* SECTION: SECURITY */}
      {activeTab === 'security' && (
        <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-4 animate-in fade-in duration-200 shadow-xl text-xs">
          <h3 className="text-sm font-black text-white border-b border-[#CBA378]/20 pb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#FECB6E]" /> Security Overview & Active Sessions
          </h3>
          <div className="p-4 rounded-2xl bg-[#141620] border border-[#CBA378]/20 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-white text-xs">Two-Factor Authentication (2FA)</p>
                <p className="text-[10px] text-[#B8B8AC]">Add an extra layer of protection to your account with TOTP authenticator apps.</p>
              </div>
              <button onClick={() => showToast('2FA configured successfully', 'success')} className="px-3.5 py-1.5 rounded-xl bg-[#FECB6E] text-[#171E25] font-black hover:bg-[#e0b25c] transition">Enable 2FA</button>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#141620] border border-[#CBA378]/20 space-y-1">
            <p className="font-bold text-white text-xs">Active Session Log</p>
            <p className="text-[10px] text-emerald-400 font-bold">Current Browser Session — Verified Active (IP: 103.145.x.x)</p>
          </div>
        </div>
      )}

      {/* SECTION: EMAIL */}
      {activeTab === 'email' && (
        <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-4 animate-in fade-in duration-200 shadow-xl">
          <h3 className="text-sm font-black text-white border-b border-[#CBA378]/20 pb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#FECB6E]" /> Email Address Management
          </h3>

          <div className="p-4 rounded-2xl bg-[#141620] border border-[#CBA378]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-extrabold text-[#B8B8AC] uppercase">Primary Email Address</p>
              <p className="text-sm font-bold text-white mt-0.5">{user?.email}</p>
              <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Verified Account Address
              </p>
            </div>
            <button
              onClick={() => setShowChangeEmailModal(true)}
              className="px-5 py-2.5 rounded-xl bg-[#FECB6E] text-[#171E25] font-bold text-xs hover:bg-[#e0b25c] transition shadow-md shrink-0"
            >
              Change Email
            </button>
          </div>
        </div>
      )}

      {/* SECTION: PASSWORD */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-4 animate-in fade-in duration-200 shadow-xl">
          <h3 className="text-sm font-black text-white border-b border-[#CBA378]/20 pb-2 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#FECB6E]" /> Change Account Password
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Current Password</label>
              <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FECB6E]" />
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase block mb-1">New Password</label>
              <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FECB6E]" />
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Confirm New Password</label>
              <input type="password" required value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FECB6E]" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#1A1D27] text-xs font-black hover:opacity-95 transition shadow-lg">
              Update Password
            </button>
          </div>
        </form>
      )}

      {/* SECTION: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-4 animate-in fade-in duration-200 shadow-xl">
          <h3 className="text-sm font-black text-white border-b border-[#CBA378]/20 pb-2">Notification Category Controls</h3>

          <div className="space-y-3 text-xs">
            {[
              { key: 'renewal', label: 'Renewal Notifications', desc: 'Upcoming 3-day and 7-day subscription renewal alerts' },
              { key: 'payment', label: 'Payment Notifications', desc: 'Payment method updates and billing confirmations' },
              { key: 'account', label: 'Account Notifications', desc: 'Email changes, profile updates, and status alerts' },
              { key: 'security', label: 'Security Notifications', desc: 'Password changes, login alerts, and audit events' },
              { key: 'system', label: 'System Notifications', desc: 'Platform announcements and maintenance updates' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#141620] border border-[#CBA378]/20">
                <div>
                  <p className="font-bold text-white text-xs">{item.label}</p>
                  <p className="text-[10px] text-[#B8B8AC] mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={(notifCategories as any)[item.key]}
                  onChange={(e) => setNotifCategories({ ...notifCategories, [item.key]: e.target.checked })}
                  className="w-4 h-4 rounded border-[#CBA378] text-[#FECB6E] focus:ring-0 cursor-pointer accent-[#FECB6E]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: ACCOUNT */}
      {activeTab === 'account' && (
        <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-rose-500/40 space-y-5 animate-in fade-in duration-200 shadow-xl">
          <h3 className="text-sm font-black text-rose-400 border-b border-rose-500/20 pb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Account Actions & Data Controls
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#141620] border border-[#CBA378]/20 space-y-1">
              <p className="font-bold text-white">Account Status</p>
              <p className="text-[11px] text-emerald-400 font-bold">Active & Operational</p>
            </div>

            <div className="pt-4 border-t border-rose-500/30 space-y-2">
              <p className="text-xs font-bold text-rose-300">Danger Zone — Permanent Account Removal</p>
              <button
                onClick={() => {
                  setConfirmEmail('');
                  setConfirmPassword('');
                  setTypeConfirmText('');
                  setDeleteModalStep(1);
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-600 text-rose-200 font-bold text-xs transition shadow-md"
              >
                Delete Account & Purge Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Save Confirmation Modal */}
      {showProfileSaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card-lighter-zenta p-6 rounded-3xl w-full max-w-sm border border-[#FECB6E]/40 text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-[#FECB6E] mx-auto animate-bounce" />
            <h3 className="text-sm font-black text-white">Confirm Profile Updates</h3>
            <p className="text-xs text-[#B8B8AC]">Are you sure you want to save these changes to your account?</p>
            <div className="flex gap-2">
              <button onClick={() => setShowProfileSaveConfirm(false)} className="flex-1 py-2 rounded-xl bg-[#141620] text-xs font-bold text-white">Cancel</button>
              <button onClick={executeProfileUpdate} className="flex-1 py-2 rounded-xl bg-[#FECB6E] text-[#171E25] text-xs font-black">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Confirmation Modal */}
      {showPasswordChangeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card-lighter-zenta p-6 rounded-3xl w-full max-w-sm border border-[#FECB6E]/40 text-center space-y-4">
            <Shield className="w-10 h-10 text-[#FECB6E] mx-auto animate-pulse" />
            <h3 className="text-sm font-black text-white">Confirm Password Change</h3>
            <p className="text-xs text-[#B8B8AC]">Updating your password will generate an audit log entry (<span className="font-mono text-[#FECB6E]">PASSWORD_CHANGED</span>).</p>
            <div className="flex gap-2">
              <button onClick={() => setShowPasswordChangeConfirm(false)} className="flex-1 py-2 rounded-xl bg-[#141620] text-xs font-bold text-white">Cancel</button>
              <button onClick={executePasswordChange} className="flex-1 py-2 rounded-xl bg-[#FECB6E] text-[#171E25] text-xs font-black">Update Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Email Modal */}
      <ChangeEmailModal
        isOpen={showChangeEmailModal}
        onClose={() => setShowChangeEmailModal(false)}
        onSuccess={() => {
          showToast('Email update initiated. Check inbox for verification link.', 'success');
        }}
      />

      {/* Delete Account Multi-Step Modal */}
      {deleteModalStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card-lighter-zenta p-6 rounded-3xl w-full max-w-sm border border-rose-500/40 space-y-4 text-center relative">
            {deleteModalStep === 1 && (
              <form onSubmit={handleVerifyCredentials} className="space-y-3">
                <ShieldAlert className="w-8 h-8 text-rose-400 mx-auto" />
                <h3 className="text-sm font-black text-rose-300">Verify Account Credentials</h3>
                <input type="email" required placeholder="Enter current email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} className="w-full bg-[#141620] border border-rose-500/30 rounded-xl px-3 py-2 text-xs text-white" />
                <input type="password" required placeholder="Enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-[#141620] border border-rose-500/30 rounded-xl px-3 py-2 text-xs text-white" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setDeleteModalStep(0)} className="flex-1 py-2 rounded-xl bg-[#141620] text-xs font-bold text-white">Cancel</button>
                  <button type="submit" disabled={isVerifying} className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold">Verify</button>
                </div>
              </form>
            )}

            {deleteModalStep === 2 && (
              <form onSubmit={handleTypedTextCheck} className="space-y-3">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-xs text-white">Type “delete” to confirm permanent data removal.</p>
                <input type="text" required placeholder='Type "delete"' value={typeConfirmText} onChange={(e) => setTypeConfirmText(e.target.value)} className="w-full bg-[#141620] border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-center font-mono text-amber-300" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setDeleteModalStep(0)} className="flex-1 py-2 rounded-xl bg-[#141620] text-xs font-bold text-white">Cancel</button>
                  <button type="submit" className="flex-1 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold">Confirm</button>
                </div>
              </form>
            )}

            {deleteModalStep === 3 && (
              <div className="space-y-3">
                <CheckCircle2 className="w-9 h-9 text-rose-500 mx-auto animate-bounce" />
                <h3 className="text-base font-black text-white">Final Confirmation</h3>
                <p className="text-[10px] text-[#B8B8AC]">All database records will be erased instantly.</p>
                <div className="flex gap-2">
                  <button onClick={() => setDeleteModalStep(0)} className="flex-1 py-2 rounded-xl bg-[#141620] text-xs font-bold text-white">Keep Account</button>
                  <button onClick={handleFinalDeleteAccount} className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-black uppercase">Yes, Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};