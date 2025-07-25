"use client"

import { 
  useState, 
  useEffect 
} from "react"
import { Check, SquareCheckBig } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useParams } from "next/navigation"
import type { TaskFormValues } from "@/lib/amplify/schemas"
import { useServiceForm } from "@/lib/contexts/service-form-context"
import type { ProtocolTasks } from "@/lib/contexts/service-form-context"
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
  const { 
    updateFormValues, 
    formValues, 
    hasLoadedProtocols, 
    setHasLoadedProtocols,
    protocolTasks,
    setProtocolTasks,
    protocols,
    setProtocols,
    enabledTasks,
    setEnabledTasks
  } = useServiceForm()
  const params = useParams()
  const projectId = params.project as string
  const domainId = params.domain as string
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch template protocols
  useEffect(() => {
    const fetchProtocols = async () => {
      if (!domainId) return
      
      try {
        setLoading(true)
        const protocolsData = await listDomainProtocols(domainId)
        const protocolsArray = Array.isArray(protocolsData) ? protocolsData : []
        setProtocols(protocolsArray)
        setHasLoadedProtocols(true)
      } catch (err) {
        console.error("Failed to fetch protocols:", err)
        setError("Failed to load protocols. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (!hasLoadedProtocols) {
      fetchProtocols()
    } else {
      setLoading(false)
    }
  }, [domainId, hasLoadedProtocols, setHasLoadedProtocols, setProtocols])

  // Restaurar protocolo seleccionado desde el contexto
  useEffect(() => {
    if (formValues.tmpRequestId && !selectedProtocol) {
      onSelectProtocol(formValues.tmpRequestId)
      onSelectProtocolName(formValues.protocolName || "")
    }
  }, [formValues.tmpRequestId, formValues.protocolName, selectedProtocol])

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

        setProtocolTasks({
          ...protocolTasks,
          [protocolId]: tasks,
        })

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
    const protocolName = selectedProtocolObj?.name ?? ""
    onSelectProtocolName(protocolName) // Update protocol name state

    // Limpiar tareas si cambia el protocolo
    updateFormValues({
      tasks: [],
      protocolId: selectedProtocolObj?.id ?? "", // DomainProtocol.id
      protocolName: protocolName,
      tmpRequestId: selectedProtocolObj?.tmProtocolId ?? "", // tmProtocolId (issue key)
    })

    if (value) {
      let tasks = protocolTasks[value]
      if (!tasks) {
        tasks = await fetchProtocolTasks(value)
      }
      if (tasks && tasks.length > 0) {
        // Filtrar tareas duplicadas basándose en tmpSubtaskId
        const uniqueTasks = tasks.filter((task: any, index: number, self: any[]) => 
          index === self.findIndex((t: any) => t.key === task.key)
        );
        
        const newTasks: TaskFormValues[] = uniqueTasks.map((task: any) => ({
          taskName: task.summary || "",
          taskType: task.customFields?.customfield_10371 || "",
          userEmail: "",
          tmpSubtaskId: task.key || "",
          deleted: false,
          formId: "", // Siempre inicializar como string vacío
        }))
        
        updateFormValues({
          tasks: newTasks,
        })
        
        // Inicializar todas las tareas como habilitadas
        const allTaskIndices = new Set<number>(newTasks.map((_, index) => index))
        setEnabledTasks(allTaskIndices)
      }
    }
  }

  // Obtener el valor actual del selector
  const getCurrentValue = () => {
    return selectedProtocol || formValues.tmpRequestId || ""
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Protocolo de servicio</label>
        <Select
          value={getCurrentValue()}
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {selectedProtocol && formValues.tasks && formValues.tasks.length > 0 ? (
        <div className="mt-6 border rounded-md p-4">
          <h4 className="text-sm font-medium mb-2">
            Tareas que incluye el protocolo: 
          </h4>
          <ul className="text-sm">
            {formValues.tasks?.map((task: TaskFormValues, index: number) => (
              <li key={index} className="flex items-start space-x-2">
                <SquareCheckBig className="h-5 w-5 text-green-500 mt-0.5" />
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


