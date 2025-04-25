"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock, Wrench } from "lucide-react"
import { listServicesByProject } from "@/lib/services/agtasks"
import type { Service } from "@/lib/interfaces"

export function ProjectDetails() {
  const [services, setServices] = useState<Service[]>([])
  const [kpis, setKpis] = useState({
    activeServices: 0,
    completedPercentage: 0,
    blockedServices: 0,
    averageTime: 0,
  })

  useEffect(() => {
    const fetchServices = async () => {
      const servicesData = await listServicesByProject(1) // Assuming project ID 1
      setServices(servicesData)

      // Calculate KPIs
      const totalServices = servicesData.length

      // Active services (En progreso or Planificado)
      const activeServices = servicesData.filter(
        (service) => service.status === "En progreso" || service.status === "Planificado",
      ).length

      // Completed services percentage
      const completedServices = servicesData.filter((service) => service.status === "Finalizado").length
      const completedPercentage = totalServices > 0 ? Math.round((completedServices / totalServices) * 100) : 0

      // Blocked services (services with progress < 50% that are not Planificado)
      const blockedServices = servicesData.filter(
        (service) => service.progress < 50 && service.status === "En progreso",
      ).length

      // Average time (days since start date for completed services)
      const today = new Date()
      const completedServicesWithDates = servicesData.filter(
        (service) => service.status === "Finalizado" && service.startDate,
      )

      let totalDays = 0
      completedServicesWithDates.forEach((service) => {
        const startDate = new Date(service.startDate)
        const diffTime = Math.abs(today.getTime() - startDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        totalDays += diffDays
      })

      const averageTime =
        completedServicesWithDates.length > 0 ? Math.round(totalDays / completedServicesWithDates.length) : 0

      setKpis({
        activeServices,
        completedPercentage,
        blockedServices,
        averageTime,
      })
    }

    fetchServices()
  }, [])

  return (
    <div className="w-full">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Servicios Activos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios Activos</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.activeServices}</div>
            <p className="text-xs text-muted-foreground">
              {services.length > 0
                ? `${Math.round((kpis.activeServices / services.length) * 100)}% del total`
                : "Cargando..."}
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Servicios Completados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.completedPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {services.filter((s) => s.status === "Finalizado").length} servicios finalizados
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Servicios Bloqueados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios Bloqueados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.blockedServices}</div>
            <p className="text-xs text-muted-foreground">Progreso menor al 50%</p>
          </CardContent>
        </Card>

        {/* Card 4: Tiempo Promedio */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.averageTime} días</div>
            <p className="text-xs text-muted-foreground">Duración promedio de servicios</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}