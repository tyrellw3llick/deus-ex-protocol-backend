import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/env.js';
import { AuthRequest, JWTPayload } from '../types/auth.types.js';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authorization token required',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as JWTPayload;

    if (req.body.pubKey && req.body.pubKey !== decoded.walletAddress) {
      res.status(401).json({
        success: false,
        message: 'Token does not match provided wallet address',
      });
      return;
    }

    req.verifiedWalletAddress = decoded.walletAddress;

    next();
  } catch (error) {
    console.error('Auth middleware error', error);
    res.status(401).json({
      success: false,
      message: 'Not authorized',
    });
    return;
  }
};
