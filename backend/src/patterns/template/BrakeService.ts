import { ServiceJobTemplate, IInventoryConsumer } from './ServiceJobTemplate';
import { IServiceJob } from '../../models/ServiceJob';
import Logger from '../singleton/Logger';

export class BrakeService extends ServiceJobTemplate {
  private readonly LABOR_COST = 500;
  private readonly PARTS_REQUIRED = [
    { partNumber: 'BRAKE_PAD_FRONT', quantity: 2 },
    { partNumber: 'BRAKE_PAD_REAR', quantity: 2 },
    { partNumber: 'BRAKE_FLUID_DOT4', quantity: 1 }
  ];

  constructor(inventoryService: IInventoryConsumer) {
    super(inventoryService);
  }

  protected getServiceType(): string {
    return 'BRAKE_SERVICE';
  }

  protected async performService(job: IServiceJob): Promise<void> {
    Logger.getInstance().info(`Performing brake service for job ${job._id}`);
    Logger.getInstance().debug('Inspecting brake system');
    Logger.getInstance().debug('Removing worn brake pads');
    Logger.getInstance().debug('Inspecting brake rotors');
    Logger.getInstance().debug('Installing new brake pads');
    Logger.getInstance().debug('Bleeding brake system');
    Logger.getInstance().debug('Refilling brake fluid');
    Logger.getInstance().debug('Testing brake operation');
    Logger.getInstance().info(`Brake service completed for job ${job._id}`);
  }

  protected async updateInventory(job: IServiceJob): Promise<void> {
    Logger.getInstance().info(`Updating inventory for brake service job ${job._id}`);
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
