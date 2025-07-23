"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TaskSkeleton() {
  return (
    <div className="flex justify-center items-start py-8 min-h-screen">
      <Card className="w-[90%] max-w-4xl max-h-[90vh] flex flex-col shadow-md border border-gray-200">
        <CardHeader className="pb-0 flex-shrink-0">
          {/* Stepper bubbles skeleton */}
          <div className="flex items-center justify-center gap-8 mb-8">
            {[1, 2, 3].map((step, idx) => (
              <div key={step} className="flex items-center gap-2">
                <Skeleton className="w-9 h-9 rounded-full" />
                {idx < 2 && <Skeleton className="w-16 h-0.5" />}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pt-0 pb-0">
          <div className="space-y-6">
            {/* Step title skeleton */}
            <Skeleton className="h-8 w-48" />
            
            {/* Form fields skeleton */}
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            
            {/* Additional form sections skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-40" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        
        {/* Footer skeleton */}
        <div className="flex justify-end gap-2 bg-white border-t border-gray-100 pt-4 pb-4 flex-shrink-0">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </Card>
    </div>
  )
} 