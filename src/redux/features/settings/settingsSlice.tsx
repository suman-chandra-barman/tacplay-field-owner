/** @format */

import { createSlice } from "@reduxjs/toolkit";

export type SettingsState = {
  initialized: boolean;
};

const initialState: SettingsState = {
  initialized: true,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
});

export default settingsSlice.reducer;
