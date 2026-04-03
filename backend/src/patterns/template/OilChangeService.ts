import { ServiceJobTemplate, IInventoryConsumer } from './ServiceJobTemplate';
import { IServiceJob } from '../../models/ServiceJob';
import Logger from '../singleton/Logger';

export class OilChangeService extends ServiceJobTemplate {
  private readonly LABOR_COST = 200;
  private readonly PARTS_REQUIRED = [
    { partNumber: 'ENGINE_OIL_5W30', quantity: 4 },
    { partNumber: 'OIL_FILTER', quantity: 1 }
  ];

  constructor(inventoryService: IInventoryConsumer) {
    super(inventoryService);
  }

  protected getServiceType(): string {
    return 'OIL_CHANGE';
  }

  protected async performService(job: IServiceJob): Promise<void> {
    Logger.getInstance().info(`Performing oil change for job ${job._id}`);
    Logger.getInstance().debug('Draining old engine oil');
    Logger.getInstance().debug('Removing old oil filter');
    Logger.getInstance().debug('Installing new oil filter');
    Logger.getInstance().debug('Adding new engine oil 4L');
    Logger.getInstance().debug('Checking oil level');
    Logger.getInstance().info(`Oil change completed for job ${job._id}`);
  }

  protected async updateInventory(job: IServiceJob): Promise<void> {
    Logger.getInstance().info(`Updating inventory for oil change job ${job._id}`);
    for (const part of this.PARTS_REQUIRED) {
      await this.inventoryService.consumePart(job.garageId.toString(), part.partNumber, part.quantity);
    }
  }

  protected async calculateCost(job: IServiceJob): Promise<void> {
    let partsCost = 0;
    for (const part of this.PARTS_REQUIRED) {
      const partInfo = await this.inventoryService.getPartByNumber(job.garageId.toString(), part.partNumber);
      if (partInfo) {
        partsCost += partInfo.unitPrice * part.quantity;
      }
    }
    job.finalCost = this.LABOR_COST + partsCost;
    Logger.getInstance().info(`Cost for job ${job._id}: Labor Rs.${this.LABOR_COST} + Parts Rs.${partsCost} = Rs.${job.finalCost}`);
  }
}
