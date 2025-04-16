"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RoleModal } from "./role-modal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react"
import { Role } from "@/lib/interfaces"
import { listRoles } from "@/lib/agtasks"

export default function Roles() {
  const [ roles, setRoles ] = useState<Role[]>([])
  
  useEffect(() => {
    const fetchRoles = async () => {
      const data = await listRoles()
      //console.log(data)
      setRoles(data)
    }
    fetchRoles()
  }, [])

  // Initialize selectedProtocols with all protocol IDs
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  // Update selectedProtocols when protocols change
  useEffect(() => {
    setSelectedRoles(roles.map((p) => p.id))
  }, [roles])

  const [filter, setFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Filter roles by name and only show selected ones
  const filteredRoles = roles
    .filter((role) => selectedRoles.includes(role.id))
    .filter((role) => role.name.toLowerCase().includes(filter.toLowerCase()))

  // Calculate pagination
  const totalPages = Math.ceil(filteredRoles.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const paginatedRoles = filteredRoles.slice(startIndex, startIndex + rowsPerPage)

  const handleSavePreferences = (selectedIds: string[]) => {
    setSelectedRoles(selectedIds)
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Roles</h2>
          <p className="text-sm text-muted-foreground">Manage user roles and permissions</p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          Edit
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filter roles..."
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
              <TableHead className="w-[80%]">Role</TableHead>
              <TableHead className="text-center">Language</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRoles.length > 0 ? (
              paginatedRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{role.language}</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  No roles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredRoles.length > 0
            ? `Showing ${startIndex + 1} to ${Math.min(startIndex + rowsPerPage, filteredRoles.length)} of ${
                filteredRoles.length
              } roles`
            : "No roles found"}
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

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roles={roles}
        selectedRoles={selectedRoles}
        onSave={handleSavePreferences}
      />
    </div>
  )
}
