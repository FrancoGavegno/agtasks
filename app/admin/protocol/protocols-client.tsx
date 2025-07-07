"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/admin/data-table"
import { DomainProtocolDialog } from "./protocol-dialog"
import { deleteDomainProtocol } from "@/lib/admin-actions"
import type { Schema } from "@/amplify/data/resource"

type DomainProtocol = Schema["DomainProtocol"]["type"]

interface DomainProtocolsClientProps {
  domainProtocols: DomainProtocol[]
}

export function DomainProtocolsClient({ domainProtocols }: DomainProtocolsClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDomainProtocol, setEditingDomainProtocol] = useState<DomainProtocol | null>(null)

  const handleEdit = (domainProtocol: DomainProtocol) => {
    setEditingDomainProtocol(domainProtocol)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this domain protocol?")) {
      await deleteDomainProtocol(id)
    }
  }

  const columns: ColumnDef<DomainProtocol>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "domainId",
      header: "Domain ID",
    },
    {
      accessorKey: "tmProtocolId",
      header: "TM Protocol ID",
    },
    {
      accessorKey: "language",
      header: "Language",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const domainProtocol = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(domainProtocol)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(domainProtocol.id)} className="text-destructive">
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
        data={domainProtocols}
        searchKey="name"
        onAdd={() => {
          setEditingDomainProtocol(null)
          setIsDialogOpen(true)
        }}
        addLabel="Add Domain Protocol"
      />
      <DomainProtocolDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} domainProtocol={editingDomainProtocol} />
    </>
  )
}
