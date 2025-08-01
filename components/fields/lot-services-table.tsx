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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/integrations/amplify"
import type { Schema } from "@/amplify/data/resource"
import { format } from 'date-fns'
import { useParams } from "next/navigation"
import { LotServicesTableSkeleton } from "@/components/ui/lot-services-table-skeleton"
import { useTranslations } from 'next-intl'

type Service = Schema["Service"]["type"]

interface LotServicesTableProps {
  selectedLot: any
  loading: boolean
}

export function LotServicesTable({ selectedLot, loading }: LotServicesTableProps) {
  const params = useParams()
  const domainId = params.domain as string
  const projectId = params.project as string
  const { toast } = useToast()
  const t = useTranslations("FieldsPageDetails")
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Fetch services associated with the selected lot
  const fetchLotServices = async () => {
    if (!selectedLot?.fieldId) {
      setServices([])
      return
    }

    try {
      setLoadingServices(true)
      setError(null)

      console.log('Buscando servicios para lote:', selectedLot.fieldId)

      // 1. Buscar Field cuyo Field.fieldId === value del selector de Field del formulario
      const fieldsData = await apiClient.listFields({ limit: 100 })
      const matchingField = fieldsData.items.find(field => field.fieldId === selectedLot.fieldId)

      if (!matchingField) {
        console.log('No se encontró Field con fieldId:', selectedLot.fieldId)
        setServices([])
        return
      }

      console.log('Field encontrado:', matchingField)

      // 2. Buscar TaskField cuyo TaskField.fieldId === Field.id
      const taskFieldsData = await apiClient.listTaskFields(undefined, matchingField.id)

      if (!taskFieldsData.items.length) {
        console.log('No se encontraron TaskFields para el Field:', matchingField.id)
        setServices([])
        return
      }

      console.log('TaskFields encontrados:', taskFieldsData.items.length)

      // 3. Buscar Task cuyo Task.id === TaskField.taskId y guardar serviceIds
      const serviceIds = new Set<string>()

      for (const taskField of taskFieldsData.items) {
        try {
          const task = await apiClient.getTask(taskField.taskId)
          if (task && task.serviceId) {
            serviceIds.add(task.serviceId)
            console.log('Task encontrada:', task.id, 'ServiceId:', task.serviceId)
          }
        } catch (error) {
          console.error(`Error getting task ${taskField.taskId}:`, error)
        }
      }

      console.log('ServiceIds encontrados:', Array.from(serviceIds))

      // 4. Buscar Services cuyo Service.id esté en el array de serviceIds
      const servicesWithLotTasks: Service[] = []

      for (const serviceId of Array.from(serviceIds)) {
        try {
          const service = await apiClient.getService(serviceId)
          if (service) {
            servicesWithLotTasks.push(service as Service)
            console.log('Service encontrado:', service.id, service.name)
          }
        } catch (error) {
          console.error(`Error getting service ${serviceId}:`, error)
        }
      }

      // Sort by createdAt descending
      const sorted = servicesWithLotTasks.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt ?? '').getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt ?? '').getTime() : 0;
        return dateB - dateA;
      })

      console.log('Servicios finales:', sorted.length)
      setServices(sorted)
    } catch (err) {
      console.error('Error en fetchLotServices:', err)
      setError(`Error al cargar servicios: ${err instanceof Error ? err.message : "Error desconocido"}`)
      setServices([])
    } finally {
      setLoadingServices(false)
      setRefreshing(false)
    }
  }

  // Refresh services
  const handleRefresh = () => {
    setRefreshing(true)
    fetchLotServices()
  }

  // Load services when selected lot changes
  useEffect(() => {
    if (selectedLot?.fieldId) {
      fetchLotServices()
    } else {
      setServices([])
    }
  }, [selectedLot?.fieldId])

  // Reset page when search changes
  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  // Filter services
  const filteredServices = services.filter(service => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      service.name?.toLowerCase().includes(q) ||
      service.requestId?.toLowerCase().includes(q)
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const displayedServices = filteredServices.slice(startIndex, startIndex + rowsPerPage)

  if (!selectedLot?.fieldId) {
    return (
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">{t("associatedServices")}</h3>
        <div className="text-center py-8 text-muted-foreground">
          {t("selectLotMessage")}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t("associatedServices")}</h3>
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
      </div>

      {loadingServices ? (
        <LotServicesTableSkeleton />
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
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      {searchQuery ? t("noSearchResults") : t("noServicesMessage")}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.requestId}</TableCell>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>
                        {service.createdAt ? format(new Date(service.createdAt), 'dd/MM/yyyy') : '-'}
                      </TableCell>
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

          {/* Pagination */}
          {filteredServices.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(startIndex + rowsPerPage, filteredServices.length)} de {filteredServices.length} servicios
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