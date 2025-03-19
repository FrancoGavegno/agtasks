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
import { Search } from "lucide-react"
import { Switch } from "@/components/ui/switch"

// Lista de formularios KoboToolbox de ejemplo
const FORMULARIOS = [
  { id: "form1", nombre: "Formulario de Registro de Beneficiarios" },
  { id: "form2", nombre: "Encuesta de Satisfacción" },
  { id: "form3", nombre: "Evaluación de Necesidades" },
  { id: "form4", nombre: "Monitoreo de Actividades" },
  { id: "form5", nombre: "Registro de Incidentes" },
  { id: "form6", nombre: "Evaluación Post-Distribución" },
  { id: "form7", nombre: "Formulario de Consentimiento" },
  { id: "form8", nombre: "Evaluación de Vulnerabilidad" },
  { id: "form9", nombre: "Registro de Asistencia" },
  { id: "form10", nombre: "Formulario de Seguimiento" },
]

interface FormulariosModalProps {
  abierto: boolean
  onOpenChange: (open: boolean) => void
  formulariosSeleccionados: string[]
  onGuardar: (formularios: string[]) => void
}

export function FormulariosModal({
  abierto,
  onOpenChange,
  formulariosSeleccionados,
  onGuardar,
}: FormulariosModalProps) {
  const [filtro, setFiltro] = useState("")
  const [seleccion, setSeleccion] = useState<string[]>([])

  // Inicializar la selección con los formularios ya seleccionados
  useEffect(() => {
    setSeleccion(formulariosSeleccionados)
  }, [formulariosSeleccionados, abierto])

  // Filtrar formularios según el texto de búsqueda
  const formulariosFiltrados = FORMULARIOS.filter((formulario) =>
    formulario.nombre.toLowerCase().includes(filtro.toLowerCase()),
  )

  // Manejar la selección/deselección de un formulario
  const toggleFormulario = (formularioId: string) => {
    setSeleccion((prevSeleccion) => {
      if (prevSeleccion.includes(formularioId)) {
        return prevSeleccion.filter((id) => id !== formularioId)
      } else {
        return [...prevSeleccion, formularioId]
      }
    })
  }

  // Guardar la selección y cerrar el modal
  const handleGuardar = () => {
    onGuardar(seleccion)
    onOpenChange(false)
  }

  return (
    <Dialog open={abierto} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Seleccionar Formularios KoboToolbox</DialogTitle>
          <DialogDescription>Seleccione los formularios que desea asociar a este portal de servicio.</DialogDescription>
        </DialogHeader>

        <div className="relative my-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filtrar formularios..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto pr-1">
          {formulariosFiltrados.length > 0 ? (
            <div className="space-y-4">
              {formulariosFiltrados.map((formulario) => (
                <div key={formulario.id} className="flex items-center justify-between">
                  <Label htmlFor={`formulario-${formulario.id}`} className="flex-1 cursor-pointer">
                    {formulario.nombre}
                  </Label>
                  <Switch
                    id={`formulario-${formulario.id}`}
                    checked={seleccion.includes(formulario.id)}
                    onCheckedChange={() => toggleFormulario(formulario.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">No se encontraron formularios con ese filtro.</p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleGuardar}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

