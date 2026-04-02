import { IRecommendationStrategy, Recommendation } from './IRecommendationStrategy';
import { IVehicle } from '../../models/Vehicle';
import { IServiceJob } from '../../models/ServiceJob';
import ConfigManager from '../singleton/ConfigManager';
import Logger from '../singleton/Logger';

export class MileageBasedStrategy implements IRecommendationStrategy {
  private mileageThreshold: number;

  constructor() {
    this.mileageThreshold = ConfigManager.getInstance().get('mileageThreshold');
  }

  getName(): string {
    return 'MileageBasedStrategy';
  }

  evaluate(vehicle: IVehicle, serviceHistory: IServiceJob[]): Recommendation | null {
    const lastService = serviceHistory
      .filter(job => job.status === 'DELIVERED')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

    const lastServiceMileage = lastService ? vehicle.currentMileage - this.mileageThreshold : 0;
    const mileageSinceService = vehicle.currentMileage - lastServiceMileage;

    Logger.getInstance().debug(
      `${this.getName()}: Vehicle ${vehicle.registrationNumber} - Mileage since service: ${mileageSinceService}`
    );

    if (mileageSinceService >= this.mileageThreshold) {
      return {
        type: 'OIL_CHANGE',
        message: `Oil change recommended. ${mileageSinceService} km since last service.`,
        priority: mileageSinceService > this.mileageThreshold * 1.5 ? 'HIGH' : 'MEDIUM',
        suggestedAction: 'Schedule oil change and filter replacement'
      };
    }

    return null;
  }
}
