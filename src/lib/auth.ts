/** @format */

import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp?: number;
};

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";
export const AUTH_USER_COOKIE = "tpAuthUser";
export const COOKIE_PATH = "/";

export type PersistedAuthUser = {
  id?: number;
  email?: string;
  full_name?: string;
  profile_image?: string | null;
  account_type?: string;
  role?: string;
  arena_info_saved?: boolean;
};

const isBrowser = typeof window !== "undefined";

const getCookieValue = (name: string): string | null => {
  if (!isBrowser) {
    return null;
  }

  const nameWithEquals = `${name}=`;
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith(nameWithEquals)) {
      return decodeURIComponent(trimmedCookie.substring(nameWithEquals.length));
    }
  }

  return null;
};

const setCookie = (name: string, value: string, maxAgeSeconds?: number) => {
  if (!isBrowser) {
    return;
  }

  const attributes = [`path=${COOKIE_PATH}`, "SameSite=Lax"];

  if (window.location.protocol === "https:") {
    attributes.push("Secure");
  }

  if (maxAgeSeconds && maxAgeSeconds > 0) {
    attributes.push(`max-age=${Math.floor(maxAgeSeconds)}`);
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; ${attributes.join("; ")}`;
};

const clearCookie = (name: string) => {
  if (!isBrowser) {
    return;
  }

  const attributes = [`path=${COOKIE_PATH}`, "SameSite=Lax", "max-age=0"];

  if (window.location.protocol === "https:") {
    attributes.push("Secure");
  }

  document.cookie = `${name}=; ${attributes.join("; ")}`;
};

export const getTokenMaxAge = (token: string): number | undefined => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) {
      return undefined;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const remaining = decoded.exp - nowInSeconds;
    return remaining > 0 ? remaining : 0;
  } catch {
    return undefined;
  }
};

export const saveAuthTokens = (accessToken: string, refreshToken: string) => {
  const accessTokenMaxAge = getTokenMaxAge(accessToken);
  const refreshTokenMaxAge = getTokenMaxAge(refreshToken);

  setCookie(ACCESS_TOKEN_COOKIE, accessToken, accessTokenMaxAge);
  setCookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshTokenMaxAge);
};

export const clearAuthTokens = () => {
  clearCookie(ACCESS_TOKEN_COOKIE);
  clearCookie(REFRESH_TOKEN_COOKIE);
  clearCookie(AUTH_USER_COOKIE);
};

export const saveAuthUser = (
  user: PersistedAuthUser,
  maxAgeSeconds?: number,
) => {
  const accessToken = getAccessToken();
  const resolvedMaxAge =
    typeof maxAgeSeconds === "number"
      ? maxAgeSeconds
      : accessToken
        ? getTokenMaxAge(accessToken)
        : undefined;

  setCookie(AUTH_USER_COOKIE, JSON.stringify(user), resolvedMaxAge);
};

export const getAuthUser = (): PersistedAuthUser | null => {
  const rawValue = getCookieValue(AUTH_USER_COOKIE);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as PersistedAuthUser;
  } catch {
    return null;
  }
};

export const getAccessToken = () => getCookieValue(ACCESS_TOKEN_COOKIE);

export const getRefreshToken = () => getCookieValue(REFRESH_TOKEN_COOKIE);

export const hasAccessToken = () => Boolean(getAccessToken());

type ApiError = {
  status?: number;
  data?: {
    message?: string;
    detail?: string;
    error?: string;
    errors?: Record<string, string[] | string>;
  };
};

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong",
) => {
  const typedError = error as ApiError;
  const data = typedError?.data;

  if (data?.message) {
    return data.message;
  }

  if (data?.detail) {
    return data.detail;
  }

  if (data?.error) {
    return data.error;
  }

  if (data?.errors) {
    const firstKey = Object.keys(data.errors)[0];
    const firstError = data.errors[firstKey];
    if (Array.isArray(firstError) && firstError.length > 0) {
      return firstError[0];
    }
    if (typeof firstError === "string") {
      return firstError;
    }
  }

  return fallback;
};

export const getSuccessMessage = (response: unknown, fallback = "Success") => {
  const typedResponse = response as {
    message?: string;
    data?: { message?: string };
  };

  return typedResponse?.message || typedResponse?.data?.message || fallback;
};
