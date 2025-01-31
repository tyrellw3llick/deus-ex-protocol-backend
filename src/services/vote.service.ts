import mongoose, { Types } from 'mongoose';
import ProposalModel from '../models/Proposal.js';
import VoteModel from '../models/Vote.js';
import { ProposalService } from './proposal.service.js';
import { RankService } from './rank.service.js';

// File: services/vote.service.ts

export class VoteService {
  static async castVote(userId: string, proposalId: Types.ObjectId | string, tokenBalance: number) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const proposalObjectId =
        typeof proposalId === 'string' ? new Types.ObjectId(proposalId) : proposalId;

      // Check if proposal exists and is active
      const proposal = await ProposalModel.findById(proposalObjectId);
      if (!proposal || proposal.status !== 'active') {
        throw new Error('Proposal not existing nor active');
      }

      const existingVote = await VoteModel.findOne({
        userId,
        roundId: proposal.roundId,
      }).session(session);

      const rankTier = RankService.getRankTier(tokenBalance);
      const voteWeight = tokenBalance * rankTier.voteWeight;

      // First time voting
      if (!existingVote) {
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

        await ProposalModel.findByIdAndUpdate(
          proposalObjectId,
          {
            $set: {
              'metrics.totalVotes': voteWeight,
              'metrics.totalTokensVoted': tokenBalance,
              'metrics.uniqueVoters': 1,
            },
          },
          { session },
        );
      } else if (existingVote.proposalId.toString() === proposalObjectId.toString()) {
        // Update vote for same proposal (only if weight changed)
        if (existingVote.weight !== voteWeight) {
          await VoteModel.findByIdAndUpdate(
            existingVote._id,
            {
              weight: voteWeight,
              tokenBalance,
            },
            { session },
          );

          await ProposalModel.findByIdAndUpdate(
            proposalObjectId,
            {
              $set: {
                'metrics.totalVotes': voteWeight,
                'metrics.totalTokensVoted': tokenBalance,
              },
            },
            { session },
          );
        }
      } else {
        // Change vote to different proposal
        // 1. Reset old proposal metrics
        await ProposalModel.findByIdAndUpdate(
          existingVote.proposalId,
          {
            $set: {
              'metrics.totalVotes': 0,
              'metrics.totalTokensVoted': 0,
              'metrics.uniqueVoters': 0,
            },
          },
          { session },
        );

        // 2. Set new proposal metrics
        await ProposalModel.findByIdAndUpdate(
          proposalObjectId,
          {
            $set: {
              'metrics.totalVotes': voteWeight,
              'metrics.totalTokensVoted': tokenBalance,
              'metrics.uniqueVoters': 1,
            },
          },
          { session },
        );

        // 3. Update vote record
        await VoteModel.findByIdAndUpdate(
          existingVote._id,
          {
            proposalId: proposalObjectId,
            weight: voteWeight,
            tokenBalance,
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
