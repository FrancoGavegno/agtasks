"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModalProtocols } from "./protocol-modal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, Search } from "lucide-react"
import { useSettings } from "@/lib/contexts/settings-context"

export default function Protocols() {
  const {
    protocols,
    allProtocols,
    selectedProtocols,
    protocolsLoading,
    setSelectedProtocols,
    refreshProtocols,
    isRefreshingProtocols,
  } = useSettings()

  const [filter, setFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [displayedProtocols, setDisplayedProtocols] = useState<typeof protocols>([])

  // Efecto para actualizar los protocolos mostrados cuando cambian los datos
  useEffect(() => {
    // console.log("Protocols in component:", protocols)
    // console.log("Selected protocols:", selectedProtocols)

    // Usar directamente los protocolos del dominio
    if (protocols.length > 0) {
      // console.log("Using domain protocols")
      setDisplayedProtocols(protocols)
    } else {
      // console.log("No domain protocols found")
      setDisplayedProtocols([])
    }
  }, [protocols, selectedProtocols])

  // Filter protocols by name
  const filteredProtocols = displayedProtocols.filter((protocol) =>
    protocol.name.toLowerCase().includes(filter.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredProtocols.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const paginatedProtocols = filteredProtocols.slice(startIndex, startIndex + rowsPerPage)

  const handleSavePreferences = async (selectedIds: string[]) => {
    console.log("Saving preferences with selected IDs:", selectedIds)
    setSelectedProtocols(selectedIds)
    refreshProtocols() // Esto debería volver a cargar los protocolos del dominio
  }

  if (protocolsLoading || isRefreshingProtocols) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Cargando protocolos...</span>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">

      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Protocolos</h2>
          <p className="text-sm text-muted-foreground">Administra tus protocolos de servicio</p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          Editar
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filtrar protocolos..."
            className="pl-8"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80%]">Protocolo</TableHead>
              <TableHead className="text-center">Idioma</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProtocols.length > 0 ? (
              paginatedProtocols.map((protocol) => (
                <TableRow key={protocol.id}>
                  <TableCell className="font-medium">{protocol.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{protocol.language}</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  No se encontraron protocolos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredProtocols.length > 0
            ? `Mostrando ${startIndex + 1} a ${Math.min(startIndex + rowsPerPage, filteredProtocols.length)} de ${filteredProtocols.length
            } protocolos`
            : "No se encontraron protocolos"}
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Filas por página</p>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => {
                setRowsPerPage(Number(value))
                setPage(1)
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={rowsPerPage.toString()} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 15, 20].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      <ModalProtocols
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allProtocols={allProtocols}
        protocols={protocols}
        selectedProtocols={selectedProtocols}
        onSave={handleSavePreferences}
      />
    </div>
  )
}
