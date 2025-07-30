"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/admin/data-table"
import { FieldDialog } from "./field-dialog"
import { apiClient } from '@/lib/integrations/amplify'
import type { Schema } from "@/amplify/data/resource"

type Field = Schema["Field"]["type"]
type Task = Schema["Task"]["type"]

interface FieldsClientProps {
  fields: Field[]
  tasks: Task[]
}

export function FieldsClient({ fields, tasks }: FieldsClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingField, setEditingField] = useState<Field | null>(null)

  const handleEdit = (field: Field) => {
    setEditingField(field)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this field?")) {
      try {
        await apiClient.deleteField(id)
        // Refresh the page or update the list
        window.location.reload()
      } catch (error) {
        console.error('Error deleting field:', error)
        alert('Error deleting field')
      }
    }
  }

  const getTaskName = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    return task?.taskName || "Unknown Task"
  }

  const columns: ColumnDef<Field>[] = [
    {
      accessorKey: "fieldName",
      header: "Field Name",
    },
    {
      accessorKey: "workspaceName",
      header: "Workspace",
    },
    {
      accessorKey: "campaignName",
      header: "Campaign",
    },
    {
      accessorKey: "farmName",
      header: "Farm",
    },
    {
      accessorKey: "hectares",
      header: "Hectares",
    },
    {
      accessorKey: "crop",
      header: "Crop",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const field = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(field)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(field.id!)} className="text-destructive">
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
        data={fields}
        searchKey="fieldName"
        onAdd={() => {
          setEditingField(null)
          setIsDialogOpen(true)
        }}
      />
      <FieldDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        field={editingField as any}
      />
    </>
  )
}
