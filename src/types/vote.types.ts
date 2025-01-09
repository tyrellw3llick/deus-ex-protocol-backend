import { Types } from 'mongoose';

export interface IVote {
  userId: string;
  proposalId: Types.ObjectId;
  roundId: number;
  weight: number;
  tokenBalance: number;
  createdAt: Date;
}
