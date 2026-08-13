import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, FileText } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import AdminAuditTable from '../components/admin/AdminAuditTable';
import { AdminAuditLogItem } from '../types';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAuditLogs();
      setLogs(res.data || []);
    } catch (err) {
      console.error('Failed to load audit trail:', err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      (log.user_email && log.user_email.toLowerCase().includes(q)) ||
      (log.details && log.details.toLowerCase().includes(q))
    );
  });

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6 page-transition w-full">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E]">
            Immutable Audit Trail Inspector
          </h1>
          <p className="text-xs font-bold text-[#FECB6E] mt-0.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Append-only cryptographic log recording administrative & system executions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAuditLogs}
            className="px-4 py-2 rounded-xl bg-[#2A2D3E] border border-[#FECB6E]/40 text-[#FECB6E] text-xs font-bold flex items-center gap-2 hover:bg-[#32364a] transition shadow-md cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Stream
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card-lighter-zenta p-4 rounded-3xl border border-[#CBA378]/30 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#FECB6E]" />
            <input
              type="text"
              placeholder="Search Action (USER_REGISTRATION, ADD_CARD), Email, Details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141620] text-xs font-semibold text-white pl-10 pr-4 py-2.5 rounded-2xl border border-[#CBA378]/20 focus:outline-none focus:border-[#FECB6E] transition"
            />
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <AdminAuditTable logs={filteredLogs} loading={loading} />

    </div>
  );
};

export default AdminAuditLogs;