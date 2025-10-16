"use client";

import { Doc } from "@/../convex/_generated/dataModel";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Clock, AlertCircle } from "lucide-react";
import { formatRelativeTime, isOverdue } from "@/lib/utils";

interface TodoItemProps {
  todo: Doc<"todos">;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Doc<"todos">) => void;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
};

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const isDue = todo.dueDate && isOverdue(todo.dueDate);

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo._id)}
        className="mt-1"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className={`font-medium ${
              todo.completed ? "line-through text-muted-foreground" : ""
            }`}
          >
            {todo.title}
          </h3>
          <Badge
            variant="outline"
            className={priorityColors[todo.priority]}
          >
            {priorityLabels[todo.priority]}
          </Badge>
        </div>

        {todo.description && (
          <p
            className={`text-sm mt-1 ${
              todo.completed ? "line-through text-muted-foreground" : "text-muted-foreground"
            }`}
          >
            {todo.description}
          </p>
        )}

        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(todo.createdAt)}
          </span>

          {todo.dueDate && (
            <span
              className={`flex items-center gap-1 ${
                isDue && !todo.completed ? "text-destructive font-medium" : ""
              }`}
            >
              <AlertCircle className="h-3 w-3" />
              Due {formatRelativeTime(todo.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(todo)}
          className="h-8 w-8"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo._id)}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
