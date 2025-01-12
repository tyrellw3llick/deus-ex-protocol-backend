import { Request, Response, NextFunction } from 'express';
import { createErrorResponse } from '../types/api.types.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler caught:', err);

  // Make sure we're dealing with a proper response object
  if (!res.status || typeof res.status !== 'function') {
    console.error('Invalid response object in error handler');
    return next(err);
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'An unexpected error occurred'));
};
