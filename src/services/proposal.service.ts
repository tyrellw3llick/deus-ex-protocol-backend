import mongoose, { Types } from 'mongoose';
import ProposalModel from '../models/Proposal.js';
import VoteModel from '../models/Vote.js';

export class ProposalService {
  /**
   * Creates a new proposal for voting round
   */
  static async createProposal(data: {
    title: string;
    description: string;
    roundId: number;
    endDate: Date;
  }) {
    try {
      if (data.endDate <= new Date()) {
        throw new Error('End date must be in the future');
      }

      const proposal = await ProposalModel.create({
        ...data,
        metrics: {
          totalVotes: 0,
          totalTokensVoted: 0,
          uniqueVoters: 0,
        },
        status: 'active',
      });

      return proposal;
    } catch (error) {
      console.error('Error creating the proposal:', error);
      throw error;
    }
  }

  /**
   * Get all active proposals in current round
   */
  static async getActiveProposals(roundId: number) {
    try {
      return await ProposalModel.find({
        roundId,
        status: 'active',
      }).sort({ 'metrics.totalVotes': -1 });
    } catch (error) {
      console.error('Error retrieving active proposals', error);
      throw error;
    }
  }

  /**
   * Get proposal by ID
   */
  static async getProposalById(proposalId: Types.ObjectId | string) {
    try {
      return await ProposalModel.findById(proposalId);
    } catch (error) {
      console.error('Error retrieving the proposal', error);
      throw error;
    }
  }

  /**
   * Updates proposal metrics when a new vote is cast
   */
  static async updateProposalMetrics(proposalId: string, tokenBalance: number) {
    try {
      await ProposalModel.findByIdAndUpdate(proposalId, {
        $inc: {
          'metrics.totalVotes': 1,
          'metrics.totalTokensVoted': tokenBalance,
          'metrics.uniqueVoters': 1,
        },
      });
    } catch (error) {
      console.error('Error updating proposal metrics', error);
      throw error;
    }
  }

  /**
   * Gets the current active round ID
   */
  static async getCurrentRoundId(): Promise<number> {
    const activeProposals = await ProposalModel.findOne({
      status: 'active',
    }).sort({ roundId: -1 });

    return activeProposals?.roundId || 0;
  }

  /**
   * Check if a proposal exists and is active
   */
  static async isProposalActive(proposalId: string): Promise<boolean> {
    try {
      const proposal = await ProposalModel.findById(proposalId);
      return proposal?.status === 'active';
    } catch (error) {
      console.error('Error checking if proposal is active', error);
      throw error;
    }
  }

  /**
   * Check if user has already voted in a specific round
   */
  static async hasUserVotedInRound(userId: string, roundId: number): Promise<boolean> {
    try {
      const vote = await VoteModel.findOne({
        userId,
        roundId,
      });

      return !!vote;
    } catch (error) {
      console.error('Error checking user vote status', error);
      throw error;
    }
  }

  /**
   * Get user's vote in a round if exists
   */
  static async getUserVoteInRound(userId: string, roundId: number) {
    try {
      return await VoteModel.findOne({
        userId,
        roundId,
      }).populate('proposalId');
    } catch (error) {
      console.error('Error retrieving user vote in round', error);
      throw error;
    }
  }

  /**
   * Get all proposals in a specific round
   * Useful for showing round history
   */
  static async getProposalByRoundId(roundId: number) {
    try {
      return await ProposalModel.find({
        roundId,
      }).sort({
        status: 1,
        'metrics.totalVotes': -1,
      });
    } catch (error) {
      console.error('Error retrieving the proposals by round id', error);
      throw error;
    }
  }

  /**
   * Ends the current voting round and determines winners
   */
  static async endRound(roundId: number) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const proposals = await ProposalModel.find({
        roundId,
        status: 'active',
      })
        .sort({ 'metrics.totalVotes': -1 })
        .session(session);

      if (proposals.length === 0) {
        throw new Error('No active proposals found in round');
      }

      const updates = proposals.map((proposal, index) => {
        let status: 'winner' | 'runnerup' | 'closed' = 'closed';

        if (index === 0) status = 'winner';
        else if (index === 1) status = 'runnerup';

        return ProposalModel.findByIdAndUpdate(proposal._id, { status }, { session });
      });

      await Promise.all(updates);
      await session.commitTransaction();

      return proposals[0];
    } catch (error) {
      await session.abortTransaction();
      console.error('Error ending round', error);
      throw error;
    } finally {
      session.endSession();
    }
  }
}
