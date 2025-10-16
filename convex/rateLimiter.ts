/**
 * Rate Limiter Configuration
 *
 * Configures rate limits for all mutations to prevent abuse.
 * Uses token bucket algorithm for smooth rate limiting with burst capacity.
 */

import { RateLimiter, MINUTE } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  /**
   * Todo operations
   * Token bucket allows bursts but maintains average rate
   */
  createTodo: {
    kind: "token bucket",
    rate: 30, // 30 per minute
    period: MINUTE,
    capacity: 5, // Allow burst of 5
  },
  updateTodo: {
    kind: "token bucket",
    rate: 60, // 60 per minute
    period: MINUTE,
    capacity: 10,
  },
  deleteTodo: {
    kind: "token bucket",
    rate: 30, // 30 per minute
    period: MINUTE,
    capacity: 5,
  },

  /**
   * Chat operations
   * Lower limits for AI interactions
   */
  sendMessage: {
    kind: "token bucket",
    rate: 10, // 10 per minute
    period: MINUTE,
    capacity: 2, // Small burst allowance
  },
  createThread: {
    kind: "token bucket",
    rate: 5, // 5 per minute
    period: MINUTE,
    capacity: 2,
  },

  /**
   * Preference updates
   */
  updatePreferences: {
    kind: "token bucket",
    rate: 10, // 10 per minute
    period: MINUTE,
    capacity: 3,
  },
});
