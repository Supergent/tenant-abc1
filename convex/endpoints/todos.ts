/**
 * Endpoint Layer: Todos
 *
 * Business logic for todo management.
 * Composes database operations from the db layer.
 * Handles authentication, authorization, and rate limiting.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as Todos from "../db/todos";
import { isValidTitle, isValidDescription } from "../helpers/validation";

/**
 * Create a new todo
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "createTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Try again in ${Math.ceil(status.retryAfter / 1000)}s`
      );
    }

    // 3. Validation
    if (!isValidTitle(args.title)) {
      throw new Error("Title must be between 1 and 200 characters");
    }
    if (!isValidDescription(args.description)) {
      throw new Error("Description must be less than 2000 characters");
    }
    if (args.dueDate && args.dueDate < Date.now()) {
      throw new Error("Due date must be in the future");
    }

    // 4. Create todo
    return await Todos.createTodo(ctx, {
      userId: authUser._id,
      title: args.title.trim(),
      description: args.description?.trim(),
      priority: args.priority,
      dueDate: args.dueDate,
    });
  },
});

/**
 * List all todos for the current user
 */
export const list = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Todos.getTodosByUser(ctx, authUser._id);
  },
});

/**
 * List todos filtered by completion status
 */
export const listByStatus = query({
  args: {
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Todos.getTodosByUserAndCompleted(
      ctx,
      authUser._id,
      args.completed
    );
  },
});

/**
 * List todos filtered by priority
 */
export const listByPriority = query({
  args: {
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Todos.getTodosByUserAndPriority(
      ctx,
      authUser._id,
      args.priority
    );
  },
});

/**
 * Get overdue todos
 */
export const listOverdue = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Todos.getOverdueTodos(ctx, authUser._id);
  },
});

/**
 * Get todo statistics
 */
export const getStats = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Todos.getTodoStats(ctx, authUser._id);
  },
});

/**
 * Update a todo
 */
export const update = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    completed: v.optional(v.boolean()),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "updateTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Try again in ${Math.ceil(status.retryAfter / 1000)}s`
      );
    }

    // 3. Authorization - verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to update this todo");
    }

    // 4. Validation
    if (args.title !== undefined && !isValidTitle(args.title)) {
      throw new Error("Title must be between 1 and 200 characters");
    }
    if (
      args.description !== undefined &&
      !isValidDescription(args.description)
    ) {
      throw new Error("Description must be less than 2000 characters");
    }
    if (args.dueDate !== undefined && args.dueDate < Date.now()) {
      throw new Error("Due date must be in the future");
    }

    // 5. Update todo
    const { id, ...updateArgs } = args;
    return await Todos.updateTodo(ctx, id, {
      title: args.title?.trim(),
      description: args.description?.trim(),
      completed: args.completed,
      priority: args.priority,
      dueDate: args.dueDate,
    });
  },
});

/**
 * Toggle todo completion status
 */
export const toggle = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "updateTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Try again in ${Math.ceil(status.retryAfter / 1000)}s`
      );
    }

    // 3. Authorization - verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to update this todo");
    }

    // 4. Toggle completion
    return await Todos.updateTodo(ctx, args.id, {
      completed: !todo.completed,
    });
  },
});

/**
 * Delete a todo
 */
export const remove = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "deleteTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Try again in ${Math.ceil(status.retryAfter / 1000)}s`
      );
    }

    // 3. Authorization - verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to delete this todo");
    }

    // 4. Delete todo
    return await Todos.deleteTodo(ctx, args.id);
  },
});

/**
 * Delete all completed todos
 */
export const clearCompleted = mutation({
  handler: async (ctx) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "deleteTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Try again in ${Math.ceil(status.retryAfter / 1000)}s`
      );
    }

    // 3. Delete completed todos
    const count = await Todos.deleteCompletedTodos(ctx, authUser._id);
    return { deletedCount: count };
  },
});
