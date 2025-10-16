import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import agent from "@convex-dev/agent/convex.config";

/**
 * Convex application configuration
 *
 * Components installed:
 * - betterAuth: Authentication and session management
 * - rateLimiter: API rate limiting to prevent abuse
 * - agent: AI agent orchestration for intelligent features
 */
const app = defineApp();

// Better Auth MUST be first
app.use(betterAuth);

// Rate limiter for production API protection
app.use(rateLimiter);

// AI Agent for intelligent todo features
app.use(agent);

export default app;
