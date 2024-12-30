import { RankTier } from '../types/rank.types.js';
import UserModel from '../models/User.js';
import { User } from '../types/user.types.js';

const RANK_TIERS: RankTier[] = [
  { numericRank: 0, label: 'PLANKTON', minBalance: 0, messageQuota: 10, voteWeight: 1 },
  { numericRank: 1, label: 'APE', minBalance: 10000, messageQuota: 50, voteWeight: 10 },
  { numericRank: 2, label: 'CHAD', minBalance: 100000, messageQuota: 100, voteWeight: 100 },
  { numericRank: 3, label: 'WHALE', minBalance: 1000000, messageQuota: 200, voteWeight: 1000 },
];

export class RankService {
  static getRankTier(tokenBalance: number) {
    const rankTier = [...RANK_TIERS].reverse().find((tier) => tokenBalance >= tier.minBalance);

    return rankTier || RANK_TIERS[0];
  }

  static async updateUserRank(walletAddress: string, newBalance: number): Promise<void> {
    const user = await UserModel.findOne({ walletAddress });
    if (!user) return;

    const rankTier = this.getRankTier(newBalance);

    if (user.rank !== rankTier.numericRank) {
      console.log(
        `User ${walletAddress} rank changed from ${user.rank} to ${rankTier.numericRank}`,
      );
    }

    await UserModel.findOneAndUpdate(
      { walletAddress },
      {
        $set: {
          tokenBalance: newBalance,
          rank: rankTier.numericRank,
          dailyMessageQuota: rankTier.messageQuota,
          messagesLeft: Math.max(
            0,
            rankTier.messageQuota - (user.dailyMessageQuota - user.messagesLeft),
          ),
          ...(user.shouldResetMessage() && { lastMessageReset: new Date() }),
        },
      },
      { new: true },
    );
  }

  static async resetDailyQuotaIfNeeded(user: User): Promise<void> {
    if (user.shouldResetMessage()) {
      await UserModel.findByIdAndUpdate(user._id, {
        $set: {
          messagesLeft: user.dailyMessageQuota,
          lastMessageReset: new Date(),
        },
      });
    }
  }

  static async decrementMessages(walletAddress: string): Promise<boolean> {
    const user = await UserModel.findOne({ walletAddress });
    if (!user || user.messagesLeft <= 0) {
      return false;
    }

    await UserModel.findByIdAndUpdate(user._id, { $inc: { messagesLeft: -1 } });

    return true;
  }
}
