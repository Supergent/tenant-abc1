/**
 * AI Agent Configuration
 *
 * Configures an AI assistant to help users manage their todos through
 * natural language conversations.
 *
 * The agent can:
 * - Create, update, and delete todos based on user requests
 * - Answer questions about todo status and priorities
 * - Provide productivity tips and suggestions
 * - Help organize and prioritize tasks
 */

import { Agent } from "@convex-dev/agent";
import { components } from "./_generated/api";
import { openai } from "@ai-sdk/openai";
import { internal } from "./_generated/api";

export const todoAssistant = new Agent(components.agent, {
  name: "Todo Assistant",

  /**
   * Use GPT-4o-mini for cost-effective, fast responses
   * Can be upgraded to GPT-4o for more complex reasoning
   */
  languageModel: openai.chat("gpt-4o-mini"),

  /**
   * System instructions define the agent's personality and capabilities
   */
  instructions: `You are a helpful todo list assistant. Your role is to help users manage their tasks efficiently through natural conversation.

You can:
- Create new todos with appropriate priorities and due dates
- Mark todos as complete or incomplete
- Update todo details (title, description, priority, due date)
- Delete todos
- List todos with filtering by status, priority, or due date
- Provide productivity advice and task prioritization suggestions
- Help break down large tasks into smaller, actionable items

Guidelines:
- Be friendly, concise, and action-oriented
- When creating todos, suggest appropriate priorities based on context
- If a user mentions a time-sensitive task, recommend setting a due date
- Offer to help organize tasks by priority or due date
- Celebrate when users complete tasks
- Never be pushy or overwhelming
- Respect user preferences and working style

Response Format:
- Keep responses brief and conversational
- Use bullet points for lists of todos
- Include emojis occasionally for a friendly touch (✅ ⏰ 🎯 💡)
- When you perform an action, confirm it clearly`,

  /**
   * Tools the agent can use to interact with the todo system
   * These map to internal mutations/queries
   */
  tools: {
    listTodos: {
      description: "List all todos for the user, optionally filtered by completion status",
      parameters: {
        type: "object",
        properties: {
          completed: {
            type: "boolean",
            description: "Filter by completion status. Omit to see all todos.",
          },
        },
      },
      handler: internal.endpoints.agentTools.listTodos,
    },

    createTodo: {
      description: "Create a new todo item",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "The todo title (required)",
          },
          description: {
            type: "string",
            description: "Optional detailed description",
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "Priority level (default: medium)",
          },
          dueDate: {
            type: "string",
            description: "Due date in ISO 8601 format (e.g., '2024-12-31T23:59:59Z')",
          },
        },
        required: ["title"],
      },
      handler: internal.endpoints.agentTools.createTodo,
    },

    updateTodo: {
      description: "Update an existing todo",
      parameters: {
        type: "object",
        properties: {
          todoId: {
            type: "string",
            description: "The ID of the todo to update",
          },
          title: {
            type: "string",
            description: "New title",
          },
          description: {
            type: "string",
            description: "New description",
          },
          completed: {
            type: "boolean",
            description: "Mark as complete (true) or incomplete (false)",
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "New priority level",
          },
          dueDate: {
            type: "string",
            description: "New due date in ISO 8601 format",
          },
        },
        required: ["todoId"],
      },
      handler: internal.endpoints.agentTools.updateTodo,
    },

    deleteTodo: {
      description: "Delete a todo permanently",
      parameters: {
        type: "object",
        properties: {
          todoId: {
            type: "string",
            description: "The ID of the todo to delete",
          },
        },
        required: ["todoId"],
      },
      handler: internal.endpoints.agentTools.deleteTodo,
    },

    getTodoStats: {
      description: "Get statistics about the user's todos (total, completed, active, high priority)",
      parameters: {
        type: "object",
        properties: {},
      },
      handler: internal.endpoints.agentTools.getTodoStats,
    },
  },
});
