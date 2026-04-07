import Joi from 'joi';

export interface CreateServiceJobDTO {
  vehicleId: string;
  garageId: string;
  problemDescription: string;
}

export const createServiceJobSchema = Joi.object({
  vehicleId: Joi.string().required().length(24),
  garageId: Joi.string().required().length(24),
  problemDescription: Joi.string().required().min(10).max(1000).trim()
});
