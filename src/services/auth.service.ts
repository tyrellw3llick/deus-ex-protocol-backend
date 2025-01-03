// auth.service.ts
import { PublicKey } from '@solana/web3.js';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';
import { AuthResponseBody, AuthRequestBody } from '../types/auth.types.js';
import { CONFIG } from '../config/env.js';
import { SolanaService } from './solana.service.js';
import { RankService } from './rank.service.js';

export class AuthService {
  private static readonly JWT_SECRET = CONFIG.JWT_SECRET;
  private static readonly JWT_EXPIRES_IN = '24h';

  static isValidSolanaAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  static generateToken(walletAddress: string): string {
    return jwt.sign({ walletAddress }, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
  }

  static async authenticateUser(
    AuthRequestBody: AuthRequestBody,
  ): Promise<AuthResponseBody | null> {
    const { pubKey } = AuthRequestBody;

    // Validate address
    if (!this.isValidSolanaAddress(pubKey)) {
      console.error('Invalid Solana Address', pubKey);
      return null;
    }

    try {
      // Get current token balance
      const currentBalance = await SolanaService.getTokenBalance(pubKey);
      console.log(`Current balance for ${pubKey}: ${currentBalance}`);

      // First, ensure user exists with basic data
      const initialUser = await UserModel.findOneAndUpdate(
        { walletAddress: pubKey },
        {
          $setOnInsert: {
            walletAddress: pubKey,
            rank: 0,
            dailyMessageQuota: 10,
            messagesLeft: 10,
            lastMessageReset: new Date(),
          },
        },
        { upsert: true, new: true },
      );

      if (!initialUser) {
        throw new Error('Failed to create/find user');
      }

      // Use RankService to handle all rank and message quota logic
      await RankService.updateUserRank(pubKey, currentBalance);
      await RankService.resetDailyQuotaIfNeeded(initialUser);

      // Get final user data
      const updatedUser = await UserModel.findOne({ walletAddress: pubKey });

      if (!updatedUser) {
        throw new Error('Failed to find user after updates');
      }

      // Generate and return token
      const token = this.generateToken(updatedUser.walletAddress);

      return {
        token,
        user: {
          walletAddress: updatedUser.walletAddress,
          tokenBalance: updatedUser.tokenBalance,
          rank: updatedUser.rank,
          messagesLeft: updatedUser.messagesLeft,
          dailyMessageQuota: updatedUser.dailyMessageQuota,
        },
      };
    } catch (error) {
      console.error('Error in authentication', error);
      return null;
    }
  }
}
