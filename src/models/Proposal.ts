import { model, Schema } from 'mongoose';
import { IProposal } from '../types/proposal.types.js';

const proposalSchema = new Schema<IProposal>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  roundId: {
    type: Number,
    required: true,
    index: true,
  },
  metrics: {
    totalVotes: { type: Number, default: 0 },
    totalTokensVoted: { type: Number, default: 0 },
    uniqueVoters: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: ['active', 'winner', 'runnerup', 'lost'],
    default: 'active',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

proposalSchema.index({ roundId: 1, status: 1 });

const ProposalModel = model<IProposal>('Proposal', proposalSchema);
export default ProposalModel;
