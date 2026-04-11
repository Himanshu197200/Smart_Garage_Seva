import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { authenticate } from '../middlewares/authMiddleware';
import { adminOnly } from '../middlewares/roleMiddleware';

const router = Router();
const userService = new UserService(new UserRepository());
const userController = new UserController(userService);

router.get('/garage/:garageId', authenticate, adminOnly, userController.getGarageUsers);
router.get('/mechanics/:garageId', authenticate, userController.getAvailableMechanics);
router.get('/:id', authenticate, userController.getById);
router.put('/:id', authenticate, userController.updateProfile);
router.delete('/:id', authenticate, adminOnly, userController.deleteUser);

export default router;
