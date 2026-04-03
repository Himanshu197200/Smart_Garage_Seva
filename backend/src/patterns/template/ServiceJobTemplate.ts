import { IServiceJob } from '../../models/ServiceJob';
import Logger from '../singleton/Logger';
import { AppError } from '../../utils/AppError';

export interface IInventoryConsumer {
  consumePart(garageId: string, partNumber: string, quantity: number): Promise<void>;
  getPartByNumber(garageId: string, partNumber: string): Promise<{ unitPrice: number } | null>;
}

export abstract class ServiceJobTemplate {
  protected inventoryService: IInventoryConsumer;

  constructor(inventoryService: IInventoryConsumer) {
    this.inventoryService = inventoryService;
  }

  public async processJob(job: IServiceJob): Promise<void> {
    Logger.getInstance().info(`Starting service job processing: ${job._id}`);
    await this.validateJob(job);
    await this.prepareWorkspace();
    await this.performService(job);
    await this.qualityCheck(job);
    await this.updateInventory(job);
    await this.calculateCost(job);
    await this.generateReport(job);
    await this.cleanup();
    Logger.getInstance().info(`Completed service job processing: ${job._id}`);
  }

  protected async validateJob(job: IServiceJob): Promise<void> {
    if (!job.vehicleId || !job.garageId) {
      throw new AppError('Invalid job data: missing vehicle or garage', 400);
    }
    if (!job.assignedMechanicId) {
      throw new AppError('Job must have an assigned mechanic', 400);
    }
    Logger.getInstance().info(`Job ${job._id} validated`);
  }

  protected async prepareWorkspace(): Promise<void> {
    Logger.getInstance().info('Workspace prepared');
  }

  protected async qualityCheck(job: IServiceJob): Promise<void> {
    Logger.getInstance().info(`Quality check done for job ${job._id}`);
  }

  protected async generateReport(job: IServiceJob): Promise<void> {
    Logger.getInstance().info(`Report generated for job ${job._id}`);
  }

  protected async cleanup(): Promise<void> {
    Logger.getInstance().info('Workspace cleaned up');
  }

  protected abstract getServiceType(): string;
  protected abstract performService(job: IServiceJob): Promise<void>;
  protected abstract updateInventory(job: IServiceJob): Promise<void>;
  protected abstract calculateCost(job: IServiceJob): Promise<void>;
}
