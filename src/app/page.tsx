/** @format */

"use client";

import {
  DollarSign,
  CalendarCheck,
  Gamepad2,
  Trophy,
  FileText,
} from "lucide-react";
import type { ReactNode } from "react";
import StatsCard from "@/components/DashboardComponents/StatsCard";
import RevenueChart from "@/components/DashboardComponents/RevenewChart";
import SessionPieChart from "@/components/DashboardComponents/SessionPieChart";
import BookingBarChart from "@/components/DashboardComponents/BookingBarChart";
import DashboardLoading from "@/components/DashboardComponents/DashboardLoading";
import { useGetDashboardOverviewQuery } from "@/redux/features/dashboard/dashboardAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setDashboardRange } from "@/redux/features/dashboard/dashboardSlice";
import type { DashboardRange } from "@/types/DashboardTypes";
import { useTranslation } from "react-i18next";

const RANGE_OPTIONS: DashboardRange[] = ["week", "month", "year"];

const STATS_ICON_BY_KEY: Record<string, ReactNode> = {
  total_revenue: <DollarSign className="w-4 h-4" />,
  total_bookings: <CalendarCheck className="w-4 h-4" />,
  upcoming_sessions: <Gamepad2 className="w-4 h-4" />,
  matches_hosted: <Trophy className="w-4 h-4" />,
};

export default function Home() {
  const { t } = useTranslation("dashboard");
  const dispatch = useAppDispatch();
  const selectedRange = useAppSelector(
    (state) => state.dashboard.selectedRange,
  );

  const { data, isLoading, isFetching, isError } =
    useGetDashboardOverviewQuery(selectedRange);

  const payload = data?.data;
  const header = payload?.analytics_header;
  const statsItems = payload?.mark_1.items ?? [];

  const revenueSection = payload?.mark_2;
  const revenueRanges = (revenueSection?.range_options ?? []).filter(
    (option): option is DashboardRange =>
      RANGE_OPTIONS.includes(option as DashboardRange),
  );
  const visibleRanges =
    revenueRanges.length > 0 ? revenueRanges : RANGE_OPTIONS;

  const showLoadingState = (isLoading || isFetching) && !payload;

  if (showLoadingState) {
    return <DashboardLoading />;
  }

  return (
    <div className="w-full p-3 md:p-4">
      <div className="max-w-625 mx-auto space-y-4 md:space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              {header?.title ?? t("home.analyticsReport")}
            </h1>
            <p className="text-sm text-secondary mt-0.5">
              {header?.subtitle ?? t("home.analyticsSupport")}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <button className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-primary text-sm font-medium px-4 py-2 rounded-lg border border-white/5 transition-colors">
              <FileText className="w-4 h-4" />
              {header?.report_type ?? t("home.allReports")}
            </button>

            <div className="flex bg-muted rounded-lg p-0.5 border border-white/5">
              {visibleRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => dispatch(setDashboardRange(range))}
                  className={`px-3 py-2 cursor-pointer text-xs font-medium rounded-md transition-all ${
                    selectedRange === range
                      ? "bg-custom-red text-primary"
                      : "text-primary hover:text-secondary"
                  }`}
                >
                  {t(`home.${range}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isError ? (
          <div className="text-sm text-destructive">{t("home.loadFailed")}</div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsItems.map((item) => (
            <StatsCard
              key={item.key}
              title={item.label}
              value={item.value_display}
              change={item.change.display}
              isPositive={item.change.is_positive}
              icon={
                STATS_ICON_BY_KEY[item.key] ?? (
                  <DollarSign className="w-4 h-4" />
                )
              }
            />
          ))}
        </div>

        {revenueSection ? (
          <RevenueChart
            title={revenueSection.title}
            valueDisplay={revenueSection.value_display}
            legends={revenueSection.legends}
            chartData={revenueSection.chart}
          />
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {payload?.mark_3 ? (
            <SessionPieChart
              title={payload.mark_3.title}
              centerValueDisplay={payload.mark_3.center_value_display}
              items={payload.mark_3.items}
            />
          ) : null}

          {payload?.mark_4 ? (
            <BookingBarChart
              title={payload.mark_4.title}
              valueDisplay={payload.mark_4.value_display}
              subtitle={payload.mark_4.subtitle}
              totalsDisplay={payload.mark_4.totals_display}
              legends={payload.mark_4.legends}
              chartData={payload.mark_4.chart}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
