"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/integrations/amplify"
import { LotSearchForm } from "./lot-search-form"
import { LotStats } from "./lot-stats"
import { LotServicesTable } from "./lot-services-table"
import { LotTasksTable } from "./lot-tasks-table"

interface SelectedLot {
  workspaceId: string
  workspaceName?: string
  campaignId: string
  campaignName?: string
  farmId: string
  farmName?: string
  fieldId: string
  fieldName: string
  cropName?: string
  hybridName?: string
  hectares?: number
}

interface FieldsPageDetailsProps {
  userEmail: string
}

export function FieldsPageDetails({ userEmail }: FieldsPageDetailsProps) {
  const params = useParams()
  const domainId = params.domain as string
  const projectId = params.project as string
  const { toast } = useToast()
  
  const [selectedLot, setSelectedLot] = useState<SelectedLot | null>(null)
  const [loading, setLoading] = useState(false)
  const [servicesCount, setServicesCount] = useState(0)
  const [tasksCount, setTasksCount] = useState(0)

  // Calculate statistics for the selected lot
  const calculateStats = async (lot: SelectedLot) => {
    try {
      setLoading(true)
      
      console.log('Calculando estadísticas para lote:', lot.fieldId)
      
      // 1. Buscar Field cuyo Field.fieldId === value del selector de Field del formulario
      const fieldsData = await apiClient.listFields({ limit: 100 })
      const matchingField = fieldsData.items.find(field => field.fieldId === lot.fieldId)
      
      if (!matchingField) {
        console.log('No se encontró Field con fieldId:', lot.fieldId)
        setServicesCount(0)
        setTasksCount(0)
        return
      }
      
      // 2. Buscar TaskField cuyo TaskField.fieldId === Field.id
      const taskFieldsData = await apiClient.listTaskFields(undefined, matchingField.id)
      
      if (!taskFieldsData.items.length) {
        console.log('No se encontraron TaskFields para el Field:', matchingField.id)
        setServicesCount(0)
        setTasksCount(0)
        return
      }
      
      // 3. Buscar Task cuyo Task.id === TaskField.taskId y guardar serviceIds
      const serviceIds = new Set<string>()
      let tasksWithLot = 0
      
      for (const taskField of taskFieldsData.items) {
        try {
          const task = await apiClient.getTask(taskField.taskId)
          if (task) {
            tasksWithLot++
            if (task.serviceId) {
              serviceIds.add(task.serviceId)
            }
          }
        } catch (error) {
          console.error(`Error getting task ${taskField.taskId}:`, error)
        }
      }
      
      const servicesWithLot = serviceIds.size
      
      console.log('Estadísticas calculadas:', { servicesWithLot, tasksWithLot })
      setServicesCount(servicesWithLot)
      setTasksCount(tasksWithLot)
      
    } catch (error) {
      console.error("Error calculating stats:", error)
      setServicesCount(0)
      setTasksCount(0)
    } finally {
      setLoading(false)
    }
  }

  const handleLotSearch = (lot: SelectedLot) => {
    setSelectedLot(lot)
    calculateStats(lot)
    
    toast({
      title: "En proceso...",
      description: `Buscando servicios y tareas del lote: ${lot.fieldName}`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <LotSearchForm onSearch={handleLotSearch} loading={loading} userEmail={userEmail} />
      
      {/* Stats Cards - Only show when a lot is selected */}
      {selectedLot && (
        <LotStats 
          servicesCount={servicesCount} 
          tasksCount={tasksCount} 
          loading={loading} 
        />
      )}
      
      {/* Services Table */}
      <LotServicesTable selectedLot={selectedLot} loading={loading} />
      
      {/* Tasks Table */}
      <LotTasksTable selectedLot={selectedLot} loading={loading} />
    </div>
  )
}



