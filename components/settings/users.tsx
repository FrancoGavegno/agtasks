"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import type { User } from "@/lib/interfaces"
import { listUsersByDomain } from "@/lib/integrations/360"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, Search } from "lucide-react"

export default function Users() {
  const { domain } = useParams<{ domain: string }>()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState("")
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      if (!domain) return

      try {
        setLoading(true)
        console.log(`Fetching users for domain: ${domain}`)

        const domainId = Number.parseInt(domain, 10)
        if (isNaN(domainId)) {
          throw new Error(`Invalid domain ID: ${domain}`)
        }

        const fetchedUsers = await listUsersByDomain(domainId)
        // const fetchedUsers = await listUsersByDomain(8644)
        console.log(`Fetched ${fetchedUsers.length} users:`, fetchedUsers)

        setUsers(fetchedUsers)
        setError(null)
      } catch (err) {
        console.error("Error fetching users:", err)
        setError("No se pudieron cargar los usuarios. Por favor, inténtalo de nuevo más tarde.")
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios. Por favor, inténtalo de nuevo más tarde.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [domain])

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage)

  function getFullName(user: User): string {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Usuario sin nombre"
  }

  function getInitials(user: User): string {
    const first = user.firstName ? user.firstName.charAt(0) : ""
    const last = user.lastName ? user.lastName.charAt(0) : ""
    return (first + last).toUpperCase() || "U"
  }

  // Send invitation for a specific user
  async function sendInvitation(user: User) {
    try {
      // Aquí iría la llamada a la API para enviar la invitación
      // Por ahora, simulamos el envío con un toast
      toast({
        title: "Invitación enviada",
        description: `Se ha enviado un correo de invitación a ${user.email}`,
      })

      // Actualizar el estado del usuario localmente
      setUsers(users.map((u) => (u.id === user.id ? { ...u, invitationStatus: "Sent" } : u)))
    } catch (error) {
      console.error("Error sending invitation:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar la invitación. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Cargando usuarios...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Intentar de nuevo
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Usuarios</h2>
          <p className="text-sm text-muted-foreground">Gestiona los usuarios del sistema y envía invitaciones</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuarios..."
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
              <TableHead className="w-[300px]">Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado de invitación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow key={user.id || user.email}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          {getInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{getFullName(user)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.invitationStatus === "Sent" ? "default" : "secondary"} className="font-normal">
                      {user.invitationStatus === "Sent" ? "Enviada" : "No enviada"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendInvitation(user)}
                      disabled={user.invitationStatus === "Sent"}
                    >
                      {user.invitationStatus === "Sent" ? "Invitación enviada" : "Enviar invitación"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {filter
                    ? "No se encontraron usuarios que coincidan con la búsqueda."
                    : "No hay usuarios disponibles."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredUsers.length > 0
            ? `Mostrando ${startIndex + 1} a ${Math.min(startIndex + rowsPerPage, filteredUsers.length)} de ${
                filteredUsers.length
              } usuarios`
            : "No se encontraron usuarios"}
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
    </div>
  )
}
