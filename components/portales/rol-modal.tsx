"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"

// Tipo para los roles
interface Rol {
  id: string
  nombre: string
}

interface RolModalProps {
  abierto: boolean
  onOpenChange: (open: boolean) => void
  rol: Rol | null
  onGuardar: (nombre: string) => void
}

export function RolModal({ abierto, onOpenChange, rol, onGuardar }: RolModalProps) {
  const [nombreRol, setNombreRol] = useState("")

  // Inicializar el nombre del rol cuando se abre el modal
  useEffect(() => {
    if (abierto) {
      setNombreRol(rol ? rol.nombre : "")
    }
  }, [rol, abierto])

  // Guardar el rol
  const handleGuardar = () => {
    if (!nombreRol.trim()) return
    onGuardar(nombreRol)
    onOpenChange(false)
  }

  return (
    <Dialog open={abierto} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{rol ? "Editar Rol" : "Crear Nuevo Rol"}</DialogTitle>
          <DialogDescription>
            {rol ? "Modifique el nombre del rol." : "Ingrese el nombre para el nuevo rol."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre-rol">Nombre del rol</Label>
              <Input
                id="nombre-rol"
                value={nombreRol}
                onChange={(e) => setNombreRol(e.target.value)}
                placeholder="Ingrese el nombre del rol"
                autoFocus
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleGuardar} disabled={!nombreRol.trim()}>
            <Check className="h-4 w-4 mr-1" />
            {rol ? "Actualizar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

