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

export default function Step1Protocol() {
  const form = useFormContext<Step1FormValues>()
  const { updateFormValues } = useServiceForm()
  const protocol = form.watch ? form.watch("protocol") : undefined
  const params = useParams()
  const projectId = params.project as string
  const domainId = "8644" // Hardcoded for now, could be extracted from params or context

  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [protocolTasks, setProtocolTasks] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch protocols from the domain
  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/v1/agtasks/domains/${domainId}/protocols`)

        if (!response.ok) {
          throw new Error(`Error fetching protocols: ${response.status}`)
        }

        const data = await response.json()
        if (data && data.data) {
          setProtocols(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch protocols:", err)
        setError("Failed to load protocols. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProtocols()
  }, [domainId])

  // Fetch tasks for the selected protocol
  useEffect(() => {
    const fetchProtocolTasks = async (protocolId: string) => {
      try {
        // This is a placeholder - you'll need to adjust the actual endpoint
        const response = await fetch(
          `/api/v1/integrations/jira/domains/${domainId}/projects/${projectId}/services/${protocolId}/tasks`,
        )

        if (!response.ok) {
          throw new Error(`Error fetching tasks: ${response.status}`)
        }

        const data = await response.json()

        // Assuming the API returns data in a format that includes tasks
        // You might need to adjust this based on the actual response structure
        if (data && data.success && data.data) {
          // Extract task names from the response
          const tasks = data.data.subtasks?.map((task: any) => task.summary) || []

          // Update the protocol tasks state
          setProtocolTasks((prev) => ({
            ...prev,
            [protocolId]: tasks,
          }))
        }
      } catch (err) {
        console.error(`Failed to fetch tasks for protocol ${protocolId}:`, err)
      }
    }

    if (protocol) {
      // Only fetch if we don't already have the tasks for this protocol
      if (!protocolTasks[protocol]) {
        fetchProtocolTasks(protocol)
      }
    }
  }, [protocol, domainId, projectId, protocolTasks])

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
                    <>
                      <SelectItem value="variable-seeding">Protocolo Siembra y/o Fertilización Variable</SelectItem>
                      <SelectItem value="satellite-monitoring">Monitoreo satelital y control de malezas</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage className="text-red-500" />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
