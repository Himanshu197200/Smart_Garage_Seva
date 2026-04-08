import { INotification, NotificationModel } from '../models/Notification';
import { INotificationRepository } from '../interfaces/INotificationRepository';
import Logger from '../patterns/singleton/Logger';

export class NotificationRepository implements INotificationRepository {
  async findById(id: string): Promise<INotification | null> {
    try {
      return await NotificationModel.findById(id).exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding notification: ${error}`);
      throw error;
    }
  }

  async findByUser(userId: string): Promise<INotification[]> {
    try {
      return await NotificationModel.find({ userId }).sort({ createdAt: -1 }).exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding notifications by user: ${error}`);
      throw error;
    }
  }

  async findUnreadByUser(userId: string): Promise<INotification[]> {
    try {
      return await NotificationModel.find({ userId, isRead: false }).sort({ createdAt: -1 }).exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding unread notifications: ${error}`);
      throw error;
    }
  }

  async countUnread(userId: string): Promise<number> {
    try {
      return await NotificationModel.countDocuments({ userId, isRead: false }).exec();
    } catch (error) {
      Logger.getInstance().error(`Error counting unread notifications: ${error}`);
      throw error;
    }
  }

  async create(data: any): Promise<INotification> {
    try {
      const notification = new NotificationModel(data);
      return await notification.save();
    } catch (error) {
      Logger.getInstance().error(`Error creating notification: ${error}`);
      throw error;
    }
  }

  async markAsRead(id: string): Promise<INotification | null> {
    try {
      return await NotificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true }).exec();
    } catch (error) {
      Logger.getInstance().error(`Error marking notification as read: ${error}`);
      throw error;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await NotificationModel.updateMany({ userId, isRead: false }, { isRead: true }).exec();
    } catch (error) {
      Logger.getInstance().error(`Error marking all notifications as read: ${error}`);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await NotificationModel.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      Logger.getInstance().error(`Error deleting notification: ${error}`);
      throw error;
    }
  }
}
