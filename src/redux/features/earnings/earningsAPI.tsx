/** @format */

import baseAPI from "@/redux/api/baseAPI";
import type {
  EarningsListResponse,
  EarningsListQuery,
  TransactionDetailsResponse,
} from "@/types/EarningTypes";

const earningsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getEarningsList: builder.query<EarningsListResponse, EarningsListQuery>({
      query: ({ page, limit, search }) => ({
        url: "/api/arena/earnings/",
        method: "GET",
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
        },
      }),
      providesTags: ["Earnings"],
    }),
    getEarningDetails: builder.query<TransactionDetailsResponse, number>({
      query: (transactionId) => ({
        url: `/api/arena/earnings/${transactionId}/`,
        method: "GET",
      }),
      providesTags: ["Earnings"],
    }),
  }),
});

export const { useGetEarningsListQuery, useGetEarningDetailsQuery } =
  earningsAPI;

export default earningsAPI;
