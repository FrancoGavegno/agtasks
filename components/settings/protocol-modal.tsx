"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { Protocol } from "@/lib/interfaces"
import { listDomainProtocols } from "@/lib/services/agtasks"

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
  const { domain } = useParams<{ domain: string }>()
  const [localSelected, setLocalSelected] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      // console.log("Modal opened with selected protocols:", selectedProtocols)
      setLocalSelected([...selectedProtocols])
      setSearchTerm("")
    }
  }, [isOpen, selectedProtocols])

  const toggleProtocol = (id: string) => {
    setLocalSelected((prev) => {
      const newSelected = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
      // console.log(`Toggled protocol ${id}, new selection:`, newSelected)
      return newSelected
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // console.log("Saving protocols with local selection:", localSelected)
      // console.log("Current protocols:", protocols)

      // 1. Identificar protocolos que deben eliminarse
      const protocolsToDeleteTmProtocolIds = selectedProtocols.filter(
        (protocolId) => !localSelected.includes(protocolId),
      )
      // console.log("Protocols to delete:", protocolsToDeleteTmProtocolIds)

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

      // console.log("Mapped protocols to delete:", protocolsToDelete)

      // 2. Identificar protocolos que deben crearse
      const protocolsToCreate = localSelected.filter(
        (protocolId) => !protocols.some((protocol) => protocol.tmProtocolId === protocolId),
      )
      // console.log("Protocols to create:", protocolsToCreate)

      // 3. Eliminar protocolos deseleccionados
      const deletePromises = protocolsToDelete.map(async ({ id }) => {
        try {
          // console.log(`Deleting protocol with id ${id}`)
          const response = await fetch(`/api/v1/agtasks/domains/${domain}/protocols/${id}`, {
            method: "DELETE",
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error(`Error al eliminar protocolo ${id}:`, errorData)
            throw new Error(`Error al eliminar protocolo: ${errorData.message || response.statusText}`)
          }

          return await response.json()
        } catch (error) {
          console.error(`Error al eliminar protocolo ${id}:`, error)
          toast({
            title: "Error",
            description: `No se pudo eliminar el protocolo: ${(error as Error).message}`,
            variant: "destructive",
          })
          throw error
        }
      })

      // 4. Crear nuevos protocolos
      const createPromises = protocolsToCreate.map(async (protocolId) => {
        const protocolData = allProtocols.find((protocol) => protocol.tmProtocolId === protocolId)

        if (!protocolData) {
          throw new Error(`No se encontraron datos para el protocolo ${protocolId}`)
        }

        try {
          // console.log(`Creating protocol with tmProtocolId ${protocolId}`, protocolData)
          const response = await fetch(`/api/v1/agtasks/domains/${domain}/protocols`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              domainId: domain,
              tmProtocolId: protocolData.tmProtocolId,
              name: protocolData.name,
              language: protocolData.language || "ES",
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error(`Error al crear protocolo ${protocolId}:`, errorData)
            throw new Error(`Error al crear protocolo: ${errorData.message || response.statusText}`)
          }

          const result = await response.json()
          // console.log(`Protocol created successfully:`, result)
          return result
        } catch (error) {
          console.error(`Error al crear protocolo ${protocolId}:`, error)
          toast({
            title: "Error",
            description: `No se pudo crear el protocolo: ${(error as Error).message}`,
            variant: "destructive",
          })
          throw error
        }
      })

      // 5. Ejecutar todas las operaciones en paralelo
      await Promise.all([...deletePromises, ...createPromises])

      // 6. Notificar éxito y cerrar modal
      toast({
        title: "Éxito",
        description: "Preferencias de protocolos guardadas correctamente",
      })

      // Llamar a onSave con los IDs seleccionados
      // console.log("Calling onSave with:", localSelected)
      onSave(localSelected)
      onClose()
    } catch (error) {
      console.error("Error al procesar protocolos:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al guardar las preferencias de protocolos",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Filter protocols based on search term
  const filteredProtocols = allProtocols.filter(
    (protocol) =>
      protocol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (protocol.language && protocol.language.toLowerCase().includes(searchTerm.toLowerCase())),
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
