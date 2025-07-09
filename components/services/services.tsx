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
  const [visibleCount, setVisibleCount] = useState(10)

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

  // Reset visibleCount
  useEffect(() => {
    setVisibleCount(10)
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

  // Limit from visibleCount
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
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Template Request ID</TableHead>
              <TableHead>Request ID</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No se encontraron servicios que coincidan con su búsqueda
                </TableCell>
              </TableRow>
            ) : (
              displayedServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.id}</TableCell>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.tmpRequestId || "-"}</TableCell>
                  <TableCell>{service.requestId || "-"}</TableCell>
                  <TableCell>
                    {service.requestId ? (
                      <Link
                        target="_blank"
                        href={`https://jira.geoagro.com/browse/${service.requestId}`}
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
    </div>
  )
}
