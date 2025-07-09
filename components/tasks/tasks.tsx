"use client"

import { 
  useState, 
  useEffect 
} from "react"
import { Link } from "@/i18n/routing"
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
} from "lucide-react"
import type {  
  Service, 
  Task 
} from "@/lib/interfaces"
import { useToast } from "@/hooks/use-toast"
import { listTasksByProject, listServicesByProject } from "@/lib/services/agtasks"

// Utilidad para limpiar y tipar correctamente los tasks
function cleanTask(raw: any): Task {
  return {
    id: raw.id,
    projectId: raw.projectId ?? undefined,
    serviceId: raw.serviceId ?? undefined,
    tmpSubtaskId: raw.tmpSubtaskId,
    subtaskId: raw.subtaskId ?? undefined,
    taskName: raw.taskName,
    taskType: raw.taskType ?? undefined,
    taskData: raw.taskData ?? undefined,
    userEmail: raw.userEmail,
    deleted: raw.deleted ?? undefined,
    taskFields: Array.isArray(raw.taskFields) ? raw.taskFields : undefined,
  }
}

export function TasksPageDetails() {
  const params = useParams()
  const domainId = params.domain as string 
  const projectId = params.project as string
  const { toast } = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [visibleCount, setVisibleCount] = useState(10)
  const [selectedService, setSelectedService] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Fetch all services and tasks once
  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)
      // 1. Obtener todos los servicios del proyecto usando función centralizada
      const servicesData = await listServicesByProject(projectId)
      // Asegurarse de que cada servicio tenga un projectId de tipo string o undefined
      const cleanedServices: Service[] = servicesData.map((service: any) => ({
        ...service,
        projectId: service.projectId ?? undefined,
      }))
      const sortedServices: Service[] = [...cleanedServices].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt ?? '').getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt ?? '').getTime() : 0;
        return dateB - dateA;
      })
      setServices(sortedServices)
      // 2. Obtener todas las tareas del proyecto usando listTasksByProject
      const tasksData = await listTasksByProject(projectId)
      setTasks(tasksData.map(cleanTask))
    } catch (err) {
      setError(`Error al cargar tareas: ${err instanceof Error ? err.message : "Error desconocido"}`)
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

  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedService])

  // Filtrar tareas según búsqueda y servicio seleccionado
  const filteredTasks = tasks.filter(task => {
    // Filtrar por servicio
    if (selectedService !== "all") {
      if (task.serviceId !== selectedService) return false
    }
    // Filtrar por búsqueda
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      task.taskName?.toLowerCase().includes(q) ||
      task.taskType?.toLowerCase().includes(q) ||
      task.userEmail?.toLowerCase().includes(q)
    )
  })

  // Paginación
  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + rowsPerPage)

  // Reset página al cambiar búsqueda o filtro
  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedService])

  const displayedTasks = paginatedTasks

  if (loading && !refreshing) {
    return <div className="flex justify-center items-center h-64">Cargando tareas...</div>
  }

  if (error) {
    return (
      <div className="text-red-500 text-center h-64 flex flex-col items-center justify-center">
        <p className="mb-4">{error}</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> Intentar de nuevo
        </Button>
      </div>
    )
  }

  if (tasks.length === 0 && !searchQuery) {
    return (
      <div className="text-center h-64 flex flex-col items-center justify-center">
        <p className="text-lg text-muted-foreground mb-4">No hay tareas disponibles</p>
        {/* Aquí podrías agregar un botón para crear tarea si aplica */}
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
            placeholder="Buscar tareas..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
          >
            <option value="all">Todas las tareas</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Link href={`/domains/${domainId}/projects/${projectId}/tasks/create`}>
            <Button type="button" variant="default">
              + Crear Tarea
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No se encontraron tareas que coincidan con su búsqueda
                </TableCell>
              </TableRow>
            ) : (
              displayedTasks.map((task) => {
                const service = services.find(s => s.id === task.serviceId)
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.taskName}</TableCell>
                    <TableCell>{task.taskType || "-"}</TableCell>
                    <TableCell>{task.userEmail}</TableCell>
                    <TableCell>{service ? service.name : "(Sin servicio)"}</TableCell>
                    <TableCell>
                      {/* Acciones, links, etc. */}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer de paginación */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          {filteredTasks.length > 0
            ? `Mostrando ${startIndex + 1} a ${Math.min(startIndex + rowsPerPage, filteredTasks.length)} de ${filteredTasks.length} tareas`
            : "No se encontraron tareas"}
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
