import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import AdminUserTable from '../components/admin/AdminUserTable';
import AdminUserDetailModal from '../components/admin/AdminUserDetailModal';
import { AdminConfirmActionModal } from '../components/admin/AdminConfirmActionModal';
import { AdminUserListItem } from '../types';

export const AdminUsers: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialStatusParam = searchParams.get('status')?.toUpperCase() || 'ALL';

  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(initialStatusParam);
  
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [initialTab, setInitialTab] = useState<'overview' | 'subscriptions' | 'wallet' | 'activity' | 'security' | 'audit'>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    userId: number;
    action: string;
    displayId?: string;
    name?: string;
  }>({
    isOpen: false,
    userId: 0,
    action: '',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers({
        search: searchQuery || undefined,
        status: activeFilter !== 'ALL' ? activeFilter : undefined
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, activeFilter]);

  useEffect(() => {
    const statusFromUrl = searchParams.get('status')?.toUpperCase();
    if (statusFromUrl) {
      setActiveFilter(statusFromUrl);
    }
  }, [searchParams]);

  const handleUserAction = (
    userId: number, 
    tabSection: 'overview' | 'subscriptions' | 'wallet' | 'activity' | 'security' | 'audit'
  ) => {
    setSelectedUserId(userId);
    setInitialTab(tabSection);
    setIsModalOpen(true);
  };

  const initiateStatusChange = (userId: number, action: string) => {
    const targetUser = users.find((u) => u.id === userId);
    setConfirmModal({
      isOpen: true,
      userId,
      action,
      displayId: targetUser?.user_id,
      name: targetUser?.full_name,
    });
  };

  const handleStatusUpdate = async (userId: number, action: string, reason?: string) => {
    try {
      await adminApi.updateUserStatus(userId, action, reason);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filterButtons = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Suspended', value: 'SUSPENDED' },
    { label: 'Banned', value: 'BANNED' },
    { label: 'Verified', value: 'VERIFIED' },
    { label: 'Unverified', value: 'UNVERIFIED' },
    { label: 'New / Pending', value: 'PENDING' },
  ];

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6 page-transition w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E]">
            Admin Users Directory
          </h1>
          <p className="text-xs font-bold text-[#FECB6E] mt-0.5">
            Searchable user directory with status filters and action triggers
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 rounded-xl bg-[#2A2D3E] border border-[#FECB6E]/40 text-[#FECB6E] text-xs font-bold flex items-center gap-2 hover:bg-[#32364a] transition self-start md:self-auto shadow-md cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Directory
        </button>
      </div>

      <div className="glass-card-lighter-zenta p-4 rounded-3xl border border-[#CBA378]/30 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#FECB6E]" />
            <input
              type="text"
              placeholder="Search User ID, Email, Name, Contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141620] text-xs font-semibold text-white pl-10 pr-4 py-2.5 rounded-2xl border border-[#CBA378]/20 focus:outline-none focus:border-[#FECB6E] transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-[#FECB6E] shrink-0 mr-1" />
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] shadow-md'
                : 'bg-[#141620] text-[#B8B8AC] hover:text-white border border-[#CBA378]/20'
            }`}
          >
            All Accounts
          </button>
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setActiveFilter(btn.value)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === btn.value
                  ? 'bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#171E25] shadow-md'
                  : 'bg-[#141620] text-[#B8B8AC] hover:text-white border border-[#CBA378]/20'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <AdminUserTable
        users={users}
        loading={loading}
        onSelectUserAction={handleUserAction}
        onStatusChange={initiateStatusChange}
      />

      {isModalOpen && selectedUserId && (
        <AdminUserDetailModal
          userId={selectedUserId}
          initialSection={initialTab}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={initiateStatusChange}
        />
      )}

      <AdminConfirmActionModal
        isOpen={confirmModal.isOpen}
        action={confirmModal.action}
        userId={confirmModal.userId}
        userDisplayId={confirmModal.displayId}
        userName={confirmModal.name}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleStatusUpdate}
      />
    </div>
  );
};

export default AdminUsers;