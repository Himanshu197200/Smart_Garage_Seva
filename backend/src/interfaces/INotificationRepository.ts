import { INotification } from '../models/Notification';

export interface INotificationRepository {
  findById(id: string): Promise<INotification | null>;
  findByUser(userId: string): Promise<INotification[]>;
  findUnreadByUser(userId: string): Promise<INotification[]>;
  countUnread(userId: string): Promise<number>;
  create(data: any): Promise<INotification>;
  markAsRead(id: string): Promise<INotification | null>;
  markAllAsRead(userId: string): Promise<void>;
  delete(id: string): Promise<boolean>;
}
