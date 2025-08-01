import { Skeleton } from "@/components/ui/skeleton"

export function ServicesSkeleton() {
  return (
    <div className="w-full">
      {/* Header with actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Services Table Skeleton */}
      <div className="border rounded-lg">
        {/* Table Header */}
        <div className="border-b bg-muted/50">
          <div className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-1">
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="col-span-3">
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
        
        {/* Table Rows */}
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-12 gap-4 p-4">
              <div className="col-span-1">
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="col-span-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="col-span-2">
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 