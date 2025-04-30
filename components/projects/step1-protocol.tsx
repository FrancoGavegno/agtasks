"use client"

import { useFormContext } from "react-hook-form"
import { Check } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Step1FormValues } from "./validation-schemas"

// Datos de ejemplo para los protocolos
const protocolTasks = {
  "variable-seeding": [
    "Análisis de suelo y topografía",
    "Generación de mapas de prescripción",
    "Calibración de maquinaria",
    "Seguimiento de aplicación",
  ],
  "satellite-monitoring": [
    "Monitoreo de lotes utilizando imágenes satelitales",
    "Zonificación del índice",
    "Validación del mapa de zonas con recorrida a campo",
  ],
}

interface Step1ProtocolProps {
  updateTaskAssignments: (protocol: string) => void
}

export default function Step1Protocol({ updateTaskAssignments }: Step1ProtocolProps) {
  const form = useFormContext<Step1FormValues>()
  const protocol = form.watch ? form.watch("protocol") : undefined

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="protocol"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-medium">Seleccione un protocolo</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value)
                  updateTaskAssignments(value)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar protocolo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="variable-seeding">Protocolo Siembra y/o Fertilización Variable</SelectItem>
                  <SelectItem value="satellite-monitoring">Monitoreo satelital y control de malezas</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />

      {protocol && (
        <div className="mt-6 border rounded-md p-4">
          <h4 className="text-sm font-medium mb-2">Tareas que incluye este protocolo</h4>
          <ul className="space-y-2">
            {protocolTasks[protocol as keyof typeof protocolTasks]?.map((task, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5" />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
