"use client"

import type React from "react"

import { useState, useEffect } from "react"
//import Link from "next/link"
import { Link } from '@/i18n/routing';
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, Plus, Grid, List, Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getAllServicePortals, searchServicePortals, deleteServicePortal } from "@/lib/db"
import { toast } from "@/hooks/use-toast"
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog"
import type { ServicePortal } from "@/lib/types"

export function ServicePortalsList() {
  const router = useRouter()
  const [servicePortals, setServicePortals] = useState<ServicePortal[]>([])
  const [filter, setFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [portalToDelete, setPortalToDelete] = useState<ServicePortal | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  useEffect(() => {
    fetchPortals()
  }, [])

  const fetchPortals = async () => {
    setIsLoading(true)
    try {
      const data = await getAllServicePortals()
      setServicePortals(data)
    } catch (error) {
      console.error("Error fetching portals:", error)
      toast({
        title: "Error",
        description: "Failed to load service portals",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setFilter(query)

    if (query.trim()) {
      const results = await searchServicePortals(query)
      setServicePortals(results)
    } else {
      const allPortals = await getAllServicePortals()
      setServicePortals(allPortals)
    }
  }

  const handleView = (id: string) => {
    router.push(`/portals/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/service-portals/${id}/edit`)
  }

  const handleDeleteClick = (portal: ServicePortal) => {
    setPortalToDelete(portal)
    setConfirmDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!portalToDelete) return

    try {
      const success = await deleteServicePortal(portalToDelete.id)
      if (success) {
        toast({
          title: "Success",
          description: "Service portal deleted successfully",
        })
        // Refresh the list
        fetchPortals()
      } else {
        throw new Error("Failed to delete service portal")
      }
    } catch (error) {
      console.error("Error deleting portal:", error)
      toast({
        title: "Error",
        description: "Failed to delete service portal",
        variant: "destructive",
      })
    } finally {
      setConfirmDeleteOpen(false)
      setPortalToDelete(null)
    }
  }

  const renderGridView = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {servicePortals.map((portal) => (
        <Card key={portal.id} className="p-4 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{portal.name}</h3>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleView(portal.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(portal.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteClick(portal)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
          <p className="text-sm">
            <span className="font-medium text-gray-700">Domain:</span> {portal.domain}
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-700">Area:</span> {portal.area}
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-700">Workspace:</span> {portal.workspace}
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-700">Project:</span> {portal.servicePortal}
          </p>
          <div className="mt-auto pt-4 flex justify-end space-x-2">
            {/* <Button variant="outline" size="sm" onClick={() => handleView(portal.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEdit(portal.id)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button> */}

            <Button asChild variant="outline" size="sm">
              <Link href={`/portals/${portal.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </Button>

            {/* <Button asChild variant="outline" size="sm">
              <Link href={`/portals/${portal.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button> */}

          </div>
        </Card>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Area</TableHead>
            <TableHead>Workspace</TableHead>
            <TableHead>Project</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servicePortals.map((portal) => (
            <TableRow key={portal.id}>
              <TableCell className="font-medium">{portal.name}</TableCell>
              <TableCell>{portal.domain}</TableCell>
              <TableCell>{portal.area}</TableCell>
              <TableCell>{portal.workspace}</TableCell>
              <TableCell>{portal.servicePortal}</TableCell>
              <TableCell className="text-right">

                <div className="flex justify-end gap-2">
                  <Link href={`/portals/${portal.id}`} target="_blank">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>

                </div>

                {/* <div className="flex justify-end space-x-2">
                   <Button variant="ghost" size="icon" onClick={() => handleView(portal.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(portal.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(portal)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button> 

                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/portals/${portal.id}`} target="_blank">
                      <Eye className="mr-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                 <Button asChild variant="ghost" size="icon">
                    <Link href={`/portals/${portal.id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                    </Link>
                  </Button> 

                </div> */}

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Service Portals</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Link href="/portals/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Service Portal
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={filter}
          onChange={handleSearch}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 h-40 animate-pulse bg-muted" />
          ))}
        </div>
      ) : servicePortals.length > 0 ? (
        viewMode === "grid" ? (
          renderGridView()
        ) : (
          renderListView()
        )
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">
            {filter ? "No service portals found with that filter." : "No service portals. Create a new one."}
          </p>
        </div>
      )}

      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Delete Service Portal"
        description={`Are you sure you want to delete "${portalToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

