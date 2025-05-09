"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormModal } from "./form-modal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, Search } from "lucide-react"
import { useSettings } from "@/lib/contexts/settings-context"
import { Badge } from "@/components/ui/badge"

export default function Forms() {
  const { forms, allForms, selectedForms, formsLoading, setSelectedForms, refreshForms } = useSettings()

  const [filter, setFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Filter forms by name and only show selected ones
  const filteredForms = forms
    .filter((form) => selectedForms.includes(form.id))
    .filter((form) => form.name.toLowerCase().includes(filter.toLowerCase()))

  // Calculate pagination
  const totalPages = Math.ceil(filteredForms.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const paginatedForms = filteredForms.slice(startIndex, startIndex + rowsPerPage)

  const handleSavePreferences = async (selectedIds: string[]) => {
    setSelectedForms(selectedIds)
    refreshForms()
  }

  if (formsLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading forms...</span>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Forms</h2>
          <p className="text-sm text-muted-foreground">Manage data collection forms</p>
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
            placeholder="Filter forms..."
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
              <TableHead className="w-[80%]">Name</TableHead>
              <TableHead className="text-center">Language</TableHead>
              <TableHead className="text-center">Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedForms.length > 0 ? (
              paginatedForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">{form.name}</TableCell>
                  <TableCell className="font-medium text-center">{form.language}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{form.ktFormId ? "KoboToolbox" : "Local"}</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  No forms found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredForms.length > 0
            ? `Showing ${startIndex + 1} to ${Math.min(startIndex + rowsPerPage, filteredForms.length)} of ${
                filteredForms.length
              } forms`
            : "No forms found"}
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

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allForms={allForms}
        forms={forms}
        selectedForms={selectedForms}
        onSave={handleSavePreferences}
      />
    </div>
  )
}
