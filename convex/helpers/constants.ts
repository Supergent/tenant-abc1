/**
 * Application Constants
 *
 * Shared constants used across the application
 */

/**
 * Rate limiting constants
 */
export const RATE_LIMITS = {
  CREATE_TODO: { rate: 30, period: 60 * 1000 }, // 30 per minute
  UPDATE_TODO: { rate: 60, period: 60 * 1000 }, // 60 per minute
  DELETE_TODO: { rate: 30, period: 60 * 1000 }, // 30 per minute
  CHAT_MESSAGE: { rate: 10, period: 60 * 1000 }, // 10 per minute
} as const;

/**
 * Priority levels
 */
export const PRIORITY_LEVELS = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITY_LEVELS)[number];

/**
 * Theme options
 */
export const THEMES = ["light", "dark", "system"] as const;
export type Theme = (typeof THEMES)[number];

/**
 * Thread status
 */
export const THREAD_STATUS = ["active", "archived"] as const;
export type ThreadStatus = (typeof THREAD_STATUS)[number];

/**
 * Message roles
 */
export const MESSAGE_ROLES = ["user", "assistant"] as const;
export type MessageRole = (typeof MESSAGE_ROLES)[number];

/**
 * Pagination limits
 */
export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
} as const;

/**
 * Input length limits
 */
export const INPUT_LIMITS = {
  TITLE_MAX: 200,
  DESCRIPTION_MAX: 2000,
  MESSAGE_MAX: 10000,
} as const;

/**
 * Default values
 */
export const DEFAULTS = {
  PRIORITY: "medium" as Priority,
  THEME: "system" as Theme,
  EMAIL_NOTIFICATIONS: true,
  PUSH_NOTIFICATIONS: false,
} as const;
