# 🚀 Quick Start Guide

Get your real-time todo list app running in **5 minutes**!

---

## Prerequisites Check

✅ Node.js 18+ installed (`node --version`)
✅ pnpm installed (`pnpm --version`)
✅ Convex account created at [dashboard.convex.dev](https://dashboard.convex.dev)
✅ OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)

---

## Step 1: Install Dependencies (2 min)

```bash
cd /workspaces/jn74998dv4gxe0f64an4cn8kqs7skcfq
pnpm install
```

Expected output: ✅ All packages installed successfully

---

## Step 2: Initialize Convex (1 min)

```bash
npx convex dev --once
```

This will:
1. ✅ Create a new Convex deployment
2. ✅ Generate your `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`
3. ✅ Push your schema to the cloud

**⚠️ Important**: Copy the deployment URL shown in the terminal!

---

## Step 3: Configure Environment (1 min)

```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit the file
nano .env.local  # or use your preferred editor
```

**Fill in these values:**

```bash
# From Step 2 output
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Generate this: openssl rand -base64 32
BETTER_AUTH_SECRET=your-generated-secret-here

# From OpenAI dashboard
OPENAI_API_KEY=sk-...

# Keep these for local development
SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Quick generate secret:**
```bash
openssl rand -base64 32
```

---

## Step 4: Start Development Server (30 sec)

```bash
pnpm dev
```

This starts **both**:
- ✅ Convex backend (syncing in real-time)
- ✅ Next.js frontend (http://localhost:3000)

---

## Step 5: Test Your App! (30 sec)

1. **Open browser**: http://localhost:3000
2. **Sign up**: Create a new account
3. **Create todo**: Add your first task
4. **Test real-time**: Open in another browser window - see instant updates!

---

## 🎉 You're Done!

Your app is now running with:
- ✅ Real-time database
- ✅ Authentication
- ✅ Rate limiting
- ✅ AI assistant (ready to use)
- ✅ Beautiful UI

---

## Common Issues & Fixes

### ❌ "NEXT_PUBLIC_CONVEX_URL is not set"

**Fix**: Make sure `.env.local` exists in the root directory with the correct values.

```bash
# Check if file exists
cat .env.local

# If not, copy from example
cp .env.local.example .env.local
```

---

### ❌ "Command 'convex' not found"

**Fix**: Use `npx` prefix:
```bash
npx convex dev --once
```

---

### ❌ Port 3000 already in use

**Fix**: Use a different port:
```bash
cd apps/web && PORT=3001 npm run dev
```

---

### ❌ pnpm: command not found

**Fix**: Install pnpm globally:
```bash
npm install -g pnpm
```

---

## Next Steps

### 🧪 Test Core Features

- [ ] Create a todo with priority and due date
- [ ] Mark todo as complete
- [ ] Edit an existing todo
- [ ] Delete a todo
- [ ] Filter by status (All/Active/Completed)
- [ ] Filter by priority
- [ ] Clear all completed todos

### 🎨 Customize Your App

Edit these files to customize:
- **Colors**: `planning/theme.json`
- **App name**: `apps/web/app/layout.tsx`
- **Logo**: Add to `apps/web/public/`

### 🤖 Try the AI Assistant

1. Go to the chat page (when implemented)
2. Ask: "Create a high priority todo to review project code"
3. The AI will create it for you!

### 🚀 Deploy to Production

When ready to deploy:

1. **Deploy Convex**:
```bash
npx convex deploy --prod
```

2. **Deploy to Vercel**:
   - Push to GitHub
   - Connect to Vercel
   - Set environment variables
   - Deploy!

---

## 📚 Learn More

- **Convex Docs**: https://docs.convex.dev
- **Better Auth**: https://better-auth.dev
- **Next.js**: https://nextjs.org/docs
- **Full README**: See `README.md` for detailed documentation

---

## 🆘 Get Help

- **Convex Discord**: https://discord.gg/convex
- **GitHub Issues**: Report bugs in your repository
- **Documentation**: Check `IMPLEMENTATION_SUMMARY.md` for architecture details

---

**Happy coding! 🎉**

Built with ❤️ using Convex + Next.js + Better Auth
