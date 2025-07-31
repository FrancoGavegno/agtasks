"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar } from "lucide-react"

interface LotStatsProps {
  servicesCount: number
  tasksCount: number
  loading: boolean
}

export function LotStats({ servicesCount, tasksCount, loading }: LotStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Services Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Servicios</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              servicesCount
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Servicios asociados al lote
          </p>
        </CardContent>
      </Card>

      {/* Tasks Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tareas</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              tasksCount
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Tareas asociadas al lote
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 