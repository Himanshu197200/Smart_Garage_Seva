import { IServiceJob } from '../models/ServiceJob';
import { JobStatus } from '../patterns/state/JobState';

export interface IServiceJobRepository {
  findById(id: string): Promise<IServiceJob | null>;
  findAll(filter?: any): Promise<IServiceJob[]>;
  findByVehicle(vehicleId: string): Promise<IServiceJob[]>;
  findByMechanic(mechanicId: string): Promise<IServiceJob[]>;
  findByGarage(garageId: string): Promise<IServiceJob[]>;
  findPendingByGarage(garageId: string): Promise<IServiceJob[]>;
  findByStatus(status: JobStatus): Promise<IServiceJob[]>;
  create(data: Partial<IServiceJob>): Promise<IServiceJob>;
  update(id: string, data: Partial<IServiceJob>): Promise<IServiceJob | null>;
  delete(id: string): Promise<boolean>;
  count(filter?: any): Promise<number>;
}
