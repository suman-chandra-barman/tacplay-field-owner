/** @format */

"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { DashboardMark3Item } from "@/types/DashboardTypes";

const COLORS = ["#980009", "#b4971e"];

type SessionPieChartProps = {
  title: string;
  centerValueDisplay: string;
  items: DashboardMark3Item[];
};

const SessionPieChart: React.FC<SessionPieChartProps> = ({
  title,
  centerValueDisplay,
  items,
}) => {
  const chartData = items.map((item) => ({
    name: item.label,
    value: item.value,
  }));

  return (
    <div className="bg-card border border-white/5 rounded-xl p-5 flex-1">
      <h3 className="text-base md:text-lg font-semibold text-secondary mb-4">
        {title}
      </h3>

      <div className="flex flex-col sm:flex-row sm:items-center justify-center relative gap-4">
        <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-45 lg:h-45 mx-auto sm:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-[10px] sm:text-xs text-secondary text-center px-4">
              {centerValueDisplay}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:ml-4">
          {chartData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-xs text-secondary whitespace-nowrap">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs text-secondary">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionPieChart;
