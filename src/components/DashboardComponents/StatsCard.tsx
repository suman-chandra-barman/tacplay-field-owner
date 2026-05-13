/** @format */

"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon,
}) => {
  return (
    <div className="bg-card border border-white/5 rounded-xl p-5 flex flex-col gap-3 min-w-0 flex-1">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-xl md:text-3xl font-bold text-primary tracking-tight">
          {value}
        </h2>
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${
            isPositive
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-red-500/15 text-red-400"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {change}
        </span>
      </div>
      <div className="flex items-center gap-2 text-secondary text-sm">
        <span className="w-4 h-4 flex items-center justify-center opacity-70">
          {icon}
        </span>
        <span>{title}</span>
      </div>
    </div>
  );
};

export default StatsCard;
