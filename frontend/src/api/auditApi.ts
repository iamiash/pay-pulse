import client from './client';
import { AdminAuditLogItem } from '../types';

export interface AuditLogQueryParams {
  user_id?: string;
  actor_email?: string;
  action?: string;
  resource_type?: string;
  ip_address?: string;
  date_range?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const auditApi = {
  getAuditLogs: async (params?: AuditLogQueryParams) => {
    return client.get<AdminAuditLogItem[]>('/admin/audit-logs', { params });
  },
  exportAuditLogsPdf: async (params?: AuditLogQueryParams) => {
    return client.get('/admin/audit-logs/export-pdf', { 
      params, 
      responseType: 'blob' 
    });
  }
};

export default auditApi;