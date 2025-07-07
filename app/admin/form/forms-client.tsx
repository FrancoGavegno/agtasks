"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/admin/data-table"
import { DomainFormDialog } from "./form-dialog"
import { deleteDomainForm } from "@/lib/admin-actions"
import type { Schema } from "@/amplify/data/resource"

type DomainForm = Schema["DomainForm"]["type"]

interface DomainFormsClientProps {
  domainForms: DomainForm[]
}

export function DomainFormsClient({ domainForms }: DomainFormsClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDomainForm, setEditingDomainForm] = useState<DomainForm | null>(null)

  const handleEdit = (domainForm: DomainForm) => {
    setEditingDomainForm(domainForm)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this domain form?")) {
      await deleteDomainForm(id)
    }
  }

  const columns: ColumnDef<DomainForm>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "domainId",
      header: "Domain ID",
    },
    {
      accessorKey: "ktFormId",
      header: "KT Form ID",
    },
    {
      accessorKey: "language",
      header: "Language",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const domainForm = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(domainForm)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(domainForm.id)} className="text-destructive">
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
        data={domainForms}
        searchKey="name"
        onAdd={() => {
          setEditingDomainForm(null)
          setIsDialogOpen(true)
        }}
        addLabel="Add Domain Form"
      />
      <DomainFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} domainForm={editingDomainForm} />
    </>
  )
}
