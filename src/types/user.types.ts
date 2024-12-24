import { Document } from 'mongoose';

export interface User extends Document {
  walletAddress: string;
  dailyMessageQuota: number;
  messagesLeft: number;
  lastMessageReset: Date;
  createdAt: Date;
  shouldResetMessage(): boolean;
}
