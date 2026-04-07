import Joi from 'joi';

export interface JobPartUsageDTO {
  serviceJobId: string;
  inventoryId: string;
  quantityUsed: number;
}

export const jobPartUsageSchema = Joi.object({
  serviceJobId: Joi.string().required().length(24),
  inventoryId: Joi.string().required().length(24),
  quantityUsed: Joi.number().required().min(1)
});
