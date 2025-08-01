"use client"

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode
} from "react"
import {
  useForm,
  FormProvider,
  type UseFormReturn
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
import {
  serviceFormSchema,
  type DomainProtocol,
  type DomainForm,
  type ProtocolTasks,
  type ServiceFormValues,
} from "@/lib/schemas"
import type {
  User,
  Workspace,
  Season,
  Farm,
  LotField
} from "@/lib/interfaces/360"

interface ServiceFormContextType {
  // Form state
  form: UseFormReturn<ServiceFormValues>

  // Stepper state
  currentStep: number
  setCurrentStep: (step: number) => void

  // Data states
  protocols: DomainProtocol[]
  protocolTasks: ProtocolTasks
  workspaces: Workspace[]
  campaigns: Season[]
  establishments: Farm[]
  lots: LotField[]
  forms: DomainForm[]
  users: User[]
  enabledTasks: Set<number>

  // Loading flags
  hasLoadedProtocols: boolean
  hasLoadedProtocolTasks: boolean
  hasLoadedWorkspaces: boolean
  hasLoadedSeasons: boolean
  hasLoadedFarms: boolean
  hasLoadedFields: boolean
  hasLoadedForms: boolean
  hasLoadedUsers: boolean

  // Setters for data
  setProtocolTasks: React.Dispatch<React.SetStateAction<ProtocolTasks>>
  setProtocols: React.Dispatch<React.SetStateAction<DomainProtocol[]>>
  setForms: React.Dispatch<React.SetStateAction<DomainForm[]>>
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>
  setCampaigns: React.Dispatch<React.SetStateAction<Season[]>>
  setEstablishments: React.Dispatch<React.SetStateAction<Farm[]>>
  setLots: React.Dispatch<React.SetStateAction<LotField[]>>
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  setEnabledTasks: React.Dispatch<React.SetStateAction<Set<number>>>

  // Setters for loading flags
  setHasLoadedProtocols: (loaded: boolean) => void
  setHasLoadedProtocolTasks: (loaded: boolean) => void
  setHasLoadedForms: (loaded: boolean) => void
  setHasLoadedWorkspaces: (loaded: boolean) => void
  setHasLoadedSeasons: (loaded: boolean) => void
  setHasLoadedFarms: (loaded: boolean) => void
  setHasLoadedFields: (loaded: boolean) => void
  setHasLoadedUsers: (loaded: boolean) => void

  // Utility functions
  resetForm: () => void
  validateStep: (step: number) => Promise<boolean>
}

// Create the context
const ServiceFormContext = createContext<ServiceFormContextType | undefined>(undefined)

// Create the provider component
export function ServiceFormProvider({ children }: { children: ReactNode }) {
  // Initialize react-hook-form with Zod resolver
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      protocolId: "",
      protocolName: "",
      tmpRequestId: "",
      name: "",
      projectId: "",
      requestId: "",
      deleted: false,
      fields: [],
      tasks: [],
    },
    mode: "onChange",
  })

  // Stepper state
  const [currentStep, setCurrentStep] = useState(1)

  // Data states
  const [protocols, setProtocols] = useState<DomainProtocol[]>([])
  const [protocolTasks, setProtocolTasks] = useState<ProtocolTasks>({})
  const [forms, setForms] = useState<DomainForm[]>([])
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [campaigns, setCampaigns] = useState<Season[]>([])
  const [establishments, setEstablishments] = useState<Farm[]>([])
  const [lots, setLots] = useState<LotField[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [enabledTasks, setEnabledTasks] = useState<Set<number>>(new Set())

  // Loading flags
  const [hasLoadedProtocols, setHasLoadedProtocols] = useState(false)
  const [hasLoadedProtocolTasks, setHasLoadedProtocolTasks] = useState(false)
  const [hasLoadedForms, setHasLoadedForms] = useState(false)
  const [hasLoadedWorkspaces, setHasLoadedWorkspaces] = useState(false)
  const [hasLoadedSeasons, setHasLoadedSeasons] = useState(false)
  const [hasLoadedFarms, setHasLoadedFarms] = useState(false)
  const [hasLoadedFields, setHasLoadedFields] = useState(false)
  const [hasLoadedUsers, setHasLoadedUsers] = useState(false)

  // Reset form
  const resetForm = () => {
    form.reset()
    setCurrentStep(1)
    setProtocolTasks({})
    setProtocols([])
    setForms([])
    setWorkspaces([])
    setCampaigns([])
    setEstablishments([])
    setLots([])
    setUsers([])
    setEnabledTasks(new Set())
    setHasLoadedProtocols(false)
    setHasLoadedProtocolTasks(false)
    setHasLoadedForms(false)
    setHasLoadedWorkspaces(false)
    setHasLoadedSeasons(false)
    setHasLoadedFarms(false)
    setHasLoadedFields(false)
    setHasLoadedUsers(false)
  }

  // Validate specific step
  const validateStep = async (step: number): Promise<boolean> => {
    const formData = form.getValues()

    switch (step) {
      case 1:
        // Validate step 1: protocolId is required
        if (!formData.protocolId || formData.protocolId.trim() === "") {
          form.setError("protocolId", {
            type: "manual",
            message: "Debes seleccionar un protocolo"
          })
          return false
        }
        return true

      case 2:
        // Validate step 2: fields array must have at least one item
        if (!formData.fields || formData.fields.length === 0) {
          form.setError("fields", {
            type: "manual",
            message: "Debes seleccionar al menos un lote"
          })
          return false
        }
        return true

      case 3:
        // Validate step 3: tasks array and enabled tasks with proper validation
        if (!formData.tasks || formData.tasks.length === 0) {
          form.setError("tasks", {
            type: "manual",
            message: "No hay tareas disponibles"
          })
          return false
        }

        // Check if at least one task is enabled
        if (enabledTasks.size === 0) {
          form.setError("tasks", {
            type: "manual",
            message: "Al menos una tarea debe estar habilitada"
          })
          return false
        }

        // Validate each enabled task
        const enabledTasksArray = Array.from(enabledTasks)
        for (const taskIndex of enabledTasksArray) {
          const task = formData.tasks[taskIndex]
          if (!task) continue

          // Check if userEmail is filled for enabled tasks
          if (!task.userEmail || task.userEmail.trim() === "") {
            form.setError(`tasks.${taskIndex}.userEmail`, {
              type: "manual",
              message: "Debes asignar usuario a cada tarea habilitada"
            })
            return false
          }

          // Check if formId is filled for fieldvisit tasks
          if (task.taskType === "fieldvisit" && (!task.formId || task.formId.trim() === "")) {
            form.setError(`tasks.${taskIndex}.formId`, {
              type: "manual",
              message: "Debes asignar un formulario a cada tarea de tipo recorrida"
            })
            return false
          }
        }

        return true

      default:
        return true
    }
  }

  const contextValue: ServiceFormContextType = {
    form,
    currentStep,
    setCurrentStep,
    protocolTasks,
    protocols,
    forms,
    workspaces,
    campaigns,
    establishments,
    lots,
    users,
    enabledTasks,
    hasLoadedProtocols,
    hasLoadedProtocolTasks,
    hasLoadedForms,
    hasLoadedWorkspaces,
    hasLoadedSeasons,
    hasLoadedFarms,
    hasLoadedFields,
    hasLoadedUsers,
    setProtocolTasks,
    setProtocols,
    setForms,
    setWorkspaces,
    setCampaigns,
    setEstablishments,
    setLots,
    setUsers,
    setEnabledTasks,
    setHasLoadedProtocols,
    setHasLoadedProtocolTasks,
    setHasLoadedForms,
    setHasLoadedWorkspaces,
    setHasLoadedSeasons,
    setHasLoadedFarms,
    setHasLoadedFields,
    setHasLoadedUsers,
    resetForm,
    validateStep,
  }

  return (
    <ServiceFormContext.Provider value={contextValue}>
      <FormProvider {...form}>
        {children}
      </FormProvider>
    </ServiceFormContext.Provider>
  )
}

// Create the hook to use the context
export function useServiceForm() {
  const context = useContext(ServiceFormContext)
  if (context === undefined) {
    throw new Error("useServiceForm must be used within a ServiceFormProvider")
  }
  return context
} 