import { IRecommendationStrategy, Recommendation } from './IRecommendationStrategy';
import { IVehicle } from '../../models/Vehicle';
import { IServiceJob } from '../../models/ServiceJob';
import ConfigManager from '../singleton/ConfigManager';
import Logger from '../singleton/Logger';

export class AgeBasedStrategy implements IRecommendationStrategy {
  private ageThreshold: number;

  constructor() {
    this.ageThreshold = ConfigManager.getInstance().get('vehicleAgeThreshold');
  }

  getName(): string {
    return 'AgeBasedStrategy';
  }

  evaluate(vehicle: IVehicle, _serviceHistory: IServiceJob[]): Recommendation | null {
    const vehicleAge = new Date().getFullYear() - vehicle.year;

    Logger.getInstance().debug(
      `${this.getName()}: Vehicle ${vehicle.registrationNumber} - Age: ${vehicleAge} years`
    );

    if (vehicleAge >= this.ageThreshold) {
      return {
        type: 'BRAKE_INSPECTION',
        message: `Vehicle is ${vehicleAge} years old. Brake system inspection recommended.`,
        priority: vehicleAge > this.ageThreshold + 3 ? 'HIGH' : 'MEDIUM',
        suggestedAction: 'Inspect brake pads, discs, and fluid levels'
      };
    }

    return null;
  }
}
