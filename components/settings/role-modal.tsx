"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
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
  const { domain } = useParams<{ domain: string }>()
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

  const toggleRole = (role: Role) => {
    // Buscar si el rol ya existe en el dominio
    const existingRole = roles.find(
      (r) => r.name === role.name && (r.language || "ES").toLowerCase() === (role.language || "ES").toLowerCase(),
    )

    // Usar el ID del rol existente si existe, o el ID del rol de allRoles si no
    const roleId = existingRole ? existingRole.id : role.id

    setLocalSelected((prev) => {
      const newSelected = prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
      return newSelected
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // 1. Identificar roles que deben eliminarse (roles que están en el dominio pero no en localSelected)
      const rolesToDelete = roles.filter((role) => !localSelected.includes(role.id))

      // 2. Identificar roles que deben crearse (IDs en localSelected que no corresponden a roles existentes)
      const rolesToCreateIds = localSelected.filter((id) => !roles.some((role) => role.id === id))

      // 3. Eliminar roles deseleccionados
      for (const role of rolesToDelete) {
        try {
          const response = await fetch(`/api/v1/agtasks/domains/${domain}/roles/${role.id}`, {
            method: "DELETE",
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`Error al eliminar rol: ${errorData.message || response.statusText}`)
          }

          await response.json()
        } catch (error) {
          toast({
            title: "Error",
            description: `No se pudo eliminar el rol: ${(error as Error).message}`,
            variant: "destructive",
          })
          throw error
        }
      }

      // 4. Crear nuevos roles
      for (const roleId of rolesToCreateIds) {
        // Buscar el rol en allRoles
        const roleData = allRoles.find((role) => role.id === roleId)

        if (!roleData) {
          throw new Error(`No se encontraron datos para el rol ${roleId}`)
        }

        try {
          const response = await fetch(`/api/v1/agtasks/domains/${domain}/roles`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              domainId: domain,
              name: roleData.name,
              language: roleData.language || "ES",
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`Error al crear rol: ${errorData.message || response.statusText}`)
          }

          await response.json()
        } catch (error) {
          toast({
            title: "Error",
            description: `No se pudo crear el rol: ${(error as Error).message}`,
            variant: "destructive",
          })
          throw error
        }
      }

      // 5. Notificar éxito y cerrar modal
      toast({
        title: "Éxito",
        description: "Preferencias de roles guardadas correctamente",
      })

      onSave(localSelected)
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al guardar las preferencias de roles",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Filter roles based on search term
  const filteredRoles = allRoles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.language && role.language.toLowerCase().includes(searchTerm.toLowerCase())),
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
              // Buscar si el rol ya existe en el dominio
              const existingRole = roles.find(
                (r) =>
                  r.name === role.name && (r.language || "ES").toLowerCase() === (role.language || "ES").toLowerCase(),
              )

              // Usar el ID del rol existente si existe, o el ID del rol de allRoles si no
              const roleId = existingRole ? existingRole.id : role.id

              // Verificar si el rol está seleccionado
              const isSelected = localSelected.includes(roleId)

              return (
                <div key={role.id} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm text-foreground">{role.name}</div>
                    <div className="text-xs text-muted-foreground">{role.language || "ES"}</div>
                  </div>
                  <Switch checked={isSelected} onCheckedChange={() => toggleRole(role)} />
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
