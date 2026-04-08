import { IGarageService } from '../interfaces/IGarageService';
import { IGarageRepository } from '../interfaces/IGarageRepository';
import { IGarage } from '../models/Garage';
import { NotFoundError } from '../utils/AppError';
import Logger from '../patterns/singleton/Logger';

export class GarageService implements IGarageService {
  private garageRepository: IGarageRepository;

  constructor(garageRepository: IGarageRepository) {
    this.garageRepository = garageRepository;
  }

  async createGarage(data: Partial<IGarage>): Promise<IGarage> {
    const garage = await this.garageRepository.create(data);
    Logger.getInstance().info(`Garage created: ${garage.name}`);
    return garage;
  }

  async getGarageById(id: string): Promise<IGarage> {
    const garage = await this.garageRepository.findById(id);
    if (!garage) {
      throw new NotFoundError('Garage');
    }
    return garage;
  }

  async getAllGarages(): Promise<IGarage[]> {
    return await this.garageRepository.findAll();
  }

  async updateGarage(id: string, data: Partial<IGarage>): Promise<IGarage> {
    const garage = await this.garageRepository.findById(id);
    if (!garage) {
      throw new NotFoundError('Garage');
    }
    const updated = await this.garageRepository.update(id, data);
    Logger.getInstance().info(`Garage ${id} updated`);
    return updated!;
  }

  async deleteGarage(id: string): Promise<void> {
    const garage = await this.garageRepository.findById(id);
    if (!garage) {
      throw new NotFoundError('Garage');
    }
    await this.garageRepository.delete(id);
    Logger.getInstance().info(`Garage ${id} deleted`);
  }
}
