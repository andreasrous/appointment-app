/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = ["/", "/pricing", "/auth/new-verification"];

/**
 * An array of routes that are accessible to the public.
 * These routes will redirect logged in users to /dashboard
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * An array of routes that are accessible to the public.
 * These routes will redirect logged in users to /dashboard
 * @type {string[]}
 */
export const onboardingRoutes = ["/onboarding"];

/**
 * An array of routes that should be completely ignored by the middleware.
 * @type {string[]}
 */
export const middlewareIgnoreRoutes = [
  "/api/uploadthing",
  "/api/oauth/exchange",
  "/api/webhooks/stripe",
  "/api/payment",
];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

/**
 * The default redirect path after logging out.
 * @type {string}
 */
export const DEFAULT_LOGOUT_REDIRECT = "/";
