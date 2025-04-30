import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/lib/auth.config";

import {
  authRoutes,
  publicRoutes,
  onboardingRoutes,
  apiAuthPrefix,
  middlewareIgnoreRoutes,
  DEFAULT_LOGIN_REDIRECT,
} from "@/lib/routes";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const grantId = !!req.auth?.user.grantId;

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isOnboardingRoute = onboardingRoutes.includes(nextUrl.pathname);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isMiddlewareIgnoreRoute =
    middlewareIgnoreRoutes.includes(nextUrl.pathname) ||
    nextUrl.searchParams.get("bypass") === "true";

  const bypassCookie = req.cookies.get("bypass");

  const needsOnboarding =
    isLoggedIn &&
    !grantId &&
    !bypassCookie &&
    !isApiAuthRoute &&
    !isPublicRoute &&
    !isOnboardingRoute;

  if (isMiddlewareIgnoreRoute) {
    if (nextUrl.searchParams.has("bypass")) {
      const cleanedUrl = new URL(nextUrl.pathname, nextUrl);
      cleanedUrl.searchParams.delete("bypass");

      const res = NextResponse.redirect(cleanedUrl);
      res.cookies.set("bypass", "true", { path: "/", maxAge: 10 });
      return res;
    }

    return NextResponse.next();
  }

  if (needsOnboarding) {
    return NextResponse.redirect(new URL("/onboarding", nextUrl));
  }

  if (isLoggedIn && isOnboardingRoute) {
    if (grantId) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (nextUrl.pathname === "/business") {
    return NextResponse.redirect(new URL("/business/overview", nextUrl));
  }

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = encodeURIComponent(
      `${nextUrl.pathname}${nextUrl.search || ""}`
    );

    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
