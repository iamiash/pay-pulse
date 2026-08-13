import React, { useState, useEffect } from 'react';
import {
  X,
  User as UserIcon,
  CreditCard,
  Wallet,
  Activity,
  ShieldAlert,
  FileText,
  Ban,
  LogOut,
  Lock,
} from 'lucide-react';

import { adminApi } from '../../api/adminApi';
import { AdminUserDetailResponse } from '../../types';

export interface AdminUserDetailModalProps {
  userId: number;
  initialSection?:
    | 'overview'
    | 'subscriptions'
    | 'wallet'
    | 'activity'
    | 'security'
    | 'audit';

  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (
    userId: number,
    action: string
  ) => void;
}

export const AdminUserDetailModal: React.FC<
  AdminUserDetailModalProps
> = ({
  userId,
  initialSection = 'overview',
  isOpen,
  onClose,
  onStatusChange,
}) => {

  const [
    activeTab,
    setActiveTab
  ] = useState<
    'overview'
    | 'subscriptions'
    | 'wallet'
    | 'activity'
    | 'security'
    | 'audit'
  >(initialSection);

  const [
    data,
    setData
  ] = useState<
    AdminUserDetailResponse | null
  >(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  useEffect(() => {
    setActiveTab(initialSection);
  }, [initialSection]);

  useEffect(() => {

    if (
      isOpen
      && userId
    ) {

      setLoading(true);
      setData(null);

      adminApi
        .getUserDetails(userId)
        .then((res) => {

          setData(res.data);

        })
        .catch((err) => {

          console.error(
            'Failed to load user details:',
            err
          );

          setData(null);

        })
        .finally(() => {

          setLoading(false);

        });
    }

  }, [isOpen, userId]);

  if (!isOpen) {
    return null;
  }

  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      icon: UserIcon,
    },
    {
      key: 'subscriptions',
      label: 'Subscriptions',
      icon: CreditCard,
    },
    {
      key: 'wallet',
      label: 'Wallet',
      icon: Wallet,
    },
    {
      key: 'activity',
      label: 'Activity',
      icon: Activity,
    },
    {
      key: 'security',
      label: 'Security',
      icon: ShieldAlert,
    },
    {
      key: 'audit',
      label: 'Audit',
      icon: FileText,
    },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">

      <div className="w-full max-w-4xl bg-[#1A1D27] border border-[#FECB6E]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* HEADER */}

        <div className="p-5 border-b border-[#FECB6E]/20 flex items-center justify-between bg-[#141620]">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFD89B] to-[#FECB6E] flex items-center justify-center font-black text-[#1A1D27] text-lg shadow-md">

              {data?.overview?.full_name?.[0] || 'U'}

            </div>

            <div>

              <h2 className="text-lg font-black text-white">

                {data?.overview?.full_name
                  || 'User Account Profile'}

              </h2>

              <p className="text-xs font-mono font-bold text-[#FECB6E]">

                {data?.overview?.user_id || ''}

              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#2A2D3E] text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* TABS */}

        <div className="flex items-center gap-1 p-2 bg-[#141620]/60 border-b border-[#FECB6E]/10 overflow-x-auto scrollbar-none">

          {tabs.map((tab) => {

            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() =>
                  setActiveTab(tab.key)
                }
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] shadow-md'
                    : 'text-[#B8B8AC] hover:text-white hover:bg-[#2A2D3E]'
                }`}
              >

                <Icon className="w-3.5 h-3.5" />

                {tab.label}

              </button>
            );

          })}

        </div>

        {/* CONTENT */}

        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {loading ? (

            <div className="py-12 text-center text-[#FECB6E] font-bold">

              Fetching real user profile from database...

            </div>

          ) : !data ? (

            <div className="py-12 text-center space-y-4">

              <div className="text-rose-400 font-bold">

                Unable to load this user's database record.

              </div>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#2A2D3E] border border-[#FECB6E]/30 text-[#FECB6E] text-xs font-bold"
              >
                Close
              </button>

            </div>

          ) : (

            <>

              {/* OVERVIEW */}

              {activeTab === 'overview'
                && data.overview && (

                <div className="space-y-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="p-4 rounded-2xl bg-[#141620] border border-slate-700/50 space-y-1">

                      <span className="text-[10px] font-extrabold text-[#FECB6E] uppercase">

                        User ID

                      </span>

                      <p className="text-sm font-mono font-bold text-white">

                        {data.overview.user_id}

                      </p>

                    </div>

                    <div className="p-4 rounded-2xl bg-[#141620] border border-slate-700/50 space-y-1">

                      <span className="text-[10px] font-extrabold text-[#FECB6E] uppercase">

                        Name

                      </span>

                      <p className="text-sm font-bold text-white">

                        {data.overview.full_name}

                      </p>

                    </div>

                    <div className="p-4 rounded-2xl bg-[#141620] border border-slate-700/50 space-y-1">

                      <span className="text-[10px] font-extrabold text-[#FECB6E] uppercase flex items-center gap-1">

                        <Lock className="w-3 h-3 text-amber-400" />

                        Masked email

                      </span>

                      <p className="text-sm font-mono font-bold text-slate-200">

                        {data.overview.masked_email}

                      </p>

                    </div>

                    <div className="p-4 rounded-2xl bg-[#141620] border border-slate-700/50 space-y-1">

                      <span className="text-[10px] font-extrabold text-[#FECB6E] uppercase flex items-center gap-1">

                        <Lock className="w-3 h-3 text-amber-400" />

                        Masked contact

                      </span>

                      <p className="text-sm font-mono font-bold text-slate-200">

                        {data.overview.masked_contact}

                      </p>

                    </div>

                    <div className="p-4 rounded-2xl bg-[#141620] border border-slate-700/50 space-y-1">

                      <span className="text-[10px] font-extrabold text-[#FECB6E] uppercase">

                        Status

                      </span>

                      <p
                        className={`text-sm font-bold ${
                          data.overview.account_status?.toUpperCase() === 'BANNED'
                            ? 'text-rose-400'
                            : data.overview.account_status?.toUpperCase() === 'SUSPENDED'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                        }`}
                      >

                        {data.overview.account_status}

                      </p>

                    </div>

                    <div className="p-4 rounded-2xl bg-[#141620] border border-slate-700/50 space-y-1">

                      <span className="text-[10px] font-extrabold text-[#FECB6E] uppercase">

                        Role

                      </span>

                      <p className="text-sm font-bold text-indigo-400">

                        {data.overview.role}

                      </p>

                    </div>

                    <div className="p-4 rounded-2xl bg-[#141620] border border-slate-700/50 space-y-1">

                      <span className="text-[10px] font-extrabold text-[#FECB6E] uppercase">

                        Created date

                      </span>

                      <p className="text-xs font-bold text-slate-300">

                        {data.overview.created_at}

                      </p>

                    </div>

                    <div className="p-4 rounded-2xl bg-[#141620] border border-slate-700/50 space-y-1">

                      <span className="text-[10px] font-extrabold text-[#FECB6E] uppercase">

                        Last login

                      </span>

                      <p className="text-xs font-bold text-slate-300">

                        {data.overview.last_login}

                      </p>

                    </div>

                    <div className="p-4 rounded-2xl bg-[#141620] border border-slate-700/50 space-y-1">

                      <span className="text-[10px] font-extrabold text-[#FECB6E] uppercase">

                        Last active

                      </span>

                      <p className="text-xs font-bold text-slate-300">

                        {data.overview.last_active}

                      </p>

                    </div>

                    <div className="p-4 rounded-2xl bg-[#141620] border border-slate-700/50 space-y-1">

                      <span className="text-[10px] font-extrabold text-[#FECB6E] uppercase">

                        Email verified

                      </span>

                      <p className="text-xs font-bold text-emerald-400">

                        {data.overview.email_verified
                          ? 'Verified'
                          : 'Unverified'}

                      </p>

                    </div>

                  </div>

                  {/* ADMIN ACTIONS */}

                  <div className="p-4 rounded-2xl bg-[#2A2D3E] border border-[#FECB6E]/30 flex flex-wrap items-center justify-between gap-3">

                    <span className="text-xs font-bold text-white">

                      Available Actions:

                    </span>

                    <div className="flex gap-2 flex-wrap">

                      <button
                        onClick={() =>
                          onStatusChange(
                            userId,
                            'SUSPEND'
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition flex items-center gap-1.5 cursor-pointer"
                      >

                        <Ban className="w-3.5 h-3.5" />

                        Suspend

                      </button>

                      <button
                        onClick={() =>
                          onStatusChange(
                            userId,
                            'BAN'
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold hover:bg-rose-500/30 transition flex items-center gap-1.5 cursor-pointer"
                      >

                        <Ban className="w-3.5 h-3.5" />

                        Ban

                      </button>

                      <button
                        onClick={() =>
                          onStatusChange(
                            userId,
                            'FORCE_LOGOUT'
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 text-xs font-bold hover:bg-sky-500/30 transition flex items-center gap-1.5 cursor-pointer"
                      >

                        <LogOut className="w-3.5 h-3.5" />

                        Force logout

                      </button>

                      {(
                        data.overview.account_status?.toUpperCase()
                        === 'BANNED'
                        ||
                        data.overview.account_status?.toUpperCase()
                        === 'SUSPENDED'
                      ) && (

                        <button
                          onClick={() =>
                            onStatusChange(
                              userId,
                              'ACTIVE'
                            )
                          }
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30 transition cursor-pointer"
                        >

                          Restore Access

                        </button>

                      )}

                    </div>

                  </div>

                </div>

              )}

              {/* SUBSCRIPTIONS */}

              {activeTab === 'subscriptions' && (

                <div className="space-y-3">

                  <h3 className="text-xs font-extrabold text-[#FECB6E] uppercase">

                    Subscriptions

                  </h3>

                  {!data.subscriptions
                    || data.subscriptions.length === 0 ? (

                    <p className="text-xs text-slate-400">

                      No subscriptions found for this account.

                    </p>

                  ) : (

                    data.subscriptions.map((s) => (

                      <div
                        key={s.id}
                        className="p-3.5 rounded-2xl bg-[#141620] border border-slate-700/50 flex items-center justify-between gap-4"
                      >

                        <div>

                          <p className="text-sm font-bold text-white">

                            {s.name}

                          </p>

                          <p className="text-[10px] text-slate-400">

                            {s.category}
                            {' • '}
                            {s.billing_cycle}
                            {' • '}
                            {s.status}

                          </p>

                          <p className="text-[10px] text-slate-500 mt-1">

                            Renewal:
                            {' '}
                            {s.next_billing_date || 'N/A'}

                          </p>

                        </div>

                        <span className="font-mono font-bold text-[#FECB6E] whitespace-nowrap">

                          {s.currency || 'USD'}
                          {' '}
                          {Number(
                            s.cost || 0
                          ).toFixed(2)}

                        </span>

                      </div>

                    ))

                  )}

                </div>

              )}

              {/* WALLET */}

              {activeTab === 'wallet' && (

                <div className="space-y-4">

                  <h3 className="text-xs font-extrabold text-[#FECB6E] uppercase">

                    Wallet Accounts

                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                    <div className="p-3.5 rounded-2xl bg-[#141620] border border-slate-700/50">

                      <span className="text-[9px] font-black text-slate-400 uppercase">

                        Bank Accounts

                      </span>

                      <p className="text-xs font-bold text-white mt-1">

                        {data.wallet?.banks?.length || 0}
                        {' '}
                        Linked

                      </p>

                      {data.wallet?.banks?.map(
                        (b) => (

                          <p
                            key={b.id}
                            className="text-[10px] text-slate-300 font-mono mt-1"
                          >

                            {b.bank_name}
                            {' '}
                            ({b.masked_account})

                          </p>

                        )
                      )}

                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#141620] border border-slate-700/50">

                      <span className="text-[9px] font-black text-slate-400 uppercase">

                        Credit / Debit Cards

                      </span>

                      <p className="text-xs font-bold text-white mt-1">

                        {data.wallet?.cards?.length || 0}
                        {' '}
                        Saved

                      </p>

                      {data.wallet?.cards?.map(
                        (c) => (

                          <p
                            key={c.id}
                            className="text-[10px] text-slate-300 font-mono mt-1"
                          >

                            {c.card_title}
                            {' '}
                            ({c.masked_card})

                          </p>

                        )
                      )}

                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#141620] border border-slate-700/50">

                      <span className="text-[9px] font-black text-slate-400 uppercase">

                        Mobile Banking

                      </span>

                      <p className="text-xs font-bold text-white mt-1">

                        {data.wallet?.mobiles?.length || 0}
                        {' '}
                        Registered

                      </p>

                      {data.wallet?.mobiles?.map(
                        (m) => (

                          <p
                            key={m.id}
                            className="text-[10px] text-slate-300 font-mono mt-1"
                          >

                            {m.provider}
                            {' '}
                            ({m.mobile_number})

                          </p>

                        )
                      )}

                    </div>

                  </div>

                </div>

              )}

              {/* ACTIVITY */}

              {activeTab === 'activity' && (

                <div className="space-y-3">

                  <h3 className="text-xs font-extrabold text-[#FECB6E] uppercase">

                    Activity Stream

                  </h3>

                  {!data.activity
                    || data.activity.length === 0 ? (

                    <p className="text-xs text-slate-400">

                      No activity logs recorded.

                    </p>

                  ) : (

                    data.activity.map(
                      (act, idx) => (

                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#141620] border border-slate-700/50 flex justify-between items-center gap-4 text-xs"
                        >

                          <div>

                            <span className="font-bold text-white">

                              {act.event}

                            </span>

                            {act.ip
                              && act.ip !== 'N/A'
                              && (

                              <p className="text-[9px] text-slate-500 mt-1 font-mono">

                                IP:
                                {' '}
                                {act.ip}

                              </p>

                            )}

                          </div>

                          <span className="text-slate-400 text-[10px] font-mono whitespace-nowrap">

                            {act.timestamp}

                          </span>

                        </div>

                      )
                    )

                  )}

                </div>

              )}

              {/* SECURITY */}

              {activeTab === 'security' && (

                <div className="space-y-3">

                  <h3 className="text-xs font-extrabold text-[#FECB6E] uppercase">

                    Security Events

                  </h3>

                  {!data.security
                    || data.security.length === 0 ? (

                    <p className="text-xs text-slate-400">

                      No threat security events detected.

                    </p>

                  ) : (

                    data.security.map(
                      (sec) => (

                        <div
                          key={sec.id}
                          className="p-3 rounded-xl bg-[#141620] border border-rose-500/30 flex justify-between items-center gap-4 text-xs"
                        >

                          <div>

                            <p className="font-bold text-rose-400">

                              {sec.event_type}

                            </p>

                            <p className="text-[10px] text-slate-300">

                              {sec.description}

                            </p>

                          </div>

                          <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">

                            {sec.timestamp}

                          </span>

                        </div>

                      )
                    )

                  )}

                </div>

              )}

              {/* AUDIT */}

              {activeTab === 'audit' && (

                <div className="space-y-3">

                  <h3 className="text-xs font-extrabold text-[#FECB6E] uppercase">

                    Audit Trail

                  </h3>

                  {!data.audit
                    || data.audit.length === 0 ? (

                    <p className="text-xs text-slate-400">

                      No audit trail entries recorded.

                    </p>

                  ) : (

                    data.audit.map(
                      (aud) => (

                        <div
                          key={aud.id}
                          className="p-3 rounded-xl bg-[#141620] border border-slate-700/50 flex justify-between items-center gap-4 text-xs"
                        >

                          <div>

                            <p className="font-bold text-indigo-400">

                              {aud.action}

                            </p>

                            <p className="text-[10px] text-slate-400">

                              {aud.resource_type}

                            </p>

                          </div>

                          <span className="text-[10px] text-emerald-400 font-bold">

                            {aud.status}

                          </span>

                        </div>

                      )
                    )

                  )}

                </div>

              )}

            </>

          )}

        </div>

      </div>

    </div>
  );
};

export default AdminUserDetailModal;