"use client"

import {
  useState,
  useEffect
} from "react"
import { Link } from "@/i18n/routing"
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
  SquareArrowOutUpRight,
  Edit,
} from "lucide-react"
import type { Schema } from "@/amplify/data/resource"
import { format } from 'date-fns'
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/integrations/amplify"
import { useParams } from "next/navigation"

type Service = Schema["Service"]["type"]
type Task = Schema["Task"]["type"]

interface LotTasksTableProps {
  selectedLot: any
  loading: boolean
}

export function LotTasksTable({ selectedLot, loading }: LotTasksTableProps) {
  const params = useParams()
  const domainId = params.domain as string
  const projectId = params.project as string
  const { toast } = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [selectedService, setSelectedService] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Fetch tasks associated with the selected lot
  const fetchLotTasks = async () => {
    if (!selectedLot?.fieldId) {
      setTasks([])
      return
    }

    try {
      setLoadingTasks(true)
      setError(null)

      console.log('Buscando tareas para lote:', selectedLot.fieldId)

      // Get all services for the project (for the filter dropdown)
      const servicesData = await apiClient.listServices({ projectId, limit: 100 })
      const sortedServices = [...servicesData.items].sort((a, b) => {
        const requestIdA = a.requestId || '';
        const requestIdB = b.requestId || '';
        return requestIdB.localeCompare(requestIdA);
      });
      setServices(sortedServices as Service[])

      // 1. Buscar Field cuyo Field.fieldId === value del selector de Field del formulario
      const fieldsData = await apiClient.listFields({ limit: 100 })
      const matchingField = fieldsData.items.find(field => field.fieldId === selectedLot.fieldId)

      if (!matchingField) {
        console.log('No se encontró Field con fieldId:', selectedLot.fieldId)
        setTasks([])
        return
      }

      console.log('Field encontrado:', matchingField)

      // 2. Buscar TaskField cuyo TaskField.fieldId === Field.id
      const taskFieldsData = await apiClient.listTaskFields(undefined, matchingField.id)

      if (!taskFieldsData.items.length) {
        console.log('No se encontraron TaskFields para el Field:', matchingField.id)
        setTasks([])
        return
      }

      console.log('TaskFields encontrados:', taskFieldsData.items.length)

      // 3. Buscar Task cuyo Task.id === TaskField.taskId
      const tasksWithLot: Task[] = []

      for (const taskField of taskFieldsData.items) {
        try {
          const task = await apiClient.getTask(taskField.taskId)
          if (task) {
            // Add the required properties for the Task type
            const cleanedTask = {
              project: (task as any).project ?? null,
              service: (task as any).service ?? null,
              taskFields: (task as any).taskFields ?? [],
              ...task,
            }
            tasksWithLot.push(cleanedTask as Task)
            console.log('Task encontrada:', task.id, task.taskName)
          }
        } catch (error) {
          console.error(`Error getting task ${taskField.taskId}:`, error)
        }
      }

      // Sort by subtaskId ascending
      const sorted = tasksWithLot.sort((a, b) => {
        const subtaskIdA = a.subtaskId || '';
        const subtaskIdB = b.subtaskId || '';
        return subtaskIdA.localeCompare(subtaskIdB);
      });

      console.log('Tareas finales:', sorted.length)
      setTasks(sorted as Task[])
    } catch (err) {
      console.error('Error en fetchLotTasks:', err)
      setError(`Error al cargar tareas: ${err instanceof Error ? err.message : "Error desconocido"}`)
      setServices([])
      setTasks([])
    } finally {
      setLoadingTasks(false)
      setRefreshing(false)
    }
  }

  // Refresh tasks
  const handleRefresh = () => {
    setRefreshing(true)
    fetchLotTasks()
  }

  // Load tasks when selected lot changes
  useEffect(() => {
    if (selectedLot?.fieldId) {
      fetchLotTasks()
    } else {
      setTasks([])
    }
  }, [selectedLot?.fieldId])

  // Reset page when search or filter changes
  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedService])

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Filter by service
    if (selectedService !== "all") {
      if (task.serviceId !== selectedService) return false
    }

    // Search filter
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      task.taskName?.toLowerCase().includes(q) ||
      task.subtaskId?.toLowerCase().includes(q)
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const displayedTasks = filteredTasks.slice(startIndex, startIndex + rowsPerPage)

  if (!selectedLot?.fieldId) {
    return (
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Tareas Asociadas</h3>
        <div className="text-center py-8 text-muted-foreground">
          Seleccione un lote para ver las tareas asociadas
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Tareas Asociadas</h3>
        <Button onClick={handleRefresh} variant="outline" disabled={refreshing} size="sm">
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="relative flex-1 mr-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar tareas..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
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
        </div>
      </div>

      {loadingTasks ? (
        <div className="text-center py-8 text-muted-foreground">
          Cargando tareas...
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Nombre de Tarea</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      {searchQuery || selectedService !== "all" ? "No se encontraron tareas que coincidan con su búsqueda" : "No hay tareas asociadas a este lote"}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedTasks.map((task) => {
                    const associatedService = services.find(service => service.id === task.serviceId)
                    return (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.subtaskId}</TableCell>
                        <TableCell>{task.taskName}</TableCell>
                        <TableCell>
                          {associatedService ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">{associatedService.requestId}</span>
                              <span>{associatedService.name}</span>
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {task.createdAt ? format(new Date(task.createdAt), 'dd/MM/yyyy') : '-'}
                        </TableCell>
                                                 <TableCell>
                           <div className="flex items-center gap-2">
                             <Link
                               href={`/domains/${domainId}/projects/${projectId}/tasks/${task.id}/edit`}
                               className="inline-flex items-center gap-1 text-primary hover:underline"
                             >
                               <Edit className="h-4 w-4" />
                             </Link>
                             {task.subtaskId ? (
                               <Link
                                 target="_blank"
                                 href={`${process.env.NEXT_PUBLIC_JIRA_API_URL}/browse/${task.subtaskId}`}
                                 className="inline-flex items-center gap-1 text-primary hover:underline"
                               >
                                 <SquareArrowOutUpRight className="h-4 w-4" />
                               </Link>
                             ) : null}
                           </div>
                         </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredTasks.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(startIndex + rowsPerPage, filteredTasks.length)} de {filteredTasks.length} tareas
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
          )}
        </>
      )}
    </div>
  )
} 