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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  SquareArrowOutUpRight,
  RefreshCw,
  Plus,
} from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import type { 
  PaginatedResponse, 
  Service, 
} from "@/lib/interfaces"
import { useToast } from "@/hooks/use-toast"

export function ServicesPageDetails() {
  const params = useParams()
  const domainId = params.domain as string 
  const projectId = params.project as string
  const { toast } = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [visibleCount, setVisibleCount] = useState(10)

  // Fetch all services once (no backend pagination/search)
  const fetchAllServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const url = `/api/v1/agtasks/domains/${domainId}/projects/${projectId}/services`
      const response = await fetch(url)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Error: ${response.status} - ${errorData.error || "Unknown error"}`)
      }
      const data: PaginatedResponse = await response.json()
      // Ordenar por createdAt descendente
      const sorted = [...data.services].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt ?? '').getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt ?? '').getTime() : 0;
        return dateB - dateA;
      })
      setServices(sorted)
    } catch (err) {
      setError(`Error al cargar servicios: ${err instanceof Error ? err.message : "Error desconocido"}`)
      setServices([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Refresh services
  const handleRefresh = () => {
    setRefreshing(true)
    fetchAllServices()
  }

  // Load all services on mount or when domain/project changes
  useEffect(() => {
    if (projectId && domainId) {
      fetchAllServices()
    }
  }, [projectId, domainId])

  // Reset visibleCount cuando cambia la búsqueda
  useEffect(() => {
    setVisibleCount(10)
  }, [searchQuery])

  // Filtrar en el frontend
  const filteredServices = services.filter(service => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      service.serviceName?.toLowerCase().includes(q) ||
      service.externalServiceKey?.toLowerCase().includes(q) ||
      service.workspaceName?.toLowerCase().includes(q) ||
      service.campaignName?.toLowerCase().includes(q) ||
      service.farmName?.toLowerCase().includes(q)
    )
  })

  // Limitar por visibleCount
  const displayedServices = filteredServices.slice(0, visibleCount)

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

  if (services.length === 0 && !searchQuery) {
    return (
      <div className="text-center h-64 flex flex-col items-center justify-center">
        <p className="text-lg text-muted-foreground mb-4">No hay servicios disponibles</p>
        <Link href={`/domains/${domainId}/projects/${projectId}/services/create`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Crear Servicio
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
              <TableHead>Key</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Espacio de trabajo</TableHead>
              <TableHead>Campaña</TableHead>
              <TableHead>Establecimiento</TableHead>
              <TableHead>Tot. Has</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                  No se encontraron servicios que coincidan con su búsqueda
                </TableCell>
              </TableRow>
            ) : (
              displayedServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.externalServiceKey}</TableCell>
                  <TableCell className="font-medium">{service.serviceName}</TableCell>
                  <TableCell>{service.workspaceName || "-"}</TableCell>
                  <TableCell>{service.campaignName || "-"}</TableCell>
                  <TableCell>{service.farmName || service.farmId}</TableCell>
                  <TableCell>{service.totalArea} ha</TableCell>
                  <TableCell>
                    <Link
                      target="_blank"
                      href={`https://geoagro1.atlassian.net/browse/${service.externalServiceKey}`}>
                      <SquareArrowOutUpRight />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {displayedServices.length < filteredServices.length && (
        <div className="flex justify-center py-4">
          <Button onClick={() => setVisibleCount(visibleCount + 10)}>Ver más</Button>
        </div>
      )}
    </div>
  )
}
