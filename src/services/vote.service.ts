import mongoose, { Types } from 'mongoose';
import ProposalModel from '../models/Proposal.js';
import VoteModel from '../models/Vote.js';
import { ProposalService } from './proposal.service.js';
import { RankService } from './rank.service.js';

export class VoteService {
  static async castVote(userId: string, proposalId: Types.ObjectId | string, tokenBalance: number) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const proposalObjectId =
        typeof proposalId === 'string' ? new Types.ObjectId(proposalId) : proposalId;

      const proposal = await ProposalService.getProposalById(proposalObjectId);
      if (!proposal || proposal.status !== 'active') {
        throw new Error('Proposal not existing nor active');
      }

      const existingVote = await VoteModel.findOne({
        userId,
        roundId: proposal.roundId,
      }).session(session);

      const rankTier = RankService.getRankTier(tokenBalance);
      const voteWeight = tokenBalance * rankTier.voteWeight;

      if (existingVote) {
        // Same proposal - no changes needed
        if (existingVote.proposalId.toString() === proposalObjectId.toString()) {
          await session.abortTransaction();
          return existingVote;
        }

        // Remove metrics from old proposal
        await ProposalModel.findByIdAndUpdate(
          existingVote.proposalId,
          {
            $inc: {
              'metrics.totalVotes': -existingVote.weight,
              'metrics.totalTokensVoted': -existingVote.tokenBalance,
              'metrics.uniqueVoters': -1,
            },
          },
          { session },
        );

        // Update existing vote
        await VoteModel.findByIdAndUpdate(
          existingVote._id,
          {
            proposalId: proposalObjectId,
            weight: voteWeight,
            tokenBalance,
          },
          { session },
        );

        // Add metrics to new proposal (no uniqueVoters increment)
        await ProposalModel.findByIdAndUpdate(
          proposalObjectId,
          {
            $inc: {
              'metrics.totalVotes': voteWeight,
              'metrics.totalTokensVoted': tokenBalance,
              // Don't increment uniqueVoters - user is just moving their vote
            },
          },
          { session },
        );
      } else {
        // Create new vote
        await VoteModel.create(
          [
            {
              userId,
              proposalId: proposalObjectId,
              roundId: proposal.roundId,
              weight: voteWeight,
              tokenBalance,
            },
          ],
          { session },
        );

        // Add metrics for new voter
        await ProposalModel.findByIdAndUpdate(
          proposalObjectId,
          {
            $inc: {
              'metrics.totalVotes': voteWeight,
              'metrics.totalTokensVoted': tokenBalance,
              'metrics.uniqueVoters': 1, // New voter
            },
          },
          { session },
        );
      }

      await session.commitTransaction();

      return await VoteModel.findOne({
        userId,
        roundId: proposal.roundId,
      });
    } catch (error) {
      await session.abortTransaction();
      console.error('Error casting vote:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }
}

