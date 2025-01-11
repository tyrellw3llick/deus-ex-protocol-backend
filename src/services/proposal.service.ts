import mongoose from 'mongoose';
import ProposalModel from '../models/Proposal.js';

export class ProposalService {
  /**
   * Creates a new proposal for voting round
   */

  static async createProposal(data: {
    title: string;
    description: string;
    roundId: number;
    startDate: Date;
    endDate: Date;
  }) {
    try {
      const proposal = await ProposalModel.create({
        ...data,
        metrics: {
          totalVotes: 0,
          totalTokensVoted: 0,
          uniqueVoter: 0,
        },
        status: 'active',
      });

      return proposal;
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  }

  /**
   * Get all active proposals in current round
   */
  static async getActiveProposals() {
    try {
      return await ProposalModel.find({
        status: 'active',
      }).sort({ 'metrics.totalVotes': -1 });
    } catch (error) {
      console.error('Error getting active proposals:', error);
      throw error;
    }
  }

  /**
   * Get historical proposals with their final results
   */
  static async getProposalHistory() {
    try {
      return await ProposalModel.find({
        status: { $ne: 'active' },
      }).sort({ roundId: -1, 'metrics.totalVotes': -1 });
    } catch (error) {
      console.error('Error getting proposal history:', error);
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
      }).sort({
        'metrics.totalVotes': -1,
      });

      if (proposals.length === 0) {
        throw new Error('No active proposals found in round');
      }

      const updates = proposals.map((proposal, index) => {
        let status: 'winner' | 'runnerup' | 'lost';

        if (index === 0) status = 'winner';
        else if (index === 1) status = 'runnerup';
        else status = 'lost';

        return ProposalModel.findByIdAndUpdate(proposal._id, { $set: { status } }, { session });
      });
      await Promise.all(updates);
      await session.commitTransaction();

      return proposals[0];
    } catch (error) {
      await session.abortTransaction();
      console.error('Error ending round:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Gets the current active round ID
   * Useful for frontend to know which round to display
   */
  static async getCurrentRoundId(): Promise<number> {
    const latestProposal = await ProposalModel.findOne({
      status: 'active',
    }).sort({ roundId: -1 });

    return latestProposal?.roundId || 0;
  }

  /**
   * Check if a proposal exists and is active
   */
  static async isProposalActive(proposalId: string): Promise<boolean> {
    const proposal = await ProposalModel.findById(proposalId);
    return proposal?.status === 'active';
  }
}
