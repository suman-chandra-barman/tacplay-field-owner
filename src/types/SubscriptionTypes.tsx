/** @format */

export type SubscriptionPlan = {
  id: number;
  name: string;
  code: string;
  billing_cycle: string;
  price: string;
  currency: string;
  duration_days: number;
  description: string;
  is_active: boolean;
  is_current: boolean;
  button_text: string;
};

export type SubscriptionPlansResponse = {
  success: boolean;
  message: string;
  meta: Record<string, unknown>;
  data: SubscriptionPlan[];
  requestId: string;
};

export type SubscriptionStatus = {
  has_active_subscription: boolean;
  plan_code: string | null;
  plan_name: string | null;
  billing_cycle: string | null;
  price: string | null;
  currency: string | null;
  started_at: string | null;
  expires_at: string | null;
  days_left: number | null;
  status: string;
  show_upgrade_popup: boolean;
};

export type SubscriptionStatusResponse = {
  success: boolean;
  message: string;
  meta: Record<string, unknown>;
  data: SubscriptionStatus;
  requestId: string;
};

export type UpgradeSubscriptionPayload = {
  plan_code: string;
};

export type UpgradeSubscriptionResponse = {
  success: boolean;
  message: string;
  meta: Record<string, unknown>;
  data: {
    invoice_id: string;
    plan_code: string;
    plan_name: string;
    amount: string;
    currency: string;
    payment_status: string;
    upgrade_status: string;
    payment_url: string;
    stripe_checkout_session_id: string;
    created_at: string;
  };
  requestId: string;
};
