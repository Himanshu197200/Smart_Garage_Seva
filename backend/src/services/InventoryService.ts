import { IInventoryService } from '../interfaces/IInventoryService';
import { IInventoryRepository } from '../interfaces/IInventoryRepository';
import { IInventory } from '../models/Inventory';
import { NotFoundError, ValidationError } from '../utils/AppError';
import Logger from '../patterns/singleton/Logger';

export class InventoryService implements IInventoryService {
  private inventoryRepository: IInventoryRepository;

  constructor(inventoryRepository: IInventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  async addItem(data: Partial<IInventory>): Promise<IInventory> {
    const item = await this.inventoryRepository.create(data);
    Logger.getInstance().info(`Inventory item added: ${item.partName} in garage ${item.garageId}`);
    return item;
  }

  async getItemById(id: string): Promise<IInventory> {
    const item = await this.inventoryRepository.findById(id);
    if (!item) {
      throw new NotFoundError('Inventory item');
    }
    return item;
  }

  async getGarageInventory(garageId: string): Promise<IInventory[]> {
    return await this.inventoryRepository.findByGarage(garageId);
  }

  async updateItem(id: string, data: Partial<IInventory>): Promise<IInventory> {
    const item = await this.inventoryRepository.findById(id);
    if (!item) {
      throw new NotFoundError('Inventory item');
    }
    const updated = await this.inventoryRepository.update(id, { ...data, lastUpdated: new Date() });
    Logger.getInstance().info(`Inventory item ${id} updated`);
    return updated!;
  }

  async updateStock(id: string, quantity: number): Promise<IInventory> {
    const item = await this.inventoryRepository.findById(id);
    if (!item) {
      throw new NotFoundError('Inventory item');
    }
    const updated = await this.inventoryRepository.update(id, { quantity, lastUpdated: new Date() });
    Logger.getInstance().info(`Stock updated for item ${id}: ${quantity} units`);
    return updated!;
  }

  async deleteItem(id: string): Promise<void> {
    const item = await this.inventoryRepository.findById(id);
    if (!item) {
      throw new NotFoundError('Inventory item');
    }
    await this.inventoryRepository.delete(id);
    Logger.getInstance().info(`Inventory item ${id} deleted`);
  }

  async getLowStockItems(garageId: string): Promise<IInventory[]> {
    const all = await this.inventoryRepository.findByGarage(garageId);
    return all.filter(item => item.quantity <= item.lowStockThreshold);
  }

  async consumePart(garageId: string, partNumber: string, quantity: number): Promise<void> {
    const item = await this.inventoryRepository.findByPartNumber(garageId, partNumber);
    if (!item) {
      Logger.getInstance().warn(`Part ${partNumber} not found in garage ${garageId}`);
      return;
    }
    if (item.quantity < quantity) {
      throw new ValidationError(`Insufficient stock for part ${partNumber}. Available: ${item.quantity}`);
    }
    await this.inventoryRepository.update(item._id.toString(), {
      quantity: item.quantity - quantity,
      lastUpdated: new Date()
    });
    Logger.getInstance().info(`Consumed ${quantity} of ${partNumber} from garage ${garageId}`);
  }

  async getPartByNumber(garageId: string, partNumber: string): Promise<IInventory | null> {
    return await this.inventoryRepository.findByPartNumber(garageId, partNumber);
  }
}
