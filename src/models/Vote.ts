import { model, Schema } from 'mongoose';
import { IVote } from '../types/vote.types.js';

const voteSchema = new Schema<IVote>({
  userId: {
    type: String,
    required: true,
  },
  proposalId: {
    type: Schema.Types.ObjectId,
    ref: 'Proposal',
    required: true,
  },
  roundId: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  tokenBalance: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

voteSchema.index({ userId: 1, roundId: 1 });
voteSchema.index({ proposalId: 1, createdAt: 1 });

const VoteModel = model<IVote>('Vote', voteSchema);
export default VoteModel;
