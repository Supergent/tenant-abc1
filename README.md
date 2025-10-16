# Real-Time Todo List Application

A minimal, production-ready todo list application built with **Next.js 15**, **Convex backend**, **Better Auth**, and styled with **Tailwind CSS** and **shadcn/ui** components.

## Features

- ✅ **Real-time synchronization** - Changes appear instantly across all devices
- 🔐 **Secure authentication** - Email/password auth with Better Auth
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS and shadcn/ui
- 🤖 **AI-powered assistant** - Intelligent todo management with AI agent
- ⚡ **Type-safe** - Full TypeScript support across frontend and backend
- 🛡️ **Rate limiting** - Built-in API protection against abuse

## Architecture

This project follows the **four-layer Convex architecture pattern** (the Cleargent Pattern):

1. **Database Layer** (`convex/db/`) - Pure CRUD operations, only place where `ctx.db` is used
2. **Endpoint Layer** (`convex/endpoints/`) - Business logic that composes database operations
3. **Workflow Layer** (`convex/workflows/`) - Durable external service integrations
4. **Helper Layer** (`convex/helpers/`) - Pure utility functions with no database access

## Tech Stack

### Backend
- **Convex** - Real-time backend-as-a-service
- **Better Auth** - Modern authentication with Organizations support
- **Rate Limiter** - API rate limiting component
- **Agent** - AI agent orchestration for intelligent features

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with Server Components
- **TypeScript** - Type safety across the stack
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Lucide Icons** - Clean, consistent icon set

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **pnpm 8+** - `npm install -g pnpm`
- **Convex account** - [Sign up](https://dashboard.convex.dev)
- **OpenAI API key** - [Get key](https://platform.openai.com/api-keys) (for AI features)

## Installation

### 1. Clone and Install Dependencies

```bash
# Install all dependencies
pnpm install
```

### 2. Set Up Convex

```bash
# Initialize Convex (creates deployment and config)
npx convex dev --once

# Install Convex components
npx convex components install @convex-dev/better-auth --save
npx convex components install @convex-dev/rate-limiter --save
npx convex components install @convex-dev/agent --save
```

### 3. Configure Environment Variables

```bash
# Copy example environment file
cp .env.local.example .env.local

# Edit .env.local and add:
# - CONVEX_DEPLOYMENT and NEXT_PUBLIC_CONVEX_URL (from step 2)
# - BETTER_AUTH_SECRET (generate with: openssl rand -base64 32)
# - OPENAI_API_KEY (from OpenAI dashboard)
```

### 4. Start Development Servers

```bash
# Start both Convex and Next.js
pnpm dev

# Or start individually:
pnpm convex:dev  # Convex backend (port: dashboard.convex.dev)
pnpm web:dev     # Next.js frontend (port: 3000)
```

Visit [http://localhost:3000](http://localhost:3000) to see your app! 🎉

## Project Structure

```
todo-list-app/
├── convex/                    # Convex backend
│   ├── _generated/           # Auto-generated types (git-ignored)
│   ├── schema.ts             # Database schema
│   ├── convex.config.ts      # Component configuration
│   ├── auth.ts               # Better Auth setup
│   ├── http.ts               # HTTP routes (auth endpoints)
│   ├── db/                   # Database layer (CRUD operations)
│   ├── endpoints/            # Endpoint layer (business logic)
│   ├── workflows/            # Workflow layer (external services)
│   └── helpers/              # Helper layer (pure utilities)
├── apps/
│   └── web/                  # Next.js application
│       ├── app/              # App Router pages
│       ├── components/       # React components
│       ├── lib/              # Client utilities
│       └── providers/        # React Context providers
├── packages/                 # Shared packages (optional)
├── .env.local.example        # Environment variable template
├── pnpm-workspace.yaml       # pnpm monorepo config
└── package.json              # Root dependencies
```

## Component-Specific Setup

### Better Auth (Authentication)

Better Auth is configured with:
- ✅ Email/password authentication
- ✅ 30-day JWT expiration
- ✅ Convex adapter for database storage
- ✅ HTTP routes at `/auth/*`

**No additional setup required** - works out of the box!

### Rate Limiter

Rate limiting is pre-configured for all mutations. Default limits:
- **10 requests/minute** for create operations (with burst capacity of 3)
- **50 requests/minute** for update operations
- **30 requests/minute** for delete operations

Customize limits in `convex/rateLimiter.ts`.

### AI Agent

The AI agent uses OpenAI GPT-4o-mini by default. To use Anthropic Claude instead:

1. Install Anthropic SDK: `pnpm add @ai-sdk/anthropic`
2. Update `convex/agent.ts` to use `anthropic.chat("claude-3-5-sonnet-20241022")`
3. Set `ANTHROPIC_API_KEY` in `.env.local`

## Development Commands

```bash
pnpm dev              # Start both Convex and Next.js
pnpm web:dev          # Start Next.js only
pnpm convex:dev       # Start Convex only
pnpm build            # Build Next.js for production
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript compiler
```

## Database Schema

### Core Tables

- **todos** - User's todo items with priority and completion status
- **threads** - AI conversation threads
- **messages** - Individual messages in AI conversations
- **userPreferences** - User-specific settings and preferences

All tables are user-scoped and include proper indexes for efficient real-time queries.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy! Vercel auto-detects Next.js and builds

### Deploy Convex to Production

```bash
# Deploy Convex backend
npx convex deploy --prod

# Update CONVEX_DEPLOYMENT and NEXT_PUBLIC_CONVEX_URL in Vercel
# to use production values (prod:your-deployment-name)
```

## Design System

This project uses a custom design system based on the theme configuration:

- **Primary Color**: Indigo (`#6366f1`)
- **Secondary Color**: Sky Blue (`#0ea5e9`)
- **Accent Color**: Orange (`#f97316`)
- **Font**: Inter Variable with Plus Jakarta Sans for headings
- **Radius**: 4px (sm), 8px (md), 12px (lg)
- **Shadows**: Subtle slate-based shadows

See `planning/theme.json` for complete design tokens.

## ✅ Phase 2: Implementation Complete!

All implementation files have been generated:

1. ✅ **Database Layer** - CRUD operations in `convex/db/` (todos, threads, messages, userPreferences, dashboard)
2. ✅ **Endpoints** - Business logic in `convex/endpoints/` (todos, chat, preferences, dashboard, agentTools)
3. ✅ **Rate Limiting** - Configured in `convex/rateLimiter.ts`
4. ✅ **AI Agent** - Set up assistant in `convex/agent.ts`
5. ✅ **Frontend** - Complete Next.js app in `apps/web/` with authentication, dashboard, and todos pages

### Recommended Enhancements

- 🔔 Add email notifications with Resend component
- 📊 Add analytics with Aggregate component
- 💳 Add premium features with Autumn (Stripe) component
- 🔍 Add semantic search with RAG component
- 🎯 Add due date reminders with Crons component

## Learn More

- [Convex Documentation](https://docs.convex.dev)
- [Better Auth Documentation](https://better-auth.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

## Support

- **Convex Discord**: [Join community](https://discord.gg/convex)
- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check docs for detailed guides

---

Built with ❤️ using Convex and Next.js
