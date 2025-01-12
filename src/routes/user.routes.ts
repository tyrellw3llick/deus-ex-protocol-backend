import { Response, Router, RequestHandler } from 'express';
import { SolanaService } from '../services/solana.service.js';
import { RankService } from '../services/rank.service.js';
import UserModel from '../models/User.js';
import { AuthRequest } from '../types/auth.types.js';
import { createSuccessResponse, createErrorResponse } from '../types/api.types.js';

const router = Router();

const refreshBalanceHandler: RequestHandler = async (req: AuthRequest, res: Response) => {
  try {
    const walletAddress = req.verifiedWalletAddress!;

    if (!walletAddress) {
      res.status(400).json(createErrorResponse('NO_WALLET', 'No wallet found'));
      return;
    }

    const currentBalance = await SolanaService.getTokenBalance(walletAddress);
    await RankService.updateUserRank(walletAddress, currentBalance);
    const user = await UserModel.findOne({ walletAddress: walletAddress });

    if (!user) {
      res.status(404).json(createErrorResponse('USER_NOT_FOUND', 'User not found'));
      return;
    }

    res.status(200).json(
      createSuccessResponse({
        walletAddress: user.walletAddress,
        tokenBalance: user.tokenBalance,
        rank: user.rank,
        messagesLeft: user.messagesLeft,
        dailyMessageQuota: user.dailyMessageQuota,
      }),
    );
  } catch (error) {
    console.error('Balance refresh error:', error);
    res.status(500).json(createErrorResponse('REFRESH_FAILED', 'Failed to refresh balance'));
  }
};

router.post('/refresh-balance', refreshBalanceHandler);

export default router;
