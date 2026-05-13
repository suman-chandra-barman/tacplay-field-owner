/** @format */

import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
} from "@/lib/auth";

const REFRESH_ENDPOINT = "/api/auth/token/refresh/";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getAccessToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const endpointUrl =
    typeof args === "string" ? args : args.url ? String(args.url) : "";

  if (result.error?.status === 401 && endpointUrl !== REFRESH_ENDPOINT) {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        {
          url: REFRESH_ENDPOINT,
          method: "POST",
          body: {
            refresh: refreshToken,
          },
        },
        api,
        extraOptions,
      );

      const refreshPayload = refreshResult.data as
        | {
            access?: string;
            refresh?: string;
            data?: {
              access?: string;
              refresh?: string;
              tokens?: {
                access?: string;
                refresh?: string;
              };
            };
          }
        | undefined;

      const nextAccessToken =
        refreshPayload?.access ||
        refreshPayload?.data?.access ||
        refreshPayload?.data?.tokens?.access;

      const nextRefreshToken =
        refreshPayload?.refresh ||
        refreshPayload?.data?.refresh ||
        refreshPayload?.data?.tokens?.refresh ||
        refreshToken;

      if (nextAccessToken) {
        saveAuthTokens(nextAccessToken, nextRefreshToken);
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        clearAuthTokens();
      }
    } else {
      clearAuthTokens();
    }
  }

  return result;
};

const baseAPI = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Arena",
    "Dashboard",
    "Earnings",
    "BookingList",
    "Sessions",
    "Settings",
    "Subscriptions",
  ],
  endpoints: () => ({}),
});

export default baseAPI;
