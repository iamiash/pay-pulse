import React from 'react';
import { FileText, CheckCircle2, XCircle } from 'lucide-react';
import { AdminAuditLogItem } from '../../types';

export interface AdminAuditTableProps {
  logs: AdminAuditLogItem[];
  loading: boolean;
}

export const AdminAuditTable: React.FC<AdminAuditTableProps> = ({ logs, loading }) => {
  return (
    <div className="glass-card-lighter-zenta rounded-3xl border border-[#CBA378]/30 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#CBA378]/20 bg-[#141620] text-[10px] font-black text-[#FECB6E] uppercase tracking-wider">
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Actor (Admin / User)</th>
              <th className="py-3.5 px-4">Action Triggered</th>
              <th className="py-3.5 px-4">Resource</th>
              <th className="py-3.5 px-4">Target User ID</th>
              <th className="py-3.5 px-4">IP Address</th>
              <th className="py-3.5 px-4 text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CBA378]/10 text-xs font-semibold text-slate-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#FECB6E] font-bold">
                  Fetching Append-Only Immutable Audit Stream...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No audit trail records matched the specified parameters.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#2A2D3E]/50 transition">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-extrabold text-white whitespace-nowrap">
                    {log.user_email || `User #${log.user_id}`}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#FECB6E] uppercase whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                    {log.details ? log.details : 'SYSTEM_RESOURCE'}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {log.user_id ? `PP-USR-${log.user_id}` : 'GLOBAL'}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {log.ip_address || '127.0.0.1'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> SUCCESS
                    </span>
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

export default AdminAuditTable;