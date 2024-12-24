import { Request, Response, NextFunction } from 'express';
import { CONFIG } from '../config/env.js';
import { AppError } from '../types/error.js';

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(CONFIG.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
