import { Request } from 'express';

export interface AuthRequestBody {
  pubKey: string;
}

export interface AuthResponseBody {
  token: string;
  user: {
    walletAddress: string;
    messagesLeft: number;
    dailyMessageQuota: number;
  };
}

export interface JWTPayload {
  walletAddress: string;
}

export interface AuthRequest extends Request {
  body: AuthRequestBody;
  verifiedWalletAddress?: string;
}
