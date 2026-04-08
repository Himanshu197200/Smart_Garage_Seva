import { IVehicleService } from '../interfaces/IVehicleService';
import { IVehicleRepository } from '../interfaces/IVehicleRepository';
import { IVehicle } from '../models/Vehicle';
import { NotFoundError, ConflictError } from '../utils/AppError';
import Logger from '../patterns/singleton/Logger';

export class VehicleService implements IVehicleService {
  private vehicleRepository: IVehicleRepository;

  constructor(vehicleRepository: IVehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  async registerVehicle(data: Partial<IVehicle>): Promise<IVehicle> {
    const existing = await this.vehicleRepository.findByRegistration(data.registrationNumber!);
    if (existing) {
      throw new ConflictError('Vehicle with this registration number already exists');
    }
    const vehicle = await this.vehicleRepository.create(data);
    Logger.getInstance().info(`Vehicle registered: ${vehicle.registrationNumber}`);
    return vehicle;
  }

  async getVehicleById(id: string): Promise<IVehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }
    return vehicle;
  }

  async getUserVehicles(ownerId: string): Promise<IVehicle[]> {
    return await this.vehicleRepository.findByOwner(ownerId);
  }

  async updateVehicle(id: string, data: Partial<IVehicle>): Promise<IVehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }
    const updated = await this.vehicleRepository.update(id, data);
    Logger.getInstance().info(`Vehicle ${id} updated`);
    return updated!;
  }

  async updateMileage(id: string, mileage: number): Promise<IVehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }
    const updated = await this.vehicleRepository.update(id, { currentMileage: mileage });
    Logger.getInstance().info(`Vehicle ${id} mileage updated to ${mileage}`);
    return updated!;
  }

  async deleteVehicle(id: string): Promise<void> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }
    await this.vehicleRepository.delete(id);
    Logger.getInstance().info(`Vehicle ${id} deleted`);
  }
}
