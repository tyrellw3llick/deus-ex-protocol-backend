import { Response, Router, RequestHandler } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AuthRequest } from '../types/auth.types.js';

const router = Router();

const loginHandler: RequestHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.body.pubKey) {
      res.status(400).json({
        success: false,
        message: 'Wallet address is required',
      });
      return;
    }

    const authResponseBody = await AuthService.authenticateUser(req.body);

    if (!authResponseBody) {
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
      });
      return;
    }

    res.status(200).json({
      success: true,
      ...authResponseBody,
    });
  } catch (error) {
    if (!res.headersSent) {
      console.error('Authentication service error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during authentication',
      });
    }
  }
};

router.post('/login', loginHandler);

export default router;
