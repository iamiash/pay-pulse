import client from './client';
import { Subscription } from '../types';

const getSubscriptions = async (params?: any): Promise<{ data: Subscription[] }> => {
  return client.get<Subscription[]>('/subscriptions', { params });
};

const getSubscription = async (id: number): Promise<{ data: Subscription }> => {
  const res = await client.get<Subscription[]>('/subscriptions');
  const found = res.data.find((s) => s.id === id);
  if (found) {
    return { data: found };
  }
  return client.get<Subscription>(`/subscriptions/${id}`);
};

const createSubscription = async (data: Partial<Subscription>): Promise<{ data: Subscription }> => {
  return client.post<Subscription>('/subscriptions', data);
};

const updateSubscription = async (id: number, data: Partial<Subscription>): Promise<{ data: Subscription }> => {
  return client.put<Subscription>(`/subscriptions/${id}`, data);
};

const deleteSubscription = async (id: number): Promise<{ success: boolean; message?: string }> => {
  return client.delete(`/subscriptions/${id}`);
};

const search = async (query: string): Promise<{ data: Subscription[] }> => {
  return client.get<Subscription[]>('/subscriptions/search', { params: { q: query } });
};

const getAnalyticsSummary = async (): Promise<{ data: any }> => {
  return client.get('/reports/analytics');
};

const getReports = async (): Promise<{ data: any }> => {
  return client.get('/reports');
};

export const subscriptionApi = {
  getSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  list: getSubscriptions,
  getAll: getSubscriptions,
  create: createSubscription,
  update: updateSubscription,
  delete: deleteSubscription,
  search,
  getAnalyticsSummary,
  getReports,
};

export default subscriptionApi;