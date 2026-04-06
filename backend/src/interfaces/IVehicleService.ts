import { IVehicle } from '../models/Vehicle';

export interface IVehicleService {
  registerVehicle(data: Partial<IVehicle>): Promise<IVehicle>;
  getVehicleById(id: string): Promise<IVehicle>;
  getUserVehicles(ownerId: string): Promise<IVehicle[]>;
  updateVehicle(id: string, data: Partial<IVehicle>): Promise<IVehicle>;
  updateMileage(id: string, mileage: number): Promise<IVehicle>;
  deleteVehicle(id: string): Promise<void>;
}
