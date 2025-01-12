import { Document, Types } from 'mongoose';
import { AdminRequest } from './admin.types.js';

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

export interface CreateProposalBody {
  title: string;
  description: string;
  roundId: number;
  endDate: Date;
}

export interface CreateProposalRequest extends AdminRequest {
  body: CreateProposalBody;
}

export interface EndRoundBody {
  roundId: number;
}

export interface EndRoundRequest extends AdminRequest {
  body: EndRoundBody;
}
