import { Router } from 'express';
import { GarageController } from '../controllers/GarageController';
import { GarageService } from '../services/GarageService';
import { UserService } from '../services/UserService';
import { GarageRepository } from '../repositories/GarageRepository';
import { UserRepository } from '../repositories/UserRepository';
import { authenticate } from '../middlewares/authMiddleware';
import { adminOnly } from '../middlewares/roleMiddleware';

const router = Router();
const garageService = new GarageService(new GarageRepository());
const userService = new UserService(new UserRepository());
const garageController = new GarageController(garageService, userService);

router.post('/', authenticate, adminOnly, garageController.create);
router.get('/', authenticate, garageController.getAll);
router.get('/:id', authenticate, garageController.getById);
router.put('/:id', authenticate, adminOnly, garageController.update);
router.delete('/:id', authenticate, adminOnly, garageController.remove);
router.get('/:id/users', authenticate, adminOnly, garageController.getGarageUsers);
router.get('/:id/mechanics', authenticate, garageController.getAvailableMechanics);

export default router;
