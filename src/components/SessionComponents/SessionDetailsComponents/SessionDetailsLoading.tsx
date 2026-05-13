/** @format */

"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SessionDetailsLoading() {
  return (
    <div className="w-full p-3 md:p-4">
      <div className="max-w-625 mx-auto space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-52" />
          </div>
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>

        <div className="bg-card rounded-xl border border-white/5 p-5 space-y-4">
          <div className="flex justify-center">
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`score-item-${index}`}
                className="space-y-2 text-center"
              >
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`player-card-skeleton-${index}`}
              className="bg-card border border-white/5 rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-16 w-16 rounded-xl" />
                  <Skeleton className="h-6 w-28" />
                </div>
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((__, statIndex) => (
                  <Skeleton
                    key={`player-stat-skeleton-${index}-${statIndex}`}
                    className="h-10 w-full"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
