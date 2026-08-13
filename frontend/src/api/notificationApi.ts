import axios from 'axios';

declare var process: { env: { [key: string]: string | undefined } };

const API_URL = (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL)
  ? process.env.REACT_APP_API_URL
  : 'http://localhost:8000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const notificationApi = {
  getNotifications: (category?: string) => {
    const params = category && category !== 'All' ? { category } : {};
    return axios.get(`${API_URL}/notifications`, { ...getAuthHeaders(), params });
  },
  markRead: (id: number) =>
    axios.patch(`${API_URL}/notifications/${id}/read`, {}, getAuthHeaders()),
  markAllAsRead: () =>
    axios.post(`${API_URL}/notifications/mark-all-read`, {}, getAuthHeaders()),
};