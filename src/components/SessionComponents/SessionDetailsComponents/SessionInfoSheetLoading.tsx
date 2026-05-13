/** @format */

"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SessionInfoSheetLoading() {
  return (
    <div className="px-5 pb-5 space-y-6">
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <div
          key={`info-section-skeleton-${sectionIndex}`}
          className="space-y-3"
        >
          <Skeleton className="h-6 w-28" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((__, rowIndex) => (
              <div
                key={`info-row-skeleton-${sectionIndex}-${rowIndex}`}
                className="flex items-center justify-between gap-4 py-1"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
