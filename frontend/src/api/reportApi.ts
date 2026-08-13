import axios from './client';
import { AnalyticsResponse, PdfReportFilterPayload } from '../types';

export const reportApi = {
  getAnalytics: (period: string = 'This Month', startDate?: string, endDate?: string) =>
    axios.get<AnalyticsResponse>('/reports/analytics', {
      params: { period, start_date: startDate, end_date: endDate }
    }),

  downloadPdf: (filters: PdfReportFilterPayload) =>
    axios.post('/reports/export', filters, {
      responseType: 'blob'
    })
};