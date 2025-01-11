import { Document, Types } from 'mongoose';

type ProposalStatus = 'active' | 'winner' | 'runnerup' | 'lost';

interface ProposalMetrics {
  totalVotes: number;
  totalTokensVoted: number;
  uniqueVoters: number;
}

export interface IProposal extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  roundId: number;
  metrics: ProposalMetrics;
  status: ProposalStatus;
  endDate: Date;
}
