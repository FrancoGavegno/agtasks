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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"
import { NuevoProyectoModal } from "./nuevo-proyecto-modal"
import type { PortalServicio } from "./portales"

// Datos de ejemplo
const DOMINIOS = ["GeoAgro", "Rigran"]
const AREAS = ["Area 1", "Area 2"]
const ESPACIOS = ["Espacio 1", "Espacio 2"]
// const TASK_MANAGERS = ["Jira"]
const PORTALES_SERVICIO = ["CLIENTE 1", "CLIENTE 2"]

// Actualizar la interfaz para omitir protocolos, roles y formularios
interface NuevoPortalServicioModalProps {
  abierto: boolean
  onOpenChange: (open: boolean) => void
  onGuardar: (portalServicio: Omit<PortalServicio, "id" | "protocolos" | "roles" | "formularios">) => void
}

export function NuevoPortalServicioModal({ abierto, onOpenChange, onGuardar }: NuevoPortalServicioModalProps) {
  const [nombre, setNombre] = useState("")
  const [dominio, setDominio] = useState("")
  const [area, setArea] = useState("")
  const [espacioTrabajo, setEspacioTrabajo] = useState("")
  const [portalServicio, setPortalServicio] = useState("")
  const [proyectos, setProyectos] = useState<{ id: string; nombre: string }[]>(
    PORTALES_SERVICIO.map((p) => ({ id: p, nombre: p })),
  )
  const [nuevoProyectoModalAbierto, setNuevoProyectoModalAbierto] = useState(false)

  // Manejar la creación de un nuevo proyecto
  const handleProyectoCreado = (nuevoProyecto: { id: string; nombre: string }) => {
    // Agregar el nuevo proyecto a la lista
    setProyectos([...proyectos, nuevoProyecto])

    // Seleccionar automáticamente el nuevo proyecto
    setPortalServicio(nuevoProyecto.id)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre || !dominio || !area || !espacioTrabajo || !portalServicio) {
      return
    }

    onGuardar({
      nombre,
      dominio,
      area,
      espacioTrabajo,
      portalServicio,
    })

    // Limpiar el formulario
    setNombre("")
    setDominio("")
    setArea("")
    setEspacioTrabajo("")
    setPortalServicio("")
  }

  return (
    <>
      <Dialog open={abierto} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Nuevo portal de servicio</DialogTitle>
              <DialogDescription>Complete los datos para crear un nuevo portal de servicio.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre del portal de servicio</Label>
                <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dominio">Dominio</Label>
                <Select value={dominio} onValueChange={setDominio} required>
                  <SelectTrigger id="dominio">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOMINIOS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="area">Área</Label>
                <Select value={area} onValueChange={setArea} required>
                  <SelectTrigger id="area">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {AREAS.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="espacio">Espacio de trabajo</Label>
                <Select value={espacioTrabajo} onValueChange={setEspacioTrabajo} required>
                  <SelectTrigger id="espacio">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESPACIOS.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="portalServicio">Proyecto de servicio</Label>
                <Select
                  value={portalServicio}
                  onValueChange={(value) => {
                    if (value === "nuevo-proyecto") {
                      setNuevoProyectoModalAbierto(true)
                    } else {
                      setPortalServicio(value)
                    }
                  }}
                  required
                >
                  <SelectTrigger id="portalServicio">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {proyectos.map((proyecto) => (
                      <SelectItem key={proyecto.id} value={proyecto.id}>
                        {proyecto.nombre}
                      </SelectItem>
                    ))}
                    <SelectItem value="nuevo-proyecto" className="text-primary font-medium border-t mt-2 pt-2">
                      <div className="flex items-center">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Agregar proyecto a task manager
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <NuevoProyectoModal
        abierto={nuevoProyectoModalAbierto}
        onOpenChange={setNuevoProyectoModalAbierto}
        onProyectoCreado={handleProyectoCreado}
        nombreProyectoSugerido=""
      />
    </>
  )
}

