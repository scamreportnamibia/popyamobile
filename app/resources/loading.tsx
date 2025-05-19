import { Skeleton } from "@/components/ui/skeleton"

export default function ResourcesLoading() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header Skeleton */}
      <div className="sticky top-0 bg-white z-30 border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-32 ml-3" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* Search Skeleton */}
      <div className="px-4 py-3 border-b">
        <Skeleton className="h-10 w-full rounded-full" />
      </div>

      {/* Tabs Skeleton */}
      <div className="px-4 py-2 border-b overflow-x-auto">
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      </div>

      {/* Featured Resource Skeleton */}
      <div className="p-4">
        <Skeleton className="h-6 w-40 mb-3" />
        <Skeleton className="h-64 w-full rounded-lg mb-6" />

        {/* Resources List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col sm:flex-row border rounded-lg overflow-hidden">
              <Skeleton className="h-32 sm:h-auto sm:w-1/3" />
              <div className="p-4 sm:w-2/3 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <Skeleton className="h-6 w-6 rounded-full mr-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
