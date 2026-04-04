import { ServiceJobTemplate, IInventoryConsumer } from './ServiceJobTemplate';
import { IServiceJob } from '../../models/ServiceJob';
import Logger from '../singleton/Logger';

export class GeneralService extends ServiceJobTemplate {
  private readonly BASE_LABOR_COST = 300;
  private partsUsed: Array<{ partNumber: string; quantity: number }> = [];

  constructor(inventoryService: IInventoryConsumer) {
    super(inventoryService);
  }

  protected getServiceType(): string {
    return 'GENERAL_SERVICE';
  }

  public addPartUsed(partNumber: string, quantity: number): void {
    this.partsUsed.push({ partNumber, quantity });
  }

  protected async performService(job: IServiceJob): Promise<void> {
    Logger.getInstance().info(`Performing general service for job ${job._id}`);
    Logger.getInstance().debug(`Problem: ${job.problemDescription}`);
    Logger.getInstance().info(`General service completed for job ${job._id}`);
  }

  protected async updateInventory(job: IServiceJob): Promise<void> {
    Logger.getInstance().info(`Updating inventory for general service job ${job._id}`);
    for (const part of this.partsUsed) {
      await this.inventoryService.consumePart(job.garageId.toString(), part.partNumber, part.quantity);
    }
  }

  protected async calculateCost(job: IServiceJob): Promise<void> {
    let partsCost = 0;
    for (const part of this.partsUsed) {
      const partInfo = await this.inventoryService.getPartByNumber(job.garageId.toString(), part.partNumber);
      if (partInfo) {
        partsCost += partInfo.unitPrice * part.quantity;
      }
    }
    job.finalCost = this.BASE_LABOR_COST + partsCost;
    Logger.getInstance().info(`Cost for job ${job._id}: Labor Rs.${this.BASE_LABOR_COST} + Parts Rs.${partsCost} = Rs.${job.finalCost}`);
  }
}
