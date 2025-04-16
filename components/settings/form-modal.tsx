"use client"

import { useState, useEffect } from "react"
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
  selectedForms: string[]
  onSave: (selectedIds: string[]) => void
}

export function FormModal({ isOpen, onClose, forms, selectedForms, onSave }: FormModalProps) {
  const [localSelected, setLocalSelected] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelected([...selectedForms])
      setSearchTerm("")
    }
  }, [isOpen, selectedForms])

  const toggleForm = (id: string) => {
    setLocalSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const handleSave = () => {
    onSave(localSelected)
    onClose()
  }

  // Filter forms based on search term
  const filteredForms = forms.filter(
    (form) =>
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) || form.questions.toString().includes(searchTerm),
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
            filteredForms.map((form) => (
              <div key={form.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm text-foreground">{form.name}</div>
                  <div className="text-xs text-muted-foreground">{form.questions} preguntas</div>
                </div>
                <Switch checked={localSelected.includes(form.id)} onCheckedChange={() => toggleForm(form.id)} />
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">No se encontraron formularios.</div>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <Button onClick={handleSave}>Guardar preferencias</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
