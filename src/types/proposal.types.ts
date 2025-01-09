export interface IProposal {
  title: string;
  description: string;
  roundId: number;
  metrics: {
    totalVotes: number;
    totalTokensVoted: number;
    uniqueVoter: number;
  };
  status: 'active' | 'winner' | 'runnerup' | 'lost';
  startDate: Date;
  endDate: Date;
}
