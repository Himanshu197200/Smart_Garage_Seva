import { IInventory } from '../models/Inventory';

export interface IInventoryRepository {
  findById(id: string): Promise<IInventory | null>;
  findAll(filter?: any): Promise<IInventory[]>;
  findByGarage(garageId: string): Promise<IInventory[]>;
  findByPartNumber(garageId: string, partNumber: string): Promise<IInventory | null>;
  findLowStock(): Promise<IInventory[]>;
  create(data: Partial<IInventory>): Promise<IInventory>;
  update(id: string, data: Partial<IInventory>): Promise<IInventory | null>;
  delete(id: string): Promise<boolean>;
  count(filter?: any): Promise<number>;
}
