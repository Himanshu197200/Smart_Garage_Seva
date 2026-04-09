import { IMaintenanceService } from '../interfaces/IMaintenanceService';
import { IRecommendationStrategy, Recommendation } from '../patterns/strategy/IRecommendationStrategy';
import { MileageBasedStrategy } from '../patterns/strategy/MileageBasedStrategy';
import { TimeBasedStrategy } from '../patterns/strategy/TimeBasedStrategy';
import { AgeBasedStrategy } from '../patterns/strategy/AgeBasedStrategy';
import { IVehicle } from '../models/Vehicle';
import { IServiceJob } from '../models/ServiceJob';
import Logger from '../patterns/singleton/Logger';

export class MaintenanceService implements IMaintenanceService {
  private strategies: IRecommendationStrategy[];

  constructor() {
    this.strategies = [
      new MileageBasedStrategy(),
      new TimeBasedStrategy(),
      new AgeBasedStrategy()
    ];
  }

  public addStrategy(strategy: IRecommendationStrategy): void {
    this.strategies.push(strategy);
    Logger.getInstance().info(`Added recommendation strategy: ${strategy.getName()}`);
  }

  public removeStrategy(strategyName: string): void {
    this.strategies = this.strategies.filter(s => s.getName() !== strategyName);
    Logger.getInstance().info(`Removed recommendation strategy: ${strategyName}`);
  }

  public async generateRecommendations(vehicle: IVehicle, serviceHistory: IServiceJob[]): Promise<Recommendation[]> {
    Logger.getInstance().info(`Generating recommendations for vehicle: ${vehicle.registrationNumber}`);

    const recommendations: Recommendation[] = [];

    for (const strategy of this.strategies) {
      try {
        const rec = strategy.evaluate(vehicle, serviceHistory);
        if (rec) {
          recommendations.push(rec);
          Logger.getInstance().debug(`${strategy.getName()} generated: ${rec.type}`);
        }
      } catch (error) {
        Logger.getInstance().error(`Error in strategy ${strategy.getName()}: ${error}`);
      }
    }

    const priorityOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    Logger.getInstance().info(`Generated ${recommendations.length} recommendations for ${vehicle.registrationNumber}`);
    return recommendations;
  }

  public getActiveStrategies(): string[] {
    return this.strategies.map(s => s.getName());
  }
}
