import { IObserver } from './IObserver';
import NotificationFactory, { NotificationType } from '../factory/NotificationFactory';
import Logger from '../singleton/Logger';

export class MechanicNotificationObserver implements IObserver {
  private notificationSaver: (notification: any) => Promise<void>;

  constructor(notificationSaver: (notification: any) => Promise<void>) {
    this.notificationSaver = notificationSaver;
  }

  async update(event: string, data: any): Promise<void> {
    Logger.getInstance().debug(`MechanicNotificationObserver received: ${event}`);

    if (event === 'JOB_ASSIGNED') {
      const notification = NotificationFactory.create(
        NotificationType.JOB_ASSIGNED,
        data.mechanicId,
        {
          jobId: data.jobId,
          vehicleNumber: data.vehicleNumber,
          problemDescription: data.problemDescription
        }
      );
      await this.notificationSaver(notification);
    }
  }
}
