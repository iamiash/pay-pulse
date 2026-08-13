import React, { useState, useEffect } from 'react';
import { reportApi } from '../api/reportApi';
import { subscriptionApi } from '../api/subscriptionApi';
import { useToast } from '../context/ToastContext';
import { Subscription } from '../types';
import { 
  FileText, Download, Filter, Trash2, Calendar, 
  CreditCard, PieChart, CheckCircle2, ShieldCheck 
} from 'lucide-react';

interface ReportHistoryItem {
  id: string;
  title: string;
  period: string;
  generatedDate: string;
  format: string;
}

export const Reports: React.FC = () => {
  const { showToast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>('Subscription Summary');

  // 42. REPORT FILTERS
  const [dateRange, setDateRange] = useState<string>('This Month');
  const [selectedSubscription, setSelectedSubscription] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentSourceFilter, setPaymentSourceFilter] = useState<string>('All');
  const [currencyFilter, setCurrencyFilter] = useState<string>('BDT');

  // Report History Archive State
  const [reportHistory, setReportHistory] = useState<ReportHistoryItem[]>([
    { id: '1', title: 'Subscription Summary', period: 'Aug 2026', generatedDate: 'Aug 12, 2026', format: 'PDF' },
    { id: '2', title: 'Monthly Spending', period: 'July 2026', generatedDate: 'Aug 01, 2026', format: 'PDF' },
  ]);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const res = await subscriptionApi.list();
      setSubscriptions(res.data);
    } catch (err) {
      console.error('Failed to load subscriptions', err);
    }
  };

  // 43. PDF Output & Backend Trigger
  const handleGeneratePdf = async () => {
    try {
      showToast('Generating PDF Report...', 'info');

      const response = await reportApi.downloadPdf({
        report_type: selectedCard.toLowerCase().replace(/\s+/g, '_'),
        date_range: dateRange,
        subscription_id: selectedSubscription !== 'All' ? parseInt(selectedSubscription) : undefined,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        payment_source: paymentSourceFilter !== 'All' ? paymentSourceFilter : undefined,
        currency: currencyFilter
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PayPulse_Report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Add generated item to History
      const newHistoryItem: ReportHistoryItem = {
        id: Date.now().toString(),
        title: selectedCard,
        period: dateRange,
        generatedDate: 'Aug 12, 2026',
        format: 'PDF'
      };
      setReportHistory([newHistoryItem, ...reportHistory]);

      showToast('PayPulse_Report.pdf generated successfully!', 'success');
    } catch (err) {
      showToast('Failed to generate PDF report', 'error');
    }
  };

  const handleDeleteHistory = (id: string) => {
    setReportHistory(reportHistory.filter((h) => h.id !== id));
    showToast('Report deleted from history archive', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#EFE6D6] page-transition pb-12">
      
      {/* Header */}
      <div className="border-b border-[#CBA378]/20 pb-4">
        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FECB6E] to-[#E0A32E] tracking-tight">
          Financial Document & PDF Generation Center
        </h2>
        <p className="text-xs font-bold text-[#B8B8AC] mt-0.5">Generate immutable audit reports and compliance documentation</p>
      </div>

      {/* 41. FOUR REPORT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'Subscription Summary', desc: 'Comprehensive active & inactive portfolio breakdown', icon: FileText },
          { name: 'Monthly Spending', desc: 'Detailed expenditure and billing cycle totals', icon: Calendar },
          { name: 'Subscription Details', desc: 'Deep itemized plan parameters and contact info', icon: CreditCard },
          { name: 'Custom Report', desc: 'Fully tailored multi-variable financial export', icon: PieChart },
        ].map((card) => {
          const IconComponent = card.icon;
          const isSelected = selectedCard === card.name;
          return (
            <div
              key={card.name}
              onClick={() => setSelectedCard(card.name)}
              className={`glass-card-lighter-zenta p-5 rounded-2xl cursor-pointer transition-all duration-200 space-y-2 border ${
                isSelected
                  ? 'border-[#FECB6E] bg-gradient-to-b from-[#1E2430] to-[#141620] shadow-lg scale-[1.02]'
                  : 'border-[#CBA378]/20 hover:border-[#CBA378]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <IconComponent className={`w-5 h-5 ${isSelected ? 'text-[#FECB6E]' : 'text-[#B8B8AC]'}`} />
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <h3 className="text-sm font-black text-white">{card.name}</h3>
              <p className="text-[10px] text-[#B8B8AC] leading-relaxed">{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 42. REPORT FILTERS FORM */}
      <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-5 bg-gradient-to-b from-[#2A2D3E] to-[#1A1D27]">
        <div className="flex items-center justify-between border-b border-[#CBA378]/20 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#FECB6E]" />
            <h3 className="text-base font-black text-white">Report Parameters: {selectedCard}</h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> PCI Safe — No Secret Tokens Included
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Date Range */}
          <div>
            <label className="text-[10px] font-black text-[#B8B8AC] uppercase block mb-1.5">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#FECB6E]"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Year">This Year</option>
              <option value="Last Year">Last Year</option>
            </select>
          </div>

          {/* Specific Subscription */}
          <div>
            <label className="text-[10px] font-black text-[#B8B8AC] uppercase block mb-1.5">Subscription</label>
            <select
              value={selectedSubscription}
              onChange={(e) => setSelectedSubscription(e.target.value)}
              className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#FECB6E]"
            >
              <option value="All">All Subscriptions</option>
              {subscriptions.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-[10px] font-black text-[#B8B8AC] uppercase block mb-1.5">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#FECB6E]"
            >
              <option value="All">All Categories</option>
              <option value="AI Tools">AI Tools</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Cloud">Cloud</option>
              <option value="Productivity">Productivity</option>
              <option value="Software">Software</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[10px] font-black text-[#B8B8AC] uppercase block mb-1.5">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#FECB6E]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Paused">Paused Only</option>
              <option value="Cancelled">Cancelled Only</option>
            </select>
          </div>

          {/* Payment Source */}
          <div>
            <label className="text-[10px] font-black text-[#B8B8AC] uppercase block mb-1.5">Payment Source</label>
            <select
              value={paymentSourceFilter}
              onChange={(e) => setPaymentSourceFilter(e.target.value)}
              className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#FECB6E]"
            >
              <option value="All">All Payment Channels</option>
              <option value="Card">Card</option>
              <option value="Bank">Bank</option>
              <option value="Mobile Banking">Mobile Banking</option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label className="text-[10px] font-black text-[#B8B8AC] uppercase block mb-1.5">Currency</label>
            <select
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value)}
              className="w-full bg-[#141620] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#FECB6E]"
            >
              <option value="BDT">BDT (৳)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-[#CBA378]/20 flex justify-end">
          <button
            onClick={handleGeneratePdf}
            className="px-6 py-2.5 rounded-xl btn-modern-left-3d text-xs font-black flex items-center gap-2 shadow-lg"
          >
            <Download className="w-4 h-4 text-[#38BDF8]" /> Generate PDF
          </button>
        </div>
      </div>

      {/* Report History */}
      <div className="glass-card-lighter-zenta p-6 rounded-3xl border border-[#CBA378]/30 space-y-4">
        <div className="border-b border-[#CBA378]/20 pb-3">
          <h3 className="text-base font-black text-white">Report Generation History</h3>
          <p className="text-xs text-[#B8B8AC]">Previously requested PDF documents</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#CBA378]/20 bg-[#141620]">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-[#1A1D27] text-[10px] uppercase font-black text-[#FECB6E] border-b border-[#CBA378]/20">
              <tr>
                <th className="px-5 py-3">Report Name</th>
                <th className="px-5 py-3">Period</th>
                <th className="px-5 py-3">Generated Date</th>
                <th className="px-5 py-3">Format</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBA378]/10 font-semibold">
              {reportHistory.map((item) => (
                <tr key={item.id} className="hover:bg-[#1A1D27]/80 transition">
                  <td className="px-5 py-3.5 font-bold text-white">{item.title}</td>
                  <td className="px-5 py-3.5 text-[#FECB6E] font-mono">{item.period}</td>
                  <td className="px-5 py-3.5 text-slate-300">{item.generatedDate}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      {item.format}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={handleGeneratePdf}
                      className="px-2.5 py-1 rounded-lg bg-[#1A1D27] hover:bg-[#252A38] text-xs font-bold text-[#FECB6E] border border-[#CBA378]/30 transition inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Download
                    </button>
                    <button
                      onClick={() => handleDeleteHistory(item.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#1A1D27] hover:bg-rose-950/40 text-xs font-bold text-rose-400 border border-rose-500/30 transition inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};