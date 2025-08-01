import { Skeleton } from "@/components/ui/skeleton"
import { BreadcrumbSkeleton } from "@/components/ui/breadcrumb-skeleton"

export default function ProjectsLoading() {
  return (
    <div className="container w-full pt-4 pb-4">
      <BreadcrumbSkeleton />
      
      {/* Projects Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 