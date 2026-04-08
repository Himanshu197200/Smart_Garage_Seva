import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAuthService } from '../interfaces/IAuthService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { LoginDTO } from '../dtos/LoginDTO';
import { IUser } from '../models/User';
import { ConflictError, UnauthorizedError } from '../utils/AppError';
import ConfigManager from '../patterns/singleton/ConfigManager';
import Logger from '../patterns/singleton/Logger';

export class AuthService implements IAuthService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async register(data: CreateUserDTO): Promise<IUser> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const saltRounds = ConfigManager.getInstance().get('bcryptSaltRounds');
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      phone: data.phone,
      role: data.role,
      skills: data.skills || [],
      garageId: data.garageId as any
    });

    Logger.getInstance().info(`New user registered: ${user.email} with role ${user.role}`);
    return user;
  }

  async login(credentials: LoginDTO): Promise<{ token: string; user: Partial<IUser> }> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      ConfigManager.getInstance().get('jwtSecret'),
      { expiresIn: ConfigManager.getInstance().get('jwtExpiry') } as any
    );

    Logger.getInstance().info(`User logged in: ${user.email}`);

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        garageId: user.garageId,
        isAvailable: user.isAvailable
      }
    };
  }

  async verifyToken(token: string): Promise<IUser> {
    const decoded = jwt.verify(token, ConfigManager.getInstance().get('jwtSecret')) as { id: string };
    const user = await this.userRepository.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    return user;
  }
}
