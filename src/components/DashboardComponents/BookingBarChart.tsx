/** @format */

"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import type {
  DashboardLegend,
  DashboardMark4ChartItem,
} from "@/types/DashboardTypes";
import { Lock, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

type BookingBarChartProps = {
  title: string;
  valueDisplay: string;
  subtitle: string;
  totalsDisplay: string;
  legends: DashboardLegend[];
  chartData: DashboardMark4ChartItem[];
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

const BookingBarChart: React.FC<BookingBarChartProps> = ({
  title,
  valueDisplay,
  subtitle,
  totalsDisplay,
  legends,
  chartData,
  isLocked = false,
  onUpgradeClick,
}) => {
  const { t } = useTranslation("dashboard");
  const getLegendLabel = (label: string) => {
    if (label === "Premium") return t("home.legends.premium");
    if (label === "Free") return t("home.legends.free");
    if (label === "Booking Count") return t("home.legends.bookingCount");
    return label;
  };
  const legendA = legends[0]?.label ? getLegendLabel(legends[0].label) : t("home.legends.premium");
  const legendB = legends[1]?.label ? getLegendLabel(legends[1].label) : t("home.legends.free");
  const translatedTitle = title === "Booking Source Breakdown"
    ? t("home.bookingSourceBreakdown")
    : title === "Booking Count"
    ? t("home.legends.bookingCount")
    : title;

  return (
    <div className="bg-card border border-white/5 rounded-xl p-5 flex-1 relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-base font-semibold text-secondary">{translatedTitle}</h3>
          {!isLocked && (
            <>
              <h2 className="text-xl md:text-3xl font-bold text-primary mt-1">
                {valueDisplay}
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                {subtitle}&nbsp;&nbsp;&nbsp;{totalsDisplay}
              </p>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-custom-red" />
            <span className="text-xs text-secondary">{legendA}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-custom-yellow" />
            <span className="text-xs text-secondary">{legendB}</span>
          </div>
        </div>
      </div>

      <div className="relative mt-4 flex-1 flex flex-col justify-end">
        <div className={cn("w-full h-32 sm:h-40 md:h-48 lg:h-50 transition-all duration-200", isLocked && "blur-[2.5px] pointer-events-none select-none opacity-75")}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
              barGap={2}
            >
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
              <Bar
                dataKey="premium"
                name={legendA}
                fill="#980009"
                radius={[3, 3, 0, 0]}
                barSize={12}
              />
              <Bar
                dataKey="free"
                name={legendB}
                fill="#b4971e"
                radius={[3, 3, 0, 0]}
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b0b0f]/50 backdrop-blur-[1.5px] rounded-xl p-6 text-center z-10 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-custom-red/10 border border-custom-red/20 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(152,0,9,0.2)] animate-pulse">
              <Lock className="w-5 h-5 text-custom-red" />
            </div>
            <h4 className="text-base font-semibold text-primary mb-1">
              {t("home.unlockBookingTitle", "Unlock Booking Source Breakdown")}
            </h4>
            <p className="text-xs text-secondary max-w-[320px] mb-4 leading-relaxed">
              {t("home.unlockBookingDesc", "Upgrade your plan to Essential for Field Growth or Gold to view match booking breakdown analytics between Premium and Free slots.")}
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

export default BookingBarChart;
