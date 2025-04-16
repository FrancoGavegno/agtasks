"use client"

import { useState, useEffect } from "react"
import {Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Role } from "@/lib/interfaces"

interface RoleModalProps {
  isOpen: boolean
  onClose: () => void
  roles: Role[]
  selectedRoles: string[]
  onSave: (selectedIds: string[]) => void
}

export function RoleModal({ isOpen, onClose, roles, selectedRoles, onSave }: RoleModalProps) {
  const [localSelected, setLocalSelected] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelected([...selectedRoles])
      setSearchTerm("")
    }
  }, [isOpen, selectedRoles])

  const toggleRole = (id: string) => {
    setLocalSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const handleSave = () => {
    onSave(localSelected)
    onClose()
  }

  // Filter roles based on search term
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.language.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Roles</DialogTitle>
            <DialogDescription>Selecciona los roles que deseas mostrar.</DialogDescription>
          </div>
        </DialogHeader>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar roles..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4 py-2 max-h-[300px] overflow-y-auto pr-2">
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role) => (
              <div key={role.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm text-foreground">{role.name}</div>
                  <div className="text-xs text-muted-foreground">{role.language}</div>
                </div>
                <Switch checked={localSelected.includes(role.id)} onCheckedChange={() => toggleRole(role.id)} />
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">No se encontraron roles.</div>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <Button onClick={handleSave}>Guardar preferencias</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
