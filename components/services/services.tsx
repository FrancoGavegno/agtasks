"use client"

import { useState, useEffect } from "react"
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
  Plus,
  SquareArrowOutUpRight,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { client } from "@/lib/amplify-client"
import type { Schema } from "@/amplify/data/resource"

type Service = Schema["Service"]["type"]

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
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Fetch all services using GraphQL (Amplify)
  const fetchAllServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await client.models.Service.list({
        filter: { projectId: { eq: projectId } }
      })
      const raw = response.data || []
      // Filtrar solo los datos planos (sin métodos)
      const plain = raw.filter((s: any) => typeof s.id === 'string' && typeof s.name === 'string')
      // Ordenar por createdAt descendente si existe
      const sorted = [...plain].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt ?? '').getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt ?? '').getTime() : 0;
        return dateB - dateA;
      })
      setServices(sorted as Service[])
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

  // Reset visibleCount y página al cambiar búsqueda
  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  // frontend filter
  const filteredServices = services.filter(service => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      service.name?.toLowerCase().includes(q) ||
      service.tmpRequestId?.toLowerCase().includes(q) ||
      service.requestId?.toLowerCase().includes(q)
    )
  })

  // Paginación
  const totalPages = Math.ceil(filteredServices.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const paginatedServices = filteredServices.slice(startIndex, startIndex + rowsPerPage)

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
              {/* <TableHead>ID</TableHead> */}
              <TableHead>Nombre</TableHead>
              <TableHead>Template Request ID</TableHead>
              <TableHead>Request ID</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No se encontraron servicios que coincidan con su búsqueda
                </TableCell>
              </TableRow>
            ) : (
              paginatedServices.map((service) => (
                <TableRow key={service.id}>
                  {/* <TableCell>{service.id}</TableCell> */}
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.tmpRequestId || "-"}</TableCell>
                  <TableCell>{service.requestId || "-"}</TableCell>
                  <TableCell>{service.createdAt}</TableCell>
                  <TableCell>
                    {service.requestId ? (
                      <Link
                        target="_blank"
                        href={`${process.env.NEXT_PUBLIC_JIRA_API_URL}/browse/${service.requestId}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <SquareArrowOutUpRight className="h-4 w-4" />
                      </Link>
                    ) : null}
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
          {filteredServices.length > 0
            ? `Mostrando ${startIndex + 1} a ${Math.min(startIndex + rowsPerPage, filteredServices.length)} de ${filteredServices.length} servicios`
            : "No se encontraron servicios"}
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
