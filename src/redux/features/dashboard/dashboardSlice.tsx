/** @format */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardRange } from "@/types/DashboardTypes";

export type DashboardState = {
  selectedRange: DashboardRange;
};

const initialState: DashboardState = {
  selectedRange: "month",
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardRange: (state, action: PayloadAction<DashboardRange>) => {
      state.selectedRange = action.payload;
    },
  },
});

export const { setDashboardRange } = dashboardSlice.actions;

export default dashboardSlice.reducer;
