"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/admin/data-table"
import { ServiceDialog } from "./service-dialog"
import { deleteService } from "@/lib/admin-actions"
import type { Schema } from "@/amplify/data/resource"

type Service = Schema["Service"]["type"]
type Project = Schema["Project"]["type"]

interface ServicesClientProps {
  services: Service[]
  projects: Project[]
}

export function ServicesClient({ services, projects }: ServicesClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await deleteService(id)
    }
  }

  const getProjectName = (projectId?: string | null) => {
    if (!projectId) return "No Project"
    const project = projects.find((p) => p.id === projectId)
    return project?.name || "Unknown Project"
  }

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "projectId",
      header: "Project",
      cell: ({ row }) => getProjectName(row.original.projectId),
    },
    {
      accessorKey: "tmpRequestId",
      header: "Template Request ID",
    },
    {
      accessorKey: "requestId",
      header: "Request ID",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const service = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(service)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(service.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={services}
        searchKey="name"
        onAdd={() => {
          setEditingService(null)
          setIsDialogOpen(true)
        }}
        addLabel="Add Service"
      />
      <ServiceDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} service={editingService} projects={projects} />
    </>
  )
}
