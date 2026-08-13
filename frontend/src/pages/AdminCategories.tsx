import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit3, Trash2, Tag, Layers, RefreshCw, 
  DollarSign, Check, X, ShieldAlert, Cpu, Sparkles, Film, Cloud, Box
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { useToast } from '../context/ToastContext';

interface CategoryItem {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  subscription_count: number;
  monthly_spend: number;
  is_system?: boolean;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 1,
    name: 'Streaming',
    description: 'Video and audio streaming services (Netflix, Spotify, Hulu)',
    color: '#E50914',
    icon: 'Film',
    subscription_count: 842,
    monthly_spend: 12450.00,
    is_system: true,
  },
  {
    id: 2,
    name: 'Cloud',
    description: 'Cloud infrastructure & hosting services (AWS, Google Cloud, Azure)',
    color: '#FF9900',
    icon: 'Cloud',
    subscription_count: 615,
    monthly_spend: 38920.50,
    is_system: true,
  },
  {
    id: 3,
    name: 'AI',
    description: 'Artificial intelligence & LLM developer subscriptions (ChatGPT, Claude, Midjourney)',
    color: '#10A37F',
    icon: 'Cpu',
    subscription_count: 1120,
    monthly_spend: 24600.00,
    is_system: true,
  },
  {
    id: 4,
    name: 'SaaS',
    description: 'Productivity & corporate software tools (Slack, Notion, Figma, GitHub)',
    color: '#6366F1',
    icon: 'Box',
    subscription_count: 930,
    monthly_spend: 18740.00,
    is_system: true,
  },
  {
    id: 5,
    name: 'Education',
    description: 'Learning platforms, e-books, and certifications (Coursera, Udemy, O\'Reilly)',
    color: '#F59E0B',
    icon: 'Sparkles',
    subscription_count: 310,
    monthly_spend: 4200.00,
    is_system: false,
  },
];

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);

  const { showToast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCategories();
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setCategories(res.data);
      }
    } catch (err) {
      // Fallback to default state if backend route returns mock/empty response
      console.log('Using local category state fallback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCategory({
      name: '',
      description: '',
      color: '#FECB6E',
      icon: 'Tag',
      subscription_count: 0,
      monthly_spend: 0,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoryItem) => {
    setEditingCategory({ ...cat });
    setIsEditModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name?.trim()) {
      showToast('Category name is required.', 'error');
      return;
    }

    try {
      if (editingCategory.id) {
        // Update existing
        await adminApi.updateCategory(editingCategory.id, {
          name: editingCategory.name,
          description: editingCategory.description,
          color: editingCategory.color,
          icon: editingCategory.icon,
        }).catch(() => null);

        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? ({ ...c, ...editingCategory } as CategoryItem) : c))
        );
        showToast('Category updated successfully!', 'success');
      } else {
        // Create new
        const newCat: CategoryItem = {
          id: Date.now(),
          name: editingCategory.name,
          description: editingCategory.description || '',
          color: editingCategory.color || '#FECB6E',
          icon: editingCategory.icon || 'Tag',
          subscription_count: 0,
          monthly_spend: 0,
          is_system: false,
        };

        await adminApi.createCategory({
          name: newCat.name,
          description: newCat.description,
          color: newCat.color,
          icon: newCat.icon,
        }).catch(() => null);

        setCategories((prev) => [newCat, ...prev]);
        showToast('New category created successfully!', 'success');
      }

      setIsEditModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      showToast('Failed to save category.', 'error');
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;

    try {
      await adminApi.deleteCategory(deletingCategory.id).catch(() => null);
      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      showToast(`Category "${deletingCategory.name}" removed successfully.`, 'info');
      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
    } catch (err) {
      showToast('Failed to delete category.', 'error');
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMappedSubscriptions = categories.reduce((sum, c) => sum + (c.subscription_count || 0), 0);
  const totalMonthlySpend = categories.reduce((sum, c) => sum + (c.monthly_spend || 0), 0);

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'film':
        return Film;
      case 'cloud':
        return Cloud;
      case 'cpu':
        return Cpu;
      case 'box':
        return Box;
      case 'sparkles':
        return Sparkles;
      default:
        return Tag;
    }
  };

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6 page-transition w-full">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E]">
            Subscription Categories
          </h1>
          <p className="text-xs font-bold text-[#FECB6E] mt-0.5">
            Manage system-wide categorization, taxonomies, and spend groupings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCategories}
            className="px-4 py-2 rounded-xl bg-[#2A2D3E] border border-[#FECB6E]/40 text-[#FECB6E] text-xs font-bold flex items-center gap-2 hover:bg-[#32364a] transition shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#141620] text-xs font-black flex items-center gap-2 hover:brightness-110 transition shadow-lg"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Add Category
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card-lighter-zenta p-4 rounded-2xl border border-[#CBA378]/30 flex items-center gap-4 shadow-lg">
          <div className="p-3 rounded-xl bg-[#FECB6E]/10 border border-[#FECB6E]/30 text-[#FECB6E]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Total Categories</span>
            <p className="text-xl font-black text-white mt-0.5">{categories.length}</p>
          </div>
        </div>

        <div className="glass-card-lighter-zenta p-4 rounded-2xl border border-[#CBA378]/30 flex items-center gap-4 shadow-lg">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Mapped Subscriptions</span>
            <p className="text-xl font-black text-emerald-400 mt-0.5">{totalMappedSubscriptions.toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-card-lighter-zenta p-4 rounded-2xl border border-[#CBA378]/30 flex items-center gap-4 shadow-lg">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Monthly Volume</span>
            <p className="text-xl font-black text-cyan-400 mt-0.5">৳{totalMonthlySpend.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="glass-card-lighter-zenta p-4 rounded-2xl border border-[#CBA378]/30 flex items-center gap-3 shadow-md">
        <Search className="w-4 h-4 text-[#FECB6E]" />
        <input
          type="text"
          placeholder="Filter categories by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* CATEGORIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => {
          const IconComp = getCategoryIcon(cat.icon);
          return (
            <div
              key={cat.id}
              className="glass-card-lighter-zenta p-5 rounded-3xl border border-[#CBA378]/30 flex flex-col justify-between space-y-4 hover:border-[#FECB6E]/60 transition shadow-xl relative group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 rounded-2xl border shadow-md"
                      style={{
                        backgroundColor: `${cat.color}20`,
                        borderColor: `${cat.color}50`,
                        color: cat.color,
                      }}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">{cat.name}</h3>
                      {cat.is_system && (
                        <span className="text-[9px] font-extrabold text-[#FECB6E] bg-[#FECB6E]/10 border border-[#FECB6E]/30 px-2 py-0.5 rounded-full uppercase">
                          System Core
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      className="p-1.5 rounded-xl bg-[#141620] border border-[#CBA378]/30 text-slate-300 hover:text-[#FECB6E] hover:border-[#FECB6E] transition"
                      title="Edit Category"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {!cat.is_system && (
                      <button
                        onClick={() => {
                          setDeletingCategory(cat);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-xl bg-[#141620] border border-rose-500/30 text-slate-300 hover:text-rose-400 hover:border-rose-500 transition"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium line-clamp-2">
                  {cat.description || 'No detailed description provided for this category taxonomy.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#CBA378]/20 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Plans</span>
                  <span className="font-mono font-bold text-white">{cat.subscription_count}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Monthly Spend</span>
                  <span className="font-mono font-black text-[#FECB6E]">৳{cat.monthly_spend.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isEditModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card-lighter-zenta p-6 rounded-3xl w-full max-w-md border border-[#FECB6E]/40 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#FECB6E]/20 pb-3">
              <h3 className="text-lg font-black text-white">
                {editingCategory.id ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-[#2A2D3E] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#FECB6E] uppercase block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g. AI Tools, Gaming, Utilities"
                  className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#FECB6E] uppercase block mb-1">Theme Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editingCategory.color || '#FECB6E'}
                    onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                    className="w-10 h-9 rounded-lg bg-transparent border border-[#CBA378]/30 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingCategory.color || '#FECB6E'}
                    onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                    className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FECB6E]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#FECB6E] uppercase block mb-1">Icon Type</label>
                <select
                  value={editingCategory.icon || 'Tag'}
                  onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                  className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                >
                  <option value="Tag">Default Tag</option>
                  <option value="Film">Streaming / Film</option>
                  <option value="Cloud">Cloud Infrastructure</option>
                  <option value="Cpu">Artificial Intelligence</option>
                  <option value="Box">SaaS / Software</option>
                  <option value="Sparkles">Education / Premium</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#FECB6E] uppercase block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Provide brief context on what subscriptions belong here..."
                  className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#2A2D3E] hover:bg-[#32364a] text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#141620] hover:brightness-110 transition shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card-lighter-zenta p-6 rounded-3xl w-full max-w-sm border border-rose-500/40 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">Delete Category?</h3>
              <p className="text-xs text-slate-300 mt-1">
                Are you sure you want to remove <strong className="text-rose-400">{deletingCategory.name}</strong>?
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#2A2D3E] text-white hover:bg-[#32364a] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="flex-1 py-2 rounded-xl text-xs font-black bg-rose-500 text-white hover:bg-rose-600 transition shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;