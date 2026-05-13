/** @format */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type EarningsState = {
  page: number;
  limit: number;
  selectedTransactionId: number | null;
};

const initialState: EarningsState = {
  page: 1,
  limit: 10,
  selectedTransactionId: null,
};

const earningsSlice = createSlice({
  name: "earnings",
  initialState,
  reducers: {
    setEarningsPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setEarningsLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1;
    },
    setSelectedTransactionId: (state, action: PayloadAction<number | null>) => {
      state.selectedTransactionId = action.payload;
    },
  },
});

export const { setEarningsPage, setEarningsLimit, setSelectedTransactionId } =
  earningsSlice.actions;

export default earningsSlice.reducer;
