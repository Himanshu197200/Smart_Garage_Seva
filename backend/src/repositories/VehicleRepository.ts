import { BaseRepository } from './BaseRepository';
import { IVehicle, VehicleModel } from '../models/Vehicle';
import { IVehicleRepository } from '../interfaces/IVehicleRepository';
import Logger from '../patterns/singleton/Logger';

export class VehicleRepository extends BaseRepository<IVehicle> implements IVehicleRepository {
  constructor() {
    super(VehicleModel);
  }

  async findByOwner(ownerId: string): Promise<IVehicle[]> {
    try {
      return await this.model.find({ ownerId }).sort({ createdAt: -1 }).exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding vehicles by owner: ${error}`);
      throw error;
    }
  }

  async findByGarage(garageId: string): Promise<IVehicle[]> {
    try {
      return await this.model.find({ garageId }).sort({ createdAt: -1 }).exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding vehicles by garage: ${error}`);
      throw error;
    }
  }

  async findByRegistration(regNumber: string): Promise<IVehicle | null> {
    try {
      return await this.model.findOne({ registrationNumber: regNumber.toUpperCase() }).exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding vehicle by registration: ${error}`);
      throw error;
    }
  }
}
