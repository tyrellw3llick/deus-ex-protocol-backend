import { Document } from 'mongoose';
import { NumericRank } from './rank.types.js';

export interface User extends Document {
  walletAddress: string;
  tokenBalance: number;
  rank: NumericRank;
  dailyMessageQuota: number;
  messagesLeft: number;
  lastMessageReset: Date;
  createdAt: Date;
  shouldResetMessage(): boolean;
}
