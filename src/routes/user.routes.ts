import { Response, Router, RequestHandler } from 'express';
import { SolanaService } from '../services/solana.service.js';
import { RankService } from '../services/rank.service.js';
import UserModel from '../models/User.js';
import { AuthRequest } from '../types/auth.types.js';

const router = Router();

// @route   POST /api/user/refresh-balance
// @desc    Refresh user's token balance and update rank
// @access  Private
const refreshBalanceHandler: RequestHandler = async (req: AuthRequest, res: Response) => {
  try {
    const walletAddress = req.verifiedWalletAddress!;

    if (!walletAddress) {
      res.status(400).json({
        success: false,
        message: 'No wallet found',
      });
      return;
    }

    // Get current balance from Solana
    const currentBalance = await SolanaService.getTokenBalance(walletAddress);

    // Update user's rank and quotas based on new balance
    await RankService.updateUserRank(walletAddress, currentBalance);

    // Get updated user data
    const user = await UserModel.findOne({ walletAddress: walletAddress });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Return only updated user data
    res.status(200).json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        tokenBalance: user.tokenBalance,
        rank: user.rank,
        messagesLeft: user.messagesLeft,
        dailyMessageQuota: user.dailyMessageQuota,
      },
    });
  } catch (error) {
    console.error('Balance refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh balance',
    });
  }
};

router.post('/refresh-balance', refreshBalanceHandler);

export default router;
