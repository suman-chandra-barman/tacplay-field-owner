/** @format */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type BookingListState = {
  page: number;
  limit: number;
  selectedBookingId: number | null;
};

const initialState: BookingListState = {
  page: 1,
  limit: 10,
  selectedBookingId: null,
};

const bookingListSlice = createSlice({
  name: "bookingList",
  initialState,
  reducers: {
    setBookingListPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setBookingListLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1;
    },
    setSelectedBookingId: (state, action: PayloadAction<number | null>) => {
      state.selectedBookingId = action.payload;
    },
  },
});

export const { setBookingListPage, setBookingListLimit, setSelectedBookingId } =
  bookingListSlice.actions;

export default bookingListSlice.reducer;
