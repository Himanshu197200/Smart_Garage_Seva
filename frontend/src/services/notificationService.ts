import api from './api';
import { ApiResponse, Notification } from '../types';

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const res = await api.get<ApiResponse<Notification[]>>('/notifications');
    return res.data.data || [];
  },

  getUnread: async (): Promise<Notification[]> => {
    const res = await api.get<ApiResponse<Notification[]>>('/notifications/unread');
    return res.data.data || [];
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
    return res.data.data?.count || 0;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  }
};
