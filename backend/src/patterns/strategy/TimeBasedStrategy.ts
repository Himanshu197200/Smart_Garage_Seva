import { IRecommendationStrategy, Recommendation } from './IRecommendationStrategy';
import { IVehicle } from '../../models/Vehicle';
import { IServiceJob } from '../../models/ServiceJob';
import ConfigManager from '../singleton/ConfigManager';
import Logger from '../singleton/Logger';

export class TimeBasedStrategy implements IRecommendationStrategy {
  private daysThreshold: number;

  constructor() {
    this.daysThreshold = ConfigManager.getInstance().get('daysSinceServiceThreshold');
  }

  getName(): string {
    return 'TimeBasedStrategy';
  }

  evaluate(vehicle: IVehicle, serviceHistory: IServiceJob[]): Recommendation | null {
    const lastService = serviceHistory
      .filter(job => job.status === 'DELIVERED')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

    if (!lastService) {
      return {
        type: 'PERIODIC_CHECK',
        message: 'No service history found. Initial inspection recommended.',
        priority: 'MEDIUM',
        suggestedAction: 'Schedule comprehensive vehicle inspection'
      };
    }

    const daysSinceService = Math.floor(
      (Date.now() - new Date(lastService.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    Logger.getInstance().debug(
      `${this.getName()}: Vehicle ${vehicle.registrationNumber} - Days since service: ${daysSinceService}`
    );

    if (daysSinceService >= this.daysThreshold) {
      return {
        type: 'PERIODIC_CHECK',
        message: `Periodic maintenance due. ${daysSinceService} days since last service.`,
        priority: daysSinceService > this.daysThreshold * 1.5 ? 'HIGH' : 'MEDIUM',
        suggestedAction: 'Schedule routine maintenance check'
      };
    }

    return null;
  }
}
