/** @format */

import baseAPI from "@/redux/api/baseAPI";
import type {
  CreateSessionPayload,
  CreateSessionResponse,
  SessionActionResponse,
  SessionCheckInPayload,
  SessionCheckInResponse,
  SessionDetailsResponse,
  SessionInfoResponse,
  SessionSubmitResultPayload,
  SessionSubmitResultResponse,
  SessionPlayerInfoResponse,
  SessionsListQuery,
  SessionsListResponse,
} from "@/types/SessionTypes";

const sessionsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerSessions: builder.query<SessionsListResponse, SessionsListQuery>({
      query: ({ page, limit, status, match_type }) => ({
        url: "/api/session/owner/sessions/",
        method: "GET",
        params: {
          page,
          limit,
          ...(status && status !== "all" ? { status } : {}),
          ...(match_type && match_type !== "all" ? { match_type } : {}),
        },
      }),
      providesTags: ["Sessions"],
    }),
    getOwnerSessionDetails: builder.query<SessionDetailsResponse, number>({
      query: (sessionId) => ({
        url: `/api/session/owner/sessions/${sessionId}/`,
        method: "GET",
      }),
      providesTags: ["Sessions"],
    }),
    getOwnerSessionInfo: builder.query<SessionInfoResponse, number>({
      query: (sessionId) => ({
        url: `/api/session/owner/sessions/${sessionId}/info/`,
        method: "GET",
      }),
      providesTags: ["Sessions"],
    }),
    getOwnerSessionPlayerInfo: builder.query<
      SessionPlayerInfoResponse,
      { sessionId: number; bookingId: number }
    >({
      query: ({ sessionId, bookingId }) => ({
        url: `/api/session/owner/sessions/${sessionId}/players/${bookingId}/`,
        method: "GET",
      }),
      providesTags: ["Sessions"],
    }),
    startOwnerSessionMatch: builder.mutation<SessionActionResponse, number>({
      query: (sessionId) => ({
        url: `/api/session/owner/sessions/${sessionId}/start/`,
        method: "POST",
      }),
      invalidatesTags: ["Sessions"],
    }),
    cancelOwnerSessionMatch: builder.mutation<SessionActionResponse, number>({
      query: (sessionId) => ({
        url: `/api/session/owner/sessions/${sessionId}/cancel/`,
        method: "PATCH",
      }),
      invalidatesTags: ["Sessions"],
    }),
    submitOwnerSessionResult: builder.mutation<
      SessionSubmitResultResponse,
      { sessionId: number; payload: SessionSubmitResultPayload }
    >({
      query: ({ sessionId, payload }) => ({
        url: `/api/session/owner/sessions/${sessionId}/submit-result/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Sessions"],
    }),
    checkInOwnerSessionPlayers: builder.mutation<
      SessionCheckInResponse,
      { sessionId: number; payload: SessionCheckInPayload }
    >({
      query: ({ sessionId, payload }) => ({
        url: `/api/session/owner/sessions/${sessionId}/check-in/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Sessions"],
    }),
    createOwnerSession: builder.mutation<
      CreateSessionResponse,
      CreateSessionPayload
    >({
      query: (payload) => ({
        url: "/api/session/owner/sessions/create/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Sessions"],
    }),
  }),
});

export const {
  useGetOwnerSessionsQuery,
  useGetOwnerSessionDetailsQuery,
  useGetOwnerSessionInfoQuery,
  useGetOwnerSessionPlayerInfoQuery,
  useStartOwnerSessionMatchMutation,
  useCancelOwnerSessionMatchMutation,
  useSubmitOwnerSessionResultMutation,
  useCheckInOwnerSessionPlayersMutation,
  useCreateOwnerSessionMutation,
} = sessionsAPI;

export default sessionsAPI;
