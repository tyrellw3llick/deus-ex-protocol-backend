import { model, Schema } from 'mongoose';
import { IProposal } from '../types/proposal.types.js';

const proposalSchema = new Schema<IProposal>({
  title: {
    required: true,
    type: String,
    trim: true,
    minlength: [1, 'Title must be at least 1 characters long'],
    maxlength: [30, 'Title max length is 30 characters'],
  },
  description: {
    required: true,
    type: String,
    trim: true,
    minlength: [20, 'Description must be at least 20 characters long'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  roundId: {
    required: true,
    type: Number,
    index: true,
    min: [1, 'Round ID must be positive'],
    validate: {
      validator: Number.isInteger,
      message: 'Round ID must be a whole number',
    },
  },
  metrics: {
    totalVotes: {
      type: Number,
      defaul: 0,
      min: [0, 'Total votes cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Total votes must be a whole number',
      },
    },
    totalTokensVoted: {
      type: Number,
      defaul: 0,
      min: [0, 'Total tokens voted cannot be negative'],
      validate: {
        validator: Number.isFinite,
        message: 'Total tokens must be a finite number',
      },
    },
    uniqueVoters: {
      type: Number,
      defaul: 0,
      min: [0, 'Unique voters cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Unique voters must be a whole number',
      },
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
    validate: {
      validator: (endDate: Date) => endDate > new Date(),
      message: 'End date must be in the future',
    },
  },
});

proposalSchema.index({ roundId: 1, status: 1 });

const ProposalModel = model<IProposal>('Proposal', proposalSchema);
export default ProposalModel;
