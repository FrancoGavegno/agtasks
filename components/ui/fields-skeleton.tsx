import { Skeleton } from "@/components/ui/skeleton"
import { BreadcrumbSkeleton } from "./breadcrumb-skeleton"
import { LotServicesTableSkeleton } from "./lot-services-table-skeleton"
import { LotTasksTableSkeleton } from "./lot-tasks-table-skeleton"

export function FieldsSkeleton() {
  return (
    <div className="container w-full pt-4 pb-4">
      <BreadcrumbSkeleton />
      
      {/* Header with actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      
      {/* Search Form Skeleton */}
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
      
      {/* Lot Services Table Skeleton */}
      <LotServicesTableSkeleton />
      
      {/* Lot Tasks Table Skeleton */}
      <div className="mt-6">
        <LotTasksTableSkeleton />
      </div>
    </div>
  )
} 