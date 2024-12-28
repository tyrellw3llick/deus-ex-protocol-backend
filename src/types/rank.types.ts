export type NumericRank = 0 | 1 | 2 | 3;

export type RankLabel = 'PLANKTON' | 'APE' | 'CHAD' | 'WHALE';

export interface RankTier {
  numericRank: NumericRank;
  label: RankLabel;
  minBalance: number;
  messageQuota: number;
  voteWeight: number;
}
