/** @format */

import { configureStore } from "@reduxjs/toolkit";
import baseAPI from "@/redux/api/baseAPI";
import authReducer from "@/redux/features/auth/authSlice";
import bookingListReducer from "@/redux/features/bookingList/bookingListSlice";
import dashboardReducer from "@/redux/features/dashboard/dashboardSlice";
import earningsReducer from "@/redux/features/earnings/earningsSlice";
import arenaManagementReducer from "@/redux/features/arenaManagement/arenaManagementSlice";
import sessionsReducer from "@/redux/features/sessions/sessionsSlice";
import settingsReducer from "@/redux/features/settings/settingsSlice";
import subscriptionsReducer from "@/redux/features/subscriptions/subscriptionsSlice";

export const store = configureStore({
  reducer: {
    [baseAPI.reducerPath]: baseAPI.reducer,
    auth: authReducer,
    bookingList: bookingListReducer,
    dashboard: dashboardReducer,
    earnings: earningsReducer,
    arenaManagement: arenaManagementReducer,
    sessions: sessionsReducer,
    settings: settingsReducer,
    subscriptions: subscriptionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
