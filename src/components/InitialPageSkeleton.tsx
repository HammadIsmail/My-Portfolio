"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function InitialPageSkeleton() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col overflow-hidden animate-pulse">

      {/* Main Content Area Skeleton */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto max-w-5xl mx-auto w-full">
        {/* Hero Banner Skeleton */}
        <div className="neo-raised rounded-3xl overflow-hidden space-y-6 pb-8">
          <Skeleton className="h-48 sm:h-64 md:h-72 w-full neo-inset" />
          <div className="px-6 sm:px-8 space-y-4">
            <div className="flex justify-between items-end -mt-16 sm:-mt-20">
              <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 rounded-full neo-raised" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24 rounded-xl neo-button" />
                <Skeleton className="h-10 w-24 rounded-xl neo-button" />
              </div>
            </div>
            <Skeleton className="h-10 w-3/4 sm:w-1/2 rounded-xl neo-inset-sm" />
            <Skeleton className="h-5 w-1/3 rounded-xl neo-inset-sm" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full rounded-lg neo-inset-sm" />
              <Skeleton className="h-4 w-11/12 rounded-lg neo-inset-sm" />
              <Skeleton className="h-4 w-4/5 rounded-lg neo-inset-sm" />
            </div>
          </div>
        </div>

        {/* Section Cards Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-48 mx-auto rounded-xl neo-inset-sm" />
          <div className="neo-raised rounded-3xl p-6 sm:p-8 space-y-6">
            <Skeleton className="h-64 sm:h-80 w-full rounded-2xl neo-inset" />
            <Skeleton className="h-8 w-3/4 rounded-xl neo-inset-sm" />
            <Skeleton className="h-4 w-full rounded-lg neo-inset-sm" />
            <Skeleton className="h-4 w-5/6 rounded-lg neo-inset-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
