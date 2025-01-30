// routes/ai.routes.ts
import { Router, Response } from 'express';
import { AuthRequest } from '../types/auth.types.js';
import { AiService } from '../services/ai.service.js';
import { createSuccessResponse, createErrorResponse } from '../types/api.types.js';
import { AiName } from '../types/ai.types.js';

const router = Router();

/**
 * Get all available AIs
 * GET /api/ai
 */
const getAvailableAIsHandler = async (req: AuthRequest, res: Response) => {
  try {
    const ais = AiService.getAvailableAis();
    res.status(200).json(createSuccessResponse({ ais }));
  } catch (error) {
    console.error('Error fetching AIs:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Failed to fetch AIs'));
  }
};

/**
 * Get specific AI by name
 * GET /api/ai/:name
 */
const getAiByNameHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.params;
    const ai = AiService.getAiByName(name as AiName);

    if (!ai) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'AI not found'));
      return;
    }

    res.status(200).json(createSuccessResponse({ ai }));
  } catch (error) {
    console.error('Error fetching AI:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Failed to fetch AI'));
  }
};

router.get('/', getAvailableAIsHandler);
router.get('/:name', getAiByNameHandler);

export default router;
