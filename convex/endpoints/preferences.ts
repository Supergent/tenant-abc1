/**
 * Endpoint Layer: User Preferences
 *
 * Business logic for managing user preferences and settings.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as UserPreferences from "../db/userPreferences";

/**
 * Get current user's preferences
 * Creates default preferences if none exist
 */
export const get = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await UserPreferences.getUserPreferencesByUser(ctx, authUser._id);
  },
});

/**
 * Update user preferences
 */
export const update = mutation({
  args: {
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
    emailNotifications: v.optional(v.boolean()),
    pushNotifications: v.optional(v.boolean()),
    defaultPriority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "updatePreferences", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Try again in ${Math.ceil(status.retryAfter / 1000)}s`
      );
    }

    // 3. Get or create preferences
    const preferences = await UserPreferences.getOrCreateUserPreferences(
      ctx,
      authUser._id
    );

    // 4. Update preferences
    return await UserPreferences.updateUserPreferences(ctx, preferences._id, args);
  },
});

/**
 * Initialize default preferences for a new user
 */
export const initialize = mutation({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Check if preferences already exist
    const existing = await UserPreferences.getUserPreferencesByUser(
      ctx,
      authUser._id
    );
    if (existing) {
      return existing;
    }

    // Create default preferences
    const id = await UserPreferences.createUserPreferences(ctx, {
      userId: authUser._id,
    });

    return await UserPreferences.getUserPreferencesById(ctx, id);
  },
});
