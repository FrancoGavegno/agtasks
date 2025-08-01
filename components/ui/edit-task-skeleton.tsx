import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function EditTaskSkeleton() {
  return (
    <div className="container w-full pt-4 pb-4">
      {/* Breadcrumb Skeleton */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      {/* Main Card */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Skeleton className="h-8 w-8 mx-auto mb-4" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          {/* Form Content Skeleton (hidden while loading) */}
          <div className="space-y-6 opacity-0">
            {/* Step 1: Basic Information */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>

            {/* Step 2: Field Selection */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>

            {/* Step 3: Assignment and Forms */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
                
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-32 w-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <Skeleton className="h-10 w-24" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 