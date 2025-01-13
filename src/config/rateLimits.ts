export const RATE_LIMITS = {
  global: {
    points: 300, // 300 requests
    duration: 60 * 15, // per 15 minutes
    blockDuration: 60 * 15, // Block for 15 minutes if exceeded
  },

  endpoints: {
    auth: {
      points: 5, // 5 attempts
      duration: 60 * 15, // per 15 minutes
      blockDuration: 60 * 60, // Block for 1 hour if exceeded
    },

    chat: {
      points: 5, // 5 messages
      duration: 60, // per minute
      blockDuration: 60 * 5, // Block for 5 minutes if exceeded
    },

    balance: {
      points: 10, // 10 refreshes
      duration: 60 * 5, // per 5 minutes
      blockDuration: 60, // Block for 1 minute if exceeded
    },

    vote: {
      points: 10, // 10 votes
      duration: 60, // per minute
      blockDuration: 60 * 5, // Block for 5 minutes if exceeded
    },

    proposals: {
      points: 60, // 60 requests
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
