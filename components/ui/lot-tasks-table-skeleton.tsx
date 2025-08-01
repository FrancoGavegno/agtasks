import { Skeleton } from "@/components/ui/skeleton"

export function LotTasksTableSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-4 flex justify-between items-center">
        <div className="relative flex-1 mr-4">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-32" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <div className="border-b bg-muted/50">
          <div className="grid grid-cols-5 gap-4 p-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-5 gap-4 p-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-32" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-12" />
          </div>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-8" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 