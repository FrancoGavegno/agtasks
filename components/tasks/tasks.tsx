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
  SquareArrowOutUpRight,
  RefreshCw,
  Plus,
} from "lucide-react"
import type { 
  PaginatedResponse, 
  Service, 
  ServiceTask 
} from "@/lib/interfaces"
import { useToast } from "@/hooks/use-toast"
import { listTasksByProject } from "@/lib/services/agtasks"

export function TasksPageDetails() {
  const params = useParams()
  const domainId = params.domain as string 
  const projectId = params.project as string
  const { toast } = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [tasks, setTasks] = useState<ServiceTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [visibleCount, setVisibleCount] = useState(10)
  const [selectedService, setSelectedService] = useState<string>("all")

  // Fetch all services and tasks once
  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)
      // 1. Obtener todos los servicios del proyecto
      const servicesUrl = `/api/v1/agtasks/domains/${domainId}/projects/${projectId}/services`
      const servicesResponse = await fetch(servicesUrl)
      if (!servicesResponse.ok) {
        const errorData = await servicesResponse.json()
        throw new Error(`Error: ${servicesResponse.status} - ${errorData.error || "Unknown error"}`)
      }
      const servicesData: PaginatedResponse = await servicesResponse.json()
      const sortedServices = [...servicesData.services].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt ?? '').getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt ?? '').getTime() : 0;
        return dateB - dateA;
      })
      setServices(sortedServices)
      // 2. Obtener todas las ServiceTasks del proyecto usando listTasksByProject
      const tasksData = await listTasksByProject(projectId)
      setTasks(tasksData)
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
    setVisibleCount(10)
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

  const displayedTasks = filteredTasks.slice(0, visibleCount)

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
              <option key={service.id} value={service.id}>{service.serviceName}</option>
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
                    <TableCell>{service ? service.serviceName : "(Sin servicio)"}</TableCell>
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
      {displayedTasks.length < filteredTasks.length && (
        <div className="flex justify-center py-4">
          <Button onClick={() => setVisibleCount(visibleCount + 10)}>Ver más</Button>
        </div>
      )}
    </div>
  )
}
