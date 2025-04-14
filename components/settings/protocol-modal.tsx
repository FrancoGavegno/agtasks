"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

interface Protocol {
  id: string
  name: string
  language: "PT" | "EN" | "ES"
}

interface ModalProtocolsProps {
  isOpen: boolean
  onClose: () => void
  protocols: Protocol[]
  selectedProtocols: string[]
  onSave: (selectedIds: string[]) => void
}

export function ModalProtocols({ isOpen, onClose, protocols, selectedProtocols, onSave }: ModalProtocolsProps) {
  const [localSelected, setLocalSelected] = useState<string[]>([])

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelected([...selectedProtocols])
    }
  }, [isOpen, selectedProtocols])

  const toggleProtocol = (id: string) => {
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
            <DialogTitle>Protocolos</DialogTitle>
            <DialogDescription>Indica qué protocolos usará tu dominio.</DialogDescription>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {protocols.map((protocol) => (
            <div key={protocol.id} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">{protocol.name}</div>
                <div className="text-xs text-muted-foreground">{protocol.language}</div>
              </div>
              <Switch
                checked={localSelected.includes(protocol.id)}
                onCheckedChange={() => toggleProtocol(protocol.id)}
              />
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
