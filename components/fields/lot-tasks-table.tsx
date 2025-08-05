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
import { LotTasksTableSkeleton } from "@/components/ui/lot-tasks-table-skeleton"
import { useTranslations } from 'next-intl'

type Task = Schema["Task"]["type"]
type Service = {
  id?: string
  name: string
  requestId: string
  projectId: string
  deleted: boolean
  tmpRequestId: string
  protocolId: string
  createdAt?: string
  updatedAt?: string
}

interface SelectedFilters {
  workspaceId: string
  workspaceName?: string
  campaignId: string
  campaignName?: string
  farmId: string
  farmName?: string
}

interface LotTasksTableProps {
  selectedFilters: SelectedFilters | null
  loading: boolean
}

export function LotTasksTable({ selectedFilters, loading }: LotTasksTableProps) {
  const params = useParams()
  const domainId = params.domain as string
  const projectId = params.project as string
  const { toast } = useToast()
  const t = useTranslations("FieldsPageDetails")
  const [tasks, setTasks] = useState<Task[]>([])
  const [services, setServices] = useState<Map<string, Service>>(new Map())
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Fetch tasks that match the selected filters
  const fetchFilteredTasks = async () => {
    if (!selectedFilters?.workspaceId || !selectedFilters?.campaignId || !selectedFilters?.farmId) {
      setTasks([])
      setServices(new Map())
      return
    }

    try {
      setLoadingTasks(true)
      setError(null)

      console.log('Buscando tareas con filtros:', selectedFilters)

      // Get tasks that match the workspace, season, and farm criteria
      const tasksData = await apiClient.listTasks({
        projectId,
        workspaceId: Number(selectedFilters.workspaceId),
        seasonId: Number(selectedFilters.campaignId),
        farmId: Number(selectedFilters.farmId),
        limit: 100
      })

      const filteredTasks = tasksData.items

      // Sort by subtaskId ascending
      const sorted = filteredTasks.sort((a, b) => {
        const subtaskIdA = a.subtaskId || '';
        const subtaskIdB = b.subtaskId || '';
        return subtaskIdA.localeCompare(subtaskIdB);
      });

      console.log('Tareas encontradas:', sorted.length)
      setTasks(sorted as Task[])

      // Efficiently fetch only the services needed for the displayed tasks
      await fetchServicesForTasks(sorted)
    } catch (err) {
      console.error('Error en fetchFilteredTasks:', err)
      setError(`Error al cargar tareas: ${err instanceof Error ? err.message : "Error desconocido"}`)
      setTasks([])
    } finally {
      setLoadingTasks(false)
      setRefreshing(false)
    }
  }

        // Efficiently fetch services for the given tasks
      const fetchServicesForTasks = async (taskList: any[]) => {
        try {
          // Extract unique service IDs from tasks
          const serviceIds = new Set<string>()
          taskList.forEach(task => {
            if (task.serviceId) {
              serviceIds.add(task.serviceId)
            }
          })

          if (serviceIds.size === 0) {
            setServices(new Map())
            return
          }

          console.log('Buscando servicios para:', Array.from(serviceIds))

          // Fetch all services for the project and filter by the needed IDs
          const servicesData = await apiClient.listServices({ projectId, limit: 100 })
          
          // Create a map of serviceId -> Service for efficient lookup
          const servicesMap = new Map<string, Service>()
          servicesData.items.forEach(service => {
            if (service.id && serviceIds.has(service.id)) {
              servicesMap.set(service.id, service)
            }
          })

          setServices(servicesMap)
          console.log('Servicios encontrados:', servicesMap.size)
        } catch (err) {
          console.error('Error fetching services:', err)
          setServices(new Map())
        }
      }

  // Refresh tasks
  const handleRefresh = () => {
    setRefreshing(true)
    fetchFilteredTasks()
  }

  // Load tasks when selected filters change
  useEffect(() => {
    if (selectedFilters?.workspaceId && selectedFilters?.campaignId && selectedFilters?.farmId) {
      fetchFilteredTasks()
    } else {
      setTasks([])
      setServices(new Map())
    }
  }, [selectedFilters?.workspaceId, selectedFilters?.campaignId, selectedFilters?.farmId])

  // Reset page when search changes
  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
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

  if (!selectedFilters?.workspaceId || !selectedFilters?.campaignId || !selectedFilters?.farmId) {
    return (
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">{t("associatedTasks")}</h3>
        <div className="text-center py-8 text-muted-foreground">
          Seleccione espacio de trabajo, campaña y establecimiento para ver las tareas asociadas
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t("associatedTasks")}</h3>
        <Button onClick={handleRefresh} variant="outline" disabled={refreshing} size="sm">
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {t("refreshButton")}
        </Button>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="relative flex-1 mr-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {/* Placeholder for future filters if needed */}
        </div>
      </div>

      {loadingTasks ? (
        <LotTasksTableSkeleton />
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
                      {searchQuery ? t("noSearchResults") : t("noTasksMessage")}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedTasks.map((task) => {
                    return (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.subtaskId}</TableCell>
                        <TableCell>{task.taskName}</TableCell>
                        <TableCell>
                          {task.serviceId ? (
                            services.get(task.serviceId) ? (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {services.get(task.serviceId)?.requestId}
                                </span>
                                <span>{services.get(task.serviceId)?.name}</span>
                              </div>
                            ) : (
                              task.serviceId
                            )
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
                              target="_blank"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            {task.subtaskId ? (
                              <Link
                                href={`${process.env.NEXT_PUBLIC_JIRA_API_URL}/browse/${task.subtaskId}`}
                                target="_blank"
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