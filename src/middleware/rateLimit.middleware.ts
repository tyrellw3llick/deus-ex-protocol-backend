import rateLimit from 'express-rate-limit';
import { RATE_LIMITS, RateLimitConfig } from '../config/rateLimits.js';

const createLimiter = (config: RateLimitConfig) => {
  return rateLimit({
    windowMs: config.duration * 1000,
    max: config.points,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests, try again later',
    },
  });
};

export const authLimiter = createLimiter(RATE_LIMITS.endpoints.auth);
export const chatLimiter = createLimiter(RATE_LIMITS.endpoints.chat);
export const balanceLimiter = createLimiter(RATE_LIMITS.endpoints.balance);
export const voteLimiter = createLimiter(RATE_LIMITS.endpoints.vote);
export const proposalLimiter = createLimiter(RATE_LIMITS.endpoints.proposals);

export const globalLimiter = rateLimit({
  windowMs: RATE_LIMITS.global.duration * 1000,
  max: RATE_LIMITS.global.points,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Global rate limit exceeded, please try again later.',
  },
});
