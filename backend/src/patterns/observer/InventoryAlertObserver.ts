import { IObserver } from './IObserver';
import NotificationFactory, { NotificationType } from '../factory/NotificationFactory';
import Logger from '../singleton/Logger';

export class InventoryAlertObserver implements IObserver {
  private notificationSaver: (notification: any) => Promise<void>;

  constructor(notificationSaver: (notification: any) => Promise<void>) {
    this.notificationSaver = notificationSaver;
  }

  async update(event: string, data: any): Promise<void> {
    Logger.getInstance().debug(`InventoryAlertObserver received: ${event}`);

    if (event === 'LOW_STOCK_DETECTED') {
      const notification = NotificationFactory.create(
        NotificationType.LOW_INVENTORY_ALERT,
        data.adminId,
        {
          partName: data.partName,
          quantity: data.currentQuantity,
          threshold: data.threshold
        }
      );
      await this.notificationSaver(notification);
    }
  }
}
