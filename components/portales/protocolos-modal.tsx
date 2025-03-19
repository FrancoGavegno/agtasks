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

// Lista de protocolos de ejemplo con idiomas
const PROTOCOLOS = [
  { id: "Monitoreo satelital y control de malezas", nombre: "Monitoreo satelital y control de malezas", idioma: "ES" },
  { id: "Variable rate recommendations & applications", nombre: "Variable rate recommendations & applications", idioma: "EN" },
  { id: "Digitalização de Estabelecimentos e Lotes", nombre: "Digitalização de Estabelecimentos e Lotes", idioma: "PT" },
  { id: "Protocolo Siembra y/o Fertilización Variable", nombre: "Protocolo Siembra y/o Fertilización Variable", idioma: "ES" },
  { id: "Weed Control", nombre: "Weed Control", idioma: "EN" },
  { id: "Monitoramento Satelital", nombre: "Monitoramento Satelital", idioma: "PT" },
]

interface ProtocolosModalProps {
  abierto: boolean
  onOpenChange: (open: boolean) => void
  protocolosSeleccionados: string[]
  onGuardar: (protocolos: string[]) => void
}

export function ProtocolosModal({ abierto, onOpenChange, protocolosSeleccionados, onGuardar }: ProtocolosModalProps) {
  const [filtro, setFiltro] = useState("")
  const [seleccion, setSeleccion] = useState<string[]>([])

  // Inicializar la selección con los protocolos ya seleccionados
  useEffect(() => {
    setSeleccion(protocolosSeleccionados)
  }, [protocolosSeleccionados, abierto])

  // Filtrar protocolos según el texto de búsqueda
  const protocolosFiltrados = PROTOCOLOS.filter(
    (protocolo) =>
      protocolo.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      protocolo.idioma.toLowerCase().includes(filtro.toLowerCase()),
  )

  // Manejar la selección/deselección de un protocolo
  const toggleProtocolo = (protocoloId: string) => {
    setSeleccion((prevSeleccion) => {
      if (prevSeleccion.includes(protocoloId)) {
        return prevSeleccion.filter((p) => p !== protocoloId)
      } else {
        return [...prevSeleccion, protocoloId]
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
          <DialogTitle>Seleccionar Protocolos</DialogTitle>
          <DialogDescription>Seleccione los protocolos que desea asociar a este portal de servicio.</DialogDescription>
        </DialogHeader>

        <div className="relative my-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filtrar protocolos..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto pr-1">
          {protocolosFiltrados.length > 0 ? (
            <div className="space-y-4">
              {protocolosFiltrados.map((protocolo) => (
                <div key={protocolo.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor={`protocolo-${protocolo.id}`} className="cursor-pointer">
                      {protocolo.nombre}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">{protocolo.idioma}</p>
                  </div>
                  <Switch
                    id={`protocolo-${protocolo.id}`}
                    checked={seleccion.includes(protocolo.id)}
                    onCheckedChange={() => toggleProtocolo(protocolo.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">No se encontraron protocolos con ese filtro.</p>
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

