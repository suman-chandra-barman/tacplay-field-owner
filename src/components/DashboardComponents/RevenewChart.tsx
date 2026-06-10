/** @format */

"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type {
  DashboardLegend,
  DashboardMark2ChartItem,
} from "@/types/DashboardTypes";
import { Euro, Lock, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type RevenueChartProps = {
  title: string;
  valueDisplay: string;
  legends: DashboardLegend[];
  chartData: DashboardMark2ChartItem[];
  isLocked?: boolean;
  onUpgradeClick?: () => void;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1826] border border-white/10 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RevenueChart: React.FC<RevenueChartProps> = ({
  title,
  valueDisplay,
  legends,
  chartData,
  isLocked = false,
  onUpgradeClick,
}) => {
  const { t } = useTranslation("dashboard");
  const getLegendLabel = (label: string) => {
    if (label === "Revenue Growth") return t("home.legends.revenueGrowth");
    if (label === "Booking Count") return t("home.legends.bookingCount");
    return label;
  };
  const legendA = legends[0]?.label ? getLegendLabel(legends[0].label) : t("home.legends.revenueGrowth");
  const legendB = legends[1]?.label ? getLegendLabel(legends[1].label) : t("home.legends.bookingCount");
  const translatedTitle = (title === "Revenue" || title === "Total Revenue") ? t("home.totalRevenue") : title;

  return (
    <div className="bg-card border border-white/5 rounded-xl p-5 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm md:text-sm text-secondary mb-1">{translatedTitle}</p>
          <h2 className="text-xl md:text-3xl font-bold text-primary flex items-center gap-1">
            <Euro className="w-4 h-4" /> {valueDisplay}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-custom-red" />
            <span className="text-xs text-primary">{legendA}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-custom-yellow" />
            <span className="text-xs text-primary">{legendB}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className={cn("w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-70 transition-all duration-200", isLocked && "blur-[2.5px] pointer-events-none select-none opacity-75")}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#980009" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#980009" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b4971e" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#b4971e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(82,82,115,0.2)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#525273", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#525273", fontSize: 12 }}
                tickFormatter={(value) =>
                  value >= 1000 ? `${value / 1000}k` : value
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="booking_count"
                name={legendB}
                stroke="#b4971e"
                strokeWidth={2}
                fill="url(#bookingGradient)"
              />
              <Area
                type="monotone"
                dataKey="revenue_growth"
                name={legendA}
                stroke="#980009"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b0b0f]/50 backdrop-blur-[1.5px] rounded-xl p-6 text-center z-10 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-custom-red/10 border border-custom-red/20 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(152,0,9,0.2)] animate-pulse">
              <Lock className="w-5 h-5 text-custom-red" />
            </div>
            <h4 className="text-base font-semibold text-primary mb-1">
              {t("home.unlockRevenueTitle", "Unlock Revenue Analytics")}
            </h4>
            <p className="text-xs text-secondary max-w-[320px] mb-4 leading-relaxed">
              {t("home.unlockRevenueDesc", "Upgrade your plan to Essential for Field Growth or Gold to view interactive charts tracking your weekly, monthly, and yearly revenue growth alongside booking counts.")}
            </p>
            <button
              onClick={onUpgradeClick}
              className="flex items-center gap-1.5 bg-linear-to-r from-[#980009] via-[#C00069] to-[#980009] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_10px_rgba(192,0,105,0.4)] cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-[#cdba20]" />
              {t("sidebar.upgrade", "Upgrade")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
