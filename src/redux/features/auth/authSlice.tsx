/** @format */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { hasAccessToken } from "@/lib/auth";
import type { AuthUser } from "@/redux/features/auth/authAPI";

type VerificationPurpose = "signup" | "forgot-password" | null;

type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  pendingEmail: string;
  verificationPurpose: VerificationPurpose;
};

const initialState: AuthState = {
  isAuthenticated: hasAccessToken(),
  user: null,
  pendingEmail: "",
  verificationPurpose: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthSession: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuthSession: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setPendingVerification: (
      state,
      action: PayloadAction<{
        email: string;
        purpose: Exclude<VerificationPurpose, null>;
      }>,
    ) => {
      state.pendingEmail = action.payload.email;
      state.verificationPurpose = action.payload.purpose;
    },
    clearPendingVerification: (state) => {
      state.pendingEmail = "";
      state.verificationPurpose = null;
    },
  },
});

export const {
  setAuthSession,
  clearAuthSession,
  setPendingVerification,
  clearPendingVerification,
} = authSlice.actions;

export default authSlice.reducer;
