"use client";

import { useState, useEffect } from "react";
import { Doc } from "@/../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface TodoFormProps {
  todo?: Doc<"todos">;
  onSubmit: (data: TodoFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface TodoFormData {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  dueDate?: number;
}

export function TodoForm({ todo, onSubmit, onCancel, isSubmitting }: TodoFormProps) {
  const [formData, setFormData] = useState<TodoFormData>({
    title: todo?.title || "",
    description: todo?.description || "",
    priority: todo?.priority || "medium",
    dueDate: todo?.dueDate,
  });

  const [dueDateInput, setDueDateInput] = useState<string>("");

  useEffect(() => {
    if (todo?.dueDate) {
      const date = new Date(todo.dueDate);
      setDueDateInput(date.toISOString().slice(0, 16));
    }
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDueDateChange = (value: string) => {
    setDueDateInput(value);
    if (value) {
      setFormData({ ...formData, dueDate: new Date(value).getTime() });
    } else {
      const { dueDate, ...rest } = formData;
      setFormData(rest);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {todo ? "Edit Todo" : "Create New Todo"}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="What needs to be done?"
          required
          maxLength={200}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Add more details..."
          maxLength={2000}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={formData.priority}
          onValueChange={(value: "low" | "medium" | "high") =>
            setFormData({ ...formData, priority: value })
          }
        >
          <SelectTrigger id="priority">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date (Optional)</Label>
        <Input
          id="dueDate"
          type="datetime-local"
          value={dueDateInput}
          onChange={(e) => handleDueDateChange(e.target.value)}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !formData.title.trim()}>
          {isSubmitting ? "Saving..." : todo ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
