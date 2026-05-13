/** @format */

"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SessionLoading() {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-52" />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-40 rounded-lg" />
          <Skeleton className="h-10 w-full sm:w-40 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-44 rounded-lg" />
      </div>

      <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 gap-3 px-4 py-3 border-b border-white/5">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={`session-header-${index}`} className="h-4 w-16" />
          ))}
        </div>
        <div className="space-y-3 p-4">
          {Array.from({ length: 10 }).map((_, rowIndex) => (
            <div
              key={`session-row-${rowIndex}`}
              className="grid grid-cols-7 gap-3"
            >
              {Array.from({ length: 7 }).map((__, columnIndex) => (
                <Skeleton
                  key={`session-cell-${rowIndex}-${columnIndex}`}
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
