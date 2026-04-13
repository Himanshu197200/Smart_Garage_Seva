import { Router, Request, Response } from 'express';
import { MaintenanceService } from '../services/MaintenanceService';
import { VehicleRepository } from '../repositories/VehicleRepository';
import { ServiceJobRepository } from '../repositories/ServiceJobRepository';
import { NotificationService } from '../services/NotificationService';
import { NotificationRepository } from '../repositories/NotificationRepository';
import NotificationFactory, { NotificationType } from '../patterns/factory/NotificationFactory';
import { authenticate } from '../middlewares/authMiddleware';
import { adminOnly } from '../middlewares/roleMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
const maintenanceService = new MaintenanceService();
const vehicleRepository = new VehicleRepository();
const jobRepository = new ServiceJobRepository();
const notificationService = new NotificationService(new NotificationRepository());

router.get('/recommendations', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const vehicles = await vehicleRepository.findByOwner(req.user!._id.toString());
  const allRecs: any[] = [];

  for (const vehicle of vehicles) {
    const history = await jobRepository.findByVehicle(vehicle._id.toString());
    const recs = await maintenanceService.generateRecommendations(vehicle, history);
    allRecs.push({ vehicle: vehicle.registrationNumber, recommendations: recs });
  }

  res.status(200).json({ success: true, data: allRecs });
}));

router.get('/recommendations/:vehicleId', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const vehicle = await vehicleRepository.findById(req.params.vehicleId);
  if (!vehicle) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }
  const history = await jobRepository.findByVehicle(vehicle._id.toString());
  const recs = await maintenanceService.generateRecommendations(vehicle, history);
  res.status(200).json({ success: true, data: recs });
}));

router.post('/scan', authenticate, adminOnly, asyncHandler(async (req: Request, res: Response) => {
  const vehicles = await vehicleRepository.findAll();
  let total = 0;

  for (const vehicle of vehicles) {
    const history = await jobRepository.findByVehicle(vehicle._id.toString());
    const recs = await maintenanceService.generateRecommendations(vehicle, history);

    for (const rec of recs) {
      const notification = NotificationFactory.create(
        NotificationType.RECOMMENDATION_ALERT,
        vehicle.ownerId.toString(),
        {
          vehicleNumber: vehicle.registrationNumber,
          recommendation: rec.message,
          priority: rec.priority
        }
      );
      await notificationService.save(notification);
      total++;
    }
  }

  res.status(200).json({ success: true, message: `Scan complete. ${total} recommendations generated.` });
}));

router.get('/strategies', authenticate, adminOnly, asyncHandler(async (req: Request, res: Response) => {
  const strategies = maintenanceService.getActiveStrategies();
  res.status(200).json({ success: true, data: strategies });
}));

export default router;
