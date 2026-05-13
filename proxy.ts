/** @format */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth";

const authOnlyRoutes = [
  "/sign-in",
  "/sign-up",
  "/forgot-pass",
  "/verify-otp",
  "/reset-pass",
];

const isAuthOnlyRoute = (pathname: string) => {
  return authOnlyRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
};

const PROFILE_SETUP_ROUTE = "/profile-setup";

const isValidAccessToken = (token: string | undefined) => {
  if (!token) {
    return false;
  }

  const trimmedToken = token.trim();
  if (!trimmedToken) {
    return false;
  }

  const normalized = trimmedToken.toLowerCase();
  if (normalized === "undefined" || normalized === "null") {
    return false;
  }

  const tokenParts = trimmedToken.split(".");
  if (tokenParts.length !== 3) {
    return false;
  }

  try {
    const payloadBase64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson) as { exp?: number };

    if (typeof payload.exp !== "number") {
      return false;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp > nowInSeconds;
  } catch {
    return false;
  }
};

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const isAuthenticated = isValidAccessToken(accessToken);
  const isAuthRoute = isAuthOnlyRoute(pathname);
  const isProfileSetupRoute =
    pathname === PROFILE_SETUP_ROUTE ||
    pathname.startsWith(`${PROFILE_SETUP_ROUTE}/`);

  if (!isAuthenticated && !isAuthRoute) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL(PROFILE_SETUP_ROUTE, request.url));
  }

  if (!isAuthenticated && isProfileSetupRoute) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
