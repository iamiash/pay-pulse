import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, CreditCard, Wallet, 
  ShieldAlert, FileText, Settings, User as UserIcon, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isExpanded, onToggleExpand }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const topNav = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCard },
    { name: 'Wallet', path: '/admin/wallet', icon: Wallet },
  ];

  const middleNav = [
    { name: 'Security', path: '/admin/security', icon: ShieldAlert },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
  ];

  const bottomNav = [
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'Admin Profile', path: '/admin/profile', icon: UserIcon },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 bg-[#1A1D27] border-r border-[#FECB6E]/30 flex flex-col justify-between transition-all duration-300 shadow-[4px_0_25px_rgba(0,0,0,0.6)] ${
        isExpanded ? 'w-48' : 'w-12'
      }`}
    >
      {/* Top Header & Expand Toggle */}
      <div>
        <div className="h-12 border-b border-[#FECB6E]/20 px-3 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#FFD89B] to-[#FECB6E] flex items-center justify-center font-black text-[#1A1D27] text-xs shrink-0 shadow-md">
              A
            </div>
            {isExpanded && (
              <span className="font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E] whitespace-nowrap">
                PayPulse Admin
              </span>
            )}
          </div>
          <button
            onClick={onToggleExpand}
            className="p-1 rounded-lg bg-[#2A2D3E] text-[#FECB6E] hover:scale-105 transition"
            title={isExpanded ? 'Collapse Menu' : 'Expand Menu'}
          >
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* TOP SECTION */}
        <div className="py-3 px-1.5 space-y-1 border-b border-[#FECB6E]/10">
          {isExpanded && (
            <p className="px-2 text-[9px] font-extrabold text-[#FECB6E]/70 uppercase tracking-widest mb-1">
              Core Management
            </p>
          )}
          {topNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] shadow-[0_2px_10px_rgba(254,203,110,0.3)]'
                      : 'text-[#B8B8AC] hover:text-white hover:bg-[#2A2D3E]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {isExpanded && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* MIDDLE SECTION */}
        <div className="py-3 px-1.5 space-y-1">
          {isExpanded && (
            <p className="px-2 text-[9px] font-extrabold text-[#FECB6E]/70 uppercase tracking-widest mb-1">
              Security & Compliance
            </p>
          )}
          {middleNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] shadow-[0_2px_10px_rgba(254,203,110,0.3)]'
                      : 'text-[#B8B8AC] hover:text-white hover:bg-[#2A2D3E]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {isExpanded && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="p-1.5 border-t border-[#FECB6E]/20 space-y-1">
        {isExpanded && (
          <p className="px-2 text-[9px] font-extrabold text-[#FECB6E]/70 uppercase tracking-widest mb-1">
            Control & System
          </p>
        )}
        {bottomNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] shadow-[0_2px_10px_rgba(254,203,110,0.3)]'
                    : 'text-[#B8B8AC] hover:text-white hover:bg-[#2A2D3E]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {isExpanded && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition-all mt-1"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {isExpanded && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};