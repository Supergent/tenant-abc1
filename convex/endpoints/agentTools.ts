/**
 * Endpoint Layer: Agent Tools
 *
 * Internal mutations/queries that the AI agent can call.
 * These are NOT exposed to the frontend directly.
 */

import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import * as Todos from "../db/todos";

/**
 * List todos for the agent
 */
export const listTodos = internalQuery({
  args: {
    userId: v.string(),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.completed !== undefined) {
      return await Todos.getTodosByUserAndCompleted(
        ctx,
        args.userId,
        args.completed
      );
    }
    return await Todos.getTodosByUser(ctx, args.userId);
  },
});

/**
 * Create a todo for the agent
 */
export const createTodo = internalMutation({
  args: {
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    dueDate: v.optional(v.string()), // ISO string
  },
  handler: async (ctx, args) => {
    // Parse due date if provided
    let dueDate: number | undefined;
    if (args.dueDate) {
      dueDate = new Date(args.dueDate).getTime();
    }

    return await Todos.createTodo(ctx, {
      userId: args.userId,
      title: args.title,
      description: args.description,
      priority: args.priority ?? "medium",
      dueDate,
    });
  },
});

/**
 * Update a todo for the agent
 */
export const updateTodo = internalMutation({
  args: {
    userId: v.string(),
    todoId: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    completed: v.optional(v.boolean()),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    dueDate: v.optional(v.string()), // ISO string
  },
  handler: async (ctx, args) => {
    // Verify ownership
    const todo = await Todos.getTodoById(ctx, args.todoId);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (todo.userId !== args.userId) {
      throw new Error("Not authorized");
    }

    // Parse due date if provided
    let dueDate: number | undefined;
    if (args.dueDate) {
      dueDate = new Date(args.dueDate).getTime();
    }

    return await Todos.updateTodo(ctx, args.todoId, {
      title: args.title,
      description: args.description,
      completed: args.completed,
      priority: args.priority,
      dueDate,
    });
  },
});

/**
 * Delete a todo for the agent
 */
export const deleteTodo = internalMutation({
  args: {
    userId: v.string(),
    todoId: v.id("todos"),
  },
  handler: async (ctx, args) => {
    // Verify ownership
    const todo = await Todos.getTodoById(ctx, args.todoId);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (todo.userId !== args.userId) {
      throw new Error("Not authorized");
    }

    return await Todos.deleteTodo(ctx, args.todoId);
  },
});

/**
 * Get todo stats for the agent
 */
export const getTodoStats = internalQuery({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await Todos.getTodoStats(ctx, args.userId);
  },
});
