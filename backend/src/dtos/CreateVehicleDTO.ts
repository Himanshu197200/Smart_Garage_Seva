import Joi from 'joi';

export interface CreateVehicleDTO {
  garageId: string;
  registrationNumber: string;
  brand: string;
  modelName: string;
  year: number;
  currentMileage?: number;
}

export const createVehicleSchema = Joi.object({
  garageId: Joi.string().required().length(6).pattern(/^[A-Za-z0-9]{6}$/),
  registrationNumber: Joi.string().required().trim().uppercase(),
  brand: Joi.string().required().trim(),
  modelName: Joi.string().required().trim(),
  year: Joi.number().required().min(1900).max(new Date().getFullYear() + 1),
  currentMileage: Joi.number().min(0)
});
