import client from './client';
import { 
  AdminDashboardMetrics, 
  AdminDashboardCharts, 
  AdminUserDetailResponse, 
  AdminGlobalSubscriptionItem,
  AdminSubscriptionFilterParams,
  AdminSecurityMetrics
} from '../types';

export const adminApi = {
  getMetrics: async () => {
    return client.get<AdminDashboardMetrics>('/admin/dashboard/metrics');
  },
  getSecurityMetrics: async () => {
    return client.get<AdminSecurityMetrics>('/admin/security/metrics');
  },
  getCharts: async () => {
    return client.get<AdminDashboardCharts>('/admin/dashboard/charts');
  },
  getUsers: async (params?: { search?: string; status?: string; page?: number }) => {
    return client.get('/admin/users', { params });
  },
  updateUserStatus: async (userId: number, status: string, reason?: string) => {
    return client.patch(`/admin/users/${userId}/status`, { status, reason: reason || '' });
  },
  getUserDetails: async (userId: number) => {
    return client.get<AdminUserDetailResponse>(`/admin/users/${userId}/details`);
  },
  getSubscriptions: async (params?: AdminSubscriptionFilterParams | Record<string, any>) => {
    return client.get<AdminGlobalSubscriptionItem[]>('/admin/subscriptions', { params });
  },
  getWallet: async () => {
    return client.get('/admin/wallet');
  },
  getSecurityEvents: async () => {
    return client.get('/admin/security');
  },
  getAuditLogs: async () => {
    return client.get('/admin/audit-logs');
  },
  getSettings: async () => {
    return client.get('/admin/settings');
  },
  updateSettings: async (payload: any) => {
    return client.post('/admin/settings', payload);
  },
  getCategories: async () => {
    return client.get('/admin/categories');
  },
  createCategory: async (data: { name: string; description?: string; color?: string; icon?: string }) => {
    return client.post('/admin/categories', data);
  },
  updateCategory: async (id: number, data: { name?: string; description?: string; color?: string; icon?: string }) => {
    return client.put(`/admin/categories/${id}`, data);
  },
  deleteCategory: async (id: number) => {
    return client.delete(`/admin/categories/${id}`);
  }
};

export default adminApi;