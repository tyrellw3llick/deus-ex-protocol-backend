import { model, Schema } from 'mongoose';
import { IProposal } from '../types/proposal.types.js';

const proposalSchema = new Schema<IProposal>({
  title: {
    required: true,
    type: String,
    trim: true,
  },
  description: {
    required: true,
    type: String,
    trim: true,
  },
  roundId: {
    required: true,
    type: Number,
    index: true,
  },
  metrics: {
    totalVotes: {
      type: Number,
      defaul: 0,
    },
    totalTokensVoted: {
      type: Number,
      defaul: 0,
    },
    uniqueVoters: {
      type: Number,
      defaul: 0,
    },
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'winner', 'closed', 'runnerup'],
    default: 'active',
  },
  endDate: {
    type: Date,
    required: true,
  },
});

proposalSchema.index({ roundId: 1, status: 1 });

const ProposalModel = model<IProposal>('Proposal', proposalSchema);
export default ProposalModel;
