"use client"

import { 
  useState, 
  useEffect 
} from "react"
import { 
  Avatar, 
  AvatarFallback 
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Loader2, 
  Search 
} from "lucide-react"
import { useSettings } from "@/lib/contexts/settings-context"
import type { User } from "@/lib/interfaces/360"
import { useTranslations } from 'next-intl'

export default function Users() {
  const t = useTranslations("SettingsUsers")
  const { 
    users, 
    usersLoading, 
    refreshUsers, 
    sentInvitationEmails, 
    setSentInvitationEmails 
  } = useSettings()
  const [filter, setFilter] = useState("")
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

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

  // Reset pagination when filter changes
  useEffect(() => {
    setPage(1)
  }, [filter])

  function getFullName(user: User): string {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Usuario sin nombre"
  }

  function getInitials(user: User): string {
    const first = user.firstName ? user.firstName.charAt(0) : ""
    const last = user.lastName ? user.lastName.charAt(0) : ""
    return (first + last).toUpperCase() || "U"
  }

  // Check if an invitation has been sent for a user
  function hasInvitationBeenSent(userEmail: string): boolean {
    return sentInvitationEmails.has(userEmail)
  }

  // Send invitation for a specific user
  async function sendInvitation(user: User) {
    try {
      // Aquí iría la llamada a la API para enviar la invitación
      // Por ahora, simulamos el envío

      // Add this user email to the set of sent invitations
      setSentInvitationEmails(new Set(sentInvitationEmails).add(user.email))

      // Update the user's invitation status
      const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, invitationStatus: "Sent" } : u))

      // Show a toast notification
      toast({
        title: "Invitación enviada",
        description: `Se ha enviado un correo de invitación a ${user.email}`,
      })
    } catch (error) {
      // console.error("Error sending invitation:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar la invitación. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          <span className="ml-2 text-muted-foreground">{t("loadingUsers")}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* <Button variant="outline" size="sm" onClick={refreshUsers}>
            {t("refreshButton")}
          </Button> */}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
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
              <TableHead>{t("tableHeaders.name")}</TableHead>
              <TableHead>{t("tableHeaders.email")}</TableHead>
              <TableHead>{t("tableHeaders.status")}</TableHead>
              <TableHead>{t("tableHeaders.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  {filter
                    ? t("noUsersSubtitle")
                    : t("noUsersTitle")
                  }
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user, index) => (
                <TableRow key={user.id || `user-${index}`}>
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
                    <Badge variant={hasInvitationBeenSent(user.email) || user.invitationStatus === "Sent" ? "default" : "secondary"} className="font-normal">
                      {hasInvitationBeenSent(user.email) || user.invitationStatus === "Sent" ? t("sentInvitation") : t("noSentInvitation")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendInvitation(user)}
                      disabled={hasInvitationBeenSent(user.email) || user.invitationStatus === "Sent"}
                    >
                      {hasInvitationBeenSent(user.email) || user.invitationStatus === "Sent" ? t("invitationSent") : t("sendInvitation")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {filteredUsers.length > 0
            ? t("showing") + " " + (startIndex + 1) + " " + t("of") + " " + Math.min(startIndex + rowsPerPage, filteredUsers.length) + " " + t("entries")
            : t("noUsersFound")}
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{t("rowsPerPage")}</p>
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
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
