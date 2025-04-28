"use client"

import { useFormContext } from "react-hook-form"
import { Check } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Step1FormValues } from "./validation-schemas"
import { useServiceForm } from "@/lib/contexts/service-form-context"

export default function Step1Protocol() {
  const form = useFormContext<Step1FormValues>()
  const { protocolTasks, updateFormValues } = useServiceForm()
  const protocol = form.watch ? form.watch("protocol") : undefined

  // Update form values in context and task assignments when protocol changes
  const handleProtocolChange = (value: string) => {
    form.setValue("protocol", value as any)

    // Update task assignments based on selected protocol
    if (value && protocolTasks[value]) {
      const tasks = protocolTasks[value]
      const newAssignments = tasks.map((task) => ({
        task,
        role: "",
        assignedTo: "",
      }))

      form.setValue("taskAssignments", newAssignments)

      // Update context
      updateFormValues({
        protocol: value as any,
        taskAssignments: newAssignments,
      })
    }
  }

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="protocol"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-medium">Seleccione un protocolo a aplicar</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={handleProtocolChange}>
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

      {protocol && protocolTasks[protocol] && (
        <div className="mt-6 border rounded-md p-4">
          <h4 className="text-sm font-medium mb-2">Tareas que incluye este protocolo</h4>
          <ul className="space-y-2">
            {protocolTasks[protocol]?.map((task, index) => (
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
