import { IVehicle } from '../../models/Vehicle';
import { IServiceJob } from '../../models/ServiceJob';

export interface Recommendation {
  type: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestedAction: string;
}

export interface IRecommendationStrategy {
  getName(): string;
  evaluate(vehicle: IVehicle, serviceHistory: IServiceJob[]): Recommendation | null;
}
