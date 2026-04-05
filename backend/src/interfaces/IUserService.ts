import { IUser } from '../models/User';

export interface IUserService {
  findById(id: string): Promise<IUser | null>;
  findByGarage(garageId: string): Promise<IUser[]>;
  findAvailableMechanics(garageId: string): Promise<IUser[]>;
  updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null>;
  deleteUser(id: string): Promise<boolean>;
}
