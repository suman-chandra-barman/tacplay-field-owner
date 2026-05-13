/** @format */

import baseAPI from "@/redux/api/baseAPI";
import type {
  ChangeFieldOwnerPasswordPayload,
  ChangeFieldOwnerPasswordResponse,
  FieldOwnerProfileResponse,
  UpdateFieldOwnerProfilePayload,
} from "@/types/SettingTypes";

const settingsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getFieldOwnerProfile: builder.query<FieldOwnerProfileResponse, void>({
      query: () => ({
        url: "/api/auth/field-owner/profile/",
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    updateFieldOwnerProfile: builder.mutation<
      FieldOwnerProfileResponse,
      UpdateFieldOwnerProfilePayload
    >({
      query: (payload) => ({
        url: "/api/auth/field-owner/profile/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Settings"],
    }),
    changeFieldOwnerPassword: builder.mutation<
      ChangeFieldOwnerPasswordResponse,
      ChangeFieldOwnerPasswordPayload
    >({
      query: (payload) => ({
        url: "/api/auth/field-owner-change-password/",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetFieldOwnerProfileQuery,
  useUpdateFieldOwnerProfileMutation,
  useChangeFieldOwnerPasswordMutation,
} = settingsAPI;

export default settingsAPI;
