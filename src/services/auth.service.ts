import { PublicKey } from '@solana/web3.js';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';
import { AuthResponseBody, AuthRequestBody } from '../types/auth.types.js';
import { CONFIG } from '../config/env.js';

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
      // Find/Create User
      const user = await UserModel.findOneAndUpdate(
        { walletAddress: pubKey.toLowerCase() },
        {
          $setOnInsert: {
            walletAddress: pubKey.toLowerCase(),
            rank: 0,
            tokenBalance: 0,
            dailyMessageQuota: 10,
            messagesLeft: 10,
            lastMessageReset: new Date(),
          },
        },
        { upsert: true, new: true },
      );

      // Verify if daily messages should reset
      if (user.shouldResetMessage()) {
        user.messagesLeft = user.dailyMessageQuota;
        user.lastMessageReset = new Date();
        await user.save();
      }

      // Generate and return token
      const token = this.generateToken(user.walletAddress);

      return {
        token,
        user: {
          walletAddress: user.walletAddress,
          tokenBalance: user.tokenBalance,
          rank: user.rank,
          messagesLeft: user.messagesLeft,
          dailyMessageQuota: user.dailyMessageQuota,
        },
      };
    } catch (error) {
      console.error('Error in authentication', error);
      return null;
    }
  }
}
