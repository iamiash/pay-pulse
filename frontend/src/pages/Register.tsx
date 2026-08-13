import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useToast } from '../context/ToastContext';
import { RegistrationSuccessModal } from '../components/modals/RegistrationSuccessModal';

export const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState('United States');
  const [preferredCurrency, setPreferredCurrency] = useState('USD');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [generatedUserId, setGeneratedUserId] = useState('');
  const [emailSentStatus, setEmailSentStatus] = useState(true);

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Password Strength Calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { label: '', color: '', score: 0 };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { label: 'Weak', color: 'bg-rose-500', score: 25 };
    if (score === 2) return { label: 'Medium', color: 'bg-amber-500', score: 50 };
    if (score === 3) return { label: 'Strong', color: 'bg-cyan-400', score: 75 };
    return { label: 'Very Strong', color: 'bg-emerald-400', score: 100 };
  }, [password]);

  // Validations
  const isEmailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const isPhoneValid = useMemo(() => {
    if (!contactNo.trim()) return true;
    return /^(\+?88)?01[3-9]\d{8}$|^(\+?\d{1,4}[-.\s]?)?\d{6,14}$/.test(contactNo.trim());
  }, [contactNo]);

  const isDobValid = useMemo(() => {
    if (!dob) return false;
    const selectedDate = new Date(dob);
    const today = new Date();
    if (selectedDate > today) return false;
    
    let age = today.getFullYear() - selectedDate.getFullYear();
    const m = today.getMonth() - selectedDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) age--;
    return age >= 10;
  }, [dob]);

  const isFormValid =
    fullName.trim().length >= 2 &&
    isEmailValid &&
    isPhoneValid &&
    isDobValid &&
    password.length >= 6 &&
    password === confirmPassword &&
    agreeTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!isFormValid) {
      if (!isEmailValid) showToast('Please enter a valid email address.', 'error');
      else if (!isDobValid) showToast('Please enter a valid Date of Birth.', 'error');
      else if (password !== confirmPassword) showToast('Passwords do not match.', 'error');
      else if (!agreeTerms) showToast('Please accept the Terms & Conditions.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await authApi.register({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        contact_no: contactNo.trim(),
        address: address.trim(),
        dob,
        country,
        preferred_currency: preferredCurrency,
      });

      setGeneratedUserId(res.data.user_id);
      setEmailSentStatus(res.data.email_sent);
      setModalOpen(true);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      let errorMsg = 'Registration failed';
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

  const handleModalClose = () => {
    setModalOpen(false);
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 auth-bg-wrapper ${isFocused ? 'is-focused' : ''}`}>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left Side Explanation */}
        <div className="hidden md:block md:col-span-5 space-y-5 text-white/90 p-4">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD89B] via-[#FECB6E] to-[#19547B]">
              PAYPULSE
            </h1>
          </Link>
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#FECB6E]">Smart Subscription Tracker & Management Platform</h2>
            <ul className="space-y-2.5 text-xs text-[#B8B8AC]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FECB6E]" />
                Track all subscriptions in one central vault.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Manage cards and payment sources securely.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Understand dynamic spending analytics.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Save smarter with automated alerts.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side Registration Form */}
        <div className="md:col-span-7 glass-card-lighter-zenta p-5 sm:p-6 rounded-2xl w-full space-y-3 relative overflow-hidden">
          <div className="text-center md:text-left space-y-0.5">
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD89B] via-[#FECB6E] to-[#19547B]">
              Create Account
            </h1>
            <p className="text-[10px] text-[#FFD89B]">Enter your details to generate your PayPulse User ID</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5">
            <p className="text-[9px] font-bold text-[#FECB6E] uppercase tracking-wider">1. Personal Information</p>

            {/* Full Name */}
            <div className="floating-input-group">
              <input
                type="text"
                required
                placeholder=" "
                value={fullName}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setFullName(e.target.value)}
                className="floating-input-sm glow-cyan"
              />
              <label className="floating-label-sm">Full Name *</label>
            </div>

            {/* Email Address */}
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
              <label className="floating-label-sm">Email Address *</label>
            </div>

            {/* Contact Number & Date of Birth Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="floating-input-group">
                <input
                  type="text"
                  required
                  placeholder=" "
                  value={contactNo}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setContactNo(e.target.value)}
                  className="floating-input-sm glow-violet"
                />
                <label className="floating-label-sm">Contact (+8801... / Int) *</label>
              </div>

              <div>
                <input
                  type="date"
                  required
                  value={dob}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full h-[36px] bg-[#141620] border-t border-l-2 border-r border-b border-t-[#FECB6E]/60 border-l-[#FECB6E] border-r-[#FECB6E]/25 border-b-[#FECB6E]/25 rounded-lg px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#FECB6E]"
                />
              </div>
            </div>

            {/* Country & Currency Row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-[36px] bg-[#141620] border border-[#CBA378]/30 rounded-lg px-2 text-xs text-white focus:outline-none focus:border-[#FECB6E] cursor-pointer"
                >
                  <option value="United States" className="bg-[#141620] text-white">United States</option>
                  <option value="Bangladesh" className="bg-[#141620] text-white">Bangladesh</option>
                  <option value="United Kingdom" className="bg-[#141620] text-white">United Kingdom</option>
                  <option value="Canada" className="bg-[#141620] text-white">Canada</option>
                  <option value="Australia" className="bg-[#141620] text-white">Australia</option>
                  <option value="Germany" className="bg-[#141620] text-white">Germany</option>
                  <option value="India" className="bg-[#141620] text-white">India</option>
                  <option value="Singapore" className="bg-[#141620] text-white">Singapore</option>
                  <option value="UAE" className="bg-[#141620] text-white">UAE</option>
                </select>
              </div>

              <div>
                <select
                  value={preferredCurrency}
                  onChange={(e) => setPreferredCurrency(e.target.value)}
                  className="w-full h-[36px] bg-[#141620] border border-[#CBA378]/30 rounded-lg px-2 text-xs text-white focus:outline-none focus:border-[#FECB6E] cursor-pointer"
                >
                  <option value="USD" className="bg-[#141620] text-white">USD ($)</option>
                  <option value="BDT" className="bg-[#141620] text-white">BDT (৳)</option>
                  <option value="EUR" className="bg-[#141620] text-white">EUR (€)</option>
                  <option value="GBP" className="bg-[#141620] text-white">GBP (£)</option>
                  <option value="CAD" className="bg-[#141620] text-white">CAD ($)</option>
                  <option value="AUD" className="bg-[#141620] text-white">AUD ($)</option>
                  <option value="INR" className="bg-[#141620] text-white">INR (₹)</option>
                  <option value="AED" className="bg-[#141620] text-white">AED (د.إ)</option>
                </select>
              </div>
            </div>

            <p className="text-[9px] font-bold text-[#FECB6E] uppercase tracking-wider pt-1">2. Account Credentials</p>

            {/* Password */}
            <div className="floating-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder=" "
                value={password}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setPassword(e.target.value)}
                className="floating-input-sm glow-rose"
              />
              <label className="floating-label-sm">Password *</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="field-icon-right text-slate-400 hover:text-[#FECB6E]"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-[#B8B8AC]">Password Strength:</span>
                  <span className="font-bold text-white">{passwordStrength.label}</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>
              </div>
            )}

            {/* Confirm Password */}
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
              <label className="floating-label-sm">Confirm Password *</label>
            </div>

            {/* Terms Agreement */}
            <div className="pt-1 text-[10px] text-[#B8B8AC]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-[#CBA378] text-[#FECB6E] focus:ring-0"
                />
                <span>
                  I agree to the <span className="text-[#FECB6E] underline">PayPulse Terms & Privacy Policy</span>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="w-full py-2.5 rounded-lg btn-3d-jupiter-sm text-xs font-bold uppercase transition-all btn-outline-cyan disabled:opacity-40 mt-2 cursor-pointer"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link to="/login" className="text-xs text-[#B8B8AC] hover:text-[#FECB6E] transition">
              Already registered? <span className="text-[#FECB6E] underline">Sign in from here</span>
            </Link>
          </div>
        </div>
      </div>

      <RegistrationSuccessModal
        isOpen={modalOpen}
        userId={generatedUserId}
        emailSent={emailSentStatus}
        onClose={handleModalClose}
      />
    </div>
  );
};