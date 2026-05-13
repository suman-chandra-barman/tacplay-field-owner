/** @format */

import baseAPI from "@/redux/api/baseAPI";
import type {
  BookingDetailsResponse,
  BookingListQuery,
  BookingListResponse,
} from "@/types/BookingListTypes";

const bookingListAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getBookingList: builder.query<BookingListResponse, BookingListQuery>({
      query: ({ page, limit, search }) => ({
        url: "/api/arena/bookings/",
        method: "GET",
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
        },
      }),
      providesTags: ["BookingList"],
    }),
    getBookingDetails: builder.query<BookingDetailsResponse, number>({
      query: (bookingId) => ({
        url: `/api/arena/bookings/${bookingId}/`,
        method: "GET",
      }),
      providesTags: ["BookingList"],
    }),
  }),
});

export const { useGetBookingListQuery, useGetBookingDetailsQuery } =
  bookingListAPI;

export default bookingListAPI;
