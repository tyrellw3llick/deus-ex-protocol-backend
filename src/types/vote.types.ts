import { Document, Types } from 'mongoose';

export interface IVote extends Document {
  userId: string;
  proposalId: Types.ObjectId;
  roundId: number;
  weight: number;
  tokenBalance: number;
  createdAt: Date;
}
