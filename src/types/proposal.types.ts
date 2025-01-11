import { Document } from 'mongoose';

type ProposalStatus = 'active' | 'winner' | 'runnerup' | 'lost';

interface ProposalMetrics {
  totalVotes: number;
  totalTokensVoted: number;
  uniqueVoters: number;
}

export interface IProposal extends Document {
  title: string;
  description: string;
  roundId: number;
  metrics: ProposalMetrics;
  status: ProposalStatus;
  endDate: Date;
}
