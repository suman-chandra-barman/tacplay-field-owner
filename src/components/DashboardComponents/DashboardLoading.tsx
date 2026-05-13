/** @format */

"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="w-full p-3 md:p-4">
      <div className="max-w-625 mx-auto space-y-4 md:space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <Skeleton className="h-8 w-52" />
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-end">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <div className="flex bg-muted rounded-lg p-0.5 border border-white/5 gap-1">
              <Skeleton className="h-9 w-16 rounded-md" />
              <Skeleton className="h-9 w-16 rounded-md" />
              <Skeleton className="h-9 w-16 rounded-md" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`stats-skeleton-${index}`}
              className="bg-card border border-white/5 rounded-xl p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-6 w-14 rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-white/5 rounded-xl p-5 space-y-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-36" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-2.5 w-2.5 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-2.5 w-2.5 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
          <Skeleton className="h-40 sm:h-48 md:h-56 lg:h-64 xl:h-70 w-full rounded-lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card border border-white/5 rounded-xl p-5 space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="flex items-center justify-center">
              <Skeleton className="h-40 w-40 rounded-full" />
            </div>
            <div className="flex items-center justify-center gap-6">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          <div className="bg-card border border-white/5 rounded-xl p-5 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-32 sm:h-40 md:h-48 lg:h-50 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
