import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import garageRoutes from './garageRoutes';
import vehicleRoutes from './vehicleRoutes';
import serviceJobRoutes from './serviceJobRoutes';
import inventoryRoutes from './inventoryRoutes';
import notificationRoutes from './notificationRoutes';
import maintenanceRoutes from './maintenanceRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/garages', garageRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/service-jobs', serviceJobRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/notifications', notificationRoutes);
router.use('/maintenance', maintenanceRoutes);

export default router;
