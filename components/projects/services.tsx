"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Edit,
  Play,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { listServicesByProject } from "@/lib/services/agtasks"
import type { Service } from "@/lib/interfaces"

export function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Service | null; direction: "asc" | "desc" | "none" }>({
    key: null,
    direction: "none",
  })

  // TO DO: Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      const servicesData = await listServicesByProject(1)
      setServices(servicesData)
    }

    fetchServices()
  }, [])

  // Handle sorting
  const requestSort = (key: keyof Service) => {
    let direction: "asc" | "desc" | "none" = "asc"
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc"
      } else if (sortConfig.direction === "desc") {
        direction = "none"
      }
    }
    setSortConfig({ key, direction })
  }

  // Get sort icon based on current sort state
  const getSortIcon = (key: keyof Service) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }

    if (sortConfig.direction === "asc") {
      return <ArrowUp className="ml-2 h-4 w-4" />
    }

    if (sortConfig.direction === "desc") {
      return <ArrowDown className="ml-2 h-4 w-4" />
    }

    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  // Filter services based on search query
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.establishment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.lots.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort services based on sort config
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortConfig.direction === "none" || sortConfig.key === null) {
      return 0
    }

    // Handle date sorting
    if (sortConfig.key === "startDate") {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0

      if (sortConfig.direction === "asc") {
        return dateA - dateB
      } else {
        return dateB - dateA
      }
    }

    // Handle numeric sorting
    if (sortConfig.key === "totalHectares" || sortConfig.key === "progress") {
      if (sortConfig.direction === "asc") {
        return a[sortConfig.key] - b[sortConfig.key]
      } else {
        return b[sortConfig.key] - a[sortConfig.key]
      }
    }

    // Handle string sorting
    const valueA = a[sortConfig.key]?.toString().toLowerCase() || ""
    const valueB = b[sortConfig.key]?.toString().toLowerCase() || ""

    if (sortConfig.direction === "asc") {
      return valueA.localeCompare(valueB)
    } else {
      return valueB.localeCompare(valueA)
    }
  })

  // Calculate pagination
  const totalPages = Math.ceil(sortedServices.length / rowsPerPage)
  const indexOfLastItem = currentPage * rowsPerPage
  const indexOfFirstItem = indexOfLastItem - rowsPerPage
  const currentItems = sortedServices.slice(indexOfFirstItem, indexOfLastItem)

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

  return (
    <div className="w-full">

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search services..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader column="name" label="Servicio" />
              <SortableHeader column="establishment" label="Establecimiento" />
              <SortableHeader column="lots" label="Lotes" />
              <SortableHeader column="totalHectares" label="Tot. Has" />
              <SortableHeader column="progress" label="Progreso" />
              <SortableHeader column="startDate" label="Fecha Inicio" />
              {/* <TableHead>Acciones</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No se encontraron servicios
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.establishment}</TableCell>
                  <TableCell>{service.lots}</TableCell>
                  <TableCell>{service.totalHectares}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={service.progress} className="h-2 w-[60px]" />
                      <span className="text-xs text-muted-foreground">{service.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{service.startDate ? new Date(service.startDate).toLocaleDateString() : "-"}</TableCell>
                  {/* <TableCell>
                    <div className="flex gap-2">
                      {service.status === "pending" && (
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {sortedServices.length > 0 ? <p>0 of {sortedServices.length} row(s) selected.</p> : <p>No results.</p>}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
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
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="h-8 w-8 p-0" onClick={goToPreviousPage} disabled={currentPage === 1}>
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
