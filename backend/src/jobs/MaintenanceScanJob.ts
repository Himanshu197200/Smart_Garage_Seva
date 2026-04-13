import cron from 'node-cron';
import { MaintenanceService } from '../services/MaintenanceService';
import { VehicleRepository } from '../repositories/VehicleRepository';
import { ServiceJobRepository } from '../repositories/ServiceJobRepository';
import { NotificationService } from '../services/NotificationService';
import { NotificationRepository } from '../repositories/NotificationRepository';
import NotificationFactory, { NotificationType } from '../patterns/factory/NotificationFactory';
import Logger from '../patterns/singleton/Logger';
import ConfigManager from '../patterns/singleton/ConfigManager';

export class MaintenanceScanJob {
  private maintenanceService: MaintenanceService;
  private vehicleRepository: VehicleRepository;
  private serviceJobRepository: ServiceJobRepository;
  private notificationService: NotificationService;

  constructor() {
    this.maintenanceService = new MaintenanceService();
    this.vehicleRepository = new VehicleRepository();
    this.serviceJobRepository = new ServiceJobRepository();
    this.notificationService = new NotificationService(new NotificationRepository());
  }

  public start(): void {
    const cronExpression = ConfigManager.getInstance().get('maintenanceScanTime');
    Logger.getInstance().info(`Scheduling maintenance scan job: ${cronExpression}`);

    cron.schedule(cronExpression, async () => {
      await this.runScan();
    });
  }

  public async runScan(): Promise<void> {
    Logger.getInstance().info('Starting daily maintenance scan');
    const startTime = Date.now();

    try {
      const vehicles = await this.vehicleRepository.findAll();
      Logger.getInstance().info(`Found ${vehicles.length} vehicles to scan`);

      let total = 0;

      for (const vehicle of vehicles) {
        try {
          const history = await this.serviceJobRepository.findByVehicle(vehicle._id.toString());
          const recs = await this.maintenanceService.generateRecommendations(vehicle, history);

          for (const rec of recs) {
            const notification = NotificationFactory.create(
              NotificationType.RECOMMENDATION_ALERT,
              vehicle.ownerId.toString(),
              {
                vehicleNumber: vehicle.registrationNumber,
                recommendation: rec.message,
                priority: rec.priority
              }
            );
            await this.notificationService.save(notification);
            total++;
          }
        } catch (error) {
          Logger.getInstance().error(`Error scanning vehicle ${vehicle.registrationNumber}: ${error}`);
        }
      }

      const duration = Date.now() - startTime;
      Logger.getInstance().info(`Maintenance scan done in ${duration}ms. ${total} recommendations generated.`);
    } catch (error) {
      Logger.getInstance().error(`Maintenance scan failed: ${error}`);
    }
  }
}
