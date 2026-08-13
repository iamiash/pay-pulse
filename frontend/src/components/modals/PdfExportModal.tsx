import React, { useState } from 'react';
import { reportApi } from '../../api/reportApi';
import { useToast } from '../../context/ToastContext';
import { X, Download, FileText } from 'lucide-react';

export const PdfExportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('This Month');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      showToast('Preparing PDF Report...', 'info');

      const response = await reportApi.downloadPdf({
        report_type: reportType,
        date_range: dateRange,
        category: category !== 'All' ? category : undefined,
        status: status !== 'All' ? status : undefined
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PayPulse_Report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast('PDF Report downloaded successfully!', 'success');
      onClose();
    } catch (err) {
      showToast('Failed to generate PDF report', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card-lighter-zenta border border-[#CBA378]/40 rounded-3xl p-6 w-full max-w-md relative text-white space-y-4">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1 rounded-lg text-[#B8B8AC] hover:text-white"
        >
          <X className="w-5 h-5"/>
        </button>

        <div className="flex items-center gap-2 border-b border-[#CBA378]/20 pb-3">
          <FileText className="w-5 h-5 text-[#FECB6E]" />
          <h3 className="text-lg font-black text-white">Export Financial PDF</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-[10px] font-bold text-[#B8B8AC] uppercase block mb-1">Report Format</label>
            <select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)} 
              className="w-full bg-[#10141D] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
            >
              <option value="summary">1. Full Complete Summary PDF</option>
              <option value="monthly">2. Monthly Spending Audit PDF</option>
              <option value="filtered">3. Custom Filtered PDF</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#B8B8AC] uppercase block mb-1">Date Range</label>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)} 
              className="w-full bg-[#10141D] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
            >
              <option value="This Month">This Month</option>
              <option value="Last 3 Months">Last 3 Months</option>
              <option value="This Year">This Year</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-[#B8B8AC] uppercase block mb-1">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full bg-[#10141D] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
              >
                <option value="All">All</option>
                <option value="AI Tools">AI Tools</option>
                <option value="Cloud">Cloud</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#B8B8AC] uppercase block mb-1">Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
                className="w-full bg-[#10141D] border border-[#CBA378]/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FECB6E]"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="w-full py-3 rounded-xl btn-modern-left-3d text-xs font-black shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            <Download className="w-4 h-4 text-[#38BDF8]" /> Download PDF Report
          </button>
        </div>

      </div>
    </div>
  );
};