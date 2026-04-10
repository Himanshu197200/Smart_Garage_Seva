import { Request, Response } from 'express';
import { IUserService } from '../interfaces/IUserService';
import { asyncHandler } from '../utils/asyncHandler';

export class UserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  getById = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.findById(req.params.id);
    res.status(200).json({ success: true, data: user });
  });

  getGarageUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.userService.findByGarage(req.params.garageId);
    res.status(200).json({ success: true, data: users });
  });

  getAvailableMechanics = asyncHandler(async (req: Request, res: Response) => {
    const mechanics = await this.userService.findAvailableMechanics(req.params.garageId);
    res.status(200).json({ success: true, data: mechanics });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.userService.updateProfile(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    await this.userService.deleteUser(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted' });
  });
}
