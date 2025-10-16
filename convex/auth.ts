import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { components } from "./_generated/api";
import { type DataModel } from "./_generated/dataModel";

/**
 * Better Auth client for Convex
 *
 * Provides type-safe authentication operations:
 * - getAuthUser() - Get authenticated user from context
 * - adapter() - Database adapter for Better Auth
 */
export const authComponent = createClient<DataModel>(components.betterAuth);

/**
 * Create Better Auth instance with Convex adapter
 *
 * Configuration:
 * - Email/password authentication enabled
 * - Email verification disabled (for development)
 * - JWT expiration: 30 days
 * - Convex plugin for seamless integration
 *
 * @param ctx - Convex context
 * @param optionsOnly - Return config only (for testing)
 * @returns Better Auth instance
 */
export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    baseURL: process.env.SITE_URL!,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // Enable in production!
    },
    plugins: [
      convex({
        jwtExpirationSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  });
};
