"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TodoItem } from "@/components/todo-item";
import { TodoForm, TodoFormData } from "@/components/todo-form";
import { Plus, Filter, Trash2, ArrowLeft } from "lucide-react";
import { Doc, Id } from "@/../convex/_generated/dataModel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterTab = "all" | "active" | "completed";
type PriorityFilter = "all" | "low" | "medium" | "high";

export default function TodosPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Doc<"todos"> | null>(null);

  const allTodos = useQuery(api.endpoints.todos.list, session ? undefined : "skip");
  const createTodo = useMutation(api.endpoints.todos.create);
  const updateTodo = useMutation(api.endpoints.todos.update);
  const toggleTodo = useMutation(api.endpoints.todos.toggle);
  const deleteTodo = useMutation(api.endpoints.todos.remove);
  const clearCompleted = useMutation(api.endpoints.todos.clearCompleted);

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

  // Filter todos based on active filters
  const filteredTodos = allTodos?.filter((todo) => {
    // Filter by completion status
    if (filterTab === "active" && todo.completed) return false;
    if (filterTab === "completed" && !todo.completed) return false;

    // Filter by priority
    if (priorityFilter !== "all" && todo.priority !== priorityFilter) return false;

    return true;
  });

  const handleCreateTodo = async (data: TodoFormData) => {
    try {
      await createTodo(data);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create todo:", error);
      alert(error instanceof Error ? error.message : "Failed to create todo");
    }
  };

  const handleUpdateTodo = async (data: TodoFormData) => {
    if (!editingTodo) return;

    try {
      await updateTodo({
        id: editingTodo._id,
        ...data,
      });
      setEditingTodo(null);
    } catch (error) {
      console.error("Failed to update todo:", error);
      alert(error instanceof Error ? error.message : "Failed to update todo");
    }
  };

  const handleToggleTodo = async (id: Id<"todos">) => {
    try {
      await toggleTodo({ id });
    } catch (error) {
      console.error("Failed to toggle todo:", error);
      alert(error instanceof Error ? error.message : "Failed to toggle todo");
    }
  };

  const handleDeleteTodo = async (id: Id<"todos">) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    try {
      await deleteTodo({ id });
    } catch (error) {
      console.error("Failed to delete todo:", error);
      alert(error instanceof Error ? error.message : "Failed to delete todo");
    }
  };

  const handleClearCompleted = async () => {
    const completedCount = allTodos?.filter((t) => t.completed).length || 0;
    if (completedCount === 0) return;

    if (!confirm(`Delete ${completedCount} completed todo${completedCount > 1 ? "s" : ""}?`)) {
      return;
    }

    try {
      await clearCompleted();
    } catch (error) {
      console.error("Failed to clear completed todos:", error);
      alert(error instanceof Error ? error.message : "Failed to clear completed todos");
    }
  };

  const handleEditClick = (todo: Doc<"todos">) => {
    setEditingTodo(todo);
    setShowForm(false);
  };

  const completedCount = allTodos?.filter((t) => t.completed).length || 0;

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">My Todos</h1>
              <p className="text-muted-foreground mt-1">
                {allTodos?.length || 0} total, {completedCount} completed
              </p>
            </div>
          </div>
          <Button
            size="lg"
            onClick={() => {
              setShowForm(true);
              setEditingTodo(null);
            }}
            disabled={showForm || editingTodo !== null}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Todo
          </Button>
        </div>

        {/* Create/Edit Form */}
        {(showForm || editingTodo) && (
          <Card>
            <CardContent className="pt-6">
              <TodoForm
                todo={editingTodo || undefined}
                onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTodo(null);
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={filterTab === "all" ? "default" : "outline"}
                  onClick={() => setFilterTab("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filterTab === "active" ? "default" : "outline"}
                  onClick={() => setFilterTab("active")}
                  size="sm"
                >
                  Active
                </Button>
                <Button
                  variant={filterTab === "completed" ? "default" : "outline"}
                  onClick={() => setFilterTab("completed")}
                  size="sm"
                >
                  Completed
                </Button>
              </div>

              <div className="flex gap-2 items-center w-full sm:w-auto">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={priorityFilter}
                  onValueChange={(value: PriorityFilter) => setPriorityFilter(value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>

                {completedCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCompleted}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Completed
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Todos List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filterTab === "all" && "All Todos"}
              {filterTab === "active" && "Active Todos"}
              {filterTab === "completed" && "Completed Todos"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allTodos === undefined ? (
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
            ) : filteredTodos?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {filterTab === "all" && "No todos yet. Create one to get started!"}
                  {filterTab === "active" && "No active todos. Great job!"}
                  {filterTab === "completed" && "No completed todos yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTodos?.map((todo) => (
                  <TodoItem
                    key={todo._id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onEdit={handleEditClick}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
