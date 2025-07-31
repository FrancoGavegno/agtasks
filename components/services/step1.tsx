"use client"

import {
  useState,
  useEffect
} from "react"
import { 
 // Check, 
  SquareCheckBig 
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { useServiceForm, } from "@/lib/contexts/services-context"
import { apiClient } from "@/lib/integrations/amplify"
// import { listTasksbyService } from "@/lib/integrations/jira"
import { type ServiceFormValues } from "@/lib/schemas"
import { useTranslations } from 'next-intl'
// import type {
//   JiraSubtask,
// } from "@/lib/interfaces/jira"

export default function Step1() {
  const t = useTranslations("CreateServiceSteps.step1")
  const {
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<ServiceFormValues>()

  const {
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
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>("")

  // Watch form values
  const protocolId = watch("protocolId")
  const protocolName = watch("protocolName")
  const tmpRequestId = watch("tmpRequestId")

  // Fetch template protocols
  useEffect(() => {
    const fetchProtocols = async () => {
      if (!domainId) return

      try {
        setLoading(true)
        const protocolsData = await apiClient.listDomainProtocols(domainId)
        const protocolsArray = protocolsData.items || []
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

  // Restore selected protocol when form values are loaded
  useEffect(() => {
    if (tmpRequestId && !selectedProtocolId) {
      const protocol = protocols.find(p => p.tmProtocolId === tmpRequestId)
      if (protocol && protocol.id) {
        setSelectedProtocolId(protocol.id)
      }
    }
  }, [tmpRequestId, selectedProtocolId, protocols])

  // Fetch tasks for the selected protocol
  useEffect(() => {
    if (tmpRequestId && domainId && projectId) {
      if (!protocolTasks[tmpRequestId]) {
        fetchProtocolTasks(tmpRequestId)
      }
    }
  }, [tmpRequestId, domainId, projectId, protocolTasks])

  // Fetch template tasks for specific protocol using tmpRequestId (Jira issue key)
  const fetchProtocolTasks = async (tmpRequestId: string) => {
    try {
      const response = await fetch(
        `/api/v1/integrations/jira/domains/${domainId}/projects/${projectId}/services/${tmpRequestId}/tasks`,
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
          [tmpRequestId]: tasks,
        }))

        return tasks
      }
      
      return []
    } catch (err) {
      console.error(`Failed to fetch tasks for protocol ${tmpRequestId}:`, err)
      setError(`Failed to load tasks for the selected protocol. Please try again later.`)
      
      return []
    }
  }

  const handleProtocolChange = async (value: string) => {
    if (!value) {
      setValue("protocolId", "")
      setValue("protocolName", "")
      setValue("tmpRequestId", "")
      setSelectedProtocolId("")
      if (tmpRequestId) {
        setProtocolTasks((prev) => {
          const newTasks = { ...prev }
          delete newTasks[tmpRequestId]
          return newTasks
        })
      }
      setEnabledTasks(new Set())
      return
    }

    // Find the protocol object using tmProtocolId (since SelectItem uses tmProtocolId as value)
    const selectedProtocol = protocols.find(p => p.tmProtocolId === value)
    if (!selectedProtocol) return

    // Update the selected protocol ID for the selector
    setSelectedProtocolId(selectedProtocol.id || "")
    
    // Set form values correctly according to Amplify schema:
    // - protocolId: DomainProtocol.id (for database relationship)
    // - tmpRequestId: DomainProtocol.tmProtocolId (for Jira integration)
    setValue("protocolId", selectedProtocol.id) // DomainProtocol.id for database relationship
    setValue("protocolName", selectedProtocol.name)
    setValue("tmpRequestId", selectedProtocol.tmProtocolId) // DomainProtocol.tmProtocolId for Jira integration

    // Clear tasks when protocol changes
    setValue("tasks", [])

    // Fetch tasks for the selected protocol using tmProtocolId
    let tasks = protocolTasks[value]
    if (!tasks) {
      tasks = await fetchProtocolTasks(value)
    }
    
    if (tasks && tasks.length > 0) {
      // Filter duplicate tasks based on tmpSubtaskId
      const uniqueTasks = tasks.filter((task: any, index: number, self: any[]) => 
        index === self.findIndex((t: any) => t.key === task.key)
      );
      
      const formTasks = uniqueTasks.map((task: any) => ({
        taskName: task.summary || "",
        taskType: task.customFields?.customfield_10371 || "Task",
        userEmail: "", // Will be filled in step 3
        projectId: projectId,
        serviceId: "", // Will be filled when service is created
        formId: "", // Will be filled if needed
        tmpSubtaskId: task.key || "",
        subtaskId: "", // Will be filled when JIRA subtask is created
        deleted: false,
      }))

      setValue("tasks", formTasks)
      
      // Initialize all tasks as enabled
      const allTaskIndices = new Set<number>(formTasks.map((_, index) => index))
      setEnabledTasks(allTaskIndices)
    }
  }

  const getCurrentValue = () => {
    return tmpRequestId || selectedProtocolId || ""
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("protocolLabel")}</label>
        <Select
          value={getCurrentValue()}
          onValueChange={handleProtocolChange}
          disabled={loading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loading ? t("loadingProtocols") : t("selectProtocol")} />
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
                {t("noProtocolsAvailable")}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {errors.protocolId && (
          <p className="text-red-500 text-sm">{errors.protocolId.message}</p>
        )}
      </div>

      {tmpRequestId && watch("tasks") && watch("tasks").length > 0 ? (
        <div className="mt-6 border rounded-md p-4">
          <h4 className="text-sm font-medium mb-2">
            {t("protocolTasksTitle")}
          </h4>
          <ul className="text-sm">
            {watch("tasks").map((task: any, index: number) => (
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
        tmpRequestId && (
          <div className="mt-6 border rounded-md p-4 text-center text-gray-500">
            <p>{t("searchingTasks")}</p>
          </div>
        )
      )}
    </div>
  )
}
