import { BaseRepository } from './BaseRepository';
import { IServiceJob, ServiceJobModel } from '../models/ServiceJob';
import { IServiceJobRepository } from '../interfaces/IServiceJobRepository';
import { JobStatus } from '../patterns/state/JobState';
import Logger from '../patterns/singleton/Logger';

export class ServiceJobRepository extends BaseRepository<IServiceJob> implements IServiceJobRepository {
  constructor() {
    super(ServiceJobModel);
  }

  async findByVehicle(vehicleId: string): Promise<IServiceJob[]> {
    try {
      return await this.model.find({ vehicleId }).sort({ createdAt: -1 }).populate('vehicleId').populate('assignedMechanicId').exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding jobs by vehicle: ${error}`);
      throw error;
    }
  }

  async findByMechanic(mechanicId: string): Promise<IServiceJob[]> {
    try {
      return await this.model.find({ assignedMechanicId: mechanicId }).sort({ createdAt: -1 }).populate('vehicleId').exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding jobs by mechanic: ${error}`);
      throw error;
    }
  }

  async findByGarage(garageId: string): Promise<IServiceJob[]> {
    try {
      return await this.model.find({ garageId }).sort({ createdAt: -1 }).populate('vehicleId').populate('assignedMechanicId').exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding jobs by garage: ${error}`);
      throw error;
    }
  }

  async findPendingByGarage(garageId: string): Promise<IServiceJob[]> {
    try {
      return await this.model
        .find({ garageId, status: { $in: [JobStatus.CREATED, JobStatus.ASSIGNED, JobStatus.IN_PROGRESS] } })
        .sort({ createdAt: 1 })
        .populate('vehicleId')
        .populate('assignedMechanicId')
        .exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding pending jobs: ${error}`);
      throw error;
    }
  }

  async findByStatus(status: JobStatus): Promise<IServiceJob[]> {
    try {
      return await this.model.find({ status }).sort({ createdAt: -1 }).exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding jobs by status: ${error}`);
      throw error;
    }
  }
}
