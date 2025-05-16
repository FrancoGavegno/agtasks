"use client"

import { useFormContext } from "react-hook-form"
import { Check } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import type { Step1FormValues } from "./validation-schemas"
import { useServiceForm } from "@/lib/contexts/service-form-context"
import type { Protocol } from "@/lib/interfaces"

// Define la interfaz TaskAssignment
interface TaskAssignment {
  task: string
  role: string
  assignedTo: string
}

export default function Step1Protocol() {
  const form = useFormContext<Step1FormValues>()
  const { updateFormValues } = useServiceForm()
  const protocol = form.watch ? form.watch("protocol") : undefined
  const params = useParams()
  const projectId = params.project as string
  const domainId = params.domain as string

  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [protocolTasks, setProtocolTasks] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch protocols from the domain
  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/v1/agtasks/domains/${domainId}/protocols`)
        if (!res.ok) {
          throw new Error(`Error fetching protocols: ${res.status}`)
        }
        const data = await res.json()
        const protocolsData = Array.isArray(data) ? data : []
        setProtocols(protocolsData)
      } catch (err) {
        console.error("Failed to fetch protocols:", err)
        setError("Failed to load protocols. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (domainId) {
      fetchProtocols()
    }
  }, [domainId])

  // Definir la función fetchProtocolTasks fuera de los useEffect
  const fetchProtocolTasks = async (protocolId: string) => {
    try {
      // Use the correct API endpoint with parameters from the URL
      const response = await fetch(
        `/api/v1/integrations/jira/domains/${domainId}/projects/${projectId}/services/${protocolId}/tasks`,
      )

      if (!response.ok) {
        throw new Error(`Error fetching tasks: ${response.status}`)
      }

      const data = await response.json()

      // Extract tasks from the response
      if (data && data.success && data.data) {
        // Extract task names from the response
        const tasks = data.data.subtasks?.map((task: any) => task.summary) || []

        // Update the protocol tasks state
        setProtocolTasks((prev) => ({
          ...prev,
          [protocolId]: tasks,
        }))

        return tasks
      }
      return []
    } catch (err) {
      console.error(`Failed to fetch tasks for protocol ${protocolId}:`, err)
      setError(`Failed to load tasks for the selected protocol. Please try again later.`)
      return []
    }
  }

  // Fetch tasks for the selected protocol
  useEffect(() => {
    if (protocol && domainId && projectId) {
      // Only fetch if we don't already have the tasks for this protocol
      if (!protocolTasks[protocol]) {
        fetchProtocolTasks(protocol)
      }
    }
  }, [protocol, domainId, projectId, protocolTasks])

  // Update form values in context and task assignments when protocol changes
  const handleProtocolChange = async (value: string) => {
    form.setValue("protocol", value as any)

    // Actualizar task assignments basado en el protocolo seleccionado
    if (value) {
      // Si ya tenemos las tareas para este protocolo, usarlas inmediatamente
      if (protocolTasks[value]) {
        const tasks = protocolTasks[value]
        const newAssignments: TaskAssignment[] = tasks.map((task: string) => ({
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
      } else {
        // Si no tenemos las tareas, hacer la petición y luego actualizar
        const tasks = await fetchProtocolTasks(value)
        if (tasks && tasks.length > 0) {
          const newAssignments: TaskAssignment[] = tasks.map((task: string) => ({
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
    }
  }

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="protocol"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-medium">Seleccione un protocolo</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={handleProtocolChange} disabled={loading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loading ? "Cargando protocolos..." : "Seleccionar protocolo"} />
                </SelectTrigger>
                <SelectContent>
                  {protocols.length > 0 ? (
                    protocols.map((protocol) => (
                      <SelectItem key={protocol.id} value={protocol.tmProtocolId}>
                        {protocol.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-protocols" disabled>
                      No hay protocolos disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage className="text-red-500" />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </FormItem>
        )}
      />

      {protocol && protocolTasks[protocol] && protocolTasks[protocol].length > 0 ? (
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
      ) : (
        protocol && (
          <div className="mt-6 border rounded-md p-4 text-center text-gray-500">
            <p>No hay tareas disponibles para este protocolo</p>
          </div>
        )
      )}
    </div>
  )
}
