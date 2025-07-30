"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/admin/data-table"
import { TaskDialog } from "./task-dialog"
import { apiClient } from "@/lib/integrations/amplify"
import type { Schema } from "@/amplify/data/resource"

type Task = Schema["Task"]["type"]
type Project = Schema["Project"]["type"]
type Service = Schema["Service"]["type"]

interface TasksClientProps {
  tasks: Task[]
  projects: Project[]
  services: Service[]
}

export function TasksClient({ tasks, projects, services }: TasksClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await apiClient.deleteTask(id)
        // Refresh the page or update the list
        window.location.reload()
      } catch (error) {
        console.error('Error deleting task:', error)
        alert('Error deleting task')
      }
    }
  }

  const getProjectName = (projectId?: string | null) => {
    if (!projectId) return "No Project"
    const project = projects.find((p) => p.id === projectId)
    return project?.name || "Unknown Project"
  }

  const getServiceName = (serviceId?: string | null) => {
    if (!serviceId) return "No Service"
    const service = services.find((s) => s.id === serviceId)
    return service?.name || "Unknown Service"
  }

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "projectId",
      header: "Project",
      cell: ({ row }) => getProjectName(row.original.projectId),
    },
    {
      accessorKey: "serviceId",
      header: "Service",
      cell: ({ row }) => getServiceName(row.original.serviceId),
    },
    {
      accessorKey: "subtaskId",
      header: "subtaskId",
    },
    {
      accessorKey: "taskName",
      header: "Task Name",
    },
    {
      accessorKey: "taskType",
      header: "Type",
    },
    {
      accessorKey: "userEmail",
      header: "User Email",
    },
    {
      accessorKey: "tmpSubtaskId",
      header: "tmpSubtaskId",
    },
    {
      accessorKey: "formId",
      header: "Form ID"
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const task = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(task)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(task.id!)} className="text-destructive">
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
        data={tasks}
        searchKey="taskName"
        onAdd={() => {
          setEditingTask(null)
          setIsDialogOpen(true)
        }}
      />
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={editingTask}
        projects={projects}
        services={services}
      />
    </>
  )
}
