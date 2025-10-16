import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { createAuth } from "./auth";

/**
 * HTTP router for Convex
 *
 * Handles HTTP endpoints outside of standard Convex queries/mutations.
 * Currently configured for Better Auth authentication endpoints.
 */
const http = httpRouter();

/**
 * Better Auth HTTP routes
 *
 * Handles all authentication requests:
 * - POST /auth/sign-in - User login
 * - POST /auth/sign-up - User registration
 * - POST /auth/sign-out - User logout
 * - GET /auth/session - Get current session
 * - And other Better Auth endpoints
 *
 * Note: Using httpAction() wrapper for proper TypeScript types
 */
http.route({
  path: "/auth/*",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

http.route({
  path: "/auth/*",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

export default http;
