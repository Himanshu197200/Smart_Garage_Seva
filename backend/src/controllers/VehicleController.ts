import { Request, Response } from 'express';
import { IVehicleService } from '../interfaces/IVehicleService';
import { IServiceJobRepository } from '../interfaces/IServiceJobRepository';
import { asyncHandler } from '../utils/asyncHandler';

export class VehicleController {
  private vehicleService: IVehicleService;
  private jobRepository: IServiceJobRepository;

  constructor(vehicleService: IVehicleService, jobRepository: IServiceJobRepository) {
    this.vehicleService = vehicleService;
    this.jobRepository = jobRepository;
  }

  create = asyncHandler(async (req: Request, res: Response) => {
    const vehicle = await this.vehicleService.registerVehicle({
      ...req.body,
      ownerId: req.user!._id
    });
    res.status(201).json({ success: true, data: vehicle });
  });

  getMyVehicles = asyncHandler(async (req: Request, res: Response) => {
    const vehicles = await this.vehicleService.getUserVehicles(req.user!._id.toString());
    res.status(200).json({ success: true, data: vehicles });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const vehicle = await this.vehicleService.getVehicleById(req.params.id);
    res.status(200).json({ success: true, data: vehicle });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const vehicle = await this.vehicleService.updateVehicle(req.params.id, req.body);
    res.status(200).json({ success: true, data: vehicle });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.vehicleService.deleteVehicle(req.params.id);
    res.status(200).json({ success: true, message: 'Vehicle deleted' });
  });

  updateMileage = asyncHandler(async (req: Request, res: Response) => {
    const { mileage } = req.body;
    const vehicle = await this.vehicleService.updateMileage(req.params.id, mileage);
    res.status(200).json({ success: true, data: vehicle });
  });

  getServiceHistory = asyncHandler(async (req: Request, res: Response) => {
    const jobs = await this.jobRepository.findByVehicle(req.params.id);
    res.status(200).json({ success: true, data: jobs });
  });
}
