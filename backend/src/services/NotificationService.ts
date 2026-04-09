import { INotificationService } from '../interfaces/INotificationService';
import { INotificationRepository } from '../interfaces/INotificationRepository';
import { INotification } from '../models/Notification';
import { NotFoundError } from '../utils/AppError';
import Logger from '../patterns/singleton/Logger';

export class NotificationService implements INotificationService {
  private notificationRepository: INotificationRepository;

  constructor(notificationRepository: INotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async save(notification: any): Promise<INotification> {
    const saved = await this.notificationRepository.create(notification);
    Logger.getInstance().debug(`Notification saved for user ${notification.userId}`);
    return saved;
  }

  async getUserNotifications(userId: string): Promise<INotification[]> {
    return await this.notificationRepository.findByUser(userId);
  }

  async getUnreadNotifications(userId: string): Promise<INotification[]> {
    return await this.notificationRepository.findUnreadByUser(userId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepository.countUnread(userId);
  }

  async markAsRead(id: string): Promise<INotification> {
    const notification = await this.notificationRepository.markAsRead(id);
    if (!notification) {
      throw new NotFoundError('Notification');
    }
    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
    Logger.getInstance().info(`All notifications marked as read for user ${userId}`);
  }

  async deleteNotification(id: string): Promise<void> {
    const deleted = await this.notificationRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Notification');
    }
  }
}
