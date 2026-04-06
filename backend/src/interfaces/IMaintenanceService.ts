import { IVehicle } from '../models/Vehicle';
import { IServiceJob } from '../models/ServiceJob';
import { Recommendation } from '../patterns/strategy/IRecommendationStrategy';
import { IRecommendationStrategy } from '../patterns/strategy/IRecommendationStrategy';

export interface IMaintenanceService {
  generateRecommendations(vehicle: IVehicle, serviceHistory: IServiceJob[]): Promise<Recommendation[]>;
  addStrategy(strategy: IRecommendationStrategy): void;
  removeStrategy(strategyName: string): void;
  getActiveStrategies(): string[];
}
