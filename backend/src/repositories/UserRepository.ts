import { BaseRepository } from './BaseRepository';
import { IUser, UserModel, UserRole } from '../models/User';
import { IUserRepository } from '../interfaces/IUserRepository';
import Logger from '../patterns/singleton/Logger';

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.model.findOne({ email }).exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding user by email: ${error}`);
      throw error;
    }
  }

  async findByGarage(garageId: string): Promise<IUser[]> {
    try {
      return await this.model.find({ garageId }).exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding users by garage: ${error}`);
      throw error;
    }
  }

  async findByGarageAndRole(garageId: string, role: UserRole): Promise<IUser[]> {
    try {
      return await this.model.find({ garageId, role }).exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding users by garage and role: ${error}`);
      throw error;
    }
  }

  async findAvailableMechanics(garageId: string): Promise<IUser[]> {
    try {
      return await this.model.find({ garageId, role: UserRole.MECHANIC, isAvailable: true }).exec();
    } catch (error) {
      Logger.getInstance().error(`Error finding available mechanics: ${error}`);
      throw error;
    }
  }
}
