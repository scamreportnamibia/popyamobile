import { Skeleton } from "@/components/ui/skeleton"

export default function MoodTrackerLoading() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header Skeleton */}
      <div className="sticky top-[56px] bg-white dark:bg-gray-800 z-30 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-32 ml-3" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      <div className="p-4">
        {/* Insights Card Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
          <Skeleton className="h-6 w-32 mb-3" />

          <div className="grid grid-cols-2 gap-3 mb-4">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>

          <Skeleton className="h-5 w-28 mb-2" />
          <div className="flex flex-wrap gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-8 w-16 rounded-full" />
            ))}
          </div>
        </div>

        {/* Filters Skeleton */}
        <Skeleton className="h-32 rounded-xl mb-4" />

        {/* Chart Skeleton */}
        <Skeleton className="h-48 rounded-xl mb-4" />

        {/* History List Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <Skeleton className="h-6 w-32 mb-3" />

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
