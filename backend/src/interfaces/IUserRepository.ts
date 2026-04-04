import { IUser } from '../models/User';
import { UserRole } from '../models/User';

export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  findByEmail(email: string): Promise<IUser | null>;
  findByGarage(garageId: string): Promise<IUser[]>;
  findByGarageAndRole(garageId: string, role: UserRole): Promise<IUser[]>;
  findAvailableMechanics(garageId: string): Promise<IUser[]>;
  create(data: Partial<IUser>): Promise<IUser>;
  update(id: string, data: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
  count(filter?: any): Promise<number>;
}
