import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NotificationItem, NotificationCategory } from '../types';
import { notificationApi } from '../api/notificationApi';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  refreshNotifications: (category?: string) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  selectedCategory: 'All',
  setSelectedCategory: () => {},
  refreshNotifications: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const refreshNotifications = useCallback((cat?: string) => {
    const categoryToFetch = cat !== undefined ? cat : selectedCategory;
    notificationApi.getNotifications(categoryToFetch === 'All' ? undefined : categoryToFetch)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Notification Sync Error", err));
  }, [selectedCategory]);

  const markAsRead = (id: number) => {
    notificationApi.markRead(id)
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
      })
      .catch((err) => console.error("Error marking notification read", err));
  };

  const markAllAsRead = () => {
    notificationApi.markAllAsRead()
      .then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      })
      .catch((err) => console.error("Error marking all read", err));
  };

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(() => {
      refreshNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      selectedCategory, 
      setSelectedCategory, 
      refreshNotifications, 
      markAsRead, 
      markAllAsRead 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);