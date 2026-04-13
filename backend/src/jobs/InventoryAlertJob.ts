import cron from 'node-cron';
import { InventoryRepository } from '../repositories/InventoryRepository';
import { UserRepository } from '../repositories/UserRepository';
import { NotificationService } from '../services/NotificationService';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { JobStatusSubject } from '../patterns/observer/JobStatusSubject';
import NotificationFactory, { NotificationType } from '../patterns/factory/NotificationFactory';
import { UserRole } from '../models/User';
import Logger from '../patterns/singleton/Logger';

export class InventoryAlertJob {
  private inventoryRepository: InventoryRepository;
  private userRepository: UserRepository;
  private notificationService: NotificationService;

  constructor() {
    this.inventoryRepository = new InventoryRepository();
    this.userRepository = new UserRepository();
    this.notificationService = new NotificationService(new NotificationRepository());
  }

  public start(): void {
    cron.schedule('0 */4 * * *', async () => {
      await this.checkLowStock();
    });
    Logger.getInstance().info('Inventory alert job scheduled every 4 hours');
  }

  public async checkLowStock(): Promise<void> {
    Logger.getInstance().info('Checking for low stock items');

    try {
      const lowStockItems = await this.inventoryRepository.findLowStock();

      if (lowStockItems.length === 0) {
        Logger.getInstance().info('No low stock items found');
        return;
      }

      Logger.getInstance().info(`Found ${lowStockItems.length} low stock items`);

      const itemsByGarage = new Map<string, typeof lowStockItems>();
      for (const item of lowStockItems) {
        const garageId = item.garageId.toString();
        if (!itemsByGarage.has(garageId)) {
          itemsByGarage.set(garageId, []);
        }
        itemsByGarage.get(garageId)!.push(item);
      }

      for (const [garageId, items] of itemsByGarage) {
        const admins = await this.userRepository.findByGarageAndRole(garageId, UserRole.ADMIN);

        for (const admin of admins) {
          for (const item of items) {
            const notification = NotificationFactory.create(
              NotificationType.LOW_INVENTORY_ALERT,
              admin._id.toString(),
              {
                partName: item.partName,
                quantity: item.quantity,
                threshold: item.lowStockThreshold
              }
            );
            await this.notificationService.save(notification);

            await JobStatusSubject.getInstance().notify('LOW_STOCK_DETECTED', {
              adminId: admin._id.toString(),
              partName: item.partName,
              currentQuantity: item.quantity,
              threshold: item.lowStockThreshold
            });
          }
        }
      }

      Logger.getInstance().info('Low stock notifications sent');
    } catch (error) {
      Logger.getInstance().error(`Inventory alert job failed: ${error}`);
    }
  }
}
