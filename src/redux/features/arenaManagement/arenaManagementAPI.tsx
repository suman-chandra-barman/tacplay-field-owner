/** @format */

import baseAPI from "@/redux/api/baseAPI";

export type ArenaUserInfo = {
  full_name: string;
  email: string;
  profile_image: string | null;
};

export type ArenaApiResponse<T> = {
  success: boolean;
  message: string;
  meta: Record<string, unknown>;
  data: T;
  requestId: string;
};

export type ArenaCountry = {
  id: number;
  name: string;
  iso2: string;
};

export type ArenaCity = {
  id: number;
  name: string;
  country: ArenaCountry;
};

export type ArenaRule = {
  minimum_players_per_team: number;
  maximum_players_per_team: number;
  minimum_players_per_session: number;
  maximum_players_per_session: number;
  default_session_duration: number;
  duration_unit: string;
  base_price_per_player: string;
  allow_social_matches: boolean;
  allow_ranked_matches: boolean;
};

export type ArenaPackage = {
  id: number;
  package_name: string;
  description: string;
  package_fee: string;
  include_items: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ArenaMedia = {
  id: number;
  file: string;
  file_url: string;
  media_type: string;
  is_primary: boolean;
  created_at: string;
};

export type ArenaField = {
  id: number;
  field_name: string;
  description: string;
  country: ArenaCountry;
  city: ArenaCity;
  full_address: string;
  business_name: string | null;
  business_type: string | null;
  contact_phone_number: string | null;
  bank_account_holder_name: string | null;
  bank_name: string | null;
  account_number: string | null;
  iban_routing_number: string | null;
  swift_bic_code: string | null;
  completion_step: number;
  is_onboarding_completed: boolean;
  approval_status: string;
  submitted_at: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  rule: ArenaRule;
  packages: ArenaPackage[];
  media: ArenaMedia[];
};

export type CompletionFlowResponse = {
  success: boolean;
  message: string;
  meta: Record<string, unknown>;
  data: ArenaField;
  requestId: string;
};

export type Step1ArenaInfoInput = {
  field_name: string;
  description: string;
  country: string;
  city: string;
  full_address: string;
  image: File | null;
};

export type Step2MatchRequirementsBody = {
  minimum_players_per_team: number;
  maximum_players_per_team: number;
  minimum_players_per_session: number;
  maximum_players_per_session: number;
  default_session_duration: number;
  base_price_per_player: string;
  allow_social_matches: boolean;
  allow_ranked_matches: boolean;
};

export type PackageDraft = {
  package_name: string;
  description: string;
  package_fee: string;
  include_items: string[];
};

export type Step3PackageManagementBody = {
  packages: PackageDraft[];
};

export type Step4PayoutBusinessBody = {
  business_name: string;
  business_type: string;
  contact_phone_number: string;
  bank_account_holder_name: string;
  bank_name: string;
  account_number: string;
  confirm_account_number: string;
  iban_routing_number: string;
  swift_bic_code: string;
};

export type ArenaInfoResponseData = {
  id: number;
  field_name: string;
  description: string;
  country: ArenaCountry;
  city: ArenaCity;
  full_address: string;
  media: ArenaMedia[];
  user_info?: ArenaUserInfo;
};

export type ArenaInfoEditInput = {
  field_name: string;
  description: string;
  country: string;
  city: string;
  full_address: string;
  image?: File | null;
};

export type FieldSetupResponseData = {
  minimum_players_per_team: number;
  maximum_players_per_team: number;
  minimum_players_per_session: number;
  maximum_players_per_session: number;
  default_session_duration: number;
  duration_unit: string;
  base_price_per_player: string;
  allow_social_matches: boolean;
  allow_ranked_matches: boolean;
  user_info?: ArenaUserInfo;
};

export type FieldSetupEditBody = {
  minimum_players_per_team: number;
  maximum_players_per_team: number;
  minimum_players_per_session: number;
  maximum_players_per_session: number;
  default_session_duration: number;
  base_price_per_player: string;
  allow_social_matches: boolean;
  allow_ranked_matches: boolean;
};

export type PackageManagementResponseData = {
  packages: ArenaPackage[];
  user_info?: ArenaUserInfo;
};

export type PackageManagementEditBody = {
  packages: Array<{
    package_name: string;
    description: string;
    package_fee: string;
    include_items: string[];
    is_active: boolean;
  }>;
};

export type PayoutDetailsResponseData = {
  business_name: string;
  business_type: string;
  contact_phone_number: string;
  bank_account_holder_name: string;
  bank_name: string;
  account_number: string;
  iban_routing_number: string;
  swift_bic_code: string;
  user_info?: ArenaUserInfo;
};

export type PayoutDetailsEditBody = {
  business_name: string;
  business_type: string;
  contact_phone_number: string;
  bank_account_holder_name: string;
  bank_name: string;
  account_number: string;
  iban_routing_number: string;
  swift_bic_code: string;
};

const arenaManagementAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getArenaInfo: builder.query<ArenaApiResponse<ArenaInfoResponseData>, void>({
      query: () => ({
        url: "/api/arena/arena-info/",
        method: "GET",
      }),
      providesTags: ["Arena"],
    }),
    editArenaInfo: builder.mutation<
      ArenaApiResponse<ArenaInfoResponseData>,
      ArenaInfoEditInput
    >({
      query: (body) => {
        const formData = new FormData();
        formData.append("field_name", body.field_name);
        formData.append("description", body.description);
        formData.append("country", body.country);
        formData.append("city", body.city);
        formData.append("full_address", body.full_address);
        if (body.image) {
          formData.append("image", body.image);
        }

        return {
          url: "/api/arena/arena-info/edit/",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Arena"],
    }),
    getFieldSetup: builder.query<
      ArenaApiResponse<FieldSetupResponseData>,
      void
    >({
      query: () => ({
        url: "/api/arena/field-setup/",
        method: "GET",
      }),
      providesTags: ["Arena"],
    }),
    editFieldSetup: builder.mutation<
      ArenaApiResponse<FieldSetupResponseData>,
      FieldSetupEditBody
    >({
      query: (body) => ({
        url: "/api/arena/field-setup/edit/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Arena"],
    }),
    getPackageManagement: builder.query<
      ArenaApiResponse<PackageManagementResponseData>,
      void
    >({
      query: () => ({
        url: "/api/arena/package-management/",
        method: "GET",
      }),
      providesTags: ["Arena"],
    }),
    editPackageManagement: builder.mutation<
      ArenaApiResponse<PackageManagementResponseData>,
      PackageManagementEditBody
    >({
      query: (body) => ({
        url: "/api/arena/package-management/edit/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Arena"],
    }),
    getPayoutDetails: builder.query<
      ArenaApiResponse<PayoutDetailsResponseData>,
      void
    >({
      query: () => ({
        url: "/api/arena/payout-details/",
        method: "GET",
      }),
      providesTags: ["Arena"],
    }),
    editPayoutDetails: builder.mutation<
      ArenaApiResponse<PayoutDetailsResponseData>,
      PayoutDetailsEditBody
    >({
      query: (body) => ({
        url: "/api/arena/payout-details/edit/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Arena"],
    }),
    submitStep1ArenaInfo: builder.mutation<
      CompletionFlowResponse,
      Step1ArenaInfoInput
    >({
      query: (body) => {
        const formData = new FormData();
        formData.append("field_name", body.field_name);
        formData.append("description", body.description);
        formData.append("country", body.country);
        formData.append("city", body.city);
        formData.append("full_address", body.full_address);
        if (body.image) {
          formData.append("image", body.image);
        }
        return {
          url: "/api/arena/completion-flow/step-1-arena-info/",
          method: "POST",
          body: formData,
        };
      },
    }),
    submitStep2MatchRequirements: builder.mutation<
      CompletionFlowResponse,
      Step2MatchRequirementsBody
    >({
      query: (body) => ({
        url: "/api/arena/completion-flow/step-2-match-requirements/",
        method: "POST",
        body,
      }),
    }),
    submitStep3PackageManagement: builder.mutation<
      CompletionFlowResponse,
      Step3PackageManagementBody
    >({
      query: (body) => ({
        url: "/api/arena/completion-flow/step-3-package-management/",
        method: "POST",
        body,
      }),
    }),
    submitStep4PayoutBusiness: builder.mutation<
      CompletionFlowResponse,
      Step4PayoutBusinessBody
    >({
      query: (body) => ({
        url: "/api/arena/completion-flow/step-4-payout-business/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetArenaInfoQuery,
  useEditArenaInfoMutation,
  useGetFieldSetupQuery,
  useEditFieldSetupMutation,
  useGetPackageManagementQuery,
  useEditPackageManagementMutation,
  useGetPayoutDetailsQuery,
  useEditPayoutDetailsMutation,
  useSubmitStep1ArenaInfoMutation,
  useSubmitStep2MatchRequirementsMutation,
  useSubmitStep3PackageManagementMutation,
  useSubmitStep4PayoutBusinessMutation,
} = arenaManagementAPI;

export default arenaManagementAPI;
