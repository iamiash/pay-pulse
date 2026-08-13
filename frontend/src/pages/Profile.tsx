import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import { useToast } from '../context/ToastContext';
import { 
  User, Mail, Phone, Calendar, Globe, DollarSign, 
  Edit3, KeyRound, Camera, Trash2, CheckCircle2, ShieldCheck, X 
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [contactNo, setContactNo] = useState(user?.contact_no || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [country, setCountry] = useState((user as any)?.country || 'United States');
  const [currency, setCurrency] = useState((user as any)?.currency || 'USD');

  // Change password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await userApi.updateProfile({
        full_name: fullName,
        email,
        contact_no: contactNo,
        dob,
        country,
        currency
      } as any);
      updateUser(res.data);
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to update profile', 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userApi.changePassword({ current_password: currentPassword, new_password: newPassword });
      showToast('Password changed successfully!', 'success');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to change password', 'error');
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
        showToast('Failed to upload avatar', 'error');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-[#EFE6D6] page-transition pb-12">
      
      {/* Centered Headline */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E] tracking-tight drop-shadow-md">
          User Profile & Security
        </h2>
        <p className="text-xs font-bold text-[#FECB6E]">Manage personal details, currency preferences, and authentication credentials</p>
      </div>

      {/* Main Profile Card */}
      <div className="glass-card-lighter-zenta p-8 rounded-3xl border border-[#CBA378]/40 space-y-6 bg-gradient-to-br from-[#2A2D3E] via-[#222533] to-[#1A1D27] shadow-2xl">
        
        {/* Header Avatar & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-[#CBA378]/20 pb-6">
          <div className="flex items-center gap-5">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-[#FECB6E] shadow-lg" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD89B] to-[#FECB6E] text-[#1A1D27] flex items-center justify-center font-black text-2xl shadow-lg">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h3 className="text-2xl font-black text-white">{user?.full_name || 'User Profile'}</h3>
              <p className="text-xs font-semibold text-[#FECB6E]">{user?.email || 'user@paypulse.com'}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full mt-1.5">
                <ShieldCheck className="w-3 h-3" /> Verified Account
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-[#171E25] border border-[#CBA378]/40 text-xs font-black text-[#FECB6E] hover:bg-[#222834] transition flex items-center gap-1.5 shadow"
            >
              <Edit3 className="w-4 h-4" /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 rounded-xl bg-[#171E25] border border-rose-500/40 text-xs font-black text-rose-300 hover:bg-rose-950/40 transition flex items-center gap-1.5 shadow"
            >
              <KeyRound className="w-4 h-4" /> Change Password
            </button>
          </div>
        </div>

        {/* Profile Information Display / Edit Form */}
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-[#171E25] border border-[#CBA378]/20 space-y-1">
              <p className="text-[10px] uppercase font-bold text-[#B8B8AC] flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#FECB6E]" /> Full Name</p>
              <p className="text-sm font-black text-white">{user?.full_name || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#171E25] border border-[#CBA378]/20 space-y-1">
              <p className="text-[10px] uppercase font-bold text-[#B8B8AC] flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#FECB6E]" /> Email Address</p>
              <p className="text-sm font-black text-white">{user?.email || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#171E25] border border-[#CBA378]/20 space-y-1">
              <p className="text-[10px] uppercase font-bold text-[#B8B8AC] flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#FECB6E]" /> Contact Number</p>
              <p className="text-sm font-black text-white">{user?.contact_no || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#171E25] border border-[#CBA378]/20 space-y-1">
              <p className="text-[10px] uppercase font-bold text-[#B8B8AC] flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#FECB6E]" /> Date of Birth</p>
              <p className="text-sm font-black text-white">{user?.dob || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#171E25] border border-[#CBA378]/20 space-y-1">
              <p className="text-[10px] uppercase font-bold text-[#B8B8AC] flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-[#FECB6E]" /> Country / Region</p>
              <p className="text-sm font-black text-white">{(user as any)?.country || 'United States'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#171E25] border border-[#CBA378]/20 space-y-1">
              <p className="text-[10px] uppercase font-bold text-[#B8B8AC] flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-[#FECB6E]" /> Default Currency</p>
              <p className="text-sm font-black text-[#FECB6E]">{(user as any)?.currency || 'USD ($)'}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-[#B8B8AC] uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#171E25] border border-[#CBA378]/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#B8B8AC] uppercase block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#171E25] border border-[#CBA378]/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#B8B8AC] uppercase block mb-1">Contact Number</label>
                <input
                  type="text"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  className="w-full bg-[#171E25] border border-[#CBA378]/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#B8B8AC] uppercase block mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-[#171E25] border border-[#CBA378]/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#B8B8AC] uppercase block mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#171E25] border border-[#CBA378]/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#B8B8AC] uppercase block mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-[#171E25] border border-[#CBA378]/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                >
                  <option value="USD">USD ($)</option>
                  <option value="BDT">BDT (৳)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#CBA378]/20">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-[#171E25] text-[#B8B8AC] font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl btn-modern-left-3d font-black text-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="glass-card-lighter-zenta border border-[#CBA378]/40 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-white my-auto bg-gradient-to-b from-[#2A2D3E]/95 via-[#222533]/98 to-[#1A1D27]/98">
            <button onClick={() => setShowPasswordModal(false)} className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#171E25] text-[#B8B8AC] hover:text-white transition">
              <X className="w-4 h-4"/>
            </button>

            <div className="mb-4 border-b border-[#CBA378]/20 pb-3">
              <h3 className="text-lg font-black text-white">Change Account Password</h3>
              <p className="text-xs text-[#B8B8AC]">Ensure your account remains secure with a strong password</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase block mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 rounded-xl bg-[#171E25] text-[#B8B8AC] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl btn-modern-left-3d font-black text-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};