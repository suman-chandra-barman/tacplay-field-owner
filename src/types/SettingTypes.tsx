/** @format */

export type FieldOwnerProfile = {
  id: number;
  full_name: string;
  email_address: string;
  contact_number: string;
  password: string;
  profile_image: string | null;
};

export type FieldOwnerProfileResponse = {
  success: boolean;
  message: string;
  meta: Record<string, unknown>;
  data: FieldOwnerProfile;
  requestId: string;
};

export type UpdateFieldOwnerProfilePayload = FormData;

export type ChangeFieldOwnerPasswordPayload = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

export type ChangeFieldOwnerPasswordResponse = {
  success: boolean;
  message: string;
  meta?: Record<string, unknown>;
  data?: unknown;
  requestId?: string;
};
