import { Skeleton } from "@/components/ui/skeleton"
import { BreadcrumbSkeleton } from "@/components/ui/breadcrumb-skeleton"

export default function ProjectLoading() {
  return (
    <div className="container w-full pt-4 pb-4">
      <BreadcrumbSkeleton />
      
      {/* Project Header */}
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      {/* Project Content */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 