import { MileageBasedStrategy } from '../../../src/patterns/strategy/MileageBasedStrategy';
import { TimeBasedStrategy } from '../../../src/patterns/strategy/TimeBasedStrategy';
import { AgeBasedStrategy } from '../../../src/patterns/strategy/AgeBasedStrategy';
import { JobStatus } from '../../../src/patterns/state/JobState';

const mockVehicle: any = {
  _id: 'v1',
  registrationNumber: 'MH01AB1234',
  brand: 'Maruti',
  modelName: 'Swift',
  year: 2015,
  currentMileage: 60000,
  ownerId: 'owner1',
  garageId: 'g1'
};

const mockDeliveredJob: any = {
  _id: 'j1',
  status: JobStatus.DELIVERED,
  vehicleId: 'v1',
  garageId: 'g1',
  problemDescription: 'Oil change test',
  costEstimate: 500,
  finalCost: 500,
  updatedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000)
};

describe('MileageBasedStrategy', () => {
  const strategy = new MileageBasedStrategy();

  it('should return a recommendation when mileage exceeds threshold', () => {
    const rec = strategy.evaluate(mockVehicle, []);
    expect(rec).not.toBeNull();
    expect(rec?.type).toBe('OIL_CHANGE');
  });

  it('should return an oil change recommendation when mileage history has a service', () => {
    const rec = strategy.evaluate(mockVehicle, [mockDeliveredJob]);
    expect(rec?.type).toBe('OIL_CHANGE');
  });
});

describe('TimeBasedStrategy', () => {
  const strategy = new TimeBasedStrategy();

  it('should return a recommendation when no service history exists', () => {
    const rec = strategy.evaluate(mockVehicle, []);
    expect(rec).not.toBeNull();
    expect(rec?.type).toBe('PERIODIC_CHECK');
  });

  it('should return a recommendation when service is overdue', () => {
    const rec = strategy.evaluate(mockVehicle, [mockDeliveredJob]);
    expect(rec).not.toBeNull();
    expect(rec?.type).toBe('PERIODIC_CHECK');
  });
});

describe('AgeBasedStrategy', () => {
  const strategy = new AgeBasedStrategy();

  it('should return a brake inspection for old vehicles', () => {
    const rec = strategy.evaluate(mockVehicle, []);
    expect(rec).not.toBeNull();
    expect(rec?.type).toBe('BRAKE_INSPECTION');
  });

  it('should return null for new vehicles', () => {
    const newVehicle = { ...mockVehicle, year: new Date().getFullYear() };
    const rec = strategy.evaluate(newVehicle, []);
    expect(rec).toBeNull();
  });
});
