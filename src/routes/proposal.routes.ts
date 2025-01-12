import { Response, Router } from 'express';
import { CreateProposalRequest, EndRoundRequest } from '../types/proposal.types.js';
import { createErrorResponse, createSuccessResponse } from '../types/api.types.js';
import { ProposalService } from '../services/proposal.service.js';
import { RoundIdRequest } from '../types/vote.types.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';
import { AuthRequest } from '../types/auth.types.js';

const router = Router();

// ADMIN ROUTES

/**
 * Create new proposal (Admin only)
 * POST /api/admin/proposal
 */
const createProposalHandler = async (req: CreateProposalRequest, res: Response) => {
  try {
    const { title, description, roundId, endDate } = req.body;

    if (!title || !description || !roundId || !endDate) {
      res.status(400).json(createErrorResponse('INVALID_INPUT', 'All fields are required'));
      return;
    }

    const proposal = await ProposalService.createProposal({
      title,
      description,
      roundId,
      endDate: new Date(endDate),
    });

    res.status(201).json(createSuccessResponse({ proposal }));
  } catch (error) {
    console.error('Error creating proposal', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Failed to create proposal'));
  }
};

/**
 * End voting round (Admin only)
 * POST /api/admin/round/end
 */
const endRoundHandler = async (req: EndRoundRequest, res: Response) => {
  try {
    const { roundId } = req.body;

    if (!roundId) {
      res.status(400).json(createErrorResponse('INVALID_INPUT', 'Round ID is required'));
      return;
    }

    const winner = await ProposalService.endRound(roundId);
    res.status(200).json(createSuccessResponse({ winner }));
  } catch (error) {
    console.error('Error ending round:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Failed to end round'));
  }
};

// USER ROUTES

/**
 * Get active proposals
 * GET /api/proposals/active
 */
const getActiveProposalsHandler = async (req: AuthRequest, res: Response) => {
  try {
    const proposals = await ProposalService.getActiveProposals();
    res.status(200).json(createSuccessResponse({ proposals }));
  } catch (error) {
    console.error('Error fetching active proposal:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Failed to fetch active proposals'));
  }
};

/**
 * Get proposals by round ID
 * GET /api/proposals/:roundId
 */
const getProposalsByRoundIdHandler = async (req: RoundIdRequest, res: Response) => {
  try {
    const roundId = parseInt(req.params.roundId);

    if (isNaN(roundId)) {
      res.status(400).json(createErrorResponse('INVALID_INPUT', 'Invalid round ID'));
      return;
    }

    const proposals = await ProposalService.getProposalsByRoundId(roundId);
    res.status(200).json(createSuccessResponse({ proposals }));
  } catch (error) {
    console.error('Error fetching round proposals', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Failed to fetch round proposals'));
  }
};

// Admin routes
router.post('/proposal', adminMiddleware, createProposalHandler);
router.post('/round/end', adminMiddleware, endRoundHandler);

// User routes
router.get('/active', getActiveProposalsHandler);
router.get('/:roundId', getProposalsByRoundIdHandler);
export default router;
