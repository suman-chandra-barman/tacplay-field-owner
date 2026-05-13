/** @format */

import baseAPI from "@/redux/api/baseAPI";
import type {
  DashboardOverviewResponse,
  DashboardRange,
} from "@/types/DashboardTypes";

const dashboardAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<
      DashboardOverviewResponse,
      DashboardRange
    >({
      query: (range) => ({
        url: "/api/arena/overview/",
        method: "GET",
        params: { range },
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardOverviewQuery } = dashboardAPI;

export default dashboardAPI;
