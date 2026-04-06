import { INotification } from '../models/Notification';

export interface INotificationService {
  save(notification: any): Promise<INotification>;
  getUserNotifications(userId: string): Promise<INotification[]>;
  getUnreadNotifications(userId: string): Promise<INotification[]>;
  getUnreadCount(userId: string): Promise<number>;
  markAsRead(id: string): Promise<INotification>;
  markAllAsRead(userId: string): Promise<void>;
  deleteNotification(id: string): Promise<void>;
}
