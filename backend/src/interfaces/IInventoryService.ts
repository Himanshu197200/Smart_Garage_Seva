import { IInventory } from '../models/Inventory';

export interface IInventoryService {
  addItem(data: Partial<IInventory>): Promise<IInventory>;
  getItemById(id: string): Promise<IInventory>;
  getGarageInventory(garageId: string): Promise<IInventory[]>;
  updateItem(id: string, data: Partial<IInventory>): Promise<IInventory>;
  updateStock(id: string, quantity: number): Promise<IInventory>;
  deleteItem(id: string): Promise<void>;
  getLowStockItems(garageId: string): Promise<IInventory[]>;
  consumePart(garageId: string, partNumber: string, quantity: number): Promise<void>;
  getPartByNumber(garageId: string, partNumber: string): Promise<IInventory | null>;
}
