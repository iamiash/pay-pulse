import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Key, Mail, Lock, AlertTriangle, 
  Search, Filter, RefreshCw, FileText 
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import AdminSecurityTable from '../components/admin/AdminSecurityTable';
import { AdminSecurityEventItem, AdminSecurityMetrics } from '../types';

export const AdminSecurity: React.FC = () => {
  const [events, setEvents] = useState<AdminSecurityEventItem[]>([]);
  const [secMetrics, setSecMetrics] = useState<AdminSecurityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const fetchSecurityEvents = async () => {
    try {
      setLoading(true);
      const [eventsRes, metricsRes] = await Promise.all([
        adminApi.getSecurityEvents(),
        adminApi.getSecurityMetrics()
      ]);
      setEvents(eventsRes.data || []);
      setSecMetrics(metricsRes.data || null);
    } catch (err) {
      console.error('Failed to load security threats:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityEvents();
  }, []);

  const metrics = [
    { label: 'Failed Logins', value: secMetrics?.failed_logins ?? 0, icon: Key, color: 'text-amber-400' },
    { label: 'Password Resets', value: secMetrics?.password_resets ?? 0, icon: Lock, color: 'text-cyan-400' },
    { label: 'Email Changes', value: secMetrics?.email_changes ?? 0, icon: Mail, color: 'text-indigo-400' },
    { label: 'Suspicious Activity', value: secMetrics?.suspicious_activity ?? 0, icon: AlertTriangle, color: 'text-rose-400' },
    { label: 'Locked Accounts', value: secMetrics?.locked_accounts ?? 0, icon: ShieldAlert, color: 'text-rose-500' },
    { label: 'Recent Events', value: secMetrics?.recent_events ?? events.length, icon: FileText, color: 'text-[#FECB6E]' },
  ];

  const filteredEvents = events.filter((e) => {
    const matchesSearch = 
      e.event_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.user_email && e.user_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (severityFilter === 'ALL') return matchesSearch;
    return matchesSearch && e.severity.toUpperCase() === severityFilter.toUpperCase();
  });

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6 page-transition w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E]">
            Security Threat Dashboard
          </h1>
          <p className="text-xs font-bold text-[#FECB6E] mt-0.5">
            Real-time threat monitoring, account lockouts, and event anomaly detection
          </p>
        </div>
        <button
          onClick={fetchSecurityEvents}
          className="px-4 py-2 rounded-xl bg-[#2A2D3E] border border-[#FECB6E]/40 text-[#FECB6E] text-xs font-bold flex items-center gap-2 hover:bg-[#32364a] transition self-start md:self-auto shadow-md cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Threats
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="p-4 rounded-3xl bg-[#141620] border border-[#CBA378]/30 space-y-2 shadow-xl hover:border-[#FECB6E]/50 transition">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{m.label}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <p className="text-2xl font-black text-white">{m.value}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card-lighter-zenta p-4 rounded-3xl border border-[#CBA378]/30 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#FECB6E]" />
            <input
              type="text"
              placeholder="Search Event, Email, IP Address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141620] text-xs font-semibold text-white pl-10 pr-4 py-2.5 rounded-2xl border border-[#CBA378]/20 focus:outline-none focus:border-[#FECB6E] transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-[#FECB6E] shrink-0 mr-1" />
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase whitespace-nowrap transition-all cursor-pointer ${
                severityFilter === sev
                  ? 'bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] shadow-md'
                  : 'bg-[#141620] text-[#B8B8AC] hover:text-white border border-[#CBA378]/20'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <AdminSecurityTable events={filteredEvents} loading={loading} />
    </div>
  );
};

export default AdminSecurity;