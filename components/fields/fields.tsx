"use client"

import {
  useState,
  useEffect
} from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Search,
  RefreshCw,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  MapPin,
  Calendar,
  Users,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

import type { Schema } from "@/amplify/data/resource"
import { format } from 'date-fns'

type Field = Schema["Field"]["type"]
type Task = Schema["Task"]["type"]
type Service = Schema["Service"]["type"]
type TaskField = Schema["TaskField"]["type"]

import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/integrations/amplify"

interface FieldWithAssociations {
  id?: string
  workspaceId: string
  workspaceName?: string
  campaignId: string
  campaignName?: string
  farmId: string
  farmName?: string
  fieldId: string
  fieldName: string
  hectares?: number
  crop?: string
  hybrid?: string
  deleted?: boolean
  createdAt?: string
  updatedAt?: string
  tasks: any[]
  services: any[]
}

export function FieldsPageDetails() {
  const params = useParams()
  const domainId = params.domain as string
  const projectId = params.project as string
  const { toast } = useToast()
  const [fields, setFields] = useState<FieldWithAssociations[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [selectedService, setSelectedService] = useState<string>("all")
  const [selectedTask, setSelectedTask] = useState<string>("all")
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [nextToken, setNextToken] = useState<string | undefined>(undefined)
  const [hasMoreFields, setHasMoreFields] = useState(true)
  const [loadingFields, setLoadingFields] = useState(false)

  // Fetch all data efficiently
  // Note: Amplify has a 100 record limit per query, so we implement pagination
  // to load all fields before filtering by task associations
  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!projectId || projectId.trim() === '') {
        throw new Error('Project ID is required and cannot be empty')
      }

      // 1. Get all services for the project
      const servicesData = await apiClient.listServices({projectId, limit: 100})
      const sortedServices = [...servicesData.items].sort((a, b) => {
        const requestIdA = a.requestId || '';
        const requestIdB = b.requestId || '';
        return requestIdB.localeCompare(requestIdA);
      });
      setServices(sortedServices as Service[])

      // 2. Get all tasks for the project
      const tasksData = await apiClient.listTasks({ projectId, limit: 100 });
      const cleanedTasks = tasksData.items.map((task) => ({
        project: (task as any).project ?? null,
        service: (task as any).service ?? null,
        taskFields: (task as any).taskFields ?? [],
        ...task,
      }));
      const sortedTasks = cleanedTasks.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt ?? '').getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt ?? '').getTime() : 0;
        return dateB - dateA;
      });
      setTasks(sortedTasks as Task[])

      // 3. Get all fields with pagination to handle Amplify's 100 record limit
      setLoadingFields(true)
      let allFields: any[] = []
      let currentNextToken: string | undefined = undefined
      let hasMore = true
      let pageCount = 0
      
      while (hasMore) {
        pageCount++
        const fieldsData = await apiClient.listFields({ 
          limit: 100, 
          nextToken: currentNextToken 
        })
        allFields = [...allFields, ...fieldsData.items]
        currentNextToken = fieldsData.nextToken
        hasMore = !!currentNextToken
        
        // Update loading message for better UX
        if (pageCount > 1) {
          setError(`Cargando fields... (página ${pageCount})`)
        }
      }
      
      setHasMoreFields(false) // We've loaded all fields
      setLoadingFields(false)
      setError(null) // Clear loading message
      
      // 4. Get all task-field associations for this project's tasks
      const taskFieldAssociations: { [fieldId: string]: { taskIds: string[], serviceIds: string[] } } = {}
      
      console.log(`Processing ${sortedTasks.length} tasks for task-field associations`)
      
      for (const task of sortedTasks) {
        if (!task.id) continue
        
        try {
          const taskFields = await apiClient.listTaskFields(task.id)
          console.log(`Task ${task.id} (${task.taskName}) has ${taskFields.items.length} field associations`)
          
                     for (const tf of taskFields.items) {
             // The fieldId in TaskField refers to the internal Field.id
             const fieldId = tf.fieldId
             if (!fieldId) continue
             
             // Try to get field info from the relationship if available
             const fieldInfo = (tf as any).field
             const fieldName = fieldInfo?.fieldName || 'Unknown Field'
             
             console.log(`TaskField: taskId=${tf.taskId}, fieldId=${fieldId}, fieldName=${fieldName}`)
             
             if (!taskFieldAssociations[fieldId]) {
               taskFieldAssociations[fieldId] = { taskIds: [], serviceIds: [] }
             }
             
             // Avoid duplicates
             if (!taskFieldAssociations[fieldId].taskIds.includes(task.id)) {
               taskFieldAssociations[fieldId].taskIds.push(task.id)
             }
             
             if (task.serviceId && !taskFieldAssociations[fieldId].serviceIds.includes(task.serviceId)) {
               taskFieldAssociations[fieldId].serviceIds.push(task.serviceId)
             }
           }
        } catch (error) {
          console.error(`Error getting task fields for task ${task.id}:`, error)
        }
      }
      
      console.log('Task-field associations:', taskFieldAssociations)

      // 5. Create fields with associations
      console.log(`Total fields loaded: ${allFields.length}`)
      console.log(`Fields with task associations: ${Object.keys(taskFieldAssociations).length}`)
      
      const fieldsWithAssociations: FieldWithAssociations[] = allFields
        .filter((field: any) => field.id && taskFieldAssociations[field.id]) // Only show fields that have task associations
        .map((field: any) => {
          const associations = taskFieldAssociations[field.id!]
          const fieldTasks = sortedTasks.filter(task => task.id && associations.taskIds.includes(task.id))
          const fieldServices = sortedServices.filter(service => service.id && associations.serviceIds.includes(service.id))
          
          console.log(`Field ${field.fieldName} (${field.id}) has ${fieldTasks.length} tasks and ${fieldServices.length} services`)
          
          return {
            ...field,
            tasks: fieldTasks,
            services: fieldServices
          }
        })
        .sort((a: FieldWithAssociations, b: FieldWithAssociations) => a.fieldName.localeCompare(b.fieldName))
      
      console.log(`Final fields with associations: ${fieldsWithAssociations.length}`)

      setFields(fieldsWithAssociations)

    } catch (err) {
      setError(`Error al cargar fields: ${err instanceof Error ? err.message : "Error desconocido"}`)
      setFields([])
      setServices([])
      setTasks([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Refresh
  const handleRefresh = () => {
    setRefreshing(true)
    fetchAllData()
  }

  useEffect(() => {
    if (projectId && domainId) {
      fetchAllData()
    }
  }, [projectId, domainId])

  // Reset página al cambiar búsqueda o filtros
  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedService, selectedTask, selectedWorkspace])

  // Get unique workspaces for filter
  const uniqueWorkspaces = Array.from(new Set(fields.map(field => field.workspaceId).filter(Boolean)))

  // Filter fields
  const filteredFields = fields.filter(field => {
    // Filter by service
    if (selectedService !== "all") {
      const hasService = field.services.some(service => service.id === selectedService)
      if (!hasService) return false
    }

    // Filter by task
    if (selectedTask !== "all") {
      const hasTask = field.tasks.some(task => task.id === selectedTask)
      if (!hasTask) return false
    }

    // Filter by workspace
    if (selectedWorkspace !== "all") {
      if (field.workspaceId !== selectedWorkspace) return false
    }

    // Search filter
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      field.fieldName.toLowerCase().includes(q) ||
      (field.farmName?.toLowerCase().includes(q) || false) ||
      (field.campaignName?.toLowerCase().includes(q) || false) ||
      (field.workspaceName?.toLowerCase().includes(q) || false) ||
      (field.crop?.toLowerCase().includes(q) || false)
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredFields.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const displayedFields = filteredFields.slice(startIndex, startIndex + rowsPerPage)

  if ((loading || loadingFields) && !refreshing) {
    return (
      <div className="w-full">
        <div className="mb-4 flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (error && !loadingFields) {
    return (
      <div className="text-red-500 text-center h-64 flex flex-col items-center justify-center">
        <p className="mb-4">{error}</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> Intentar de nuevo
        </Button>
      </div>
    )
  }

  if (loadingFields) {
    return (
      <div className="text-blue-600 text-center h-64 flex flex-col items-center justify-center">
        <p className="mb-4">{error || "Cargando fields..."}</p>
        <p className="text-sm text-muted-foreground mb-4">
          Amplify tiene un límite de 100 registros por consulta. Cargando todos los fields...
        </p>
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span className="text-sm">Procesando...</span>
        </div>
      </div>
    )
  }

  if (fields.length === 0 && !searchQuery) {
    return (
      <div className="text-center h-64 flex flex-col items-center justify-center">
        <p className="text-lg text-muted-foreground mb-4">No hay fields disponibles</p>
        <p className="text-sm text-muted-foreground">Los fields aparecerán cuando se creen tareas asociadas</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <div className="relative flex-1 mr-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar fields..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {/* Workspace Selector */}
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedWorkspace}
            onChange={e => setSelectedWorkspace(e.target.value)}
          >
            <option value="all">Todos los workspaces</option>
            {uniqueWorkspaces.map(workspaceId => {
              const workspace = fields.find(f => f.workspaceId === workspaceId)
              return (
                <option key={workspaceId} value={workspaceId}>
                  {workspace?.workspaceName || workspaceId}
                </option>
              )
            })}
          </select>

          {/* Services Selector */}
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
          >
            <option value="all">Todos los servicios</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.requestId} {service.name}
              </option>
            ))}
          </select>

          {/* Tasks Selector */}
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedTask}
            onChange={e => setSelectedTask(e.target.value)}
          >
            <option value="all">Todas las tareas</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>
                {task.subtaskId} {task.taskName}
              </option>
            ))}
          </select>

          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workspace</TableHead>
              <TableHead>Campaña</TableHead>
              <TableHead>Establecimiento</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Hectareas</TableHead>
              <TableHead>Cultivo</TableHead>
              <TableHead>Servicios</TableHead>
              <TableHead>Tareas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedFields.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No se encontraron fields que coincidan con su búsqueda
                </TableCell>
              </TableRow>
            ) : (
              displayedFields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell>{field.workspaceName || field.workspaceId}</TableCell>
                  <TableCell>{field.campaignName || field.campaignId}</TableCell>
                  <TableCell>{field.farmName || field.farmId}</TableCell>
                  <TableCell>{field.fieldName}</TableCell>
                  <TableCell>{field.hectares ? `${field.hectares} ha` : '-'}</TableCell>
                  <TableCell>{field.crop || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {field.services.slice(0, 3).map(service => (
                        <div key={service.id} className="text-xs flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {service.requestId} {service.name}
                        </div>
                      ))}
                      {field.services.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{field.services.length - 3} más
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {field.tasks.slice(0, 3).map(task => (
                        <div key={task.id} className="text-xs flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.subtaskId} - {task.taskName}
                        </div>
                      ))}
                      {field.tasks.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{field.tasks.length - 3} más
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer de paginación */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          {filteredFields.length > 0
            ? `Mostrando ${startIndex + 1} a ${Math.min(startIndex + rowsPerPage, filteredFields.length)} de ${filteredFields.length} fields`
            : "No se encontraron fields"}
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Filas por página</p>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={rowsPerPage}
              onChange={e => {
                setRowsPerPage(Number(e.target.value))
                setPage(1)
              }}
            >
              {[5, 10, 15, 20].map((pageSize) => (
                <option key={pageSize} value={pageSize}>{pageSize}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(1)} disabled={page === 1}>
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">Primera página</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>
            <span className="text-sm">
              Página {page} de {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Página siguiente</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages || totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Última página</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}



