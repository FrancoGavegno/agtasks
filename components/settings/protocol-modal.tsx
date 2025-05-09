"use client"

import { useState, useEffect } from "react"
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Protocol } from "@/lib/interfaces"

interface ModalProtocolsProps {
  isOpen: boolean
  onClose: () => void
  protocols: Protocol[]
  allProtocols: Protocol[]
  selectedProtocols: string[]
  onSave: (selectedIds: string[]) => void
}

export function ModalProtocols({
  isOpen,
  onClose,
  protocols,
  allProtocols,
  selectedProtocols,
  onSave,
}: ModalProtocolsProps) {
  const { domain } = useParams<{ domain: string }>();
  const [localSelected, setLocalSelected] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelected([...selectedProtocols])
      setSearchTerm("")
    }
  }, [isOpen, selectedProtocols])

  const toggleProtocol = (id: string) => {
    setLocalSelected((prev) => {
      const newSelected = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
      return newSelected
    })
  }

  const handleSave = async () => {
    setIsSaving(true) // Deshabilitar el botón mientras se ejecuta
    try {
      // 1. Identificar protocolos que deben eliminarse
      // (tmProtocolId que ya no están seleccionados)
      const protocolsToDeleteTmProtocolIds = selectedProtocols.filter(
        (protocolId) => !localSelected.includes(protocolId),
      )

      // Mapear tmProtocolId a id usando protocols (los DomainProtocol asociados)
      const protocolsToDelete = protocolsToDeleteTmProtocolIds
        .map((tmProtocolId) => {
          const protocol = protocols.find((p) => p.tmProtocolId === tmProtocolId)
          if (protocol) {
            return { tmProtocolId, id: protocol.id }
          }
          console.warn(`No se encontró DomainProtocol para tmProtocolId ${tmProtocolId}`)
          return null
        })
        .filter((item): item is { tmProtocolId: string; id: string } => item !== null)

      // 2. Identificar protocolos que deben crearse (tmProtocolId que no están en protocols)
      const protocolsToCreate = localSelected.filter(
        (protocolId) => !protocols.some((protocol) => protocol.tmProtocolId === protocolId),
      )

      // 3. Eliminar protocolos deseleccionados usando el id del DomainProtocol
      const deletePromises = protocolsToDelete.map(async ({ tmProtocolId, id }) => {
        //const response = await fetch(`/api/domain-protocol?protocolId=${id}`, {
        const response = await fetch(`/api/v1/agtasks/domains/${domain}/protocols/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error(`Error en DELETE para id ${id}:`, errorData)
          throw new Error(`Failed to delete protocol with id ${id}`)
        }

        const data = await response.json()
        return data
      })

      // 4. Crear nuevos protocolos
      const createPromises = protocolsToCreate.map(async (protocolId) => {
        const protocolData = allProtocols.find((protocol) => protocol.tmProtocolId === protocolId)

        if (!protocolData) {
          throw new Error(`Protocol data not found for tmProtocolId ${protocolId}`)
        }

        //const response = await fetch("/api/domain-protocol", {
        const response = await fetch(`/api/v1/agtasks/domains/${domain}/protocols`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            domainId: "dd8ae98f-2231-444e-8daf-120a4c416d15",
            tmProtocolId: protocolData.tmProtocolId,
            name: protocolData.name,
            language: protocolData.language,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error(`Error en POST para tmProtocolId ${protocolId}:`, errorData)
          throw new Error(`Failed to create protocol with tmProtocolId ${protocolId}`)
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
      console.error("Error processing protocols:", error)
    } finally {
      setIsSaving(false) // Rehabilitar el botón cuando termine (incluso si hay error)
    }
  }

  // Filter protocols based on search term
  const filteredProtocols = allProtocols.filter(
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
                  <div className="text-sm text-foreground">{protocol.name}</div>
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
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Guardando preferencias..." : "Guardar preferencias"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
