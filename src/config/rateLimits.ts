export const RATE_LIMITS = {
  global: {
    points: 500, // 300 requests
    duration: 60 * 15, // per 15 minutes
    blockDuration: 60 * 15, // Block for 15 minutes if exceeded
  },

  endpoints: {
    auth: {
      points: 15, // 5 attempts
      duration: 60 * 15, // per 15 minutes
      blockDuration: 60 * 60, // Block for 1 hour if exceeded
    },

    chat: {
      points: 20, // 5 messages
      duration: 60, // per minute
      blockDuration: 60 * 5, // Block for 5 minutes if exceeded
    },

    balance: {
      points: 30, // 10 refreshes
      duration: 60 * 15, // per 5 minutes
      blockDuration: 60, // Block for 1 minute if exceeded
    },

    vote: {
      points: 20, // 10 votes
      duration: 60 * 5, // per minute
      blockDuration: 60 * 5, // Block for 5 minutes if exceeded
    },

    proposals: {
      points: 30, // 60 requests
      duration: 60, // per minute
      blockDuration: 60, // Block for 1 minute if exceeded
    },
  },
} as const;

export type RateLimitConfig = {
  points: number;
  duration: number;
  blockDuration: number;
};
