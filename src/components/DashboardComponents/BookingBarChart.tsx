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
import type {
  DashboardLegend,
  DashboardMark4ChartItem,
} from "@/types/DashboardTypes";

type BookingBarChartProps = {
  title: string;
  valueDisplay: string;
  subtitle: string;
  totalsDisplay: string;
  legends: DashboardLegend[];
  chartData: DashboardMark4ChartItem[];
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
}) => {
  const legendA = legends[0]?.label ?? "Premium";
  const legendB = legends[1]?.label ?? "Free";

  return (
    <div className="bg-card border border-white/5 rounded-xl p-5 flex-1">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-base font-semibold text-secondary">{title}</h3>
          <h2 className="text-xl md:text-3xl font-bold text-primary mt-1">
            {valueDisplay}
          </h2>
          <p className="text-xs text-secondary mt-0.5">
            {subtitle}&nbsp;&nbsp;&nbsp;{totalsDisplay}
          </p>
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

      <div className="w-full h-32 sm:h-40 md:h-48 lg:h-50 mt-4">
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
    </div>
  );
};

export default BookingBarChart;
