import { IVehicle } from '../models/Vehicle';

export interface IVehicleRepository {
  findById(id: string): Promise<IVehicle | null>;
  findAll(filter?: any): Promise<IVehicle[]>;
  findByOwner(ownerId: string): Promise<IVehicle[]>;
  findByGarage(garageId: string): Promise<IVehicle[]>;
  findByRegistration(regNumber: string): Promise<IVehicle | null>;
  create(data: Partial<IVehicle>): Promise<IVehicle>;
  update(id: string, data: Partial<IVehicle>): Promise<IVehicle | null>;
  delete(id: string): Promise<boolean>;
  count(filter?: any): Promise<number>;
}
