import React, { useState, useEffect } from 'react';
import { subscriptionApi } from '../api/subscriptionApi';
import { Subscription } from '../types';
import { formatCurrency } from '../utils/formatters';
import { SubscriptionDetailModal } from '../components/subscriptions/SubscriptionDetailModal';
import { 
  FolderKanban, Plus, Layers, DollarSign, PieChart, 
  ChevronRight, X, ExternalLink, CheckCircle2, AlertCircle 
} from 'lucide-react';

export const Categories: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Category Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('#FECB6E');

  // Drill-down Category Detail State
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedSubForDetail, setSelectedSubForDetail] = useState<Subscription | null>(null);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const res = await subscriptionApi.getAll();
      setSubscriptions(res.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  // Group subscriptions by category
  const categoriesMap: { [cat: string]: Subscription[] } = {};
  subscriptions.forEach((sub) => {
    const cat = sub.category || 'Uncategorized';
    if (!categoriesMap[cat]) categoriesMap[cat] = [];
    categoriesMap[cat].push(sub);
  });

  const totalMonthlySpend = subscriptions.reduce((sum, s) => sum + (s.cost || 0), 0) || 1.0;

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    // Local state addition or API trigger
    setShowAddModal(false);
    setNewCatName('');
    setNewCatDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#EFE6D6] page-transition pb-12">
      
      {/* Centered Headline */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#CBA378]/20 pb-4">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E] tracking-tight drop-shadow-md">
            Category Management
          </h2>
          <p className="text-xs font-bold text-[#FECB6E]">Dynamic categorization driving analytics and budget distribution</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl btn-modern-left-3d text-xs font-black flex items-center gap-1.5 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(categoriesMap).length === 0 ? (
          <div className="col-span-full p-12 text-center text-[#B8B8AC] text-xs font-bold glass-card-lighter-zenta rounded-3xl">
            No categories registered. Add subscriptions or create a custom category.
          </div>
        ) : (
          Object.entries(categoriesMap).map(([categoryName, list]) => {
            const monthlySpend = list.reduce((sum, s) => sum + s.cost, 0);
            const annualSpend = monthlySpend * 12;
            const percentageOfTotal = Math.round((monthlySpend / totalMonthlySpend) * 100);

            return (
              <div
                key={categoryName}
                onClick={() => setActiveCategory(categoryName)}
                className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 hover:border-[#FECB6E] hover:scale-[1.02] transition-all cursor-pointer space-y-4 group bg-gradient-to-br from-[#2A2D3E] via-[#222533] to-[#1A1D27]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-[#FECB6E]/20 text-[#FECB6E] border border-[#FECB6E]/40">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-[#FECB6E] transition">
                        {categoryName}
                      </h3>
                      <p className="text-[11px] text-[#B8B8AC] font-semibold">{list.length} subscriptions</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#B8B8AC] group-hover:text-[#FECB6E] group-hover:translate-x-1 transition" />
                </div>

                <div className="space-y-2 pt-2 border-t border-[#CBA378]/20 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#B8B8AC]">Monthly Spending:</span>
                    <span className="font-black text-[#FECB6E] text-sm">{formatCurrency(monthlySpend)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#B8B8AC]">Annual Spending:</span>
                    <span className="font-black text-emerald-400">{formatCurrency(annualSpend)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#B8B8AC]">Share of Total:</span>
                    <span className="font-bold text-cyan-300">{percentageOfTotal}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#171E25] rounded-full h-2 overflow-hidden border border-[#CBA378]/20">
                  <div 
                    className="bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(percentageOfTotal, 5)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Category Details Modal */}
      {activeCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="glass-card-lighter-zenta border border-[#CBA378]/40 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative text-white my-auto bg-gradient-to-b from-[#2A2D3E]/95 via-[#222533]/98 to-[#1A1D27]/98">
            <button onClick={() => setActiveCategory(null)} className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#171E25] text-[#B8B8AC] hover:text-white transition">
              <X className="w-4 h-4"/>
            </button>

            <div className="mb-5 border-b border-[#CBA378]/20 pb-3">
              <h3 className="text-xl font-black text-white">{activeCategory}</h3>
              <p className="text-xs font-bold text-[#FECB6E]">
                Total: {formatCurrency(categoriesMap[activeCategory]?.reduce((s, item) => s + item.cost, 0) || 0)}/month
              </p>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {categoriesMap[activeCategory]?.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubForDetail(sub)}
                  className="p-4 bg-[#171E25] hover:bg-[#222834] rounded-2xl border border-[#CBA378]/30 flex items-center justify-between cursor-pointer transition group"
                >
                  <div>
                    <h4 className="text-sm font-black text-white group-hover:text-[#FECB6E] flex items-center gap-1.5">
                      {sub.name} <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#FECB6E]" />
                    </h4>
                    <p className="text-[11px] text-[#B8B8AC] font-semibold">{sub.plan_type} • {sub.billing_cycle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-[#FECB6E]">{formatCurrency(sub.cost)}</p>
                    <p className="text-[10px] text-emerald-400 font-bold">Next: {sub.next_billing_date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="glass-card-lighter-zenta border border-[#CBA378]/40 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative text-white my-auto bg-gradient-to-b from-[#2A2D3E]/95 via-[#222533]/98 to-[#1A1D27]/98">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#171E25] text-[#B8B8AC] hover:text-white transition">
              <X className="w-4 h-4"/>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-gradient-to-r from-[#FFD89B] to-[#FECB6E] text-[#1A1D27] font-black shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">Add New Category</h3>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Developer Tools"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Optional description"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-[#B8B8AC] uppercase block mb-1">Theme Color</label>
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-full h-10 bg-[#141620] border border-[#CBA378]/30 rounded-xl px-2 py-1 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-2.5 rounded-xl btn-modern-left-3d text-xs font-black flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Detail Modal */}
      {selectedSubForDetail && (
        <SubscriptionDetailModal
          subscription={selectedSubForDetail}
          onClose={() => setSelectedSubForDetail(null)}
        />
      )}

    </div>
  );
};