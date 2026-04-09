import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/AppError';
import { UserRole } from '../models/User';

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ForbiddenError('Authentication required');
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
    }
    next();
  };
};

export const adminOnly = authorize(UserRole.ADMIN);
export const mechanicOnly = authorize(UserRole.MECHANIC);
export const customerOnly = authorize(UserRole.CUSTOMER);
export const adminOrMechanic = authorize(UserRole.ADMIN, UserRole.MECHANIC);
