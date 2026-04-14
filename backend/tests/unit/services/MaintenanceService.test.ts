import { MaintenanceService } from '../../../src/services/MaintenanceService';
import { JobStatus } from '../../../src/patterns/state/JobState';

const mockVehicle: any = {
  _id: 'v1',
  registrationNumber: 'MH01CD5678',
  brand: 'Honda',
  modelName: 'City',
  year: 2014,
  currentMileage: 80000,
  ownerId: 'owner1',
  garageId: 'g1'
};

describe('MaintenanceService', () => {
  let service: MaintenanceService;

  beforeEach(() => {
    service = new MaintenanceService();
  });

  it('should return active strategy names', () => {
    const strategies = service.getActiveStrategies();
    expect(strategies).toContain('MileageBasedStrategy');
    expect(strategies).toContain('TimeBasedStrategy');
    expect(strategies).toContain('AgeBasedStrategy');
  });

  it('should generate recommendations for a vehicle with service needs', async () => {
    const recs = await service.generateRecommendations(mockVehicle, []);
    expect(recs.length).toBeGreaterThan(0);
  });

  it('should sort recommendations by priority (HIGH first)', async () => {
    const recs = await service.generateRecommendations(mockVehicle, []);
    const priorityOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    for (let i = 1; i < recs.length; i++) {
      expect(priorityOrder[recs[i - 1].priority]).toBeLessThanOrEqual(priorityOrder[recs[i].priority]);
    }
  });

  it('should allow adding a new strategy', () => {
    const customStrategy = {
      getName: () => 'CustomStrategy',
      evaluate: () => null
    };
    service.addStrategy(customStrategy);
    expect(service.getActiveStrategies()).toContain('CustomStrategy');
  });

  it('should allow removing a strategy', () => {
    service.removeStrategy('AgeBasedStrategy');
    expect(service.getActiveStrategies()).not.toContain('AgeBasedStrategy');
  });
});
