/** @format */

"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function BookingListLoading() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Skeleton className="h-10 w-full sm:w-72 rounded-lg" />
      </div>

      <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 gap-3 px-4 py-3 border-b border-white/5">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={`booking-header-${index}`} className="h-4 w-16" />
          ))}
        </div>
        <div className="space-y-3 p-4">
          {Array.from({ length: 13 }).map((_, rowIndex) => (
            <div
              key={`booking-row-${rowIndex}`}
              className="grid grid-cols-7 gap-3"
            >
              {Array.from({ length: 7 }).map((__, columnIndex) => (
                <Skeleton
                  key={`booking-cell-${rowIndex}-${columnIndex}`}
                  className="h-5 md:h-8 w-full"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
