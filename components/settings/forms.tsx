"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormModal } from "./form-modal"

interface Form {
  id: string
  name: string
  questions: number
}

export default function Forms() {
  const [forms] = useState<Form[]>([
    { id: "1", name: "Control de Cosecha", questions: 14 },
    { id: "2", name: "Control de Emergencia", questions: 10 },
    { id: "3", name: "Estado de Cultivos", questions: 10 },
    { id: "4", name: "Estimacion de Rindes", questions: 12 },
    { id: "5", name: "Muestreos Simplificado", questions: 8 },
    { id: "6", name: "Plagas y Enfermedades", questions: 13 },
  ])

  // Initialize selectedForms with all form IDs
  const [selectedForms, setSelectedForms] = useState<string[]>(forms.map((f) => f.id))

  const [filter, setFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter forms by name and only show selected ones
  const filteredForms = forms
    .filter((form) => selectedForms.includes(form.id))
    .filter((form) => form.name.toLowerCase().includes(filter.toLowerCase()))

  const handleSavePreferences = (selectedIds: string[]) => {
    setSelectedForms(selectedIds)
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5">
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight">Forms</h2>
          <p className="text-muted-foreground">Manage data collection forms</p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          Edit
        </Button>
      </div>

      <div className="mb-5">
        <Input
          placeholder="Filter forms..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-full"
        />
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-12 items-center px-4 py-3 bg-muted/50 text-sm">
          <div className="col-span-9 font-medium">Name</div>
          <div className="col-span-3 font-medium text-center">Questions</div>
        </div>

        {filteredForms.length > 0 ? (
          filteredForms.map((form) => (
            <div key={form.id} className="grid grid-cols-12 items-center px-4 py-3 border-t text-sm">
              <div className="col-span-9 font-medium">{form.name}</div>
              <div className="col-span-3 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground">
                  {form.questions}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">No forms found.</div>
        )}
      </div>

      <div className="flex items-center justify-end mt-4 text-sm text-muted-foreground">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        forms={forms}
        selectedForms={selectedForms}
        onSave={handleSavePreferences}
      />
    </div>
  )
}
