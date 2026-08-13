import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, CreditCard, Wallet, FileText, BarChart3, 
  Menu, LogOut, Settings, RefreshCw, Layers, User as UserIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ConfirmModal } from './ConfirmModal';

interface SidebarProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onResetSelectedSub?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isExpanded: externalExpanded, onToggleExpand, onResetSelectedSub }) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isExpanded = externalExpanded !== undefined ? externalExpanded : internalExpanded;

  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  // Primary navigation options aligned with requirement
  const primaryNavItems = [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { title: 'Subscriptions', path: '/subscriptions', icon: CreditCard },
    { title: 'Wallet', path: '/wallet', icon: Wallet },
    { title: 'Analytics', path: '/analytics', icon: BarChart3 },
    { title: 'Reports', path: '/reports', icon: FileText },
    { title: 'Renewals', path: '/renewals', icon: RefreshCw },
    { title: 'Categories', path: '/categories', icon: Layers },
  ];

  // Lower section items
  const lowerNavItems = [
    { title: 'Settings', path: '/settings', icon: Settings },
    { title: 'Profile', path: '/profile', icon: UserIcon },
  ];

  const handleNavClick = () => {
    if (onResetSelectedSub) {
      onResetSelectedSub();
    }
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#2C2927] border-r border-[#CBA378]/30 flex flex-col justify-between transition-all duration-300 z-40 shadow-[6px_0_20px_rgba(0,0,0,0.65)] ${
          isExpanded ? 'w-48' : 'w-12'
        }`}
      >
        {/* Top Header & Toggle */}
        <div className="overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between px-2 border-b border-[#CBA378]/20 h-12 sticky top-0 bg-[#2C2927] z-10">
            {isExpanded && (
              <span className="font-black text-base tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#EFE6D6] via-[#CBA378] to-[#C86D39] drop-shadow-md pl-1">
                PayPulse
              </span>
            )}
            <button
              onClick={handleToggle}
              title="Toggle Menu"
              className="p-1.5 rounded-xl bg-[#1F1C1B] border border-[#CBA378]/30 text-[#CBA378] shadow-[0_2px_0_#121110] hover:shadow-[0_0_15px_rgba(203,163,120,0.6)] hover:scale-105 active:translate-y-[1px] transition-all mx-auto"
            >
              <Menu className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary Navigation Items */}
          <nav className="flex flex-col gap-1 p-1.5 mt-1">
            <p className={`text-[9px] font-bold text-[#CBA378]/70 uppercase tracking-wider px-2 my-1 ${!isExpanded ? 'hidden' : ''}`}>
              Menu
            </p>
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  title={!isExpanded ? item.title : undefined}
                  className={({ isActive }) =>
                    `flex items-center transition-all duration-200 text-xs font-semibold rounded-xl ${
                      isExpanded 
                        ? 'px-2.5 py-1.5 gap-2.5' 
                        : 'justify-center items-center w-9 h-9 mx-auto'
                    } ${
                      isActive
                        ? 'bg-gradient-to-b from-[#EFE6D6] via-[#CBA378] to-[#C86D39] text-[#2C2927] border border-white/60 shadow-[0_2px_0_#7A3B18,0_0_15px_rgba(203,163,120,0.6)] font-bold'
                        : 'text-[#B8B8AC] hover:bg-[#1F1C1B] hover:text-[#CBA378] hover:border hover:border-[#CBA378]/40'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {isExpanded && <span className="truncate tracking-wide text-[11px]">{item.title}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Lower Section Navigation & User Profile */}
        <div className="border-t border-[#CBA378]/20 bg-[#1F1C1B]">
          <div className="p-1.5 flex flex-col gap-1">
            {lowerNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  title={!isExpanded ? item.title : undefined}
                  className={({ isActive }) =>
                    `flex items-center transition-all duration-200 text-xs font-semibold rounded-xl ${
                      isExpanded 
                        ? 'px-2.5 py-1.5 gap-2.5' 
                        : 'justify-center items-center w-9 h-9 mx-auto'
                    } ${
                      isActive
                        ? 'bg-gradient-to-b from-[#EFE6D6] via-[#CBA378] to-[#C86D39] text-[#2C2927] border border-white/60 font-bold'
                        : 'text-[#B8B8AC] hover:bg-[#2C2927] hover:text-[#CBA378]'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {isExpanded && <span className="truncate tracking-wide text-[11px]">{item.title}</span>}
                </NavLink>
              );
            })}

            {/* Sign Out Action */}
            <button
              onClick={() => setShowSignoutConfirm(true)}
              title={!isExpanded ? 'Sign Out' : undefined}
              className={`flex items-center transition-all duration-200 text-xs font-semibold rounded-xl text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 ${
                isExpanded ? 'px-2.5 py-1.5 gap-2.5 w-full text-left' : 'justify-center items-center w-9 h-9 mx-auto'
              }`}
            >
              <LogOut className="w-3.5 h-3.5 shrink-0 text-rose-400" />
              {isExpanded && <span className="truncate tracking-wide text-[11px]">Sign Out</span>}
            </button>
          </div>

          {/* User Profile Badge */}
          <div className="p-1.5 border-t border-[#CBA378]/10 relative bg-[#171E25]">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              title={user ? `${user.full_name} (${user.email})` : 'Profile'}
              className={`w-full flex items-center gap-2 p-1 rounded-xl hover:bg-[#2C2927] border border-transparent hover:border-[#CBA378]/40 transition text-left ${
                !isExpanded ? 'justify-center' : ''
              }`}
            >
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-6 h-6 rounded-full object-cover border border-[#CBA378] shadow-md shrink-0" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#EFE6D6] to-[#CBA378] text-[#2C2927] flex items-center justify-center font-bold text-[10px] shadow-[0_2px_0_#7A3B18] shrink-0">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
              )}
              {isExpanded && (
                <div className="overflow-hidden">
                  <p className="text-[11px] font-bold text-[#EFE6D6] truncate">{user?.full_name || 'User'}</p>
                  <p className="text-[9px] text-[#CBA378] truncate">{user?.user_id || user?.email || 'PP-USER'}</p>
                </div>
              )}
            </button>

            {/* Profile Popover Menu */}
            {showProfileMenu && (
              <div className="absolute bottom-12 left-1.5 w-48 bg-[#1F1C1B] border border-[#CBA378]/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleNavClick();
                    navigate('/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#EFE6D6] hover:bg-[#2C2927] hover:text-[#CBA378] rounded-xl transition"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#CBA378]" />
                  View Profile
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleNavClick();
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#EFE6D6] hover:bg-[#2C2927] hover:text-[#CBA378] rounded-xl transition mt-0.5"
                >
                  <Settings className="w-3.5 h-3.5 text-[#CBA378]" />
                  Account Settings
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowSignoutConfirm(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-xl transition mt-0.5"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <ConfirmModal
        isOpen={showSignoutConfirm}
        title="Sign Out of PayPulse"
        message="Are you sure you want to sign out of your account session?"
        onConfirm={() => {
          logout();
          navigate('/login');
        }}
        onCancel={() => setShowSignoutConfirm(false)}
      />
    </>
  );
};