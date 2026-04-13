import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { NotificationService } from '../services/NotificationService';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const notificationController = new NotificationController(new NotificationService(new NotificationRepository()));

router.get('/', authenticate, notificationController.getAll);
router.get('/unread', authenticate, notificationController.getUnread);
router.get('/unread-count', authenticate, notificationController.getUnreadCount);
router.patch('/:id/read', authenticate, notificationController.markAsRead);
router.patch('/read-all', authenticate, notificationController.markAllAsRead);
router.delete('/:id', authenticate, notificationController.remove);

export default router;
