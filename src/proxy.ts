/** @format */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPublicAuthPath } from "@/lib/public-auth-paths";
import { SESSION_COOKIE_NAME } from "@/lib/session-cookie";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (isPublicAuthPath(pathname)) {
    if (
      hasSession &&
      (pathname === "/sign-in" || pathname.startsWith("/sign-in/"))
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("from", pathname);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
