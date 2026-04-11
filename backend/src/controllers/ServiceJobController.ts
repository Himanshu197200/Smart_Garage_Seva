import { Request, Response } from 'express';
import { IServiceJobService } from '../interfaces/IServiceJobService';
import { asyncHandler } from '../utils/asyncHandler';

export class ServiceJobController {
  private serviceJobService: IServiceJobService;

  constructor(serviceJobService: IServiceJobService) {
    this.serviceJobService = serviceJobService;
  }

  create = asyncHandler(async (req: Request, res: Response) => {
    const job = await this.serviceJobService.createJob(req.body, req.user!._id.toString());
    res.status(201).json({ success: true, data: job });
  });

  getJobs = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user!;
    const garageId = req.query.garageId as string | undefined;
    const jobs = await this.serviceJobService.getJobsByRole(user._id.toString(), user.role, garageId);
    res.status(200).json({ success: true, data: jobs });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const job = await this.serviceJobService.getJobById(req.params.id);
    res.status(200).json({ success: true, data: job });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.serviceJobService.updateEstimate(req.params.id, req.body.costEstimate);
    res.status(200).json({ success: true, data: updated });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.serviceJobService.deleteJob(req.params.id);
    res.status(200).json({ success: true, message: 'Job cancelled' });
  });

  assignMechanic = asyncHandler(async (req: Request, res: Response) => {
    const { mechanicId } = req.body;
    const job = await this.serviceJobService.assignMechanic(req.params.id, mechanicId);
    res.status(200).json({ success: true, data: job });
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user!;
    const job = await this.serviceJobService.updateStatus(
      req.params.id,
      req.body.status,
      user._id.toString(),
      user.role
    );
    res.status(200).json({ success: true, data: job });
  });

  updateEstimate = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.serviceJobService.updateEstimate(req.params.id, req.body.costEstimate);
    res.status(200).json({ success: true, data: updated });
  });

  getTransitions = asyncHandler(async (req: Request, res: Response) => {
    const transitions = await this.serviceJobService.getAvailableTransitions(req.params.id);
    res.status(200).json({ success: true, data: transitions });
  });
}
