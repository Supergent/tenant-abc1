import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database schema for minimal real-time todo list application
 *
 * Architecture: Four-layer Convex pattern (db/endpoints/workflows/helpers)
 * All tables are user-scoped with proper indexes for real-time queries
 */
export default defineSchema({
  /**
   * Todos table - Core application data
   *
   * User-scoped todo items with status tracking and real-time sync
   */
  todos: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    completed: v.boolean(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_completed", ["userId", "completed"])
    .index("by_user_and_priority", ["userId", "priority"])
    .index("by_user_and_due_date", ["userId", "dueDate"]),

  /**
   * AI Agent threads - Conversational AI interactions
   *
   * Used by Agent component for multi-turn conversations about todo management
   */
  threads: defineTable({
    userId: v.string(),
    title: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("archived")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"]),

  /**
   * AI Agent messages - Individual messages in threads
   *
   * Stores user and assistant messages for conversation history
   */
  messages: defineTable({
    threadId: v.id("threads"),
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_thread", ["threadId"])
    .index("by_user", ["userId"]),

  /**
   * User preferences - Application settings per user
   *
   * Stores theme, notification preferences, and other user-specific settings
   */
  userPreferences: defineTable({
    userId: v.string(),
    theme: v.union(v.literal("light"), v.literal("dark"), v.literal("system")),
    emailNotifications: v.boolean(),
    pushNotifications: v.boolean(),
    defaultPriority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),
});
