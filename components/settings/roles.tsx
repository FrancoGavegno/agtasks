"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RoleModal } from "./role-modal"

interface Role {
  id: string
  name: string
}

export default function Roles() {
  const [roles] = useState<Role[]>([
    { id: "1", name: "Supervisor" },
    { id: "2", name: "Operador" },
    { id: "3", name: "Coordinador" },
    { id: "4", name: "Colector" },
  ])

  // Initialize selectedRoles with all role IDs
  const [selectedRoles, setSelectedRoles] = useState<string[]>(roles.map((p) => p.id))

  const [filter, setFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter roles by name and only show selected ones
  const filteredRoles = roles
    .filter((role) => selectedRoles.includes(role.id))
    .filter((role) => role.name.toLowerCase().includes(filter.toLowerCase()))

  const handleSavePreferences = (selectedIds: string[]) => {
    setSelectedRoles(selectedIds)
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5">
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight">Roles</h2>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          Edit
        </Button>
      </div>

      <div className="mb-5">
        <Input
          placeholder="Filter roles..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-full"
        />
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-1 items-center px-4 py-3 bg-muted/50 text-sm">
          <div className="font-medium">Role</div>
        </div>

        {filteredRoles.length > 0 ? (
          filteredRoles.map((role) => (
            <div key={role.id} className="grid grid-cols-1 items-center px-4 py-3 border-t text-sm">
              <div className="font-medium">{role.name}</div>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">No roles found.</div>
        )}
      </div>

      <div className="flex items-center justify-end mt-4 text-sm text-muted-foreground">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
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
