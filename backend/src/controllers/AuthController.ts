import { Request, Response } from 'express';
import { IAuthService } from '../interfaces/IAuthService';
import { asyncHandler } from '../utils/asyncHandler';

export class AuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  register = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.authService.register(req.body);
    const { passwordHash, ...userWithoutPassword } = user.toObject();
    res.status(201).json({ success: true, data: userWithoutPassword });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);
    res.status(200).json({ success: true, data: result });
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const { passwordHash, ...userWithoutPassword } = req.user!.toObject();
    res.status(200).json({ success: true, data: userWithoutPassword });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  });
}
