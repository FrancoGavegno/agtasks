import { Skeleton } from "@/components/ui/skeleton"
import { BreadcrumbSkeleton } from "./breadcrumb-skeleton"

export function SettingsSkeleton() {
  return (
    <div className="container w-full pt-4 pb-4">
      <BreadcrumbSkeleton />
      
      {/* Tabs Navigation Skeleton */}
      <div className="space-y-6">
        <div className="border-b">
          <div className="flex space-x-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-2 pb-2">
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Content Area */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 