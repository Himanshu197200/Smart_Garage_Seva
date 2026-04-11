import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { authenticate } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import { createUserSchema } from '../dtos/CreateUserDTO';
import { loginSchema } from '../dtos/LoginDTO';

const router = Router();
const authService = new AuthService(new UserRepository());
const authController = new AuthController(authService);

router.post('/register', validate(createUserSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);

export default router;
