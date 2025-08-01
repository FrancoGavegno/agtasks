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
  Plus,
  SquareArrowOutUpRight,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Edit
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/integrations/amplify"
import type { Schema } from "@/amplify/data/resource"
import { format } from 'date-fns'
import { ServicesSkeleton } from "@/components/ui/services-skeleton"
import { useTranslations } from 'next-intl'

type Service = Schema["Service"]["type"]

export function ServicesPageDetails() {
  const params = useParams()
  const domainId = params.domain as string
  const projectId = params.project as string
  const { toast } = useToast()
  const t = useTranslations("ServicesPageDetails")
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [protocols, setProtocols] = useState<any[]>([]);
  const [protocolIdToName, setProtocolIdToName] = useState<Record<string, string>>({});

  // Fetch all services using GraphQL (Amplify)
  const fetchAllServices = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Verificar que projectId sea válido
      if (!projectId || projectId.trim() === '') {
        throw new Error('Project ID is required and cannot be empty')
      }
      
      const response = await apiClient.listServices({ 
        projectId: projectId, 
        limit: 100
      })
      
      // const raw = response.items || []
      // // Filtrar solo los datos planos (sin métodos)
      // const plain = raw.filter((s: any) => typeof s.id === 'string' && typeof s.name === 'string')
     
      // Ordenar por createdAt descendente 
      const sorted = [...response.items].sort((a, b) => {
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

  useEffect(() => {
    if (domainId) {
      apiClient.listDomainProtocols(domainId).then(protocols => {
        setProtocols(protocols.items);
        const map: Record<string, string> = {};
        protocols.items.forEach(p => { 
          if (p.id) map[p.id] = p.name; 
        });
        setProtocolIdToName(map);
      });
    }
  }, [domainId]);

  // frontend filter
  const filteredServices = services.filter(service => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      service.requestId?.toLowerCase().includes(q) ||
      service.name?.toLowerCase().includes(q) ||
      service.createdAt?.toLowerCase().includes(q)
    )
  })

  // Paginación
  const totalPages = Math.ceil(filteredServices.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const paginatedServices = filteredServices.slice(startIndex, startIndex + rowsPerPage)

  if (loading && !refreshing) {
    return <ServicesSkeleton />
  }

  if (error) {
    return (
      <div className="text-red-500 text-center h-64 flex flex-col items-center justify-center">
        <p className="mb-4">{error}</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> {t("tryAgainButton")}
        </Button>
      </div>
    )
  }

  if (services.length === 0 && !searchQuery) {
    return (
      <div className="text-center h-64 flex flex-col items-center justify-center">
        <p className="text-lg text-muted-foreground mb-4">{t("notFoundTitle")}</p>
        <Link href={`/domains/${domainId}/projects/${projectId}/services/create`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> {t("createServiceButton")}
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
            placeholder={t("searchPlaceholder")}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {t("refreshButton")}
          </Button>
          <Link href={`/domains/${domainId}/projects/${projectId}/services/create`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> {t("createServiceButton")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("tableHeaders.key")}</TableHead>
              <TableHead>{t("tableHeaders.summary")}</TableHead>
              <TableHead>{t("tableHeaders.protocol")}</TableHead>
              <TableHead>{t("tableHeaders.created")}</TableHead>
              <TableHead>{t("tableHeaders.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  {searchQuery ? t("noSearchResults") : t("notFoundTitle")}
                </TableCell>
              </TableRow>
            ) : (
              paginatedServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.requestId}</TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>
                    {service.protocolId ? (protocolIdToName[service.protocolId] || service.protocolId) : "-"}
                  </TableCell>
                  <TableCell>
                    {service.createdAt ? format(new Date(service.createdAt), 'dd/MM/yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">                      
                      {service.requestId ? (
                        <Link
                          target="_blank"
                          href={`${process.env.NEXT_PUBLIC_JIRA_API_URL}/browse/${service.requestId}`}
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <SquareArrowOutUpRight className="h-4 w-4" />
                        </Link>
                      ) : null}
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
