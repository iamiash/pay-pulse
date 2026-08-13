import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, Bell, CheckCircle, X, Sparkles, SearchX, Layout, 
  CreditCard as SubIcon, Wallet as WalletIcon, FileText, CheckCheck,
  RefreshCw, ShieldCheck, UserCheck, AlertCircle, Cpu
} from 'lucide-react';
import { subscriptionApi } from '../../api/subscriptionApi';
import { walletApi } from '../../api/walletApi';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { Subscription, AppSearchResult, NotificationCategory } from '../../types';

const STATIC_REPORTS = [
  { name: 'Monthly Tax & Expense Report', path: '/reports', subtext: 'PDF & CSV Export' },
  { name: 'Annual Subscription Analytics', path: '/reports', subtext: 'Financial Year Breakdown' },
];

const NOTIF_CATEGORIES: { id: string; label: string; icon: any }[] = [
  { id: 'All', label: 'All', icon: Sparkles },
  { id: 'Renewal', label: 'Renewal', icon: RefreshCw },
  { id: 'Payment', label: 'Payment', icon: SubIcon },
  { id: 'Account', label: 'Account', icon: UserCheck },
  { id: 'Security', label: 'Security', icon: ShieldCheck },
  { id: 'System', label: 'System', icon: Cpu },
];

export const Navbar: React.FC<{ onSelectSubscription?: (sub: Subscription) => void }> = ({ onSelectSubscription }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AppSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showBellPopover, setShowBellPopover] = useState(false);
  
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    selectedCategory, 
    setSelectedCategory, 
    markAsRead, 
    markAllAsRead, 
    refreshNotifications 
  } = useNotifications();
  const navigate = useNavigate();

  const searchRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
        setHasSearched(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setShowBellPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setHasSearched(false);

    if (val.trim().length >= 1) {
      const q = val.toLowerCase().trim();
      const results: AppSearchResult[] = [];

      try {
        const subRes = await subscriptionApi.search(val);
        subRes.data.forEach((sub: Subscription) => {
          results.push({
            id: `sub-${sub.id}`,
            name: `${sub.name} Subscription`,
            type: 'subscription',
            path: `/subscriptions/${sub.id}`,
            category: 'Subscription',
            subtext: `${sub.plan_type} • ${sub.currency || '৳'}${sub.cost}`,
            subscription: sub,
          });
        });
      } catch (err) {
        console.error('Subscription search error:', err);
      }

      try {
        const getMobileMethod = (walletApi as any).getMobiles ? (walletApi as any).getMobiles() : (walletApi as any).getMobile();
        const [cardsRes, banksRes, mobilesRes] = await Promise.all([
          walletApi.getCards().catch(() => ({ data: [] })),
          walletApi.getBanks().catch(() => ({ data: [] })),
          getMobileMethod.catch(() => ({ data: [] })),
        ]);

        const cards = cardsRes.data || [];
        const banks = banksRes.data || [];
        const mobiles = mobilesRes.data || [];

        cards.forEach((card: any) => {
          if (card.card_title?.toLowerCase().includes(q) || card.card_type?.toLowerCase().includes(q) || q.includes('card')) {
            results.push({
              id: `card-${card.id}`,
              name: `${card.card_title} Payment Method`,
              type: 'payment_method',
              path: '/wallet',
              category: 'Payment Method',
              subtext: `${card.card_type} • ${card.masked_card_number}`,
            });
          }
        });

        banks.forEach((bank: any) => {
          if (bank.bank_name?.toLowerCase().includes(q) || q.includes('bank')) {
            results.push({
              id: `bank-${bank.id}`,
              name: `${bank.bank_name} Bank Account`,
              type: 'payment_method',
              path: '/wallet',
              category: 'Payment Method',
              subtext: `Branch: ${bank.branch_name} • ${bank.masked_account_number}`,
            });
          }
        });

        mobiles.forEach((mob: any) => {
          if (mob.provider?.toLowerCase().includes(q) || q.includes('bkash') || q.includes('mobile')) {
            results.push({
              id: `mob-${mob.id}`,
              name: `${mob.provider} Mobile Wallet`,
              type: 'payment_method',
              path: '/wallet',
              category: 'Payment Method',
              subtext: mob.mobile_number,
            });
          }
        });
      } catch (err) {
        console.error('Wallet search error:', err);
      }

      STATIC_REPORTS.forEach((rep, idx) => {
        if (rep.name.toLowerCase().includes(q) || q.includes('report')) {
          results.push({
            id: `report-${idx}`,
            name: rep.name,
            type: 'report',
            path: rep.path,
            category: 'Report',
            subtext: rep.subtext,
          });
        }
      });

      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setHasSearched(false);
  };

  const handleSelectResult = (result: AppSearchResult) => {
    if (result.subscription && onSelectSubscription) {
      onSelectSubscription(result.subscription);
    }
    navigate(result.path);
    setSuggestions([]);
    setSearchQuery('');
    setHasSearched(false);
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;
    setHasSearched(true);

    if (suggestions.length > 0) {
      handleSelectResult(suggestions[0]);
    } else {
      try {
        const res = await subscriptionApi.search(searchQuery);
        if (res.data.length > 0) {
          if (onSelectSubscription) onSelectSubscription(res.data[0]);
          navigate(`/subscriptions/${res.data[0].id}`);
          setSuggestions([]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleNotificationClick = (id: number, subscriptionId?: number | null) => {
    markAsRead(id);
    if (subscriptionId) {
      navigate(`/subscriptions/${subscriptionId}`);
    } else {
      navigate('/subscriptions');
    }
    setShowBellPopover(false);
  };

  const handleBellToggle = () => {
    if (!showBellPopover) {
      refreshNotifications(selectedCategory);
    }
    setShowBellPopover(!showBellPopover);
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    refreshNotifications(catId);
  };

  return (
    <header className="h-12 bg-[#2A2D3E] border-b border-[#FECB6E]/30 px-5 flex items-center justify-between sticky top-0 z-30 shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
      {/* Universal Search */}
      <div className="relative w-full max-w-md mx-auto" ref={searchRef}>
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3 w-3.5 h-3.5 text-[#FECB6E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              placeholder="Search Subscriptions, Payment sources, Reports..."
              className="w-full bg-[#1A1D27] border border-[#FECB6E]/40 rounded-xl pl-8 pr-7 py-1 text-xs font-medium text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FECB6E] transition shadow-inner"
            />
            {searchQuery.length > 0 && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 p-0.5 rounded-full text-slate-400 hover:text-[#FECB6E] hover:bg-[#2A2D3E] transition"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={handleSearchSubmit}
            className="px-3.5 py-1 bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-600 text-slate-950 font-bold text-xs rounded-xl border border-cyan-300 shadow-[0_2px_0_#0891B2,0_4px_10px_rgba(6,182,212,0.4)] hover:shadow-[0_0_18px_rgba(6,182,212,0.9)] hover:scale-105 active:translate-y-[1px] transition-all shrink-0"
          >
            Search
          </button>
        </div>

        {/* Dropdown Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-[#1A1D27] border border-[#FECB6E]/40 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden z-50 max-h-72 overflow-y-auto divide-y divide-[#FECB6E]/10 animate-in fade-in duration-150">
            {suggestions.map((result) => (
              <div
                key={result.id}
                onClick={() => handleSelectResult(result)}
                className="px-4 py-2 hover:bg-[#2A2D3E] cursor-pointer flex justify-between items-center transition bg-[#1A1D27]"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-xl border ${
                    result.type === 'subscription' 
                      ? 'bg-[#FECB6E]/10 border-[#FECB6E]/30 text-[#FECB6E]' 
                      : result.type === 'payment_method'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                  }`}>
                    {result.type === 'subscription' && <SubIcon className="w-3.5 h-3.5" />}
                    {result.type === 'payment_method' && <WalletIcon className="w-3.5 h-3.5" />}
                    {result.type === 'report' && <FileText className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{result.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{result.subtext}</p>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full border border-[#FECB6E]/40 bg-[#FECB6E]/20 text-[#FECB6E] font-semibold">
                  {result.category}
                </span>
              </div>
            ))}
          </div>
        )}

        {searchQuery.trim().length >= 1 && suggestions.length === 0 && hasSearched && (
          <div className="absolute left-0 right-0 mt-2 bg-[#1A1D27] border border-rose-500/40 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-4 text-center z-50">
            <SearchX className="w-6 h-6 text-rose-400 mx-auto mb-1 animate-bounce" />
            <p className="text-xs font-bold text-white">No matching result found</p>
          </div>
        )}
      </div>

      {/* Bell Notification & Profile Controls */}
      <div className="flex items-center gap-3">
        <div className="relative" ref={bellRef}>
          <button
            onClick={handleBellToggle}
            className="relative p-1.5 rounded-xl bg-[#1A1D27] border border-[#FECB6E]/40 text-[#FECB6E] hover:shadow-[0_0_18px_rgba(254,203,110,0.8)] hover:scale-105 active:translate-y-[1px] transition-all"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse border border-white/50">
                {unreadCount}
              </span>
            )}
          </button>

          {showBellPopover && (
            <div className="absolute right-0 mt-3 w-88 bg-[#1A1D27] border border-[#FECB6E]/40 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              
              {/* Header */}
              <div className="flex justify-between items-center pb-2 border-b border-[#FECB6E]/20 mb-3">
                <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Sparkles className="w-3.5 h-3.5 text-[#FECB6E]" /> Notifications
                </span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead} 
                      className="text-[10px] text-[#FECB6E] hover:underline flex items-center gap-1 font-semibold"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3 h-3" /> Mark Read
                    </button>
                  )}
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#FECB6E]/20 text-[#FECB6E] border border-[#FECB6E]/40">
                    {unreadCount} Unread
                  </span>
                </div>
              </div>

              {/* Notification Category Pills */}
              <div className="flex gap-1 overflow-x-auto pb-2 mb-2 no-scrollbar">
                {NOTIF_CATEGORIES.map((cat) => {
                  const CatIcon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition flex items-center gap-1 ${
                        isActive
                          ? 'bg-[#FECB6E] text-[#1A1D27] shadow-sm'
                          : 'bg-[#2A2D3E] text-slate-300 hover:text-white hover:bg-[#32364a]'
                      }`}
                    >
                      <CatIcon className="w-3 h-3" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Notification List */}
              <div className="max-h-64 overflow-y-auto flex flex-col gap-2 pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium text-center py-6">No notifications in {selectedCategory}</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n.id, n.subscription_id)}
                      className={`p-2.5 rounded-xl text-xs border cursor-pointer transition hover:scale-[1.01] ${
                        n.is_read 
                          ? 'bg-[#2A2D3E]/40 border-slate-700/60 text-slate-400' 
                          : 'bg-[#2A2D3E] border-[#FECB6E]/40 text-white shadow-md hover:border-[#FECB6E]'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase bg-[#FECB6E]/20 text-[#FECB6E] border border-[#FECB6E]/30">
                            {n.category || 'Renewal'}
                          </span>
                          <p className="font-bold text-white text-xs">{n.title}</p>
                        </div>
                        {!n.is_read && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }} 
                            className="text-slate-400 hover:text-emerald-400 transition"
                            title="Mark as Read"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="mt-1.5 text-slate-200 text-[11px] font-medium leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}
        </div>

        <Link to="/settings" className="flex items-center gap-2 group">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover border border-[#FECB6E] shadow-md group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#FFD89B] to-[#FECB6E] text-[#1A1D27] flex items-center justify-center font-black text-xs shadow-md group-hover:scale-105 transition-transform">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
};