/** @format */

export type BookingListQuery = {
  page: number;
  limit: number;
  search?: string;
};

export type BookingListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  filters: {
    search: string;
    status: string;
    team: string;
    match_type: string;
    session_id: string;
    date_from: string;
    date_to: string;
  };
};

export type BookingListItem = {
  booking_id: number;
  display_booking_id: string;
  player_name: string;
  player_id: number;
  display_player_id: string;
  player_email: string;
  session_id: number;
  session_name: string;
  field_name: string;
  match_date: string;
  booking_date: string;
  booking_flow: string;
  match_type: string;
  team: string;
  team_display: string;
  player_count: number;
  amount: string;
  amount_display: string;
  payment_status: string;
  status: string;
  can_view: boolean;
};

export type BookingListResponse = {
  success: boolean;
  message: string;
  meta: BookingListMeta;
  data: BookingListItem[];
  requestId: string;
};

export type BookingDetailsResponse = {
  success: boolean;
  message: string;
  meta: Record<string, unknown>;
  data: {
    booking: {
      id: number;
      display_booking_id: string;
      status: string;
      payment_status: string;
      payment_reference: string;
      booking_flow: string;
      team: string;
      team_display: string;
      player_count: number;
      created_at: string;
      paid_at: string;
      confirmed_at: string;
    };
    player: {
      id: number;
      display_player_id: string;
      full_name: string;
      email: string;
      contact_number: string | null;
      location: string;
      profile_image: string | null;
    };
    session: {
      id: number;
      session_name: string;
      field_name: string;
      match_type: string;
      session_visibility: string;
      match_date: string;
      start_time: string;
      end_time: string;
      team_a_name: string;
      team_b_name: string;
      entry_fee: string;
      status: string;
    };
    payment: {
      entry_fee_total: string;
      package_fee: string;
      commission_rate: string;
      commission_amount: string;
      total_amount: string;
      total_amount_display: string;
      currency: string;
      payment_method: string;
    };
    package: {
      id: number;
      package_name: string;
      package_fee: string;
      description: string;
      include_items: string[];
    };
    selected_players: Array<{
      id: number;
      full_name: string;
      email: string;
      profile_image: string | null;
    }>;
    session_booking: {
      id: number;
      status: string;
      paid_amount: string;
      payment_status: string;
    };
  };
  requestId: string;
};
