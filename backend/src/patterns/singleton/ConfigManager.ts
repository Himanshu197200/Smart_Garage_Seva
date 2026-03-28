import dotenv from 'dotenv';
import Logger from './Logger';

interface AppConfig {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiry: string;
  lowStockThreshold: number;
  maintenanceScanTime: string;
  mileageThreshold: number;
  daysSinceServiceThreshold: number;
  vehicleAgeThreshold: number;
  bcryptSaltRounds: number;
  nodeEnv: string;
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;

  private constructor() {
    dotenv.config();
    this.config = {
      port: parseInt(process.env.PORT || '5000'),
      mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/smart_garage',
      jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
      jwtExpiry: process.env.JWT_EXPIRY || '7d',
      lowStockThreshold: parseInt(process.env.LOW_STOCK_THRESHOLD || '5'),
      maintenanceScanTime: process.env.SCAN_TIME || '0 6 * * *',
      mileageThreshold: parseInt(process.env.MILEAGE_THRESHOLD || '5000'),
      daysSinceServiceThreshold: parseInt(process.env.DAYS_THRESHOLD || '90'),
      vehicleAgeThreshold: parseInt(process.env.VEHICLE_AGE_THRESHOLD || '5'),
      bcryptSaltRounds: parseInt(process.env.BCRYPT_ROUNDS || '10'),
      nodeEnv: process.env.NODE_ENV || 'development'
    };
    this.validateConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private validateConfig(): void {
    if (this.config.jwtSecret === 'your-secret-key') {
      Logger.getInstance().warn('Using default JWT secret - change this in production');
    }
  }

  public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  public getAll(): Readonly<AppConfig> {
    return Object.freeze({ ...this.config });
  }
}

export default ConfigManager;
