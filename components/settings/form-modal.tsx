"use client"

import { useState, useEffect } from "react"
import { useParams } from 'next/navigation'
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import type { Form } from "@/lib/interfaces"

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  forms: Form[]
  allForms: Form[]
  selectedForms: string[]
  onSave: (selectedIds: string[]) => void
}

export function FormModal({ isOpen, onClose, forms, allForms, selectedForms, onSave }: FormModalProps) {
  const { domain } = useParams<{ domain: string }>();
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
    setIsSaving(true) // Deshabilitar el botón mientras se ejecuta
    try {
      // 1. Identificar formularios que deben eliminarse
      // (id que ya no están seleccionados)
      const formsToDeleteIds = selectedForms.filter((formId) => !localSelected.includes(formId))

      // 2. Identificar formularios que deben crearse (id que no están en forms)
      const formsToCreate = localSelected.filter((formId) => !forms.some((form) => form.id === formId))

      // 3. Eliminar formularios deseleccionados usando el id del DomainForm
      const deletePromises = formsToDeleteIds.map(async (formId) => {
        const response = await fetch(`/api/v1/agtasks/domains/${domain}/forms/${formId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error(`Error en DELETE para id ${formId}:`, errorData)
          throw new Error(`Failed to delete form with id ${formId}`)
        }

        const data = await response.json()
        return data
      })

      // 4. Crear nuevos formularios
      const createPromises = formsToCreate.map(async (formId) => {
        const formData = allForms.find((form) => form.id === formId)

        if (!formData) {
          throw new Error(`Form data not found for id ${formId}`)
        }

        const response = await fetch(`/api/v1/agtasks/domains/${domain}/forms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            language: formData.language || "ES",
            ktFormId: formData.ktFormId || formData.id,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error(`Error en POST para id ${formId}:`, errorData)
          throw new Error(`Failed to create form with id ${formId}`)
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
      console.error("Error processing forms:", error)
    } finally {
      setIsSaving(false) // Rehabilitar el botón cuando termine (incluso si hay error)
    }
  }

  // Filter forms based on search term
  const filteredForms = allForms.filter(
    (form) => form.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

              // If it exists, use its ID for checking selection
              const checkId = existingForm ? existingForm.id : form.id

              return (
                <div key={form.id} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm text-foreground">{form.name}</div>
                    <div className="text-xs text-muted-foreground">{form.language || "es"}</div>
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
