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

type RevenueChartProps = {
  title: string;
  valueDisplay: string;
  legends: DashboardLegend[];
  chartData: DashboardMark2ChartItem[];
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
}) => {
  const legendA = legends[0]?.label ?? "Revenue Growth";
  const legendB = legends[1]?.label ?? "Booking Count";

  return (
    <div className="bg-card border border-white/5 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm md:text-sm text-secondary mb-1">{title}</p>
          <h2 className="text-xl md:text-3xl font-bold text-primary">
            {valueDisplay}
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

      <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-70">
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
    </div>
  );
};

export default RevenueChart;
