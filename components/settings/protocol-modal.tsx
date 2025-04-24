"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Protocol } from "@/lib/interfaces"

interface ModalProtocolsProps {
  isOpen: boolean
  onClose: () => void
  protocols: Protocol[]
  selectedProtocols: string[]
  onSave: (selectedIds: string[]) => void
}

export function ModalProtocols({ isOpen, onClose, protocols, selectedProtocols, onSave }: ModalProtocolsProps) {
  const [localSelected, setLocalSelected] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelected([...selectedProtocols])
      setSearchTerm("")
    }
  }, [isOpen, selectedProtocols])

  const toggleProtocol = (id: string) => {
    setLocalSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const handleSave = async () => {
    try {
      // Hacer una solicitud DELETE por cada ID en localSelected
      const deletePromises = localSelected.map(async (protocolId) => {
        const response = await fetch(`/api/domain-protocol?protocolId=${protocolId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Failed to delete protocol with ID ${protocolId}`);
        }

        return response.json();
      });

      // Esperar a que todas las solicitudes DELETE se completen
      await Promise.all(deletePromises);

      // Llamar a onSave y cerrar el modal si todo sale bien
      onSave(localSelected);
      onClose();
    } catch (error) {
      console.error("Error deleting protocols:", error);
      // Opcional: Mostrar un mensaje de error al usuario aquí
      // Por ejemplo, podrías usar una notificación o un estado para mostrar el error
    }
  };

  // Filter protocols based on search term
  const filteredProtocols = protocols.filter(
    (protocol) =>
      protocol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      protocol.language.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Protocolos</DialogTitle>
            <DialogDescription>Indica qué protocolos usará tu dominio.</DialogDescription>
          </div>
        </DialogHeader>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar protocolos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4 py-2 max-h-[300px] overflow-y-auto pr-2">
          {filteredProtocols.length > 0 ? (
            filteredProtocols.map((protocol) => (
              <div key={protocol.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm text-foreground">{protocol.id} {protocol.name}</div>
                  <div className="text-xs text-muted-foreground">{protocol.language}</div>
                </div>
                <Switch
                  checked={localSelected.includes(protocol.tmProtocolId)}
                  onCheckedChange={() => toggleProtocol(protocol.tmProtocolId)}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">No se encontraron protocolos.</div>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <Button onClick={handleSave}>Guardar preferencias</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}