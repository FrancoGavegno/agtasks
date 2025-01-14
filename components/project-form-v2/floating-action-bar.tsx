'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FloatingActionBarProps {
  selectedTasks: string[]
  matchFields: string[]
  onClose: () => void
  onUpdateCustomFields: (fieldName: string, value: string) => void
  customFieldsData: Record<string, any[]>
}

export function FloatingActionBar({
  selectedTasks,
  matchFields,
  onClose,
  onUpdateCustomFields,
  customFieldsData,
}: FloatingActionBarProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  if (selectedTasks.length === 0) return null

  const handleSave = () => {
    if (selectedField && selectedValue) {
      onUpdateCustomFields(selectedField, selectedValue)
      setSelectedField(null)
      setSelectedValue(null)
    }
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-background border rounded-lg shadow-lg p-4 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{selectedTasks.length} {selectedTasks.length === 1 ? 'Tarea' : 'Tareas'} seleccionada(s)</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="h-6 w-px bg-border" />
      <div className="flex items-center gap-4">
        <Select onValueChange={setSelectedField} value={selectedField || undefined}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Seleccionar campo" />
          </SelectTrigger>
          <SelectContent>
            {matchFields.map((field) => (
              <SelectItem key={field} value={field}>
                {field.replace('match_', '')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedField && (
          <Select onValueChange={setSelectedValue} value={selectedValue || undefined}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={`Seleccionar ${selectedField.replace('match_', '')}`} />
            </SelectTrigger>
            <SelectContent>
              {customFieldsData[selectedField.replace('match_', '')]?.map((item: any) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <Button onClick={handleSave} disabled={!selectedField || !selectedValue}>Guardar</Button>
    </div>
  )
}

