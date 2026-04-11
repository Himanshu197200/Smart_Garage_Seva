import { Request, Response } from 'express';
import { INotificationService } from '../interfaces/INotificationService';
import { asyncHandler } from '../utils/asyncHandler';

export class NotificationController {
  private notificationService: INotificationService;

  constructor(notificationService: INotificationService) {
    this.notificationService = notificationService;
  }

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const notifications = await this.notificationService.getUserNotifications(req.user!._id.toString());
    res.status(200).json({ success: true, data: notifications });
  });

  getUnread = asyncHandler(async (req: Request, res: Response) => {
    const notifications = await this.notificationService.getUnreadNotifications(req.user!._id.toString());
    res.status(200).json({ success: true, data: notifications });
  });

  getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
    const count = await this.notificationService.getUnreadCount(req.user!._id.toString());
    res.status(200).json({ success: true, data: { count } });
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const notification = await this.notificationService.markAsRead(req.params.id);
    res.status(200).json({ success: true, data: notification });
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    await this.notificationService.markAllAsRead(req.user!._id.toString());
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.notificationService.deleteNotification(req.params.id);
    res.status(200).json({ success: true, message: 'Notification deleted' });
  });
}
