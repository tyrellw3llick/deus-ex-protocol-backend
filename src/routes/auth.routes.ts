import { Response, Router, RequestHandler } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AuthRequest } from '../types/auth.types.js';

const router = Router();

const loginHandler: RequestHandler = async (req: AuthRequest, res: Response) => {
  try {
    const authRequestBody = req.body;
    const authResponseBody = await AuthService.authenticateUser(authRequestBody);

    if (!authResponseBody) {
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
      });
    }

    res.status(200).json({
      success: true,
      ...authResponseBody,
    });
  } catch (error) {
    console.error('Authentication service error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication',
    });
  }
};

router.post('/login', loginHandler);

export default router;
