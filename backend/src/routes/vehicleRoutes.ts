import { Router } from 'express';
import { VehicleController } from '../controllers/VehicleController';
import { VehicleService } from '../services/VehicleService';
import { VehicleRepository } from '../repositories/VehicleRepository';
import { ServiceJobRepository } from '../repositories/ServiceJobRepository';
import { authenticate } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import { createVehicleSchema } from '../dtos/CreateVehicleDTO';

const router = Router();
const vehicleService = new VehicleService(new VehicleRepository());
const jobRepository = new ServiceJobRepository();
const vehicleController = new VehicleController(vehicleService, jobRepository);

router.post('/', authenticate, validate(createVehicleSchema), vehicleController.create);
router.get('/', authenticate, vehicleController.getMyVehicles);
router.get('/:id', authenticate, vehicleController.getById);
router.put('/:id', authenticate, vehicleController.update);
router.delete('/:id', authenticate, vehicleController.remove);
router.put('/:id/mileage', authenticate, vehicleController.updateMileage);
router.get('/:id/history', authenticate, vehicleController.getServiceHistory);

export default router;
