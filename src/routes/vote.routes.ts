import { Response, Router } from 'express';
import { CastVoteRequest, VoteStatusRequest } from '../types/vote.types.js';
import { createErrorResponse, createSuccessResponse } from '../types/api.types.js';
import { SolanaService } from '../services/solana.service.js';
import { VoteService } from '../services/vote.service.js';
import { ProposalService } from '../services/proposal.service.js';

const router = Router();

/**
 * Cast a vote
 * POST /api/vote */

const castVoteHandler = async (req: CastVoteRequest, res: Response) => {
  try {
    const { proposalId } = req.body;
    const userId = req.verifiedWalletAddress;

    if (!userId) {
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Not authorized'));
      return;
    }

    if (!proposalId) {
      res.status(400).json(createErrorResponse('INVALID_INPUT', 'Proposal ID is required'));
      return;
    }

    const tokenBalance = await SolanaService.getTokenBalance(userId);
    const vote = await VoteService.castVote(userId, proposalId, tokenBalance);
    res.status(200).json(createSuccessResponse({ vote }));
  } catch (error) {
    console.error('Error casting vote:', error);
    if (error instanceof Error) {
      if (error.message === 'Proposal not existing nor active') {
        res
          .status(400)
          .json(
            createErrorResponse('INVALID_PROPOSAL', 'Proposal is not active or does not exist'),
          );
        return;
      }
    }

    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Failed to cast vote'));
  }
};

/**
 * Get user's vote status in a round
 * GET /api/vote/status/:roundId
 */
const getUserVoteInRoundHanlder = async (req: VoteStatusRequest, res: Response) => {
  try {
    const roundId = parseInt(req.params.roundId);
    const userId = req.verifiedWalletAddress;

    if (isNaN(roundId)) {
      res.status(400).json(createErrorResponse('INVALID_INPUT', 'Invalid round ID'));
      return;
    }

    if (!userId) {
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Not authorized'));
      return;
    }

    const vote = await ProposalService.getUserVoteInRound(userId, roundId);
    res.status(200).json(createSuccessResponse({ vote }));
  } catch (error) {
    console.error('Error fetching vote status:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Failed to fetch vote status'));
  }
};

router.post('/', castVoteHandler);
router.get('/status/:roundId', getUserVoteInRoundHanlder);
export default router;
