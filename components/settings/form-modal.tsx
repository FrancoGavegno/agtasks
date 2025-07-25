"use client"

import { 
  useState, 
  useEffect 
} from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { 
  apiClient,
  type DomainForm
} from "@/lib/integrations/amplify"

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  forms: DomainForm[]
  allForms: DomainForm[]
  selectedForms: string[]
  onSave: (selectedIds: string[]) => void
}

export function FormModal({ isOpen, onClose, forms, allForms, selectedForms, onSave }: FormModalProps) {
  const { domain } = useParams<{ domain: string }>()
  const [localSelected, setLocalSelected] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelected([...selectedForms])
      setSearchTerm("")
    }
  }, [isOpen, selectedForms])

  const toggleForm = (id: string) => {
    setLocalSelected((prev) => {
      const newSelected = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
      return newSelected
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // console.log("=== DEBUG FORM MODAL ===")
      // console.log("localSelected:", localSelected)
      // console.log("selectedForms:", selectedForms)
      // console.log("forms:", forms)
      // console.log("allForms:", allForms)

      // 1. Identificar formularios que deben eliminarse
      const formsToDeleteKtFormIds = selectedForms.filter((formId) => !localSelected.includes(formId))

      // Mapear ktFormId a id usando forms (los DomainForm asociados)
      const formsToDelete = formsToDeleteKtFormIds
        .map((ktFormId) => {
          const form = forms.find((f) => f.ktFormId === ktFormId)
          if (form) {
            return { ktFormId, id: form.id }
          }
          console.warn(`No se encontró DomainForm para ktFormId ${ktFormId}`)
          return null
        })
        .filter((item): item is { ktFormId: string; id: string } => item !== null)

      // 2. Identificar formularios que deben crearse
      const formsToCreate = localSelected.filter(
        (ktFormId) => !forms.some((form) => form.ktFormId === ktFormId),
      )

      // console.log("Formularios a eliminar:", formsToDelete)
      // console.log("Formularios a crear:", formsToCreate)

      // 3. Eliminar formularios deseleccionados
      const deletePromises = formsToDelete.map(async ({ id }) => {
        try {
          await apiClient.deleteDomainForm(id)
        } catch (error) {
          console.error(`Error al eliminar formulario ${id}:`, error)
          let errorMessage = "Error desconocido"
          if (error instanceof Error) {
            errorMessage = error.message
          } else if (typeof error === 'string') {
            errorMessage = error
          }
          toast({
            title: "Error",
            description: `No se pudo eliminar el formulario: ${errorMessage}`,
            variant: "destructive",
          })
          throw error
        }
      })

             // 4. Crear nuevos formularios
       const createPromises = formsToCreate.map(async (ktFormId) => {
         // console.log(`Buscando formulario con ktFormId: ${ktFormId}`)
         // Buscar por ktFormId, no por id
         const formData = allForms.find((form) => form.ktFormId === ktFormId)
         // console.log("formData encontrado:", formData)

         if (!formData) {
           // console.log("allForms disponibles:", allForms.map(f => ({ name: f.name, ktFormId: f.ktFormId, id: f.id })))
           throw new Error(`No se encontraron datos para el formulario ${ktFormId}`)
         }

        // Validar que todos los campos requeridos estén presentes
        if (!domain) {
          throw new Error("Domain ID is required")
        }
        if (!formData.name) {
          throw new Error("Form name is required")
        }
        if (!formData.ktFormId && !formData.id) {
          throw new Error("Kobo Toolbox Form ID is required")
        }

                 const formDataToCreate = {
           domainId: domain,
           name: formData.name,
           language: formData.language || "ES",
           ktFormId: formData.ktFormId,
         }
         // console.log("formDataToCreate:", formDataToCreate)

         try {
           // console.log(`Intentando crear DomainForm con ktFormId: ${ktFormId}`)
           await apiClient.createDomainForm(formDataToCreate)
           // console.log(`DomainForm creado exitosamente con ktFormId: ${ktFormId}`)
        } catch (error) {
          console.error(`Error al crear formulario ${ktFormId}:`, error)
          let errorMessage = "Error desconocido"
          if (error instanceof Error) {
            errorMessage = error.message
          } else if (typeof error === 'string') {
            errorMessage = error
          }
          toast({
            title: "Error",
            description: `No se pudo crear el formulario: ${errorMessage}`,
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
        description: "Preferencias de formularios guardadas correctamente",
      })

      onSave(localSelected)
      onClose()
    } catch (error) {
      console.error("Error al procesar formularios:", error)
      let errorMessage = "Hubo un problema al guardar las preferencias de formularios"
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Filter forms based on search term
  const filteredForms = allForms.filter((form) => form.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Formularios</DialogTitle>
            <DialogDescription>Selecciona los formularios que deseas mostrar.</DialogDescription>
          </div>
        </DialogHeader>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar formularios..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

                 <div className="space-y-4 py-2 max-h-[300px] overflow-y-auto pr-2">
           {filteredForms.length > 0 ? (
             filteredForms.map((form) => {
               // Check if this form is already in the domain forms list
               const existingForm = forms.find((f) => f.ktFormId === form.ktFormId)

               // Use ktFormId for selection since selectedForms contains ktFormId
               const checkId = form.ktFormId

               return (
                 <div key={form.id} className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <div className="text-sm text-foreground">{form.name}</div>
                     {form.language && <div className="text-xs text-muted-foreground">{form.language}</div>}
                   </div>
                   <Switch checked={localSelected.includes(checkId)} onCheckedChange={() => toggleForm(checkId)} />
                 </div>
               )
             })
           ) : (
             <div className="text-center py-4 text-sm text-muted-foreground">No se encontraron formularios.</div>
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
