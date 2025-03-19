"use client"

import type React from "react"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { createProject } from "@/lib/jira"
import type { JiraProjectRequest } from "@/lib/interfaces"

interface NuevoProyectoModalProps {
  abierto: boolean
  onOpenChange: (open: boolean) => void
  onProyectoCreado: (proyecto: { id: string; nombre: string }) => void
  nombreProyectoSugerido: string
}

export function NuevoProyectoModal({
  abierto,
  onOpenChange,
  onProyectoCreado,
  nombreProyectoSugerido,
}: NuevoProyectoModalProps) {
  const [nombre, setNombre] = useState(nombreProyectoSugerido)
  const [clave, setClave] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre || !clave) {
      toast({
        title: "Error",
        description: "El nombre y la clave del proyecto son obligatorios",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Preparar datos para la API de Jira
      const projectData: JiraProjectRequest = {
        key: clave.toUpperCase(),
        name: nombre,
        projectTypeKey: "software", // Tipo de proyecto por defecto
        description: descripcion,
      }

      // Llamar a la API para crear el proyecto
      const response = await createProject(projectData)

      if (response.success && response.data) {
        toast({
          title: "Proyecto creado",
          description: `El proyecto "${nombre}" ha sido creado exitosamente`,
        })

        // Notificar al componente padre sobre el nuevo proyecto
        onProyectoCreado({
          id: response.data.id,
          nombre: response.data.name,
        })

        // Cerrar el modal
        onOpenChange(false)
      } else {
        throw new Error(response.error || "Error al crear el proyecto")
      }
    } catch (error) {
      console.error("Error al crear el proyecto:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear el proyecto",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear nuevo proyecto en Jira</DialogTitle>
            <DialogDescription>Complete los datos para crear un nuevo proyecto en el task manager.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre del proyecto</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder=""
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="clave">Identificador del proyecto</Label>
              <Input
                id="clave"
                value={clave}
                onChange={(e) => setClave(e.target.value.replace(/[^A-Za-z0-9]/g, ""))}
                placeholder=""
                maxLength={10}
                required
                className="uppercase"
              />
              <p className="text-xs text-muted-foreground">
                La clave debe ser única, solo letras y números, máximo 10 caracteres.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción (opcional)</Label>
              <Textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder=""
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear proyecto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

