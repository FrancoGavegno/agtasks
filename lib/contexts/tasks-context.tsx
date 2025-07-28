"use client"

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect,
  type ReactNode 
} from "react"
import { 
  useForm, 
  FormProvider, 
  type UseFormReturn 
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  taskFormSchema,
  type TaskFormValues,
  type Task,
  type Field,
} from "@/lib/schemas"
import type {
  User,
  Workspace,
  Season,
  Farm,
  LotField
} from "@/lib/interfaces/360"
import { apiClient } from "@/lib/integrations/amplify"

interface TaskFormContextType {
  // Form state
  form: UseFormReturn<TaskFormValues>
  
  // Stepper state
  currentStep: number
  setCurrentStep: (step: number) => void
  
  // Mode state
  mode: 'create' | 'edit'
  taskId?: string
  
  // Data states
  workspaces: Workspace[]
  campaigns: Season[]
  establishments: Farm[]
  lots: LotField[]
  users: User[]
  
  // Loading flags
  hasLoadedWorkspaces: boolean
  hasLoadedSeasons: boolean
  hasLoadedFarms: boolean
  hasLoadedFields: boolean
  hasLoadedUsers: boolean
  isLoadingTask: boolean
  
  // Setters for data
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>
  setCampaigns: React.Dispatch<React.SetStateAction<Season[]>>
  setEstablishments: React.Dispatch<React.SetStateAction<Farm[]>>
  setLots: React.Dispatch<React.SetStateAction<LotField[]>>
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  
  // Setters for loading flags
  setHasLoadedWorkspaces: (loaded: boolean) => void
  setHasLoadedSeasons: (loaded: boolean) => void
  setHasLoadedFarms: (loaded: boolean) => void
  setHasLoadedFields: (loaded: boolean) => void
  setHasLoadedUsers: (loaded: boolean) => void
  setIsLoadingTask: (loading: boolean) => void
  
  // Utility functions
  resetForm: () => void
  validateStep: (step: number) => Promise<boolean>
  loadTaskForEdit: (taskId: string) => Promise<void>
  updateTask: (data: TaskFormValues) => Promise<void>
}

// Create the context
const TaskFormContext = createContext<TaskFormContextType | undefined>(undefined)

  // Create the provider component
  export function TaskFormProvider({ 
    children, 
    mode = 'create',
    taskId,
    initialData 
  }: { 
    children: ReactNode
    mode?: 'create' | 'edit'
    taskId?: string
    initialData?: { task: Task, fields: Field[] }
  }) {
    const [currentMode, setCurrentMode] = useState<'create' | 'edit'>(mode)
  // Initialize react-hook-form with Zod resolver
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      taskName: "",
      taskType: "",
      fields: [],
      projectId: "",
      serviceId: "",
      userEmail: "",
      tmpSubtaskId: "",
      subtaskId: "",
      taskData: null,
      deleted: false,
      formId: "",
    },
    mode: "onChange",
  })

  // Stepper state
  const [currentStep, setCurrentStep] = useState(1)

  // Data states
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [campaigns, setCampaigns] = useState<Season[]>([])
  const [establishments, setEstablishments] = useState<Farm[]>([])
  const [lots, setLots] = useState<LotField[]>([])
  const [users, setUsers] = useState<User[]>([])

  // Loading flags
  const [hasLoadedWorkspaces, setHasLoadedWorkspaces] = useState(false)
  const [hasLoadedSeasons, setHasLoadedSeasons] = useState(false)
  const [hasLoadedFarms, setHasLoadedFarms] = useState(false)
  const [hasLoadedFields, setHasLoadedFields] = useState(false)
  const [hasLoadedUsers, setHasLoadedUsers] = useState(false)
  const [isLoadingTask, setIsLoadingTask] = useState(false)

  // Load initial data for edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const { task, fields } = initialData
      form.reset({
        taskName: task.taskName || "",
        taskType: task.taskType || "",
        fields: fields.map(field => ({
          workspaceId: field.workspaceId?.toString() || "",
          workspaceName: field.workspaceName,
          campaignId: field.campaignId?.toString() || "",
          campaignName: field.campaignName,
          farmId: field.farmId?.toString() || "",
          farmName: field.farmName,
          fieldId: field.fieldId || "",
          fieldName: field.fieldName || "",
          hectares: field.hectares,
          crop: field.crop,
          hybrid: field.hybrid,
        })),
        projectId: task.projectId || "",
        serviceId: task.serviceId || "",
        userEmail: task.userEmail || "",
        tmpSubtaskId: task.tmpSubtaskId || "",
        subtaskId: task.subtaskId || "",
        taskData: task.taskData,
        deleted: task.deleted || false,
        formId: task.formId || "",
      })
    }
  }, [mode, initialData, form])

  // Reset form
  const resetForm = () => {
    form.reset({
      taskName: "",
      taskType: "",
      fields: [],
      projectId: "",
      serviceId: "",
      userEmail: "",
      tmpSubtaskId: "",
      subtaskId: "",
      taskData: null,
      deleted: false,
      formId: "",
    })
    setCurrentStep(1)
    setWorkspaces([])
    setCampaigns([])
    setEstablishments([])
    setLots([])
    setUsers([])
    setHasLoadedWorkspaces(false)
    setHasLoadedSeasons(false)
    setHasLoadedFarms(false)
    setHasLoadedFields(false)
    setHasLoadedUsers(false)
    setIsLoadingTask(false)
  }

  // Validate specific step
  const validateStep = async (step: number): Promise<boolean> => {
    const formData = form.getValues()
    
    switch (step) {
      case 1:
        // Validate step 1: taskName and taskType are required
        if (!formData.taskName || formData.taskName.trim() === "") {
          form.setError("taskName", {
            type: "manual",
            message: "Debes ingresar un nombre para la tarea"
          })
          return false
        }
        if (!formData.taskType || formData.taskType.trim() === "") {
          form.setError("taskType", {
            type: "manual",
            message: "Debes seleccionar un tipo de tarea"
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
        // Validate step 3: userEmail is required
        if (!formData.userEmail || formData.userEmail.trim() === "") {
          form.setError("userEmail", {
            type: "manual",
            message: "Debes seleccionar un usuario asignado"
          })
          return false
        }
        return true
        
      default:
        return true
    }
  }

  // Load task for edit mode
  const loadTaskForEdit = async (taskId: string) => {
    try {
      setIsLoadingTask(true)
      const task = await apiClient.getTask(taskId)
      const taskFields = await apiClient.listTaskFields(taskId)
      const fields = await Promise.all(
        taskFields.items.map(async (tf: any) => {
          const field = await apiClient.getField(tf.fieldId)
          return field
        })
      )
      
      form.reset({
        taskName: task.taskName || "",
        taskType: task.taskType || "",
        fields: fields.map((field: any) => ({
          workspaceId: field.workspaceId?.toString() || "",
          workspaceName: field.workspaceName,
          campaignId: field.campaignId?.toString() || "",
          campaignName: field.campaignName,
          farmId: field.farmId?.toString() || "",
          farmName: field.farmName,
          fieldId: field.fieldId || "",
          fieldName: field.fieldName || "",
          hectares: field.hectares,
          crop: field.crop,
          hybrid: field.hybrid,
        })),
        projectId: task.projectId || "",
        serviceId: task.serviceId || "",
        userEmail: task.userEmail || "",
        tmpSubtaskId: task.tmpSubtaskId || "",
        subtaskId: task.subtaskId || "",
        taskData: task.taskData,
        deleted: task.deleted || false,
        formId: task.formId || "",
      } as any)
    } catch (error) {
      console.error('Error loading task for edit:', error)
      throw error
    } finally {
      setIsLoadingTask(false)
    }
  }

  // Update task function
  const updateTask = async (data: TaskFormValues) => {
    if (!taskId) throw new Error('No task ID for update')
    
    // Update main task
    await apiClient.updateTask(taskId, {
      taskName: data.taskName,
      taskType: data.taskType,
      userEmail: data.userEmail,
      taskData: data.taskData,
      serviceId: data.serviceId,
      formId: data.formId,
    })
    
    // Handle fields (remove existing and create new ones)
    const existingTaskFields = await apiClient.listTaskFields(taskId)
    await Promise.all(existingTaskFields.items.map((tf: any) => apiClient.deleteTaskField(tf.id)))
    
    // Create new fields and associations
    const fieldIds = await createTaskFieldsInDB(data.fields)
    await associateFieldsToTask(taskId, fieldIds)
  }

  // Helper functions for field operations
  const createTaskFieldsInDB = async (fields: any[]): Promise<string[]> => {
    const fieldIds: string[] = []
    
    for (const field of fields) {
      const fieldData = {
        workspaceId: field.workspaceId?.toString() || "",
        workspaceName: field.workspaceName,
        campaignId: field.campaignId?.toString() || "",
        campaignName: field.campaignName,
        farmId: field.farmId?.toString() || "",
        farmName: field.farmName,
        fieldId: field.fieldId || "",
        fieldName: field.fieldName || "",
        hectares: field.hectares,
        crop: field.crop,
        hybrid: field.hybrid,
        deleted: false
      }
      
      const result = await apiClient.createField(fieldData)
      if (result.id) fieldIds.push(result.id)
    }
    
    return fieldIds
  }

  const associateFieldsToTask = async (taskId: string, fieldIds: string[]) => {
    await Promise.all(fieldIds.map(async (fieldId) => {
      await apiClient.createTaskField({ taskId, fieldId })
    }))
  }

  const contextValue: TaskFormContextType = {
    form,
    currentStep,
    setCurrentStep,
    mode: currentMode,
    taskId,
    workspaces,
    campaigns,
    establishments,
    lots,
    users,
    hasLoadedWorkspaces,
    hasLoadedSeasons,
    hasLoadedFarms,
    hasLoadedFields,
    hasLoadedUsers,
    isLoadingTask,
    setWorkspaces,
    setCampaigns,
    setEstablishments,
    setLots,
    setUsers,
    setHasLoadedWorkspaces,
    setHasLoadedSeasons,
    setHasLoadedFarms,
    setHasLoadedFields,
    setHasLoadedUsers,
    setIsLoadingTask,
    resetForm,
    validateStep,
    loadTaskForEdit,
    updateTask,
  }

  return (
    <TaskFormContext.Provider value={contextValue}>
      <FormProvider {...form}>
        {children}
      </FormProvider>
    </TaskFormContext.Provider>
  )
}

// Create the hook to use the context
export function useTaskForm() {
  const context = useContext(TaskFormContext)
  if (context === undefined) {
    throw new Error("useTaskForm must be used within a TaskFormProvider")
  }
  return context
} 