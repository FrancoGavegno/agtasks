"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

interface Role {
  id: string
  name: string
}

interface RoleModalProps {
  isOpen: boolean
  onClose: () => void
  roles: Role[]
  selectedRoles: string[]
  onSave: (selectedIds: string[]) => void
}

export function RoleModal({ isOpen, onClose, roles, selectedRoles, onSave }: RoleModalProps) {
  const [localSelected, setLocalSelected] = useState<string[]>([])

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelected([...selectedRoles])
    }
  }, [isOpen, selectedRoles])

  const toggleRole = (id: string) => {
    setLocalSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const handleSave = () => {
    onSave(localSelected)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Roles</DialogTitle>
            <DialogDescription>Selecciona los roles que deseas mostrar.</DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center justify-between">
              <div className="font-medium">{role.name}</div>
              <Switch checked={localSelected.includes(role.id)} onCheckedChange={() => toggleRole(role.id)} />
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <Button onClick={handleSave}>Guardar preferencias</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
