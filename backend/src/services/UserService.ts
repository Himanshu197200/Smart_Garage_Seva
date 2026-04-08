import { IUserService } from '../interfaces/IUserService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IUser } from '../models/User';
import { NotFoundError } from '../utils/AppError';
import Logger from '../patterns/singleton/Logger';

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async findById(id: string): Promise<IUser | null> {
    return await this.userRepository.findById(id);
  }

  async findByGarage(garageId: string): Promise<IUser[]> {
    return await this.userRepository.findByGarage(garageId);
  }

  async findAvailableMechanics(garageId: string): Promise<IUser[]> {
    return await this.userRepository.findAvailableMechanics(garageId);
  }

  async updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }
    delete (data as any).passwordHash;
    delete (data as any).role;
    const updated = await this.userRepository.update(id, data);
    Logger.getInstance().info(`User ${id} profile updated`);
    return updated;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }
    Logger.getInstance().info(`User ${id} deleted`);
    return await this.userRepository.delete(id);
  }
}
