# 🏗️ Architecture Documentation

## Overview

This project follows the **Cleargent Pattern** - a four-layer Convex architecture that ensures clean separation of concerns and maintainability.

---

## Four-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│                   Uses: useQuery, useMutation                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 4: Endpoints                        │
│                  (convex/endpoints/*.ts)                     │
│                                                               │
│  • Business logic & composition                              │
│  • Authentication & authorization                            │
│  • Rate limiting                                             │
│  • Validation                                                │
│  • Exports: mutation(), query()                              │
│  • Imports: db layer functions                              │
│  • NEVER uses: ctx.db directly ❌                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 3: Helpers                          │
│                  (convex/helpers/*.ts)                       │
│                                                               │
│  • Pure utility functions                                    │
│  • Validation, constants, calculations                       │
│  • NO database access ❌                                     │
│  • NO ctx parameter ❌                                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 2: Database                         │
│                    (convex/db/*.ts)                          │
│                                                               │
│  • Pure CRUD operations                                      │
│  • ONLY place where ctx.db is used ✅                       │
│  • Exports: async functions (NOT queries/mutations)          │
│  • Uses: QueryCtx, MutationCtx types                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 1: Schema                           │
│                   (convex/schema.ts)                         │
│                                                               │
│  • Table definitions                                         │
│  • Indexes                                                   │
│  • Validation rules                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Examples

### Creating a Todo

```typescript
// ✅ CORRECT FLOW

1. Frontend Component (apps/web/app/todos/page.tsx)
   ↓
   const createTodo = useMutation(api.endpoints.todos.create);
   ↓
   createTodo({ title: "...", priority: "high" })

2. Endpoint Layer (convex/endpoints/todos.ts)
   ↓
   export const create = mutation({
     handler: async (ctx, args) => {
       // Auth check
       const user = await authComponent.getAuthUser(ctx);
       // Rate limit
       await rateLimiter.limit(ctx, "createTodo", { key: user._id });
       // Validation
       if (!isValidTitle(args.title)) throw new Error(...);
       // ✅ Call database layer (NEVER ctx.db directly)
       return await Todos.createTodo(ctx, { userId: user._id, ...args });
     }
   });

3. Database Layer (convex/db/todos.ts)
   ↓
   export async function createTodo(ctx: MutationCtx, args: {...}) {
     // ✅ ONLY place where ctx.db is used
     return await ctx.db.insert("todos", {
       ...args,
       completed: false,
       createdAt: Date.now(),
       updatedAt: Date.now(),
     });
   }
```

### ❌ INCORRECT FLOW (Anti-pattern)

```typescript
// ❌ WRONG: Using ctx.db in endpoint layer
export const create = mutation({
  handler: async (ctx, args) => {
    // ❌ DON'T DO THIS
    return await ctx.db.insert("todos", args);
  }
});
```

---

## Component Integration

### Better Auth (Authentication)

```
┌──────────────────────────────────────────────────────────┐
│  Frontend (apps/web)                                      │
│  ├─ lib/auth-client.ts → createAuthClient()              │
│  └─ providers/convex-provider.tsx → ConvexProviderWithAuth│
└───────────────────────┬──────────────────────────────────┘
                        │ HTTP requests
                        ↓
┌──────────────────────────────────────────────────────────┐
│  Convex HTTP Routes (convex/http.ts)                      │
│  └─ /auth/* → createAuth(ctx).handler(request)           │
└───────────────────────┬──────────────────────────────────┘
                        │ Uses adapter
                        ↓
┌──────────────────────────────────────────────────────────┐
│  Auth Component (convex/auth.ts)                          │
│  └─ authComponent = createClient(components.betterAuth)  │
└───────────────────────┬──────────────────────────────────┘
                        │ Stores data
                        ↓
┌──────────────────────────────────────────────────────────┐
│  Convex Database (Auto-managed tables)                    │
│  ├─ session                                              │
│  ├─ user                                                 │
│  └─ account                                              │
└──────────────────────────────────────────────────────────┘
```

### Rate Limiter

```
┌──────────────────────────────────────────────────────────┐
│  Configuration (convex/rateLimiter.ts)                    │
│  export const rateLimiter = new RateLimiter({...})       │
└───────────────────────┬──────────────────────────────────┘
                        │
                        ↓
┌──────────────────────────────────────────────────────────┐
│  Endpoint Layer (convex/endpoints/todos.ts)               │
│  const status = await rateLimiter.limit(ctx, "createTodo",│
│    { key: user._id });                                   │
│  if (!status.ok) throw new Error("Rate limit exceeded"); │
└───────────────────────┬──────────────────────────────────┘
                        │
                        ↓
┌──────────────────────────────────────────────────────────┐
│  Rate Limiter Component (components.rateLimiter)          │
│  └─ Tracks request counts per user per operation         │
└──────────────────────────────────────────────────────────┘
```

### AI Agent

```
┌──────────────────────────────────────────────────────────┐
│  Configuration (convex/agent.ts)                          │
│  export const todoAssistant = new Agent({                │
│    languageModel: openai.chat("gpt-4o-mini"),           │
│    tools: { listTodos, createTodo, ... }                │
│  })                                                      │
└───────────────────────┬──────────────────────────────────┘
                        │
                        ↓
┌──────────────────────────────────────────────────────────┐
│  Chat Endpoint (convex/endpoints/chat.ts)                 │
│  const response = await todoAssistant.chat(ctx, {        │
│    threadId, message, userId                             │
│  });                                                     │
└───────────────────────┬──────────────────────────────────┘
                        │
                        ↓
┌──────────────────────────────────────────────────────────┐
│  Agent Tools (convex/endpoints/agentTools.ts)             │
│  • listTodos (internalQuery)                             │
│  • createTodo (internalMutation)                         │
│  • updateTodo (internalMutation)                         │
│  • deleteTodo (internalMutation)                         │
└───────────────────────┬──────────────────────────────────┘
                        │
                        ↓
┌──────────────────────────────────────────────────────────┐
│  Database Layer (convex/db/todos.ts)                      │
│  └─ Performs actual database operations                  │
└──────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Tables & Relationships

```
┌─────────────┐
│   todos     │
├─────────────┤
│ _id         │
│ userId      │──┐
│ title       │  │
│ description │  │
│ completed   │  │
│ priority    │  │
│ dueDate     │  │
│ createdAt   │  │
│ updatedAt   │  │
└─────────────┘  │
                 │
┌─────────────┐  │
│  threads    │  │
├─────────────┤  │
│ _id         │  │
│ userId      │──┤  (All tables user-scoped)
│ title       │  │
│ status      │  │
│ createdAt   │  │
│ updatedAt   │  │
└─────────────┘  │
                 │
┌─────────────┐  │
│  messages   │  │
├─────────────┤  │
│ _id         │  │
│ threadId    │──┤ (Foreign key)
│ userId      │──┤
│ role        │  │
│ content     │  │
│ createdAt   │  │
└─────────────┘  │
                 │
┌─────────────────┐│
│ userPreferences ││
├─────────────────┤│
│ _id             ││
│ userId          │┘
│ theme           │
│ emailNotifs     │
│ pushNotifs      │
│ defaultPriority │
│ createdAt       │
│ updatedAt       │
└─────────────────┘
```

### Indexes

All tables have strategic indexes for efficient queries:

```typescript
// todos table
.index("by_user", ["userId"])
.index("by_user_and_completed", ["userId", "completed"])
.index("by_user_and_priority", ["userId", "priority"])
.index("by_user_and_due_date", ["userId", "dueDate"])

// threads table
.index("by_user", ["userId"])
.index("by_user_and_status", ["userId", "status"])

// messages table
.index("by_thread", ["threadId"])
.index("by_user", ["userId"])

// userPreferences table
.index("by_user", ["userId"])
```

---

## Security Architecture

### Authentication Flow

```
1. User signs up/in → Better Auth
   ↓
2. Better Auth creates session → Convex DB
   ↓
3. Client receives JWT token → Stored in cookies
   ↓
4. Every request includes token → Authorization header
   ↓
5. Endpoints verify token → authComponent.getAuthUser(ctx)
   ↓
6. User ID extracted → Used for scoping queries
```

### Authorization Pattern

Every endpoint follows this pattern:

```typescript
export const update = mutation({
  handler: async (ctx, args) => {
    // 1. ✅ Authenticate
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // 2. ✅ Rate limit
    const status = await rateLimiter.limit(ctx, "updateTodo", {
      key: user._id
    });
    if (!status.ok) throw new Error("Rate limit exceeded");

    // 3. ✅ Fetch resource
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) throw new Error("Not found");

    // 4. ✅ Verify ownership
    if (todo.userId !== user._id) {
      throw new Error("Not authorized");
    }

    // 5. ✅ Validate input
    if (args.title && !isValidTitle(args.title)) {
      throw new Error("Invalid title");
    }

    // 6. ✅ Perform operation
    return await Todos.updateTodo(ctx, args.id, args);
  }
});
```

---

## Frontend Architecture

### App Router Structure

```
apps/web/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Dashboard (/)
│   ├── todos/
│   │   └── page.tsx            # Todo list (/todos)
│   └── auth/
│       ├── signin/page.tsx     # Sign in (/auth/signin)
│       └── signup/page.tsx     # Sign up (/auth/signup)
├── components/
│   ├── todo-item.tsx           # Reusable components
│   ├── todo-form.tsx
│   └── ui/                     # shadcn/ui primitives
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       └── ...
├── lib/
│   ├── auth-client.ts          # Better Auth client
│   ├── convex.ts               # Convex React client
│   └── utils.ts                # Helper functions
└── providers/
    └── convex-provider.tsx     # ConvexProviderWithAuth
```

### Real-Time Data Flow

```
Component renders
    ↓
useQuery(api.endpoints.todos.list)
    ↓
Subscribes to Convex query
    ↓
Data changes in database
    ↓
Convex pushes update to client
    ↓
Component re-renders automatically
```

### Mutations

```
User clicks "Create Todo" button
    ↓
const create = useMutation(api.endpoints.todos.create)
    ↓
create({ title: "...", priority: "high" })
    ↓
Mutation runs on server
    ↓
Database updated
    ↓
All subscribed queries automatically re-run
    ↓
All connected clients see update instantly
```

---

## Design System Architecture

```
packages/design-tokens/
├── src/
│   ├── theme.css           # CSS custom properties
│   ├── tailwind.config.ts  # Tailwind preset
│   ├── tokens.ts           # TypeScript constants
│   └── index.ts            # Exports
└── package.json

                ↓ imported by ↓

apps/web/
├── tailwind.config.ts      # Extends preset
└── app/globals.css         # Imports theme.css
```

**Theme Tokens Available:**
- Colors: primary, secondary, accent, success, warning, danger
- Neutrals: background, surface, muted, text-primary, text-secondary
- Spacing: xs (4px), sm (8px), md (12px), lg (20px), xl (28px), 2xl (40px)
- Radius: sm (4px), md (8px), lg (12px), pill (999px)
- Typography: font-family, sizes, weights
- Shadows: sm, md, lg
- Motion: ease curve, duration (fast, base, slow)

---

## Key Design Decisions

### 1. Why Four Layers?

- **Separation of concerns**: Each layer has a single responsibility
- **Testability**: Pure functions are easy to test
- **Maintainability**: Changes are localized to specific layers
- **Type safety**: Strong boundaries prevent mistakes

### 2. Why User-Scoped Everything?

- **Security**: Users can only access their own data
- **Multi-tenancy ready**: Can add `organizationId` later
- **Performance**: Indexes on `userId` make queries fast

### 3. Why Rate Limiting?

- **Prevent abuse**: Stop malicious users from overwhelming the system
- **Fair resource allocation**: Ensure all users get good performance
- **Cost control**: Avoid runaway costs from bots

### 4. Why Better Auth?

- **Modern**: Built for 2024+ web standards
- **Flexible**: Multiple auth methods (we use email/password)
- **Convex-native**: First-class Convex adapter
- **Type-safe**: Full TypeScript support

---

## Performance Considerations

### Database Queries

✅ **DO:**
- Use indexes for all queries
- Filter by userId first
- Use `.unique()` for 1:1 relationships
- Order after filtering

❌ **DON'T:**
- Full table scans without userId
- Multiple round-trips (use db layer to batch)
- Fetch more data than needed

### Real-Time Subscriptions

Each `useQuery` creates a live subscription. Optimize by:
1. Limiting subscriptions per page
2. Using pagination when needed
3. Filtering on the server (not client)

### Rate Limiting

Current limits are conservative for development:
- Create: 30/min (burst: 5)
- Update: 60/min (burst: 10)
- Delete: 30/min (burst: 5)

Adjust based on usage patterns in production.

---

## Testing Strategy

### Unit Tests (Helpers)
```typescript
// Test pure functions in helpers/
import { isValidTitle } from "./helpers/validation";

test("validates title length", () => {
  expect(isValidTitle("")).toBe(false);
  expect(isValidTitle("Valid")).toBe(true);
  expect(isValidTitle("x".repeat(201))).toBe(false);
});
```

### Integration Tests (Database Layer)
```typescript
// Test database operations
import { createTodo } from "./db/todos";

test("creates todo with defaults", async () => {
  const todo = await createTodo(ctx, {
    userId: "user_123",
    title: "Test",
    priority: "medium"
  });
  expect(todo.completed).toBe(false);
});
```

### E2E Tests (Frontend)
```typescript
// Test full user flows
test("user can create and complete todo", async () => {
  await signIn("test@example.com", "password");
  await createTodo("Buy milk");
  await toggleTodo("Buy milk");
  expect(await getTodoStatus("Buy milk")).toBe("completed");
});
```

---

## Deployment Architecture

### Development
```
Local Machine
├── Next.js (localhost:3000)
├── Convex Dev Deployment
└── Local .env.local
```

### Production
```
Vercel (Frontend)
├── Next.js Build
├── Environment Variables
└── Edge Functions

Convex Cloud (Backend)
├── Production Deployment
├── Real-time Database
└── Functions
```

---

## Monitoring & Observability

### Built-in Convex Dashboard
- Function call logs
- Error tracking
- Performance metrics
- Database queries

### Recommended Additions
- **Sentry**: Error tracking in frontend
- **Vercel Analytics**: Page view tracking
- **Custom logging**: Add structured logging to endpoints

---

## Future Enhancements

### Phase 3 Roadmap
1. ✅ Email notifications (Resend component)
2. ✅ Stripe payments (Autumn component)
3. ✅ Vector search (RAG component)
4. ✅ Scheduled tasks (Cron component)
5. ✅ File uploads (Storage component)

### Architecture Won't Change
The four-layer pattern scales to any size application. Just add more:
- Tables in schema
- CRUD functions in db/
- Endpoints for new features
- Components as needed

---

**Architecture Status**: ✅ Production Ready

This architecture has been battle-tested and follows industry best practices for modern full-stack applications.
