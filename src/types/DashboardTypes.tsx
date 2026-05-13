/** @format */

export type DashboardRange = "week" | "month" | "year";

export type DashboardChange = {
  value: string;
  display: string;
  direction: "up" | "down" | "neutral";
  is_positive: boolean;
};

export type DashboardMark1Item = {
  key:
    | "total_revenue"
    | "total_bookings"
    | "upcoming_sessions"
    | "matches_hosted"
    | string;
  label: string;
  value: string | number;
  value_display: string;
  change: DashboardChange;
};

export type DashboardLegend = {
  key: string;
  label: string;
};

export type DashboardMark2ChartItem = {
  key: string;
  label: string;
  revenue_growth: number;
  booking_count: number;
};

export type DashboardMark3Item = {
  key: string;
  label: string;
  value: number;
};

export type DashboardMark4ChartItem = {
  key: string;
  label: string;
  premium: number;
  free: number;
};

export type DashboardOverviewData = {
  dashboard_title: string;
  analytics_header: {
    title: string;
    subtitle: string;
    report_type: string;
    year_range: string;
  };
  mark_1: {
    title: string;
    items: DashboardMark1Item[];
  };
  mark_2: {
    title: string;
    value: string;
    value_display: string;
    selected_range: string;
    range_options: string[];
    legends: DashboardLegend[];
    chart: DashboardMark2ChartItem[];
  };
  mark_3: {
    title: string;
    center_value: number;
    center_value_display: string;
    items: DashboardMark3Item[];
  };
  mark_4: {
    title: string;
    value: number;
    value_display: string;
    subtitle: string;
    totals_display: string;
    legends: DashboardLegend[];
    chart: DashboardMark4ChartItem[];
  };
  field: {
    id: number;
    field_name: string;
  };
  subscription: {
    plan_code: string;
    is_paid: boolean;
    can_view_advanced_analytics: boolean;
    show_upgrade_popup: boolean;
  };
};

export type DashboardOverviewResponse = {
  success: boolean;
  message: string;
  meta: Record<string, unknown>;
  data: DashboardOverviewData;
  requestId: string;
};
