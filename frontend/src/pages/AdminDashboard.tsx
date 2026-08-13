import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserCheck, UserMinus, UserX, ShieldAlert, 
  UserPlus, CreditCard, AlertTriangle, RefreshCw, TrendingUp, Activity
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { AdminMetricCard } from '../components/admin/AdminMetricCard';
import { AdminDashboardMetrics, AdminDashboardCharts } from '../types';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [charts, setCharts] = useState<AdminDashboardCharts | null>(null);
  const [loading, setLoading] = useState(true);
  const [userGrowthTimeframe, setUserGrowthTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [resMetrics, resCharts] = await Promise.all([
        adminApi.getMetrics(),
        adminApi.getCharts()
      ]);

      setMetrics(resMetrics.data);
      setCharts(resCharts.data);
    } catch (err) {
      console.error('Failed to fetch admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const growthPoints = charts?.user_growth?.[userGrowthTimeframe] || [];
  const maxGrowthValue = Math.max(...growthPoints.map((p) => p.value), 1);

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6 page-transition w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E]">
            Platform Command Center
          </h1>
          <p className="text-xs font-bold text-[#FECB6E] mt-0.5">
            Real-time platform metrics, account analytics, and security supervision
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 rounded-xl bg-[#2A2D3E] border border-[#FECB6E]/40 text-[#FECB6E] text-xs font-bold flex items-center gap-2 hover:bg-[#32364a] transition self-start md:self-auto shadow-md cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Metrics
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => navigate('/admin/users?status=ALL')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <AdminMetricCard
            title="Total Users"
            value={metrics?.total_users ?? '—'}
            subtext="Lifetime registered accounts"
            icon={Users}
            badgeText="ALL TIME"
            colorScheme="gold"
          />
        </div>
        <div onClick={() => navigate('/admin/users?status=ACTIVE')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <AdminMetricCard
            title="Active Users"
            value={metrics?.active_users ?? '—'}
            subtext="Verified & operational"
            icon={UserCheck}
            badgeText="OPERATIONAL"
            colorScheme="emerald"
          />
        </div>
        <div onClick={() => navigate('/admin/users?status=INACTIVE')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <AdminMetricCard
            title="Inactive Users"
            value={metrics?.inactive_users ?? '—'}
            subtext="No activity in 30+ days"
            icon={UserMinus}
            badgeText="IDLE"
            colorScheme="cyan"
          />
        </div>
        <div onClick={() => navigate('/admin/users?status=SUSPENDED')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <AdminMetricCard
            title="Suspended Users"
            value={metrics?.suspended_users ?? '—'}
            subtext="Temporary restriction"
            icon={AlertTriangle}
            badgeText="RESTRICTED"
            colorScheme="amber"
          />
        </div>
        <div onClick={() => navigate('/admin/users?status=BANNED')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <AdminMetricCard
            title="Banned Users"
            value={metrics?.banned_users ?? '—'}
            subtext="Permanently blocked"
            icon={UserX}
            badgeText="BLOCKED"
            colorScheme="rose"
          />
        </div>
        <div onClick={() => navigate('/admin/users?status=PENDING')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <AdminMetricCard
            title="New Users"
            value={metrics?.new_users ?? '—'}
            subtext="Joined last 7 days"
            icon={UserPlus}
            badgeText="NEW"
            colorScheme="indigo"
          />
        </div>
        <div onClick={() => navigate('/admin/subscriptions?status=Active')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <AdminMetricCard
            title="Active Subscriptions"
            value={metrics?.active_subscriptions ?? '—'}
            subtext="Tracked platform subscriptions"
            icon={CreditCard}
            badgeText="MONITORED"
            colorScheme="emerald"
          />
        </div>
        <div onClick={() => navigate('/admin/security')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <AdminMetricCard
            title="Security Alerts"
            value={metrics?.security_alerts ?? '—'}
            subtext="Unresolved threat audit events"
            icon={ShieldAlert}
            badgeText="SECURITY"
            colorScheme="rose"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#CBA378]/20 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FECB6E]" />
              <h3 className="text-sm font-black text-white">User Growth Trajectory</h3>
            </div>
            <div className="flex bg-[#141620] p-1 rounded-xl border border-[#CBA378]/20 gap-1">
              {(['daily', 'weekly', 'monthly'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setUserGrowthTimeframe(t)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase transition cursor-pointer ${
                    userGrowthTimeframe === t
                      ? 'bg-[#FECB6E] text-[#171E25] shadow'
                      : 'text-[#B8B8AC] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2">
            {growthPoints.map((pt, i) => {
              const heightPct = Math.round((pt.value / maxGrowthValue) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-[#FECB6E] opacity-0 group-hover:opacity-100 transition">
                    {pt.value}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[28px] bg-gradient-to-t from-[#E0A32E] to-[#FECB6E] rounded-t-lg transition-all group-hover:brightness-125 shadow-md"
                  />
                  <span className="text-[10px] font-bold text-slate-400">{pt.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#CBA378]/20 pb-3">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-black text-white">Active Users (DAU / WAU / MAU)</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-[#141620] border border-emerald-500/30">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase block">DAU</span>
              <p className="text-lg font-black text-emerald-400 mt-0.5">{charts?.active_users_trend?.dau ?? 0}</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#141620] border border-cyan-500/30">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase block">WAU</span>
              <p className="text-lg font-black text-cyan-400 mt-0.5">{charts?.active_users_trend?.wau ?? 0}</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#141620] border border-[#FECB6E]/30">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase block">MAU</span>
              <p className="text-lg font-black text-[#FECB6E] mt-0.5">{charts?.active_users_trend?.mau ?? 0}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {charts?.active_users_trend?.history?.map((h, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#141620]/60">
                <span className="font-bold text-slate-300 w-12">{h.period}</span>
                <div className="flex-1 mx-3 bg-[#2A2D3E] h-2 rounded-full overflow-hidden flex">
                  <div style={{ width: `${(h.dau / 400) * 100}%` }} className="bg-emerald-400" />
                  <div style={{ width: `${(h.wau / 1500) * 100}%` }} className="bg-cyan-400" />
                </div>
                <span className="font-mono text-[10px] text-[#FECB6E] font-bold">{h.mau} MAU</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#CBA378]/20 pb-3">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-black text-white">Account Status Distribution</h3>
          </div>

          <div className="space-y-3">
            {charts?.account_status_distribution?.map((item) => {
              const total = charts.account_status_distribution.reduce((acc, curr) => acc + curr.count, 0) || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.status} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">{item.status}</span>
                    <span className="text-white font-mono">{item.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-[#141620] h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                    <div
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                      className="h-full rounded-full transition-all duration-500 shadow"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#CBA378]/20 pb-3">
            <CreditCard className="w-5 h-5 text-[#FECB6E]" />
            <h3 className="text-sm font-black text-white">Subscription Volume & Revenue Growth</h3>
          </div>

          <div className="space-y-2">
            {charts?.subscription_growth?.map((sub, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-2xl bg-[#141620] border border-[#CBA378]/10 text-xs">
                <div>
                  <span className="font-extrabold text-white block">{sub.period}</span>
                  <span className="text-[10px] text-slate-400">{sub.subscriptions} active plans</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-[#FECB6E] text-sm block">৳{sub.revenue.toLocaleString()}</span>
                  <span className="text-[9px] text-emerald-400 font-bold">MRR Trajectory</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};