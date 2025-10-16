"use client";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Circle, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatRelativeTime, isOverdue } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const summary = useQuery(api.endpoints.dashboard.summary, session ? {} : "skip");
  const recentTodos = useQuery(
    api.endpoints.dashboard.recent,
    session ? { limit: 5 } : "skip"
  );

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's an overview of your todos.
            </p>
          </div>
          <Link href="/todos">
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              New Todo
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        {summary === undefined ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Todos</CardTitle>
                <Circle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All your tasks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.active}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pending completion
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.completed}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tasks finished
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.overdue}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Need attention
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Todos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Todos</CardTitle>
                <CardDescription>Your most recent tasks</CardDescription>
              </div>
              <Link href="/todos">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentTodos === undefined ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-1/2 bg-muted animate-pulse rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentTodos.length === 0 ? (
              <div className="text-center py-12">
                <Circle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No todos yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first todo
                </p>
                <Link href="/todos">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Todo
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTodos.map((todo) => {
                  const isDue = todo.dueDate && isOverdue(todo.dueDate);
                  return (
                    <div
                      key={todo._id}
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium ${
                            todo.completed ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {todo.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="capitalize">{todo.priority} priority</span>
                          <span>•</span>
                          <span>{formatRelativeTime(todo.createdAt)}</span>
                          {todo.dueDate && (
                            <>
                              <span>•</span>
                              <span
                                className={
                                  isDue && !todo.completed ? "text-destructive font-medium" : ""
                                }
                              >
                                Due {formatRelativeTime(todo.dueDate)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
