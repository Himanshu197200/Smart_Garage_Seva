import Logger from '../singleton/Logger';
import { AppError } from '../../utils/AppError';

export enum NotificationType {
  SERVICE_REMINDER = 'SERVICE_REMINDER',
  JOB_STATUS_UPDATE = 'JOB_STATUS_UPDATE',
  LOW_INVENTORY_ALERT = 'LOW_INVENTORY_ALERT',
  RECOMMENDATION_ALERT = 'RECOMMENDATION_ALERT',
  JOB_ASSIGNED = 'JOB_ASSIGNED',
  PAYMENT_REMINDER = 'PAYMENT_REMINDER'
}

export interface NotificationData {
  [key: string]: any;
}

export interface PartialNotification {
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

class NotificationFactory {
  public static create(
    type: NotificationType,
    userId: string,
    data: NotificationData
  ): PartialNotification {
    Logger.getInstance().debug(`Creating notification of type: ${type}`);

    const base = {
      userId,
      type,
      isRead: false,
      createdAt: new Date()
    };

    switch (type) {
      case NotificationType.SERVICE_REMINDER:
        return {
          ...base,
          message: `Service reminder for vehicle ${data.vehicleNumber}. ${data.reminderMessage || 'Scheduled maintenance is due.'}`
        };

      case NotificationType.JOB_STATUS_UPDATE:
        return {
          ...base,
          message: `Your service job #${data.jobId} status updated to ${data.status}. ${data.additionalInfo || ''}`
        };

      case NotificationType.LOW_INVENTORY_ALERT:
        return {
          ...base,
          message: `Low stock alert: ${data.partName} has only ${data.quantity} units remaining. Threshold: ${data.threshold}`
        };

      case NotificationType.RECOMMENDATION_ALERT:
        return {
          ...base,
          message: `Maintenance recommendation for ${data.vehicleNumber}: ${data.recommendation}. Priority: ${data.priority}`
        };

      case NotificationType.JOB_ASSIGNED:
        return {
          ...base,
          message: `New job #${data.jobId} assigned to you. Vehicle: ${data.vehicleNumber}. Issue: ${data.problemDescription}`
        };

      case NotificationType.PAYMENT_REMINDER:
        return {
          ...base,
          message: `Payment reminder for job #${data.jobId}. Amount due: Rs.${data.amount}`
        };

      default:
        Logger.getInstance().error(`Unknown notification type: ${type}`);
        throw new AppError(`Unknown notification type: ${type}`, 400);
    }
  }

  public static createBatch(
    type: NotificationType,
    userIds: string[],
    data: NotificationData
  ): PartialNotification[] {
    return userIds.map(userId => this.create(type, userId, data));
  }
}

export default NotificationFactory;
