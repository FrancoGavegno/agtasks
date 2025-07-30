"use client"

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect,
  useCallback,
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
import { TaskService } from "@/lib/services/task-service"

interface TaskFormContextType {
  // Form state
  form: UseFormReturn<TaskFormValues>
  
  // Stepper state
  currentStep: number
  setCurrentStep: (step: number) => void
  
  // Mode state
  mode: 'create' | 'edit'
  taskId?: string
  
  // Temporary editable data states
  tempTaskData: Record<string, any> | null
  setTempTaskData: React.Dispatch<React.SetStateAction<Record<string, any> | null>>
  tempFields: any[]
  setTempFields: React.Dispatch<React.SetStateAction<any[]>>
  tempUserEmail: string
  setTempUserEmail: React.Dispatch<React.SetStateAction<string>>
  
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
  saveTemporaryChanges: () => Promise<void>
  discardTemporaryChanges: () => void
}

// Create the context
const TaskFormContext = createContext<TaskFormContextType | undefined>(undefined)

  // Create the provider component
  export function TaskFormProvider({ 
    children, 
    mode = 'create',
    taskId,
    projectId,
    initialData 
  }: { 
    children: ReactNode
    mode?: 'create' | 'edit'
    taskId?: string
    projectId?: string
    initialData?: { task: Task, fields: Field[] }
  }) {
    const [currentMode, setCurrentMode] = useState<'create' | 'edit'>(mode as 'create' | 'edit')
    const [currentTaskId, setCurrentTaskId] = useState<string | undefined>(taskId)
    
    // Update taskId when it changes
    useEffect(() => {
      setCurrentTaskId(taskId)
    }, [taskId])
    
  // Initialize react-hook-form with Zod resolver
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      taskName: "",
      taskType: "",
      fields: [],
      projectId: projectId || "",
      serviceId: "",
      userEmail: "",
      tmpSubtaskId: "",
      subtaskId: "",
      taskData: null,
      deleted: false,
      formId: "",
    },
      mode: "onChange" as const,
  })

  // Update projectId in form when it changes
  useEffect(() => {
    if (projectId) {
      form.setValue("projectId", projectId)
    }
  }, [projectId]) // Removido 'form' de las dependencias para evitar renderizado infinito

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

  // Temporary editable data states
  const [tempTaskData, setTempTaskData] = useState<Record<string, any> | null>(null)
  const [tempFields, setTempFields] = useState<any[]>([])
  const [tempUserEmail, setTempUserEmail] = useState<string>("")

  // Load initial data for edit mode
  useEffect(() => {
    if (currentMode === 'edit' && initialData) {
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
  }, [currentMode, initialData]) // Removido 'form' de las dependencias

  // Reset form
  const resetForm = useCallback(() => {
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
  }, [form])

  // Validate specific step
  const validateStep = useCallback(async (step: number): Promise<boolean> => {
    try {
      switch (step) {
        case 1:
          // Step 1: Validar taskName y taskType (igual para ambos modos)
          const formData1 = form.getValues()
          const step1Valid = Boolean(
            formData1.taskName && formData1.taskName.trim() !== "" &&
            formData1.taskType && formData1.taskType.trim() !== ""
          )
          return step1Valid
          
        case 2:
          // Step 2: Validar que haya al menos un lote seleccionado
          const formData2 = form.getValues()
          if (currentMode === 'edit') {
            // En modo edición, usar tempFields si están disponibles, sino usar formData.fields
            const fieldsToCheck = tempFields.length > 0 ? tempFields : formData2.fields
            const step2Valid = Boolean(fieldsToCheck && fieldsToCheck.length > 0)
            return step2Valid
          } else {
            // En modo creación, usar formData.fields
            const step2Valid = Boolean(formData2.fields && formData2.fields.length > 0)
            return step2Valid
          }
          
        case 3:
          // Step 3: Validar userEmail (igual para ambos modos)
          const formData3 = form.getValues()
          const step3Valid = Boolean(formData3.userEmail && formData3.userEmail.trim() !== "")
          return step3Valid
          
        default:
          return true
      }
    } catch (error) {
      console.error(`Error validating step ${step}:`, error)
      return false
    }
  }, [form, currentMode, tempFields])

  // Load task for edit mode using the unified service
  const loadTaskForEdit = useCallback(async (taskId: string) => {
    try {
      setIsLoadingTask(true)
      const { task, fields } = await TaskService.loadTaskForEdit(taskId)
      
      console.log("=== EDITAR TAREA: TaskFields obtenidos ===")
      console.log("Task ID:", taskId)
      console.log("Task Name:", task.taskName)
      console.log("Fields obtenidos:", fields)
      console.log("Total de Fields:", fields.length)
      fields.forEach((field, index) => {
        console.log(`Field ${index + 1}:`, {
          fieldId: field.fieldId,
          fieldName: field.fieldName,
          workspaceName: field.workspaceName,
          farmName: field.farmName,
          hectares: field.hectares
        })
      })
      console.log("=== FIN EDITAR TAREA ===")
      
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
  }, [form])

  // Update task function using the unified service
  const updateTask = useCallback(async (data: TaskFormValues) => {
    
    if (!currentTaskId) throw new Error('No task ID for update')
    
    try {
      // Prepare form data with temporary changes
      const preparedData = TaskService.prepareFormData(data, {
        taskData: tempTaskData,
        fields: tempFields,
        userEmail: tempUserEmail,
      })
      
      // Use the unified service to update the task
      const result = await TaskService.updateTask(preparedData, currentTaskId)
      
      // Clear temporary data after successful update
      setTempTaskData(null)
      setTempFields([])
      setTempUserEmail("")
      
    } catch (error) {
      console.error("Error in updateTask:", error)
      throw error
    }
  }, [currentTaskId, tempTaskData, tempFields, tempUserEmail, setTempTaskData, setTempFields, setTempUserEmail])

  // Save temporary changes to database
  const saveTemporaryChanges = useCallback(async () => {
    if (!currentTaskId) throw new Error('No task ID for update')
    
    const currentFormData = form.getValues()
    
    // Prepare form data with temporary changes
    const preparedData = TaskService.prepareFormData(currentFormData, {
      taskData: tempTaskData,
      fields: tempFields,
      userEmail: tempUserEmail,
    })
    
    // Use the unified service to update the task
    await TaskService.updateTask(preparedData, currentTaskId)
    
    // Clear temporary data after successful save
    setTempTaskData(null)
    setTempFields([])
    setTempUserEmail("")
  }, [currentTaskId, form, tempTaskData, tempFields, tempUserEmail, setTempTaskData, setTempFields, setTempUserEmail])

  // Discard temporary changes
  const discardTemporaryChanges = useCallback(() => {
    setTempTaskData(null)
    setTempFields([])
    setTempUserEmail("")
  }, [setTempTaskData, setTempFields, setTempUserEmail])

  const contextValue: TaskFormContextType = {
    form,
    currentStep,
    setCurrentStep,
    mode: currentMode,
    taskId: currentTaskId,
    tempTaskData,
    setTempTaskData,
    tempFields,
    setTempFields,
    tempUserEmail,
    setTempUserEmail,
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
    saveTemporaryChanges,
    discardTemporaryChanges,
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