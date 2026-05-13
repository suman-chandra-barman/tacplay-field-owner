/** @format */

/**
 * Path prefixes for pre-authentication pages (no session required).
 * Match using exact path or `${route}/...` only (not `/sign-infoo`).
 */
export const PUBLIC_AUTH_PATH_PREFIXES = [
  "/sign-in",
  "/sign-up",
  "/forgot-pass",
  "/verify-otp",
  "/reset-pass",
  "/profile-setup",
  "/create-new-pass",
  "/verify-email",
] as const;

export function isPublicAuthPath(pathname: string): boolean {
  let path = pathname;
  if (path !== "/" && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return PUBLIC_AUTH_PATH_PREFIXES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}
