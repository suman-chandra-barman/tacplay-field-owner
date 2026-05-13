/** @format */

import baseAPI from "@/redux/api/baseAPI";

export type AuthUser = {
  id?: number;
  email: string;
  full_name: string;
  profile_image?: string | null;
  account_type?: string;
  role?: string;
  arena_info_saved?: boolean;
};

export type SignupRequest = {
  owner_name: string;
  business_email: string;
  password: string;
  confirm_password: string;
};

export type SignupResponse = {
  success: boolean;
  message: string;
  data: {
    user_id: number;
    business_email: string;
  };
};

export type OtpRequest = {
  email_address: string;
  otp_code: string;
};

export type LoginRequest = {
  business_email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    tokens: {
      access: string;
      refresh: string;
    };
  };
};

export type ForgotPasswordRequest = {
  email_address: string;
};

export type ResetPasswordRequest = {
  new_password: string;
  confirm_password: string;
};

export type ForgotVerifyResponse = {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type ResetPasswordResponse = {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

const authAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    signUpFieldOwner: builder.mutation<SignupResponse, SignupRequest>({
      query: (body) => ({
        url: "/api/auth/signup/field-owner/",
        method: "POST",
        body,
      }),
    }),
    resendSignupOtp: builder.mutation<
      { success: boolean; message: string },
      { email_address: string }
    >({
      query: (body) => ({
        url: "/api/auth/resend-otp/",
        method: "POST",
        body,
      }),
    }),
    verifySignupOtp: builder.mutation<
      {
        success: boolean;
        message: string;
        data: {
          user_id: number;
          email_address: string;
          is_email_verified: boolean;
        };
      },
      OtpRequest
    >({
      query: (body) => ({
        url: "/api/auth/verify-otp/",
        method: "POST",
        body,
      }),
    }),
    loginFieldOwner: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/api/auth/field-owner-login/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    forgotPassword: builder.mutation<
      { success: boolean; message: string; data: { email_address: string } },
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: "/api/auth/forgot-password/",
        method: "POST",
        body,
      }),
    }),
    resendForgotPasswordOtp: builder.mutation<
      { success: boolean; message: string },
      { email_address: string }
    >({
      query: (body) => ({
        url: "/api/auth/resend-forgot-password-otp/",
        method: "POST",
        body,
      }),
    }),
    verifyForgotPasswordOtp: builder.mutation<ForgotVerifyResponse, OtpRequest>(
      {
        query: (body) => ({
          url: "/api/auth/verify-forgot-password-otp/",
          method: "POST",
          body,
        }),
      },
    ),
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: "/api/auth/reset-password/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/api/auth/logout/",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useSignUpFieldOwnerMutation,
  useResendSignupOtpMutation,
  useVerifySignupOtpMutation,
  useLoginFieldOwnerMutation,
  useForgotPasswordMutation,
  useResendForgotPasswordOtpMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authAPI;

export default authAPI;
