"use client"

import { 
  useState, 
  useEffect 
} from "react"
import { useFormContext } from "react-hook-form"
import { Check } from "lucide-react"
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage 
} from "@/components/ui/form"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useParams } from "next/navigation"
import type { TaskFormValues } from "@/lib/schemas"
import { useServiceForm } from "@/lib/contexts/service-form-context"
import { Protocol } from "@/lib/interfaces/agtasks"
import { listDomainProtocols } from "@/lib/services/agtasks"

interface Props {
  selectedProtocol: string
  onSelectProtocol: (protocol: string) => void
  selectedProtocolName: string
  onSelectProtocolName: (protocolName: string) => void
}

export default function Step1Protocol({
  selectedProtocol,
  onSelectProtocol,
  selectedProtocolName,
  onSelectProtocolName
}: Props) {
  const form = useFormContext<any>()
  const { updateFormValues } = useServiceForm()
  const params = useParams()
  const projectId = params.project as string
  const domainId = params.domain as string
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [protocolTasks, setProtocolTasks] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Sync selectedProtocol with form.watch("protocol")
  useEffect(() => {
    const protocol = form.watch("protocol")
    onSelectProtocol(protocol) // Update state when protocol changes
  }, [form.watch("protocol")])

  // Fetch template protocols 
  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        setLoading(true)
        const protocols = await listDomainProtocols(domainId)
        const protocolsData = Array.isArray(protocols) ? protocols : []
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

  // Fetch template tasks for specific protocol 
  const fetchProtocolTasks = async (protocolId: string) => {
    try {
      const response = await fetch(
        `/api/v1/integrations/jira/domains/${domainId}/projects/${projectId}/services/${protocolId}/tasks`,
      )
      if (!response.ok) {
        throw new Error(`Error fetching tasks: ${response.status}`)
      }

      // Extract tasks from the response
      const data = await response.json()
      if (data && data.success && data.data) {
        const tasks = data.data.subtasks || []

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
    if (selectedProtocol && domainId && projectId) {
      if (!protocolTasks[selectedProtocol]) {
        fetchProtocolTasks(selectedProtocol)
      }
    }
  }, [selectedProtocol, domainId, projectId, protocolTasks])

  // Update form values and task assignments when protocol changes
  const handleProtocolChange = async (value: string) => {
    onSelectProtocol(value) // Update local state

    // Find the protocol object to get the name
    const selectedProtocolObj = protocols.find((p) => p.tmProtocolId === value)
    onSelectProtocolName(selectedProtocolObj?.name ?? "") // Update protocol name state

    // Setear el campo 'name', 'protocolId' y 'tmpRequestId' del formulario para que pase la validación y se guarde
    form.setValue("name", selectedProtocolObj?.name ?? "", { shouldValidate: true })
    form.setValue("protocolId", selectedProtocolObj?.id ?? "", { shouldValidate: true })
    form.setValue("tmpRequestId", selectedProtocolObj?.tmProtocolId ?? "", { shouldValidate: true })

    // Limpiar tareas si cambia el protocolo
    form.setValue("tasks", [], { shouldValidate: true })
    updateFormValues({
      tasks: [],
    })

    if (value) {
      let tasks = protocolTasks[value]
      if (!tasks) {
        tasks = await fetchProtocolTasks(value)
      }
      if (tasks && tasks.length > 0) {
        const newTasks: TaskFormValues[] = tasks.map((task: any) => ({
          taskName: task.summary || "",
          taskType: task.customFields?.customfield_10371 || "",
          userEmail: "",
          tmpSubtaskId: task.key || "",
          deleted: false,
          formId: "", // Siempre inicializar como string vacío
        }))
        form.setValue("tasks", newTasks, { shouldValidate: true })
        updateFormValues({
          tasks: newTasks,
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="protocolId"
        render={({ field }) => (
          <FormItem>
            {/* <FormLabel className="text-lg font-medium">Seleccione un protocolo</FormLabel> */}
            <FormControl>
              <Select
                value={selectedProtocol || field.value}
                onValueChange={handleProtocolChange}
                disabled={loading}
              >
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

      {selectedProtocol && protocolTasks[selectedProtocol] && protocolTasks[selectedProtocol].length > 0 ? (
        <div className="mt-6 border rounded-md p-4">
          <h4 className="text-sm font-medium mb-2">
            Tareas que incluye el protocolo: {selectedProtocolName || "Cargando..."}
          </h4>
          <ul className="space-y-2">
            {form.watch("tasks")?.map((task: TaskFormValues, index: number) => (
              <li key={index} className="flex items-start space-x-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5" />
                <span>
                  {task.taskName}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        selectedProtocol && (
          <div className="mt-6 border rounded-md p-4 text-center text-gray-500">
            <p>Buscando tareas del protocolo {selectedProtocolName || "seleccionado"}</p>
          </div>
        )
      )}
    </div>
  )
}


