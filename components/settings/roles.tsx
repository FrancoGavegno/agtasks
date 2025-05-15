"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RoleModal } from "./role-modal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, Search } from "lucide-react"
import { useSettings } from "@/lib/contexts/settings-context"

export default function Roles() {
  const { roles, allRoles, selectedRoles, rolesLoading, setSelectedRoles, refreshRoles } = useSettings()

  const [filter, setFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  console.log("Roles component:", { roles, allRoles, selectedRoles })

  // Filter roles by name and only show selected ones
  const filteredRoles = roles
    .filter((role) => selectedRoles.includes(role.id))
    .filter((role) => role.name.toLowerCase().includes(filter.toLowerCase()))

  // Remove duplicate roles (same name and language)
  const uniqueRoles = filteredRoles.reduce(
    (acc, current) => {
      const isDuplicate = acc.find(
        (item) =>
          item.name === current.name &&
          (item.language || "ES").toLowerCase() === (current.language || "ES").toLowerCase(),
      )
      if (!isDuplicate) {
        return acc.concat([current])
      }
      return acc
    },
    [] as typeof filteredRoles,
  )

  // Calculate pagination
  const totalPages = Math.ceil(uniqueRoles.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const paginatedRoles = uniqueRoles.slice(startIndex, startIndex + rowsPerPage)

  const handleSavePreferences = async (selectedIds: string[]) => {
    console.log("Guardando preferencias de roles:", selectedIds)
    setSelectedRoles(selectedIds)
    refreshRoles()
  }

  if (rolesLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Cargando roles...</span>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Roles</h2>
          <p className="text-sm text-muted-foreground">Administra los roles de usuario</p>
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
            placeholder="Filtrar roles..."
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
              <TableHead className="w-[80%]">Rol</TableHead>
              <TableHead className="text-center">Idioma</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRoles.length > 0 ? (
              paginatedRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{role.language || "ES"}</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  No se encontraron roles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {uniqueRoles.length > 0
            ? `Mostrando ${startIndex + 1} a ${Math.min(startIndex + rowsPerPage, uniqueRoles.length)} de ${
                uniqueRoles.length
              } roles`
            : "No se encontraron roles"}
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

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allRoles={allRoles}
        roles={roles}
        selectedRoles={selectedRoles}
        onSave={handleSavePreferences}
      />
    </div>
  )
}
