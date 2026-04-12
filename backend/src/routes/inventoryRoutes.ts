import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';
import { InventoryService } from '../services/InventoryService';
import { InventoryRepository } from '../repositories/InventoryRepository';
import { authenticate } from '../middlewares/authMiddleware';
import { adminOnly, adminOrMechanic } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import { createInventorySchema } from '../dtos/CreateInventoryDTO';
import { jobPartUsageSchema } from '../dtos/JobPartUsageDTO';

const router = Router();
const inventoryController = new InventoryController(new InventoryService(new InventoryRepository()));

router.post('/', authenticate, adminOnly, validate(createInventorySchema), inventoryController.create);
router.get('/', authenticate, inventoryController.getGarageInventory);
router.get('/low-stock', authenticate, adminOnly, inventoryController.getLowStock);
router.get('/:id', authenticate, inventoryController.getById);
router.put('/:id', authenticate, adminOnly, inventoryController.update);
router.delete('/:id', authenticate, adminOnly, inventoryController.remove);
router.patch('/:id/stock', authenticate, adminOnly, inventoryController.updateStock);
router.post('/part-usage', authenticate, adminOrMechanic, validate(jobPartUsageSchema), inventoryController.recordPartUsage);
router.get('/part-usage/:jobId', authenticate, inventoryController.getJobPartUsage);

export default router;
