"use client"

import { 
  useState, 
  useEffect 
} from "react"
import { useParams } from "next/navigation"
import { useTranslations } from 'next-intl'
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
import { toast } from "@/hooks/use-toast"
import { 
  apiClient, 
  type DomainProtocol 
} from "@/lib/integrations/amplify"

interface ModalProtocolsProps {
  isOpen: boolean
  onClose: () => void
  protocols: DomainProtocol[]
  allProtocols: DomainProtocol[]
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
  const t = useTranslations("ProtocolModal")
  const { domain } = useParams<{ domain: string }>()
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
          // console.warn(`No se encontró DomainProtocol para tmProtocolId ${tmProtocolId}`)
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
          await apiClient.deleteDomainProtocol(id)
        } catch (error) {
          // console.error(`Error al eliminar protocolo ${id}:`, error)
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
          await apiClient.createDomainProtocol({
            domainId: domain,
            tmProtocolId: protocolData.tmProtocolId,
            name: protocolData.name,
            language: protocolData.language || "ES",
          })
        } catch (error) {
          // console.error(`Error al crear protocolo ${protocolId}:`, error)
          let errorMessage = "Error desconocido"
          if (error instanceof Error) {
            errorMessage = error.message
          } else if (typeof error === 'string') {
            errorMessage = error
          }
          toast({
            title: "Error",
            description: `No se pudo crear el protocolo: ${errorMessage}`,
            variant: "destructive",
          })
          throw error
        }
      })

      // 5. Ejecutar todas las operaciones en paralelo
      await Promise.all([...deletePromises, ...createPromises])

      // 6. Notificar éxito y cerrar modal
      toast({
        title: t("successTitle"),
        description: t("successMessage"),
      })

      // Llamar a onSave con los IDs seleccionados
      // console.log("Calling onSave with:", localSelected)
      onSave(localSelected)
      onClose()
    } catch (error) {
      // console.error("Error al procesar protocolos:", error)
      let errorMessage = t("errorMessage")
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      toast({
        title: t("errorTitle"),
        description: errorMessage,
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
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4 py-2 max-h-[300px] overflow-y-auto pr-2">
          {filteredProtocols.length > 0 ? (
            filteredProtocols.map((protocol) => (
              <div key={protocol.tmProtocolId} className="flex items-center justify-between">
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
            <div className="text-center py-4 text-sm text-muted-foreground">{t("noProtocolsFound")}</div>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? t("savingPreferences") : t("savePreferences")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
