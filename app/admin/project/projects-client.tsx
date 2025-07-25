"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/admin/data-table"
import { ProjectDialog } from "./project-dialog"
import { apiClient } from '@/lib/integrations/amplify'
import type { Project } from "@/lib/schemas"

interface ProjectsClientProps {
  projects: Project[]
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await apiClient.deleteProject(id)
        // Refresh the page or update the list
        window.location.reload()
      } catch (error) {
        console.error('Error deleting project:', error)
        alert('Error deleting project')
      }
    }
  }

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "domainId",
      header: "Domain ID",
    },
    {
      accessorKey: "areaId",
      header: "Area ID",
    },
    {
      accessorKey: "tmpSourceSystem",
      header: "Template Source",
    },
    {
      accessorKey: "serviceDeskId",
      header: "Service Desk ID",
    },
    {
      accessorKey: "requestTypeId",
      header: "Request Type ID",
    },
    {
      accessorKey: "queueId",
      header: "Queue ID",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const project = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(project)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(project.id!)} className="text-destructive">
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
        data={projects}
        searchKey="name"
        onAdd={() => {
          setEditingProject(null)
          setIsDialogOpen(true)
        }}
      />
      <ProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        project={editingProject}
      />
    </>
  )
}
