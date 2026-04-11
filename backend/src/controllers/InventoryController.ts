import { Request, Response } from 'express';
import { IInventoryService } from '../interfaces/IInventoryService';
import { JobPartUsageModel } from '../models/JobPartUsage';
import { asyncHandler } from '../utils/asyncHandler';

export class InventoryController {
  private inventoryService: IInventoryService;

  constructor(inventoryService: IInventoryService) {
    this.inventoryService = inventoryService;
  }

  create = asyncHandler(async (req: Request, res: Response) => {
    const item = await this.inventoryService.addItem(req.body);
    res.status(201).json({ success: true, data: item });
  });

  getGarageInventory = asyncHandler(async (req: Request, res: Response) => {
    const garageId = req.query.garageId as string || req.user!.garageId?.toString() || '';
    const items = await this.inventoryService.getGarageInventory(garageId);
    res.status(200).json({ success: true, data: items });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const item = await this.inventoryService.getItemById(req.params.id);
    res.status(200).json({ success: true, data: item });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.inventoryService.updateItem(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.inventoryService.deleteItem(req.params.id);
    res.status(200).json({ success: true, message: 'Item deleted' });
  });

  updateStock = asyncHandler(async (req: Request, res: Response) => {
    const { quantity } = req.body;
    const updated = await this.inventoryService.updateStock(req.params.id, quantity);
    res.status(200).json({ success: true, data: updated });
  });

  getLowStock = asyncHandler(async (req: Request, res: Response) => {
    const garageId = req.query.garageId as string || req.user!.garageId?.toString() || '';
    const items = await this.inventoryService.getLowStockItems(garageId);
    res.status(200).json({ success: true, data: items });
  });

  recordPartUsage = asyncHandler(async (req: Request, res: Response) => {
    const { serviceJobId, inventoryId, quantityUsed } = req.body;
    const item = await this.inventoryService.getItemById(inventoryId);
    await this.inventoryService.consumePart(item.garageId.toString(), item.partNumber, quantityUsed);
    const usage = new JobPartUsageModel({ serviceJobId, inventoryId, quantityUsed });
    await usage.save();
    res.status(201).json({ success: true, data: usage });
  });

  getJobPartUsage = asyncHandler(async (req: Request, res: Response) => {
    const usage = await JobPartUsageModel.find({ serviceJobId: req.params.jobId }).populate('inventoryId').exec();
    res.status(200).json({ success: true, data: usage });
  });
}
