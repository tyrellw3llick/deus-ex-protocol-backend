import { Request } from 'express';
import { NumericRank } from './rank.types.js';

export interface AuthRequestBody {
  pubKey: string;
}

export interface AuthResponseBody {
  token: string;
  user: {
    walletAddress: string;
    tokenBalance: number;
    rank: NumericRank;
    messagesLeft: number;
    dailyMessageQuota: number;
  };
}

export interface JWTPayload {
  walletAddress: string;
}

export interface AuthRequest extends Request {
  verifiedWalletAddress?: string;
}
