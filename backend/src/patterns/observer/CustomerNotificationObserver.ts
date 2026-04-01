import { IObserver } from './IObserver';
import NotificationFactory, { NotificationType } from '../factory/NotificationFactory';
import Logger from '../singleton/Logger';

export class CustomerNotificationObserver implements IObserver {
  private notificationSaver: (notification: any) => Promise<void>;

  constructor(notificationSaver: (notification: any) => Promise<void>) {
    this.notificationSaver = notificationSaver;
  }

  async update(event: string, data: any): Promise<void> {
    Logger.getInstance().debug(`CustomerNotificationObserver received: ${event}`);

    switch (event) {
      case 'JOB_STATUS_CHANGED':
        await this.handleStatusChange(data);
        break;
      case 'JOB_COMPLETED':
        await this.handleCompleted(data);
        break;
      default:
        break;
    }
  }

  private async handleStatusChange(data: any): Promise<void> {
    const notification = NotificationFactory.create(
      NotificationType.JOB_STATUS_UPDATE,
      data.customerId,
      { jobId: data.jobId, status: data.newStatus, additionalInfo: data.message }
    );
    await this.notificationSaver(notification);
  }

  private async handleCompleted(data: any): Promise<void> {
    const notification = NotificationFactory.create(
      NotificationType.JOB_STATUS_UPDATE,
      data.customerId,
      { jobId: data.jobId, status: 'COMPLETED', additionalInfo: 'Your vehicle is ready for pickup!' }
    );
    await this.notificationSaver(notification);
  }
}
