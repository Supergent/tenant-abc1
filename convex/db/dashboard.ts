/**
 * Database Layer: Dashboard
 *
 * Dashboard-specific queries that aggregate data across multiple tables.
 * Uses type assertion for dynamic table queries.
 */

import type { QueryCtx } from "../_generated/server";
import type { DataModel } from "../_generated/dataModel";
import * as Todos from "./todos";
import * as Threads from "./threads";

/**
 * Load dashboard summary with aggregate counts
 */
export async function loadSummary(ctx: QueryCtx, userId: string) {
  const TABLES = ["todos", "threads", "messages", "userPreferences"] as const;

  const perTable: Record<string, number> = {};

  for (const table of TABLES) {
    // Use type assertion to tell TypeScript this is a valid table name
    const records = await ctx.db.query(table as keyof DataModel).collect();
    const scopedRecords = records.filter((record: any) => record.userId === userId);
    perTable[table] = scopedRecords.length;
  }

  // Get specific todo statistics
  const todoStats = await Todos.getTodoStats(ctx, userId);
  const overdueTodos = await Todos.getOverdueTodos(ctx, userId);
  const activeThreads = await Threads.getThreadsByUserAndStatus(ctx, userId, "active");

  return {
    perTable,
    totalRecords: Object.values(perTable).reduce((a, b) => a + b, 0),
    todos: {
      total: todoStats.total,
      active: todoStats.active,
      completed: todoStats.completed,
      highPriority: todoStats.highPriority,
      overdue: overdueTodos.length,
    },
    threads: {
      active: activeThreads.length,
    },
  };
}

/**
 * Load recent todos for dashboard table view
 */
export async function loadRecent(ctx: QueryCtx, userId: string, limit: number = 5) {
  const allTodos = await Todos.getTodosByUser(ctx, userId);

  // Sort by most recently updated and limit
  return allTodos
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit)
    .map((todo) => ({
      _id: todo._id,
      name: todo.title,
      status: todo.completed ? "Completed" : "Active",
      priority: todo.priority,
      updatedAt: todo.updatedAt,
    }));
}
