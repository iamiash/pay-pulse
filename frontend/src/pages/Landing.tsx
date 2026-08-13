import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  BellRing, 
  BarChart3, 
  PiggyBank, 
  PlusCircle, 
  Wallet, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  X,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'about' | 'contact' | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C2927] via-[#2E4C63] to-[#171E25] text-[#EFE6D6] flex flex-col selection:bg-[#FECB6E] selection:text-[#171E25] font-sans">
      
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#171E25]/80 border-b border-[#CBA378]/20 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo Branding */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFD89B] via-[#FECB6E] to-[#19547B] flex items-center justify-center text-[#171E25] font-black text-lg shadow-lg shadow-[#FECB6E]/20 transition-transform duration-300 group-hover:scale-105">
              P
            </div>
            <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFD89B] via-[#FECB6E] to-[#EFE6D6]">
              PayPulse
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#B8B8AC]">
            <button onClick={() => scrollToSection('features')} className="hover:text-[#FECB6E] transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#FECB6E] transition-colors">
              How It Works
            </button>
            <button onClick={() => setActiveModal('about')} className="hover:text-[#FECB6E] transition-colors">
              About
            </button>
            <button onClick={() => setActiveModal('contact')} className="hover:text-[#FECB6E] transition-colors">
              Contact
            </button>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="px-3.5 py-1.5 rounded-lg border border-[#CBA378]/40 hover:border-[#FECB6E] text-xs font-bold text-[#EFE6D6] hover:text-[#FECB6E] transition-all duration-200"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-1.5 rounded-lg btn-3d-jupiter-sm text-xs font-bold uppercase tracking-wider transition-transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 max-w-5xl mx-auto text-center flex flex-col items-center justify-center">
        
        {/* Glow Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FECB6E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1817]/80 border border-[#FECB6E]/30 text-[11px] font-semibold text-[#FECB6E] mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-[#FECB6E]" />
          <span>Next-Generation Subscription Management Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD89B] via-[#EFE6D6] to-[#CBA378] leading-tight max-w-3xl mb-4">
          Take control of every subscription you pay for.
        </h1>

        <p className="text-sm sm:text-base text-[#B8B8AC] max-w-2xl font-normal leading-relaxed mb-8">
          Track subscriptions, monitor renewal dates, manage payment sources, analyze spending, and discover potential savings—all in one high-precision workspace.
        </p>

        {/* Hero CTA Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-3 rounded-xl btn-modern-left-3d text-sm font-black flex items-center justify-center gap-2 group shadow-xl"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button 
            onClick={() => scrollToSection('features')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1A1817]/80 border border-[#CBA378]/30 hover:border-[#FECB6E] text-xs font-bold text-[#EFE6D6] hover:text-[#FECB6E] transition-all"
          >
            Explore Features
          </button>
        </div>
      </section>

      {/* Feature Section (4 Blocks) */}
      <section id="features" className="py-16 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-1 mb-12">
          <p className="text-[10px] font-bold text-[#FECB6E] uppercase tracking-widest">Capabilities</p>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#EFE6D6] via-[#CBA378] to-[#C86D39]">
            Everything You Need To Master Subscriptions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Feature 1 */}
          <div className="glass-card-lighter-zenta p-5 rounded-2xl border-t-2 border-t-[#38BDF8] space-y-3 transition-transform hover:-translate-y-1 duration-200">
            <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Subscription Tracking</h3>
            <p className="text-xs text-[#B8B8AC] leading-relaxed">
              Consolidate all recurring SaaS, streaming, and utility bills into one organized multi-category table.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card-lighter-zenta p-5 rounded-2xl border-t-2 border-t-[#F59E0B] space-y-3 transition-transform hover:-translate-y-1 duration-200">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
              <BellRing className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Renewal Management</h3>
            <p className="text-xs text-[#B8B8AC] leading-relaxed">
              Get timely notification alerts before billing dates to avoid unexpected auto-renewal charges.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card-lighter-zenta p-5 rounded-2xl border-t-2 border-t-[#A78BFA] space-y-3 transition-transform hover:-translate-y-1 duration-200">
            <div className="w-10 h-10 rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/30 flex items-center justify-center text-[#A78BFA]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Spending Analytics</h3>
            <p className="text-xs text-[#B8B8AC] leading-relaxed">
              Gain clarity with monthly projections, category distributions, and multi-currency cost trends.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-card-lighter-zenta p-5 rounded-2xl border-t-2 border-t-[#10B981] space-y-3 transition-transform hover:-translate-y-1 duration-200">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <PiggyBank className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Smart Savings</h3>
            <p className="text-xs text-[#B8B8AC] leading-relaxed">
              Uncover duplicate services, idle subscriptions, and annual billing discount recommendations.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works Flow Chart Section */}
      <section id="how-it-works" className="py-16 px-4 max-w-5xl mx-auto w-full">
        <div className="text-center space-y-1 mb-12">
          <p className="text-[10px] font-bold text-[#FECB6E] uppercase tracking-widest">Simple Workflow</p>
          <h2 className="text-2xl sm:text-3xl font-black text-[#EFE6D6]">How PayPulse Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative">
          
          {/* Step 1 */}
          <div className="glass-card-lighter-zenta p-4 rounded-2xl text-center space-y-2 relative">
            <div className="w-8 h-8 rounded-full bg-[#FECB6E] text-[#171E25] font-black text-xs flex items-center justify-center mx-auto shadow-md">
              1
            </div>
            <PlusCircle className="w-6 h-6 text-[#38BDF8] mx-auto" />
            <h4 className="text-xs font-bold text-white">Add Subscriptions</h4>
            <p className="text-[11px] text-[#B8B8AC]">Enter subscription plans, costs, and cycle details.</p>
          </div>

          {/* Step 2 */}
          <div className="glass-card-lighter-zenta p-4 rounded-2xl text-center space-y-2 relative">
            <div className="w-8 h-8 rounded-full bg-[#FECB6E] text-[#171E25] font-black text-xs flex items-center justify-center mx-auto shadow-md">
              2
            </div>
            <Wallet className="w-6 h-6 text-[#F59E0B] mx-auto" />
            <h4 className="text-xs font-bold text-white">Connect Payment Sources</h4>
            <p className="text-[11px] text-[#B8B8AC]">Link cards, bank accounts, or mobile banking.</p>
          </div>

          {/* Step 3 */}
          <div className="glass-card-lighter-zenta p-4 rounded-2xl text-center space-y-2 relative">
            <div className="w-8 h-8 rounded-full bg-[#FECB6E] text-[#171E25] font-black text-xs flex items-center justify-center mx-auto shadow-md">
              3
            </div>
            <TrendingUp className="w-6 h-6 text-[#A78BFA] mx-auto" />
            <h4 className="text-xs font-bold text-white">Track Spending</h4>
            <p className="text-[11px] text-[#B8B8AC]">Monitor continuous outgoings and upcoming renewals.</p>
          </div>

          {/* Step 4 */}
          <div className="glass-card-lighter-zenta p-4 rounded-2xl text-center space-y-2 relative">
            <div className="w-8 h-8 rounded-full bg-[#FECB6E] text-[#171E25] font-black text-xs flex items-center justify-center mx-auto shadow-md">
              4
            </div>
            <PiggyBank className="w-6 h-6 text-[#10B981] mx-auto" />
            <h4 className="text-xs font-bold text-white">Discover Savings</h4>
            <p className="text-[11px] text-[#B8B8AC]">Apply smart insights to trim unnecessary costs.</p>
          </div>

        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-auto border-t border-[#CBA378]/20 bg-[#171E25]/90 py-10 px-4 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#FECB6E] text-[#171E25] font-black flex items-center justify-center text-xs">
                P
              </div>
              <span className="font-bold text-sm text-[#FFD89B]">PayPulse</span>
            </div>
            <p className="text-[11px] text-[#B8B8AC]">
              Smart Subscription Tracker and Financial Outgoing Management Platform.
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-[11px] font-bold text-[#FECB6E] uppercase tracking-wider">Navigation</p>
            <ul className="space-y-1 text-[#B8B8AC]">
              <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition">Features</button></li>
              <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition">How It Works</button></li>
              <li><button onClick={() => setActiveModal('about')} className="hover:text-white transition">About Us</button></li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <p className="text-[11px] font-bold text-[#FECB6E] uppercase tracking-wider">Legal & Compliance</p>
            <ul className="space-y-1 text-[#B8B8AC]">
              <li><button onClick={() => setActiveModal('privacy')} className="hover:text-white transition">Privacy Policy</button></li>
              <li><button onClick={() => setActiveModal('terms')} className="hover:text-white transition">Terms of Service</button></li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <p className="text-[11px] font-bold text-[#FECB6E] uppercase tracking-wider">Support</p>
            <ul className="space-y-1 text-[#B8B8AC]">
              <li><button onClick={() => setActiveModal('contact')} className="hover:text-white transition">Contact Us</button></li>
              <li><Link to="/login" className="hover:text-white transition">Account Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Create Account</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-[#CBA378]/10 text-center text-[11px] text-[#B8B8AC] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} PayPulse Inc. All rights reserved.</p>
          <div className="flex items-center gap-2 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Encrypted Data Storage</span>
          </div>
        </div>
      </footer>

      {/* Info Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card-lighter-zenta p-6 rounded-2xl w-full max-w-md relative space-y-3">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[#B8B8AC] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'about' && (
              <div className="space-y-2 text-left">
                <h3 className="text-base font-bold text-[#FFD89B]">About PayPulse</h3>
                <p className="text-xs text-[#B8B8AC] leading-relaxed">
                  PayPulse empowers individuals and organizations to regain control over recurring digital subscriptions. By consolidating billing cycles, tracking encrypted payment sources, and generating smart savings recommendations, PayPulse turns subscription clutter into structured financial clarity.
                </p>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div className="space-y-2 text-left">
                <h3 className="text-base font-bold text-[#FFD89B] flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#10B981]" /> Privacy Policy
                </h3>
                <p className="text-xs text-[#B8B8AC] leading-relaxed">
                  Your privacy is paramount. PayPulse encrypts sensitive payment account references using Fernet symmetric encryption and bcrypt password hashing. We do not sell or expose user financial data to third parties.
                </p>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="space-y-2 text-left">
                <h3 className="text-base font-bold text-[#FFD89B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" /> Terms of Service
                </h3>
                <p className="text-xs text-[#B8B8AC] leading-relaxed">
                  By using PayPulse, you agree to maintain accurate account details. All tracking tools and analytics outputs are provided for informational subscription management purposes.
                </p>
              </div>
            )}

            {activeModal === 'contact' && (
              <div className="space-y-2 text-left">
                <h3 className="text-base font-bold text-[#FFD89B]">Contact Support</h3>
                <p className="text-xs text-[#B8B8AC] leading-relaxed">
                  Have questions or suggestions? Reach out to our team at:
                </p>
                <div className="p-3 rounded-lg bg-[#171E25] border border-[#CBA378]/30 text-xs font-mono text-[#FECB6E]">
                  support@paypulse-app.com
                </div>
              </div>
            )}
            
            <button 
              onClick={() => setActiveModal(null)}
              className="w-full py-2 rounded-lg btn-modern-left-3d text-xs font-bold mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};