import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Lock } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import AdminWalletTable, { AdminWalletItem } from '../components/admin/AdminWalletTable';

export const AdminWallet: React.FC = () => {
  const [items, setItems] = useState<AdminWalletItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getWallet();
      setItems(res.data || []);
    } catch (err) {
      console.error('Failed to fetch wallet items:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.masked_identifier.includes(searchQuery);
    
    if (activeFilter === 'ALL') return matchesSearch;
    return matchesSearch && item.type.toUpperCase() === activeFilter.toUpperCase();
  });

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6 page-transition w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E]">
            Admin PCI Payment Directory
          </h1>
          <p className="text-xs font-bold text-[#FECB6E] mt-0.5 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" /> Masked wallet register with zero plain-text credential storage
          </p>
        </div>
        <button
          onClick={fetchWallet}
          className="px-4 py-2 rounded-xl bg-[#2A2D3E] border border-[#FECB6E]/40 text-[#FECB6E] text-xs font-bold flex items-center gap-2 hover:bg-[#32364a] transition self-start md:self-auto shadow-md cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Registry
        </button>
      </div>

      <div className="glass-card-lighter-zenta p-4 rounded-3xl border border-[#CBA378]/30 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#FECB6E]" />
            <input
              type="text"
              placeholder="Search User ID, Provider, Masked Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141620] text-xs font-semibold text-white pl-10 pr-4 py-2.5 rounded-2xl border border-[#CBA378]/20 focus:outline-none focus:border-[#FECB6E] transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-[#FECB6E] shrink-0 mr-1" />
          {['ALL', 'CARD', 'BANK', 'MOBILE_BANKING'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === type
                  ? 'bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] shadow-md'
                  : 'bg-[#141620] text-[#B8B8AC] hover:text-white border border-[#CBA378]/20'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <AdminWalletTable items={filteredItems} loading={loading} />
    </div>
  );
};

export default AdminWallet;