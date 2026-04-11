import { Request, Response } from 'express';
import { IGarageService } from '../interfaces/IGarageService';
import { IUserService } from '../interfaces/IUserService';
import { asyncHandler } from '../utils/asyncHandler';

export class GarageController {
  private garageService: IGarageService;
  private userService: IUserService;

  constructor(garageService: IGarageService, userService: IUserService) {
    this.garageService = garageService;
    this.userService = userService;
  }

  create = asyncHandler(async (req: Request, res: Response) => {
    const garage = await this.garageService.createGarage(req.body);
    res.status(201).json({ success: true, data: garage });
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const garages = await this.garageService.getAllGarages();
    res.status(200).json({ success: true, data: garages });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const garage = await this.garageService.getGarageById(req.params.id);
    res.status(200).json({ success: true, data: garage });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const garage = await this.garageService.updateGarage(req.params.id, req.body);
    res.status(200).json({ success: true, data: garage });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.garageService.deleteGarage(req.params.id);
    res.status(200).json({ success: true, message: 'Garage deleted' });
  });

  getGarageUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.userService.findByGarage(req.params.id);
    res.status(200).json({ success: true, data: users });
  });

  getAvailableMechanics = asyncHandler(async (req: Request, res: Response) => {
    const mechanics = await this.userService.findAvailableMechanics(req.params.id);
    res.status(200).json({ success: true, data: mechanics });
  });
}
