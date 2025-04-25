"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import type { Role } from "@/lib/interfaces"

interface RoleModalProps {
  isOpen: boolean
  onClose: () => void
  roles: Role[]
  allRoles: Role[]
  selectedRoles: string[]
  onSave: (selectedIds: string[]) => void
}

export function RoleModal({ isOpen, onClose, roles, allRoles, selectedRoles, onSave }: RoleModalProps) {
  const [localSelected, setLocalSelected] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelected([...selectedRoles])
      setSearchTerm("")
    }
  }, [isOpen, selectedRoles])

  const toggleRole = (id: string) => {
    setLocalSelected((prev) => {
      const newSelected = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
      return newSelected
    })
  }

  const handleSave = async () => {
    setIsSaving(true) // Deshabilitar el botón mientras se ejecuta
    try {
      // 1. Identificar roles que deben eliminarse
      // (id que ya no están seleccionados)
      const rolesToDeleteIds = selectedRoles.filter((roleId) => !localSelected.includes(roleId))

      // 2. Identificar roles que deben crearse (id que no están en roles)
      const rolesToCreate = localSelected.filter((roleId) => !roles.some((role) => role.id === roleId))

      // 3. Eliminar roles deseleccionados usando el id del DomainRole
      const deletePromises = rolesToDeleteIds.map(async (roleId) => {
        const response = await fetch(`/api/domain-role?roleId=${roleId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error(`Error en DELETE para id ${roleId}:`, errorData)
          throw new Error(`Failed to delete role with id ${roleId}`)
        }

        const data = await response.json()
        return data
      })

      // 4. Crear nuevos roles
      const createPromises = rolesToCreate.map(async (roleId) => {
        const roleData = allRoles.find((role) => role.id === roleId)

        if (!roleData) {
          throw new Error(`Role data not found for id ${roleId}`)
        }

        const response = await fetch("/api/domain-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            domainId: "dd8ae98f-2231-444e-8daf-120a4c416d15",
            name: roleData.name,
            language: roleData.language,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error(`Error en POST para id ${roleId}:`, errorData)
          throw new Error(`Failed to create role with id ${roleId}`)
        }

        const data = await response.json()
        return data
      })

      // 5. Ejecutar todas las operaciones (DELETE y POST) en paralelo
      await Promise.all([...deletePromises, ...createPromises])

      // 6. Llamar a onSave y cerrar el modal si todo sale bien
      onSave(localSelected)
      onClose()
    } catch (error) {
      console.error("Error processing roles:", error)
    } finally {
      setIsSaving(false) // Rehabilitar el botón cuando termine (incluso si hay error)
    }
  }

  // Filter roles based on search term
  const filteredRoles = allRoles.filter(
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
            filteredRoles.map((role) => {
              // Check if this role is already in the domain roles list
              const existingRole = roles.find(
                (r) => r.name === role.name && r.language.toLowerCase() === role.language.toLowerCase(),
              )

              // If it exists, use its ID for checking selection
              const checkId = existingRole ? existingRole.id : role.id

              return (
                <div key={role.id} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm text-foreground">{role.name}</div>
                    <div className="text-xs text-muted-foreground">{role.language}</div>
                  </div>
                  <Switch checked={localSelected.includes(checkId)} onCheckedChange={() => toggleRole(checkId)} />
                </div>
              )
            })
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">No se encontraron roles.</div>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Guardando preferencias..." : "Guardar preferencias"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
