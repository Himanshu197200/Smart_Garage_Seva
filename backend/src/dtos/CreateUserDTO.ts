import Joi from 'joi';
import { UserRole } from '../models/User';

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  skills?: string[];
  garageId?: string;
}

export const createUserSchema = Joi.object({
  name: Joi.string().required().min(2).max(50).trim(),
  email: Joi.string().required().email().lowercase().trim(),
  password: Joi.string().required().min(6).max(128),
  phone: Joi.string().required().pattern(/^[0-9]{10}$/),
  role: Joi.string().valid(...Object.values(UserRole)).required(),
  skills: Joi.array().items(Joi.string().trim()),
  garageId: Joi.string().length(24).optional().allow(null)
});
