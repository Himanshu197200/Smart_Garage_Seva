import { BaseRepository } from './BaseRepository';
import { IInventory, InventoryModel } from '../models/Inventory';
import { IInventoryRepository } from '../interfaces/IInventoryRepository';
import Logger from '../patterns/singleton/Logger';

export class InventoryRepository extends BaseRepository<IInventory> implements IInventoryRepository {
  constructor() {
    super(InventoryModel);
  }

  async findByGarage(garageId: string): Promise<IInventory[]> {
    try {
      return await this.model.find({ garageId }).sort({ partName: 1 }).exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding inventory by garage: ${error}`);
      throw error;
    }
  }

  async findByPartNumber(garageId: string, partNumber: string): Promise<IInventory | null> {
    try {
      return await this.model.findOne({ garageId, partNumber: partNumber.toUpperCase() }).exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding part by number: ${error}`);
      throw error;
    }
  }

  async findLowStock(): Promise<IInventory[]> {
    try {
      return await this.model
        .find({ $expr: { $lte: ['$quantity', '$lowStockThreshold'] } })
        .exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding low stock items: ${error}`);
      throw error;
    }
  }
}
