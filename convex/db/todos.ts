/**
 * Database Layer: Todos
 *
 * This is the ONLY file that directly accesses the todos table using ctx.db.
 * All todos-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// CREATE
export async function createTodo(
  ctx: MutationCtx,
  args: {
    userId: string;
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
    dueDate?: number;
  }
) {
  const now = Date.now();
  return await ctx.db.insert("todos", {
    ...args,
    completed: false,
    createdAt: now,
    updatedAt: now,
  });
}

// READ - Get by ID
export async function getTodoById(ctx: QueryCtx, id: Id<"todos">) {
  return await ctx.db.get(id);
}

// READ - Get all by user
export async function getTodosByUser(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

// READ - Get by user and completion status
export async function getTodosByUserAndCompleted(
  ctx: QueryCtx,
  userId: string,
  completed: boolean
) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user_and_completed", (q) =>
      q.eq("userId", userId).eq("completed", completed)
    )
    .order("desc")
    .collect();
}

// READ - Get by user and priority
export async function getTodosByUserAndPriority(
  ctx: QueryCtx,
  userId: string,
  priority: "low" | "medium" | "high"
) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user_and_priority", (q) =>
      q.eq("userId", userId).eq("priority", priority)
    )
    .order("desc")
    .collect();
}

// READ - Get todos with due dates
export async function getTodosWithDueDates(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user_and_due_date", (q) => q.eq("userId", userId))
    .filter((q) => q.neq(q.field("dueDate"), undefined))
    .order("desc")
    .collect();
}

// READ - Get overdue todos
export async function getOverdueTodos(ctx: QueryCtx, userId: string) {
  const now = Date.now();
  return await ctx.db
    .query("todos")
    .withIndex("by_user_and_due_date", (q) => q.eq("userId", userId))
    .filter((q) =>
      q.and(
        q.neq(q.field("dueDate"), undefined),
        q.lt(q.field("dueDate"), now),
        q.eq(q.field("completed"), false)
      )
    )
    .collect();
}

// UPDATE
export async function updateTodo(
  ctx: MutationCtx,
  id: Id<"todos">,
  args: {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: "low" | "medium" | "high";
    dueDate?: number;
  }
) {
  return await ctx.db.patch(id, {
    ...args,
    updatedAt: Date.now(),
  });
}

// DELETE
export async function deleteTodo(ctx: MutationCtx, id: Id<"todos">) {
  return await ctx.db.delete(id);
}

// BULK DELETE - Delete all completed todos for a user
export async function deleteCompletedTodos(ctx: MutationCtx, userId: string) {
  const completedTodos = await getTodosByUserAndCompleted(ctx, userId, true);
  for (const todo of completedTodos) {
    await ctx.db.delete(todo._id);
  }
  return completedTodos.length;
}

// STATS - Count todos by status
export async function getTodoStats(ctx: QueryCtx, userId: string) {
  const allTodos = await getTodosByUser(ctx, userId);
  const completed = allTodos.filter((t) => t.completed).length;
  const active = allTodos.length - completed;
  const highPriority = allTodos.filter(
    (t) => t.priority === "high" && !t.completed
  ).length;

  return {
    total: allTodos.length,
    completed,
    active,
    highPriority,
  };
}
