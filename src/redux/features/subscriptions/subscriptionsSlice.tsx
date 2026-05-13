/** @format */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SubscriptionsState = {
  selectedPlanCode: string | null;
  lastPaymentUrl: string | null;
};

const initialState: SubscriptionsState = {
  selectedPlanCode: null,
  lastPaymentUrl: null,
};

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setSelectedPlanCode: (state, action: PayloadAction<string | null>) => {
      state.selectedPlanCode = action.payload;
    },
    setLastPaymentUrl: (state, action: PayloadAction<string | null>) => {
      state.lastPaymentUrl = action.payload;
    },
    clearSubscriptionSession: (state) => {
      state.selectedPlanCode = null;
      state.lastPaymentUrl = null;
    },
  },
});

export const {
  setSelectedPlanCode,
  setLastPaymentUrl,
  clearSubscriptionSession,
} = subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;
