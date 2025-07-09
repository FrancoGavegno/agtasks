"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { createDomainForm, deleteDomainForm } from '@/lib/services/agtasks'
import type { Form } from "@/lib/interfaces"
import { listDomainForms } from "@/lib/services/agtasks"

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  forms: Form[]
  allForms: Form[]
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
      // console.log("Guardando preferencias de formularios:", { localSelected, selectedForms })

      // 1. Identificar formularios que deben eliminarse
      const formsToDeleteIds = selectedForms.filter((formId) => !localSelected.includes(formId))

      // 2. Identificar formularios que deben crearse
      const formsToCreate = localSelected.filter((formId) => !forms.some((form) => form.id === formId))

      // console.log("Formularios a eliminar:", formsToDeleteIds)
      // console.log("Formularios a crear:", formsToCreate)

      // 3. Eliminar formularios deseleccionados
      const deletePromises = formsToDeleteIds.map(async (formId) => {
        try {
          await deleteDomainForm(domain, formId)
        } catch (error) {
          console.error(`Error al eliminar formulario ${formId}:`, error)
          toast({
            title: "Error",
            description: `No se pudo eliminar el formulario: ${(error as Error).message}`,
            variant: "destructive",
          })
          throw error
        }
      })

      // 4. Crear nuevos formularios
      const createPromises = formsToCreate.map(async (formId) => {
        const formData = allForms.find((form) => form.id === formId)

        if (!formData) {
          throw new Error(`No se encontraron datos para el formulario ${formId}`)
        }

        try {
          await createDomainForm(domain, {
            name: formData.name,
            language: formData.language || "ES",
            ktFormId: formData.ktFormId || formData.id,
          })
        } catch (error) {
          console.error(`Error al crear formulario ${formId}:`, error)
          toast({
            title: "Error",
            description: `No se pudo crear el formulario: ${(error as Error).message}`,
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
      toast({
        title: "Error",
        description: "Hubo un problema al guardar las preferencias de formularios",
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
              const existingForm = forms.find((f) => f.ktFormId === form.ktFormId || f.ktFormId === form.id)

              // If it exists, use its ID for checking selection
              const checkId = existingForm ? existingForm.id : form.id

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
