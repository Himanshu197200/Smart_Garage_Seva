import Joi from 'joi';

export interface CreateInventoryDTO {
  garageId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  lowStockThreshold?: number;
}

export const createInventorySchema = Joi.object({
  garageId: Joi.string().required().length(6).pattern(/^[A-Za-z0-9]{6}$/),
  partName: Joi.string().required().trim(),
  partNumber: Joi.string().required().trim().uppercase(),
  quantity: Joi.number().required().min(0),
  unitPrice: Joi.number().required().min(0),
  lowStockThreshold: Joi.number().min(0)
});
