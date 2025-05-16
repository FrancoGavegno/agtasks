"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Edit,
  Play,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  PlusCircle,
  RefreshCw,
  Plus,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams } from "next/navigation"
import { Link } from "@/i18n/routing"
import type { Service } from "@/lib/interfaces"
import { useToast } from "@/hooks/use-toast"

interface PaginatedResponse {
  services: Service[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function ServicesPageDetails() {
  const params = useParams()
  const projectId = params.project as string
  const domainId = (params.domain as string) || "8644" // Obtener del parámetro o usar valor por defecto
  const { toast } = useToast()

  // Estado para los servicios y la paginación
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState<keyof Service>("serviceName")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [refreshing, setRefreshing] = useState(false)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset to first page when search query or rows per page changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchQuery, rowsPerPage])

  // Fetch services with pagination
  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)

      // Construir la URL con los parámetros de paginación y ordenación
      const url = new URL(`/api/v1/agtasks/domains/${domainId}/projects/${projectId}/services`, window.location.origin)
      url.searchParams.append("page", currentPage.toString())
      url.searchParams.append("pageSize", rowsPerPage.toString())
      url.searchParams.append("search", debouncedSearchQuery)
      url.searchParams.append("sortBy", sortBy.toString())
      url.searchParams.append("sortDirection", sortDirection)

      const response = await fetch(url.toString())

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error:", errorData)
        throw new Error(`Error: ${response.status} - ${errorData.error || "Unknown error"}`)
      }

      const data: PaginatedResponse = await response.json()

      setServices(data.services)
      setTotalItems(data.total)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error("Failed to fetch services:", err)
      setError(`Error al cargar servicios: ${err instanceof Error ? err.message : "Error desconocido"}`)
      setServices([])
      setTotalItems(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Refresh services
  const handleRefresh = () => {
    setRefreshing(true)
    fetchServices()
  }

  // Load services when parameters change
  useEffect(() => {
    if (projectId) {
      fetchServices()
    }
  }, [projectId, domainId, currentPage, rowsPerPage, debouncedSearchQuery, sortBy, sortDirection])

  // Handle sorting
  const requestSort = (key: keyof Service) => {
    if (sortBy === key) {
      // Toggle direction if same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new column and default to ascending
      setSortBy(key)
      setSortDirection("asc")
    }
  }

  // Get sort icon based on current sort state
  const getSortIcon = (key: keyof Service) => {
    if (sortBy !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }

    return sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
  }

  // Handle page change
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToFirstPage = () => goToPage(1)
  const goToPreviousPage = () => goToPage(currentPage - 1)
  const goToNextPage = () => goToPage(currentPage + 1)
  const goToLastPage = () => goToPage(totalPages)

  // Handle rows per page change
  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when changing rows per page
  }

  // Create a sortable header component
  const SortableHeader = ({ column, label }: { column: keyof Service; label: string }) => (
    <TableHead className="cursor-pointer" onClick={() => requestSort(column)}>
      <div className="flex items-center">
        {label}
        {getSortIcon(column)}
      </div>
    </TableHead>
  )

  // Handle service status change
  const handleStatusChange = async (serviceId: string, newStatus: string) => {
    try {
      // Implementar en el futuro
      toast({
        title: "Cambio de estado",
        description: `Esta funcionalidad será implementada en una versión futura.`,
      })
    } catch (err) {
      console.error("Failed to update service status:", err)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del servicio.",
        variant: "destructive",
      })
    }
  }

  if (loading && !refreshing) {
    return <div className="flex justify-center items-center h-64">Cargando servicios...</div>
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

  if (services.length === 0 && !debouncedSearchQuery) {
    return (
      <div className="text-center h-64 flex flex-col items-center justify-center">
        <p className="text-lg text-muted-foreground mb-4">No hay servicios disponibles</p>
        <Link href={`/domains/${domainId}/projects/${projectId}/services/create`}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Primer Servicio
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
            placeholder="Buscar servicios..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Link href={`/domains/${domainId}/projects/${projectId}/services/create`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Crear Servicio
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader column="serviceName" label="Servicio" />
              <SortableHeader column="workspaceName" label="Espacio de trabajo" />
              <SortableHeader column="campaignName" label="Campaña" />
              <SortableHeader column="farmName" label="Establecimiento" />
              <SortableHeader column="totalArea" label="Tot. Has" />
              <SortableHeader column="progress" label="Progreso" />
              <SortableHeader column="startDate" label="Fecha Inicio" />
              <SortableHeader column="status" label="Estado" />
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                  No se encontraron servicios que coincidan con la búsqueda
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.serviceName}</TableCell>
                  <TableCell>{service.workspaceName || "-"}</TableCell>
                  <TableCell>{service.campaignName || "-"}</TableCell>
                  <TableCell>{service.farmName || service.farmId}</TableCell>
                  <TableCell>{service.totalArea} ha</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={service.progress} className="h-2 w-[60px]" />
                      <span className="text-xs text-muted-foreground">{service.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{service.startDate ? new Date(service.startDate).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.status === "Finalizado"
                          ? "bg-green-100 text-green-800"
                          : service.status === "En progreso"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {service.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {service.status === "Planificado" && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleStatusChange(service.id, "En progreso")}
                          title="Iniciar servicio"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Link href={`/domains/${domainId}/projects/${projectId}/services/${service.id}`}>
                        <Button variant="outline" size="icon" className="h-8 w-8" title="Editar servicio">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {totalItems > 0 ? (
            <p>
              Mostrando {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, totalItems)} de{" "}
              {totalItems} servicios
            </p>
          ) : (
            <p>No hay resultados.</p>
          )}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Filas por página</p>
            <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={rowsPerPage} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {currentPage} de {totalPages || 1}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={goToFirstPage}
              disabled={currentPage === 1 || totalPages === 0}
            >
              <span className="sr-only">Ir a la primera página</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={goToPreviousPage}
              disabled={currentPage === 1 || totalPages === 0}
            >
              <span className="sr-only">Ir a la página anterior</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <span className="sr-only">Ir a la página siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={goToLastPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <span className="sr-only">Ir a la última página</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
