import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle, Lock } from 'lucide-react';
import { AdminSecurityEventItem } from '../../types';

export interface AdminSecurityTableProps {
  events: AdminSecurityEventItem[];
  loading: boolean;
}

export const AdminSecurityTable: React.FC<AdminSecurityTableProps> = ({ events, loading }) => {
  const getSeverityBadge = (severity: string) => {
    const sev = severity.toUpperCase();
    if (sev === 'CRITICAL') return 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse';
    if (sev === 'HIGH') return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    if (sev === 'MEDIUM') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
  };

  const getSeverityIcon = (severity: string) => {
    const sev = severity.toUpperCase();
    if (sev === 'CRITICAL' || sev === 'HIGH') return <ShieldAlert className="w-4 h-4 text-rose-400" />;
    if (sev === 'MEDIUM') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    return <Info className="w-4 h-4 text-sky-400" />;
  };

  return (
    <div className="glass-card-lighter-zenta rounded-3xl border border-[#CBA378]/30 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#CBA378]/20 bg-[#141620] text-[10px] font-black text-[#FECB6E] uppercase tracking-wider">
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">User Email</th>
              <th className="py-3.5 px-4">Event Type</th>
              <th className="py-3.5 px-4">Severity</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4">IP Address</th>
              <th className="py-3.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CBA378]/10 text-xs font-semibold text-slate-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#FECB6E] font-bold">
                  Evaluating Security Threat Logs...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No security events logged for current filter criteria.
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <tr key={e.id} className="hover:bg-[#2A2D3E]/50 transition">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(e.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                    {e.user_email || 'System / Unauthenticated'}
                  </td>
                  <td className="py-3 px-4 font-mono font-extrabold text-[#FECB6E] uppercase whitespace-nowrap">
                    {e.event_type}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border flex items-center gap-1 w-fit ${getSeverityBadge(e.severity)}`}>
                      {getSeverityIcon(e.severity)}
                      {e.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                    {e.description}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {e.ip_address || '127.0.0.1'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {e.resolved ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                        <CheckCircle className="w-3.5 h-3.5" /> Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-400 font-bold text-[10px]">
                        <Lock className="w-3.5 h-3.5" /> Active Threat
                      </span>
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

export default AdminSecurityTable;