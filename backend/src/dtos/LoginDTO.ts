import Joi from 'joi';

export interface LoginDTO {
  email: string;
  password: string;
}

export const loginSchema = Joi.object({
  email: Joi.string().required().email().lowercase().trim(),
  password: Joi.string().required()
});
