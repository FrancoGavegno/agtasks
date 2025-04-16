"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { User } from "@/lib/interfaces"
import { listUsersByDomain } from "@/lib/360"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, Search } from "lucide-react"

export default function Users() {
  // Original users data from API
  const [originalUsers, setOriginalUsers] = useState<User[]>([])
  // Emails of users who have had invitations sent
  const [sentInvitationEmails, setSentInvitationEmails] = useState<Set<string>>(new Set())

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState("")
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const fetchedUsers = await listUsersByDomain(8644)
        const usersWithStatus = fetchedUsers.map(user => ({
          ...user,
          invitationStatus: "Not Sent" as "Not Sent" | "Sent" | undefined,
        }))
        setOriginalUsers(usersWithStatus)

        // Initialize sentInvitationEmails with users that already have "Sent" status
        const sentEmails = new Set<string>()
        originalUsers.forEach((user) => {
          if (user.invitationStatus === "Sent") {
            sentEmails.add(user.email)
          }
        })
        setSentInvitationEmails(sentEmails)

        setError(null)
      } catch (err) {
        console.error("Error fetching users:", err)
        setError("Failed to load users. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filter users based on search term
  const filteredUsers = originalUsers.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage)

  function getFullName(user: User): string {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim()
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

  // Get the invitation status for display
  function getInvitationStatus(user: User): "Sent" | "Not Sent" {
    return hasInvitationBeenSent(user.email) ? "Sent" : "Not Sent"
  }

  // Send invitation for a specific user
  function sendInvitation(userEmail: string) {
    // Add this user email to the set of sent invitations
    setSentInvitationEmails((prev) => {
      const newSet = new Set(prev)
      newSet.add(userEmail)
      return newSet
    })

    // Show a toast notification
    const user = originalUsers.find((u) => u.email === userEmail)
    if (user) {
      toast({
        title: "Invitation sent",
        description: `Invitation email sent to ${user.email}`,
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading users...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Users</h2>
          <p className="text-sm text-muted-foreground">Manage system users and invitations</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
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
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Invitation Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => {
                const status = getInvitationStatus(user)
                const isSent = status === "Sent"

                return (
                  <TableRow key={`user-${user.email}`}>
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
                      <Badge variant={isSent ? "default" : "secondary"} className="font-normal">
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => sendInvitation(user.email)} disabled={isSent}>
                        {isSent ? "Invitation Sent" : "Send Invitation"}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredUsers.length > 0
            ? `Showing ${startIndex + 1} to ${Math.min(startIndex + rowsPerPage, filteredUsers.length)} of ${filteredUsers.length
            } users`
            : "No users found"}
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
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
              <span className="sr-only">First page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages || totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
