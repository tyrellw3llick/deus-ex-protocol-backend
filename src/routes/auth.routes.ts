import { Response, Router, RequestHandler } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AuthRequest } from '../types/auth.types.js';
import { createSuccessResponse, createErrorResponse } from '../types/api.types.js';

const router = Router();

const loginHandler: RequestHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.body.pubKey) {
      res.status(400).json(createErrorResponse('MISSING_WALLET', 'Wallet address is required'));
      return;
    }

    const authResponseBody = await AuthService.authenticateUser(req.body);

    if (!authResponseBody) {
      res.status(401).json(createErrorResponse('AUTH_FAILED', 'Authentication failed'));
      return;
    }

    res.status(200).json(createSuccessResponse(authResponseBody));
  } catch (error) {
    if (!res.headersSent) {
      console.error('Authentication service error:', error);
      res
        .status(500)
        .json(createErrorResponse('INTERNAL_ERROR', 'Internal server error during authentication'));
    }
  }
};

router.post('/login', loginHandler);

export default router;
