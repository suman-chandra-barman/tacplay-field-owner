/** @format */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  SessionMatchTypeFilter,
  SessionStatusFilter,
} from "@/types/SessionTypes";

export type SessionsState = {
  page: number;
  limit: number;
  status: SessionStatusFilter;
  matchType: SessionMatchTypeFilter;
};

const initialState: SessionsState = {
  page: 1,
  limit: 10,
  status: "all",
  matchType: "all",
};

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    setSessionsPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSessionsLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1;
    },
    setSessionsStatus: (state, action: PayloadAction<SessionStatusFilter>) => {
      state.status = action.payload;
      state.page = 1;
    },
    setSessionsMatchType: (
      state,
      action: PayloadAction<SessionMatchTypeFilter>,
    ) => {
      state.matchType = action.payload;
      state.page = 1;
    },
  },
});

export const {
  setSessionsPage,
  setSessionsLimit,
  setSessionsStatus,
  setSessionsMatchType,
} = sessionsSlice.actions;

export default sessionsSlice.reducer;
