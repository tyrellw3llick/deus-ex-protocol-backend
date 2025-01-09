import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/auth.types.js';
import { CONFIG } from '../config/env.js';

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const adminPassword = req.headers['admin-password'];

  if (!adminPassword || adminPassword !== CONFIG.ADMIN_PASSWORD) {
    res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
    return;
  }

  next();
};
