/** @format */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ArenaField } from "@/redux/features/arenaManagement/arenaManagementAPI";

export type ArenaManagementState = {
  arenaField: ArenaField | null;
};

const initialState: ArenaManagementState = {
  arenaField: null,
};

const arenaManagementSlice = createSlice({
  name: "arenaManagement",
  initialState,
  reducers: {
    setArenaField: (state, action: PayloadAction<ArenaField | null>) => {
      state.arenaField = action.payload;
    },
    clearArenaField: (state) => {
      state.arenaField = null;
    },
  },
});

export const { setArenaField, clearArenaField } = arenaManagementSlice.actions;

export default arenaManagementSlice.reducer;
