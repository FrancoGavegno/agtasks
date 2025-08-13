"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/integrations/amplify"
import { LotSearchForm } from "./lot-search-form"
import { LotStats } from "./lot-stats"
import { LotTasksTable } from "./lot-tasks-table"

interface SelectedFilters {
  workspaceId: string
  workspaceName?: string
  campaignId: string
  campaignName?: string
  farmId: string
  farmName?: string
}

interface FieldsPageDetailsProps {
  userEmail: string
}

export function FieldsPageDetails({ userEmail }: FieldsPageDetailsProps) {
  const params = useParams()
  const domainId = params.domain as string
  const projectId = params.project as string
  const { toast } = useToast()
  
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters | null>(null)
  const [loading, setLoading] = useState(false)
  const [servicesCount, setServicesCount] = useState(0)
  const [tasksCount, setTasksCount] = useState(0)

  // Calculate statistics for the selected filters
  const calculateStats = async (filters: SelectedFilters) => {
    try {
      setLoading(true)
      
      // console.log('Calculando estadísticas para:', filters)
      
      // Get tasks that match the workspace, season, and farm criteria
      const tasksData = await apiClient.listTasks({ 
        projectId,
        workspaceId: Number(filters.workspaceId),
        seasonId: Number(filters.campaignId),
        farmId: Number(filters.farmId),
        limit: 100 
      })
      
      const tasksWithFilters = tasksData.items
      
      // Count unique services
      const serviceIds = new Set<string>()
      tasksWithFilters.forEach(task => {
        if (task.serviceId) {
          serviceIds.add(task.serviceId)
        }
      })
      
      const servicesWithFilters = serviceIds.size
      const tasksWithFiltersCount = tasksWithFilters.length
      
      // console.log('Estadísticas calculadas:', { servicesWithFilters, tasksWithFiltersCount })
      setServicesCount(servicesWithFilters)
      setTasksCount(tasksWithFiltersCount)
      
    } catch (error) {
      // console.error("Error calculating stats:", error)
      setServicesCount(0)
      setTasksCount(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (filters: SelectedFilters) => {
    setSelectedFilters(filters)
    calculateStats(filters)
    
    toast({
      title: "En proceso...",
      description: `Buscando tareas para: ${filters.workspaceName} - ${filters.campaignName} - ${filters.farmName}`,
      duration: 5000,
    })
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <LotSearchForm onSearch={handleSearch} loading={loading} userEmail={userEmail} />
      
      {/* Stats Cards - Only show when filters are selected */}
      {selectedFilters && (
        <LotStats 
          servicesCount={servicesCount} 
          tasksCount={tasksCount} 
          loading={loading} 
        />
      )}
      
      {/* Tasks Table */}
      <LotTasksTable selectedFilters={selectedFilters} loading={loading} />
    </div>
  )
}



