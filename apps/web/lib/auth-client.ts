/**
 * Better Auth Client Configuration
 *
 * Client-side authentication setup for React components
 */

import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  plugins: [convexClient()],
});

export const {
  useSession,
  signIn,
  signUp,
  signOut,
} = authClient;
