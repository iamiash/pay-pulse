import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';

import { useSearchParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

import { adminApi } from '../api/adminApi';
import { AdminGlobalSubscriptionItem } from '../types';

export const AdminSubscriptions: React.FC = () => {

  const [searchParams] =
    useSearchParams();

  const initialStatusParam =
    searchParams.get('status')
    || 'ALL';

  const [
    subscriptions,
    setSubscriptions
  ] = useState<
    AdminGlobalSubscriptionItem[]
  >([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    userFilter,
    setUserFilter
  ] = useState('');

  const [
    serviceFilter,
    setServiceFilter
  ] = useState('');

  const [
    statusFilter,
    setStatusFilter
  ] = useState(
    initialStatusParam
  );

  const [
    categoryFilter,
    setCategoryFilter
  ] = useState('ALL');

  const [
    cycleFilter,
    setCycleFilter
  ] = useState('ALL');

  const fetchGlobalSubscriptions =
    async () => {

      try {

        setLoading(true);

        const res =
          await adminApi.getSubscriptions({
            user:
              userFilter || undefined,

            service:
              serviceFilter || undefined,

            status:
              statusFilter !== 'ALL'
                ? statusFilter
                : undefined,

            category:
              categoryFilter !== 'ALL'
                ? categoryFilter
                : undefined,

            billing_cycle:
              cycleFilter !== 'ALL'
                ? cycleFilter
                : undefined,
          });

        setSubscriptions(
          Array.isArray(res.data)
            ? res.data
            : []
        );

      } catch (err) {

        console.error(
          'Failed to load global subscriptions:',
          err
        );

        setSubscriptions([]);

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {

    fetchGlobalSubscriptions();

  }, [
    userFilter,
    serviceFilter,
    statusFilter,
    categoryFilter,
    cycleFilter,
  ]);

  useEffect(() => {

    const statusFromUrl =
      searchParams.get('status');

    if (statusFromUrl) {

      setStatusFilter(
        statusFromUrl
      );

    }

  }, [searchParams]);

  // ==========================================================
  // GROUP REAL DATABASE RECORDS BY SERVICE
  // ==========================================================

  const subscriptionUsage =
    useMemo(() => {

      const groups: Record<
        string,
        {
          service: string;
          users: Set<string>;
          userNames: Record<
            string,
            string
          >;
          activeCount: number;
          totalCount: number;
        }
      > = {};

      subscriptions.forEach(
        (subscription) => {

          const service =
            subscription.service
            || 'Unknown Service';

          if (!groups[service]) {

            groups[service] = {
              service,
              users: new Set<string>(),
              userNames: {},
              activeCount: 0,
              totalCount: 0,
            };

          }

          groups[
            service
          ].users.add(
            subscription.user_id
          );

          groups[
            service
          ].userNames[
            subscription.user_id
          ] =
            subscription.user_name
            || 'Unknown User';

          groups[
            service
          ].totalCount += 1;

          if (
            subscription.status
              ?.toUpperCase()
            === 'ACTIVE'
          ) {

            groups[
              service
            ].activeCount += 1;

          }

        }
      );

      return Object.values(
        groups
      ).sort(
        (a, b) =>
          b.totalCount
          - a.totalCount
      );

    }, [subscriptions]);

  return (

    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6 page-transition w-full">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E]">

            Global Subscription Monitor

          </h1>

          <p className="text-xs font-bold text-[#FECB6E] mt-0.5">

            Cross-account recurring billing registry and platform transaction monitor

          </p>

        </div>

        <button
          onClick={
            fetchGlobalSubscriptions
          }
          className="px-4 py-2 rounded-xl bg-[#2A2D3E] border border-[#FECB6E]/40 text-[#FECB6E] text-xs font-bold flex items-center gap-2 hover:bg-[#32364a] transition self-start md:self-auto shadow-md cursor-pointer"
        >

          <RefreshCw
            className={`w-3.5 h-3.5 ${
              loading
                ? 'animate-spin'
                : ''
            }`}
          />

          Refresh Registry

        </button>

      </div>

      {/* FILTERS */}

      <div className="glass-card-lighter-zenta p-4 rounded-3xl border border-[#CBA378]/30 space-y-3 shadow-xl">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

          <input
            type="text"
            placeholder="Filter by User ID / Name..."
            value={userFilter}
            onChange={(e) =>
              setUserFilter(
                e.target.value
              )
            }
            className="bg-[#141620] text-xs font-semibold text-white px-3 py-2 rounded-2xl border border-[#CBA378]/20 focus:outline-none focus:border-[#FECB6E]"
          />

          <input
            type="text"
            placeholder="Filter by Service..."
            value={serviceFilter}
            onChange={(e) =>
              setServiceFilter(
                e.target.value
              )
            }
            className="bg-[#141620] text-xs font-semibold text-white px-3 py-2 rounded-2xl border border-[#CBA378]/20 focus:outline-none focus:border-[#FECB6E]"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="bg-[#141620] text-xs font-semibold text-white px-3 py-2 rounded-2xl border border-[#CBA378]/20 focus:outline-none focus:border-[#FECB6E]"
          >

            <option value="ALL">
              All Statuses
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Paused">
              Paused
            </option>

            <option value="Expired">
              Expired
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

          </select>

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
            className="bg-[#141620] text-xs font-semibold text-white px-3 py-2 rounded-2xl border border-[#CBA378]/20 focus:outline-none focus:border-[#FECB6E]"
          >

            <option value="ALL">
              All Categories
            </option>

            <option value="AI Tools">
              AI Tools
            </option>

            <option value="Streaming">
              Streaming
            </option>

            <option value="Entertainment">
              Entertainment
            </option>

            <option value="Cloud">
              Cloud
            </option>

            <option value="SaaS">
              SaaS
            </option>

            <option value="Utilities">
              Utilities
            </option>

          </select>

          <select
            value={cycleFilter}
            onChange={(e) =>
              setCycleFilter(
                e.target.value
              )
            }
            className="bg-[#141620] text-xs font-semibold text-white px-3 py-2 rounded-2xl border border-[#CBA378]/20 focus:outline-none focus:border-[#FECB6E]"
          >

            <option value="ALL">
              All Cycles
            </option>

            <option value="Monthly">
              Monthly
            </option>

            <option value="Yearly">
              Yearly
            </option>

            <option value="Quarterly">
              Quarterly
            </option>

          </select>

        </div>

      </div>

      {/* SERVICE USAGE SUMMARY */}

      <div className="glass-card-lighter-zenta p-5 rounded-3xl border border-[#CBA378]/30 shadow-xl">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#CBA378]/20 pb-3 mb-4">

          <div>

            <h2 className="text-sm font-black text-white">

              Subscription Usage by Service

            </h2>

            <p className="text-[10px] text-slate-400 mt-1">

              Real service-to-user relationships calculated from the database

            </p>

          </div>

          <div className="text-right">

            <span className="text-[10px] font-black uppercase text-[#FECB6E]">

              {subscriptions.length}
              {' '}
              Records

            </span>

            <p className="text-[9px] text-slate-500">

              {subscriptionUsage.length}
              {' '}
              Services

            </p>

          </div>

        </div>

        {loading ? (

          <div className="py-8 text-center text-[#FECB6E] text-xs font-bold">

            Calculating real subscription usage...

          </div>

        ) : subscriptionUsage.length === 0 ? (

          <div className="py-8 text-center text-slate-400 text-xs">

            No subscription data found.

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">

            {subscriptionUsage.map(
              (group) => (

                <div
                  key={group.service}
                  className="p-4 rounded-2xl bg-[#141620] border border-[#CBA378]/20 hover:border-[#FECB6E]/40 transition"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <h3 className="text-sm font-black text-white truncate">

                        {group.service}

                      </h3>

                      <p className="text-[10px] text-slate-400 mt-1">

                        {group.users.size}
                        {' '}
                        unique user
                        {group.users.size === 1
                          ? ''
                          : 's'}

                      </p>

                    </div>

                    <span className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 whitespace-nowrap">

                      {group.activeCount}
                      {' '}
                      Active

                    </span>

                  </div>

                  <div className="mt-3">

                    <p className="text-[9px] text-slate-500 uppercase font-black mb-2">

                      Users

                    </p>

                    <div className="flex flex-wrap gap-1.5">

                      {Array.from(
                        group.users
                      ).map(
                        (userId) => (

                          <div
                            key={userId}
                            className="px-2 py-1.5 rounded-lg bg-[#2A2D3E] border border-[#FECB6E]/10"
                          >

                            <p className="text-[9px] font-mono font-bold text-[#FECB6E]">

                              {userId}

                            </p>

                            <p className="text-[8px] text-slate-500 mt-0.5">

                              {
                                group.userNames[
                                  userId
                                ]
                              }

                            </p>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-700/40 flex justify-between">

                    <span className="text-[9px] text-slate-500">

                      Total records

                    </span>

                    <span className="text-[10px] font-mono font-bold text-white">

                      {group.totalCount}

                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* DETAILED REGISTRY */}

      <div className="glass-card-lighter-zenta rounded-3xl border border-[#CBA378]/30 overflow-hidden shadow-xl">

        <div className="px-4 py-3 border-b border-[#CBA378]/20 flex items-center justify-between">

          <div>

            <h2 className="text-sm font-black text-white">

              Detailed Subscription Registry

            </h2>

            <p className="text-[9px] text-slate-500 mt-0.5">

              Every subscription record currently stored in the platform database

            </p>

          </div>

          <span className="text-[10px] font-mono font-bold text-[#FECB6E]">

            {subscriptions.length}
            {' '}
            records

          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>

              <tr className="border-b border-[#CBA378]/20 bg-[#141620]/80 text-[10px] font-black text-[#FECB6E] uppercase tracking-wider">

                <th className="py-3.5 px-4">
                  User ID
                </th>

                <th className="py-3.5 px-4">
                  Service
                </th>

                <th className="py-3.5 px-4">
                  Plan
                </th>

                <th className="py-3.5 px-4">
                  Amount
                </th>

                <th className="py-3.5 px-4">
                  Currency
                </th>

                <th className="py-3.5 px-4">
                  Renewal
                </th>

                <th className="py-3.5 px-4">
                  Status
                </th>

                <th className="py-3.5 px-4">
                  Payment Type
                </th>

                <th className="py-3.5 px-4">
                  Created
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-[#CBA378]/10 text-xs font-semibold text-slate-200">

              {loading ? (

                <tr>

                  <td
                    colSpan={9}
                    className="py-8 text-center text-[#FECB6E] font-bold"
                  >

                    Fetching Global Subscriptions...

                  </td>

                </tr>

              ) : subscriptions.length === 0 ? (

                <tr>

                  <td
                    colSpan={9}
                    className="py-8 text-center text-slate-400"
                  >

                    No matching global subscriptions found.

                  </td>

                </tr>

              ) : (

                subscriptions.map(
                  (s) => (

                    <tr
                      key={s.id}
                      className="hover:bg-[#2A2D3E]/50 transition"
                    >

                      <td className="py-3 px-4 font-mono font-bold text-[#FECB6E] whitespace-nowrap">

                        {s.user_id}

                      </td>

                      <td className="py-3 px-4 font-extrabold text-white whitespace-nowrap">

                        {s.service}

                      </td>

                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">

                        {s.plan}

                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">

                        {s.currency || 'USD'}
                        {' '}
                        {Number(
                          s.amount || 0
                        ).toFixed(2)}

                      </td>

                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">

                        {s.currency}

                      </td>

                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">

                        {s.next_billing_date
                          || 'N/A'}

                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">

                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            s.status?.toUpperCase()
                            === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : s.status?.toUpperCase()
                                === 'EXPIRED'
                                ? 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >

                          {s.status}

                        </span>

                      </td>

                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">

                        {s.payment_type}

                      </td>

                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">

                        {s.created_at
                          ? new Date(
                              s.created_at
                            ).toLocaleDateString()
                          : 'N/A'}

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default AdminSubscriptions;