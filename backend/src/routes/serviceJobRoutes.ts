import { Router } from 'express';
import { ServiceJobController } from '../controllers/ServiceJobController';
import { ServiceJobService } from '../services/ServiceJobService';
import { NotificationService } from '../services/NotificationService';
import { ServiceJobRepository } from '../repositories/ServiceJobRepository';
import { UserRepository } from '../repositories/UserRepository';
import { VehicleRepository } from '../repositories/VehicleRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { authenticate } from '../middlewares/authMiddleware';
import { adminOnly, adminOrMechanic } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import { createServiceJobSchema } from '../dtos/CreateServiceJobDTO';
import { updateJobStatusSchema } from '../dtos/UpdateJobStatusDTO';

const router = Router();
const notificationService = new NotificationService(new NotificationRepository());
const serviceJobService = new ServiceJobService(
  new ServiceJobRepository(),
  new UserRepository(),
  new VehicleRepository(),
  notificationService
);
const serviceJobController = new ServiceJobController(serviceJobService);

router.post('/', authenticate, validate(createServiceJobSchema), serviceJobController.create);
router.get('/', authenticate, serviceJobController.getJobs);
router.get('/:id', authenticate, serviceJobController.getById);
router.put('/:id', authenticate, adminOnly, serviceJobController.update);
router.delete('/:id', authenticate, adminOnly, serviceJobController.remove);
router.patch('/:id/assign', authenticate, adminOnly, serviceJobController.assignMechanic);
router.patch('/:id/status', authenticate, adminOrMechanic, validate(updateJobStatusSchema), serviceJobController.updateStatus);
router.patch('/:id/estimate', authenticate, adminOnly, serviceJobController.updateEstimate);
router.get('/:id/transitions', authenticate, serviceJobController.getTransitions);

export default router;
