/** @format */

import baseAPI from "@/redux/api/baseAPI";
import type {
  BillingHistoryResponse,
  SubscriptionPlansResponse,
  SubscriptionStatusResponse,
  UpgradeSubscriptionPayload,
  UpgradeSubscriptionResponse,
} from "@/types/SubscriptionTypes";

const subscriptionsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getFieldOwnerSubscriptionPlans: builder.query<
      SubscriptionPlansResponse,
      void
    >({
      query: () => ({
        url: "/api/auth/field-owner/subscription/plans/",
        method: "GET",
      }),
      providesTags: ["Subscriptions"],
    }),
    getFieldOwnerSubscriptionStatus: builder.query<
      SubscriptionStatusResponse,
      void
    >({
      query: () => ({
        url: "/api/auth/field-owner/subscription/status/",
        method: "GET",
      }),
      providesTags: ["Subscriptions"],
    }),
    getFieldOwnerBillingHistory: builder.query<BillingHistoryResponse, void>({
      query: () => ({
        url: "/api/auth/field-owner/subscription/billing-history/",
        method: "GET",
      }),
      providesTags: ["Subscriptions"],
    }),
    upgradeFieldOwnerSubscription: builder.mutation<
      UpgradeSubscriptionResponse,
      UpgradeSubscriptionPayload
    >({
      query: (body) => ({
        url: "/api/auth/field-owner/subscription/upgrade/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscriptions", "Dashboard"],
    }),
  }),
});

export const {
  useGetFieldOwnerSubscriptionPlansQuery,
  useGetFieldOwnerSubscriptionStatusQuery,
  useGetFieldOwnerBillingHistoryQuery,
  useUpgradeFieldOwnerSubscriptionMutation,
} = subscriptionsAPI;

export default subscriptionsAPI;
