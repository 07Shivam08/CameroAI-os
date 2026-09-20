import { authMiddleware } from "@clerk/nextjs/server";

// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your Middleware

export default authMiddleware({
  // Only allow specific public routes - remove the blanket '/api(.*)'
  publicRoutes: [
    "/api/uploadthing(.*)", // File upload endpoint (if needed publicly)
    "/api/check", // Health check endpoint
    "/form/create", // Public form creation
    "/pricing", // Pricing page
    "/sign-in(.*)", // Sign in pages
    "/sign-up(.*)", // Sign up pages
  ],
  // All other API routes will now require authentication
});

export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.

    "/((?!.+\\.[\\w]+$|_next).*)",
    // Re-include any files in the api or trpc folders that might have an extension
    "/(api|trpc)(.*)",
  ],
};
