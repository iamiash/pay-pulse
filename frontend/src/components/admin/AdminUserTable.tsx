import React, { useState } from 'react';
import { 
  MoreVertical, Eye, CreditCard, Wallet, Activity, 
  ShieldAlert, FileText, Ban, UserCheck, LogOut, CheckCircle, XCircle 
} from 'lucide-react';
import { AdminUserListItem } from '../../types';

export interface AdminUserTableProps {
  users: AdminUserListItem[];
  loading: boolean;
  onSelectUserAction: (
    userId: number, 
    tabSection: 'overview' | 'subscriptions' | 'wallet' | 'activity' | 'security' | 'audit'
  ) => void;
  onStatusChange: (userId: number, action: string) => void;
}

export const AdminUserTable: React.FC<AdminUserTableProps> = ({
  users,
  loading,
  onSelectUserAction,
  onStatusChange,
}) => {
  const [activeMenuUserId, setActiveMenuUserId] = useState<number | null>(null);

  const formatStatusBadge = (status: string) => {
    const st = (status || 'ACTIVE').toUpperCase();
    if (st === 'ACTIVE') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (st === 'SUSPENDED') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    if (st === 'BANNED') return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
  };

  return (
    <div className="glass-card-lighter-zenta rounded-3xl border border-[#CBA378]/30 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#CBA378]/20 bg-[#141620]/80 text-[10px] font-black text-[#FECB6E] uppercase tracking-wider">
              <th className="py-3.5 px-4">User ID</th>
              <th className="py-3.5 px-4">Name</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Email Verification</th>
              <th className="py-3.5 px-4">Created</th>
              <th className="py-3.5 px-4">Last Login</th>
              <th className="py-3.5 px-4">Last Active</th>
              <th className="py-3.5 px-4 text-center">Subscriptions</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CBA378]/10 text-xs font-semibold text-slate-200">
            {loading ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-[#FECB6E] font-bold">
                  Loading User Directory...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-400">
                  No user records match the specified query parameters.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-[#2A2D3E]/50 transition group">
                  <td className="py-3 px-4 font-mono font-bold text-[#FECB6E] whitespace-nowrap">
                    {u.user_id}
                  </td>
                  <td className="py-3 px-4 font-extrabold text-white whitespace-nowrap">
                    {u.full_name}
                  </td>
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                    {u.email}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase ${formatStatusBadge(u.account_status)}`}>
                      {u.account_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-300 whitespace-nowrap">
                    {u.role}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {u.email_verified ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-400 font-bold text-[10px]">
                        <XCircle className="w-3.5 h-3.5" /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                    {u.last_seen_at ? new Date(u.last_seen_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                    {u.subscriptions_count || 0}
                  </td>
                  <td className="py-3 px-4 text-right relative whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectUserAction(u.id, 'overview')}
                        className="p-1.5 rounded-lg bg-[#141620] text-[#FECB6E] hover:bg-[#FECB6E] hover:text-[#171E25] transition"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setActiveMenuUserId(activeMenuUserId === u.id ? null : u.id)}
                        className="p-1.5 rounded-lg bg-[#141620] text-slate-300 hover:text-white hover:bg-[#2A2D3E] transition"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* 57. ADMIN USER ACTION DROPDOWN MENU */}
                    {activeMenuUserId === u.id && (
                      <div className="absolute right-4 top-10 z-50 w-48 bg-[#1A1D27] border border-[#FECB6E]/30 rounded-2xl shadow-2xl p-1.5 space-y-0.5 text-left text-xs font-bold animate-in fade-in zoom-in-95">
                        <button
                          onClick={() => { onSelectUserAction(u.id, 'overview'); setActiveMenuUserId(null); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-200 hover:bg-[#2A2D3E] hover:text-[#FECB6E]"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#FECB6E]" /> View account
                        </button>
                        <button
                          onClick={() => { onSelectUserAction(u.id, 'subscriptions'); setActiveMenuUserId(null); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-200 hover:bg-[#2A2D3E] hover:text-emerald-400"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> View subscriptions
                        </button>
                        <button
                          onClick={() => { onSelectUserAction(u.id, 'wallet'); setActiveMenuUserId(null); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-200 hover:bg-[#2A2D3E] hover:text-cyan-400"
                        >
                          <Wallet className="w-3.5 h-3.5 text-cyan-400" /> View wallet
                        </button>
                        <button
                          onClick={() => { onSelectUserAction(u.id, 'activity'); setActiveMenuUserId(null); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-200 hover:bg-[#2A2D3E] hover:text-indigo-400"
                        >
                          <Activity className="w-3.5 h-3.5 text-indigo-400" /> View activity
                        </button>
                        <button
                          onClick={() => { onSelectUserAction(u.id, 'security'); setActiveMenuUserId(null); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-200 hover:bg-[#2A2D3E] hover:text-amber-400"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> View security events
                        </button>
                        <button
                          onClick={() => { onSelectUserAction(u.id, 'audit'); setActiveMenuUserId(null); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-200 hover:bg-[#2A2D3E] hover:text-purple-400"
                        >
                          <FileText className="w-3.5 h-3.5 text-purple-400" /> View audit
                        </button>

                        <div className="border-t border-slate-700/50 my-1" />

                        {u.account_status === 'SUSPENDED' ? (
                          <button
                            onClick={() => { onStatusChange(u.id, 'UNSUSPEND'); setActiveMenuUserId(null); }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-emerald-400 hover:bg-emerald-950/40"
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Unsuspend
                          </button>
                        ) : (
                          <button
                            onClick={() => { onStatusChange(u.id, 'SUSPEND'); setActiveMenuUserId(null); }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-amber-400 hover:bg-amber-950/40"
                          >
                            <Ban className="w-3.5 h-3.5" /> Suspend
                          </button>
                        )}

                        {u.account_status === 'BANNED' ? (
                          <button
                            onClick={() => { onStatusChange(u.id, 'UNBAN'); setActiveMenuUserId(null); }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-emerald-400 hover:bg-emerald-950/40"
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => { onStatusChange(u.id, 'BAN'); setActiveMenuUserId(null); }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-rose-400 hover:bg-rose-950/40"
                          >
                            <Ban className="w-3.5 h-3.5" /> Ban
                          </button>
                        )}

                        <button
                          onClick={() => { onStatusChange(u.id, 'FORCE_LOGOUT'); setActiveMenuUserId(null); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-sky-400 hover:bg-sky-950/40"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Force logout
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserTable;