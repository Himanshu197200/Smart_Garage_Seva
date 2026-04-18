import Joi from 'joi';

export interface CreateServiceJobDTO {
  vehicleId: string;
  garageId: string;
  problemDescription: string;
}

export const createServiceJobSchema = Joi.object({
  vehicleId: Joi.string().required().pattern(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/).messages({ 'string.pattern.base': 'Vehicle ID must be a valid registration number (e.g., GJ05PQ1234)' }),
  garageId: Joi.string().required().length(6).pattern(/^[A-Za-z0-9]{6}$/),
  problemDescription: Joi.string().required().min(10).max(1000).trim()
});
