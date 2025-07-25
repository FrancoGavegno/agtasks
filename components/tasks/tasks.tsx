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
  SquareArrowOutUpRight,
  Plus,
  Edit,
} from "lucide-react"

import type { Schema } from "@/amplify/data/resource"
import { format } from 'date-fns'

type Service = Schema["Service"]["type"]
type Task = Schema["Task"]["type"]

import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/integrations/amplify"

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

      // Verificar que projectId sea válido
      if (!projectId || projectId.trim() === '') {
        throw new Error('Project ID is required and cannot be empty')
      }

      // 1. Obtener todos los servicios del proyecto usando función centralizada
      const servicesData = await apiClient.listServices({projectId, limit: 100})
      // Ordenar servicios por requestId descendente
      const sortedServices = [...servicesData.items].sort((a, b) => {
        const requestIdA = a.requestId || '';
        const requestIdB = b.requestId || '';
        return requestIdB.localeCompare(requestIdA);
      });
      setServices(sortedServices as Service[])

      // 2. Obtener todas las tareas del proyecto usando listTasksByProject
      const tasksData = await apiClient.listTasks({ projectId, limit: 100 });
      // Asegurarse de que cada tarea tenga las propiedades requeridas por el tipo Task
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

      //setTasks(tasksData.map(cleanTask))
      setTasks(sortedTasks as Task[])
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

  // Reset página al cambiar búsqueda o filtro
  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedService])

  // Filtrar tareas según búsqueda (sin filtrar por servicio)
  const filteredTasks = tasks.filter(task => {
    // Si el filtro de servicio está activo, solo mostrar tasks de ese servicio
    if (selectedService !== "all" && !task.serviceId?.includes(selectedService)) {
      return false;
    }
    // Filtro de búsqueda general
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      task.subtaskId?.toLowerCase().includes(q) ||
      task.taskName?.toLowerCase().includes(q) ||
      task.taskType?.toLowerCase().includes(q) ||
      task.userEmail?.toLowerCase().includes(q) ||
      task.createdAt?.toLowerCase().includes(q)
    );
  });

  // Paginación
  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const displayedTasks = filteredTasks.slice(startIndex, startIndex + rowsPerPage)
  // const displayedTasks = paginatedTasks

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
        <Link href={`/domains/${domainId}/projects/${projectId}/tasks/create`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Crear Tarea
          </Button>
        </Link>
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

          {/* Services Selector */}
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
          >
            <option value="all">Todas las tareas</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.requestId} {service.name}</option>
            ))}
          </select>

          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar
          </Button>

          <Link href={`/domains/${domainId}/projects/${projectId}/tasks/create`}>
            <Button type="button" variant="default">
              <Plus className="mr-2 h-4 w-4" /> Crear Tarea
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Task Type</TableHead>
              <TableHead>Assigned to</TableHead>
              <TableHead>Created</TableHead>
              {/* <TableHead>Service</TableHead>*/}
              <TableHead>Actions</TableHead>
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
                    <TableCell>{task.subtaskId}</TableCell>
                    <TableCell className="flex flex-col flex-1">
                      {task.taskName}
                      <span className="text-xs text-gray-400">
                        {service ? service.name : "(Sin servicio asociado)"}
                      </span>
                    </TableCell>
                    <TableCell>{task.taskType || "-"}</TableCell>
                    <TableCell>{task.userEmail}</TableCell>
                    <TableCell>{task.createdAt ? format(new Date(task.createdAt), 'dd/MM/yyyy') : '-'}</TableCell>
                    {/* <TableCell>{service ? service.name : "(Sin servicio asociado)"}</TableCell> */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/domains/${domainId}/projects/${projectId}/tasks/${task.id}`}
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
