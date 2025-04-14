"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

interface Form {
  id: string
  name: string
  questions: number
}

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  forms: Form[]
  selectedForms: string[]
  onSave: (selectedIds: string[]) => void
}

export function FormModal({ isOpen, onClose, forms, selectedForms, onSave }: FormModalProps) {
  const [localSelected, setLocalSelected] = useState<string[]>([])

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelected([...selectedForms])
    }
  }, [isOpen, selectedForms])

  const toggleForm = (id: string) => {
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
            <DialogTitle>Formularios</DialogTitle>
            <DialogDescription>Selecciona los formularios que deseas mostrar.</DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {forms.map((form) => (
            <div key={form.id} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">{form.name}</div>
                <div className="text-xs text-muted-foreground">{form.questions} preguntas</div>
              </div>
              <Switch checked={localSelected.includes(form.id)} onCheckedChange={() => toggleForm(form.id)} />
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
