import { IUser } from '../models/User';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { LoginDTO } from '../dtos/LoginDTO';

export interface IAuthService {
  register(data: CreateUserDTO): Promise<IUser>;
  login(credentials: LoginDTO): Promise<{ token: string; user: Partial<IUser> }>;
  verifyToken(token: string): Promise<IUser>;
}
