import { api } from './client';
import { WalletBank, WalletCard, WalletMobile } from '../types';

export const walletApi = {
  // Bank Accounts
  getBanks: async () => {
    const response = await api.get<WalletBank[]>('/wallet/banks');
    return response;
  },
  addBank: async (data: { bank_name: string; account_number: string; branch_name: string; routing_number: string }) => {
    const response = await api.post<WalletBank>('/wallet/banks', data);
    return response;
  },
  updateBank: async (id: number, data: Partial<WalletBank>) => {
    const response = await api.put<WalletBank>(`/wallet/banks/${id}`, data);
    return response;
  },
  deleteBank: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/wallet/banks/${id}`);
    return response;
  },

  // Payment Cards
  getCards: async () => {
    const response = await api.get<WalletCard[]>('/wallet/cards');
    return response;
  },
  addCard: async (data: { card_title: string; card_type: string; card_category: string; card_number: string; cvc: string; expiry_date: string }) => {
    const response = await api.post<WalletCard>('/wallet/cards', data);
    return response;
  },
  updateCard: async (id: number, data: Partial<WalletCard>) => {
    const response = await api.put<WalletCard>(`/wallet/cards/${id}`, data);
    return response;
  },
  deleteCard: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/wallet/cards/${id}`);
    return response;
  },

  // Mobile Banking
  getMobile: async () => {
    const response = await api.get<WalletMobile[]>('/wallet/mobile');
    return response;
  },
  addMobile: async (data: { provider: string; mobile_number: string }) => {
    const response = await api.post<WalletMobile>('/wallet/mobile', data);
    return response;
  },
  updateMobile: async (id: number, data: Partial<WalletMobile>) => {
    const response = await api.put<WalletMobile>(`/wallet/mobile/${id}`, data);
    return response;
  },
  deleteMobile: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/wallet/mobile/${id}`);
    return response;
  }
};

export default walletApi;