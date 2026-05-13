/** @format */

"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ArenaManagementLoading() {
  return (
    <div className="w-full pt-3 pb-6 md:pb-12 md:pt-4">
      <div className="max-w-625 mx-auto space-y-4 md:space-y-6">
        <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56 overflow-hidden rounded-t-xl">
          <Skeleton className="w-full h-full rounded-t-xl" />
        </div>

        <div className="relative px-4 sm:px-6 pb-4">
          <div className="relative -mt-10 sm:-mt-12 md:-mt-14 mb-3 flex items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-card" />
              <div className="pb-1 space-y-2">
                <Skeleton className="h-7 w-42" />
                <Skeleton className="h-4 w-52" />
              </div>
            </div>
            <Skeleton className="h-8 w-18 rounded-lg" />
          </div>
        </div>

        <div className="px-4 sm:px-6 pb-6 space-y-6">
          <div className="w-full flex overflow-x-auto border-b border-white/10 gap-2 pb-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={`arena-tab-skeleton-${index}`}
                className="h-9 w-32 rounded-md shrink-0"
              />
            ))}
          </div>

          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96 max-w-full" />
              </div>
              <Skeleton className="h-9 w-36 rounded-md" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-25 w-full" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
              <Skeleton className="h-11 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
