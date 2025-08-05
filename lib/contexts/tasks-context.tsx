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

  // Step 2 specific state
  showFieldsTable: boolean
  setShowFieldsTable: React.Dispatch<React.SetStateAction<boolean>>

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
  updateTaskWith360Data: (workspaceId: number, workspaceName: string, seasonId: number, seasonName: string, farmId: number, farmName: string) => void
  updateTaskWithFieldIds: (fieldIds: number[]) => void
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
  initialData?: { task: Task }
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
      projectId: projectId || "",
      serviceId: "",
      userEmail: "",
      tmpSubtaskId: "",
      subtaskId: "",
      taskData: null,
      formId: "",
      workspaceId: 0, // Will be validated when form is submitted
      workspaceName: "",
      seasonId: 0, // Will be validated when form is submitted
      seasonName: "",
      farmId: 0, // Will be validated when form is submitted
      farmName: "",
      fieldIdsOnlyIncluded: [],
    },
    mode: "onChange" as const,
  })

  // Update projectId in form when it changes
  useEffect(() => {
    if (projectId) {
      form.setValue("projectId", projectId)
    }
  }, [projectId])

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
  const [tempUserEmail, setTempUserEmail] = useState<string>("")

  // Step 2 specific state
  const [showFieldsTable, setShowFieldsTable] = useState<boolean>(false)

  // Load initial data for edit mode
  useEffect(() => {
    if (currentMode === 'edit' && initialData) {
      const { task } = initialData
      form.reset({
        taskName: task.taskName || "",
        taskType: task.taskType || "",
        projectId: task.projectId || "",
        serviceId: task.serviceId || "",
        userEmail: task.userEmail || "",
        tmpSubtaskId: task.tmpSubtaskId || "",
        subtaskId: task.subtaskId || "",
        taskData: task.taskData,
        formId: task.formId || "",
        workspaceId: task.workspaceId || 0,
        workspaceName: task.workspaceName || "",
        seasonId: task.seasonId || 0,
        seasonName: task.seasonName || "",
        farmId: task.farmId || 0,
        farmName: task.farmName || "",
        fieldIdsOnlyIncluded: task.fieldIdsOnlyIncluded || [],
      })
      
      // Set showFieldsTable if fieldIdsOnlyIncluded has values
      if (task.fieldIdsOnlyIncluded && task.fieldIdsOnlyIncluded.length > 0) {
        setShowFieldsTable(true)
      }
    }
  }, [currentMode, initialData])

  // Reset form
  const resetForm = useCallback(() => {
    form.reset({
      taskName: "",
      taskType: "",
      projectId: "",
      serviceId: "",
      userEmail: "",
      tmpSubtaskId: "",
      subtaskId: "",
      taskData: null,
      formId: "",
      workspaceId: 0, // Will be validated when form is submitted
      workspaceName: "",
      seasonId: 0, // Will be validated when form is submitted
      seasonName: "",
      farmId: 0, // Will be validated when form is submitted
      farmName: "",
      fieldIdsOnlyIncluded: [],
    })
    setShowFieldsTable(false)
  }, [form])

  // Update task with 360 data
  const updateTaskWith360Data = useCallback((workspaceId: number, workspaceName: string, seasonId: number, seasonName: string, farmId: number, farmName: string) => {
    form.setValue("workspaceId", workspaceId, { shouldValidate: true })
    form.setValue("workspaceName", workspaceName, { shouldValidate: true })
    form.setValue("seasonId", seasonId, { shouldValidate: true })
    form.setValue("seasonName", seasonName, { shouldValidate: true })
    form.setValue("farmId", farmId, { shouldValidate: true })
    form.setValue("farmName", farmName, { shouldValidate: true })
  }, [form])

  // Update task with field IDs
  const updateTaskWithFieldIds = useCallback((fieldIds: number[]) => {
    form.setValue("fieldIdsOnlyIncluded", fieldIds, { shouldValidate: true })
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
          // Step 2: Validar que 360 Farm fields estén seleccionados
          const formData2 = form.getValues()
          const step2Valid = Boolean(
            formData2.workspaceId && formData2.workspaceId > 0 &&
            formData2.seasonId && formData2.seasonId > 0 &&
            formData2.farmId && formData2.farmId > 0
          )
          return step2Valid

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
  }, [form, currentMode])

  // Load task for edit mode using the unified service
  const loadTaskForEdit = useCallback(async (taskId: string) => {
    try {
      setIsLoadingTask(true)
      const { task } = await TaskService.loadTaskForEdit(taskId)
      
      form.reset({
        projectId: task.projectId || "",
        taskName: task.taskName || "",
        taskType: task.taskType || "",
        userEmail: task.userEmail || "",
        serviceId: task.serviceId || "",
        tmpSubtaskId: task.tmpSubtaskId || "",
        subtaskId: task.subtaskId || "",
        taskData: task.taskData,
        formId: task.formId || "",        
        workspaceId: task.workspaceId || 0,
        workspaceName: task.workspaceName || "",
        seasonId: task.seasonId || 0,
        seasonName: task.seasonName || "",
        farmId: task.farmId || 0,
        farmName: task.farmName || "",
        fieldIdsOnlyIncluded: task.fieldIdsOnlyIncluded || [],
      } as any)
      
      // Set showFieldsTable if fieldIdsOnlyIncluded has values
      if (task.fieldIdsOnlyIncluded && task.fieldIdsOnlyIncluded.length > 0) {
        setShowFieldsTable(true)
      }
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
        userEmail: tempUserEmail,
      })

      // Use the unified service to update the task
      const result = await TaskService.updateTask(preparedData, currentTaskId)

      // Clear temporary data after successful update
      setTempTaskData(null)
      setTempUserEmail("")

    } catch (error) {
      console.error("Error in updateTask:", error)
      throw error
    }
  }, [currentTaskId, tempTaskData, tempUserEmail, setTempTaskData, setTempUserEmail])

  // Save temporary changes to database
  const saveTemporaryChanges = useCallback(async () => {
    if (!currentTaskId) throw new Error('No task ID for update')

    const currentFormData = form.getValues()

    // Prepare form data with temporary changes
    const preparedData = TaskService.prepareFormData(currentFormData, {
      taskData: tempTaskData,
      userEmail: tempUserEmail,
    })

    // Use the unified service to update the task
    await TaskService.updateTask(preparedData, currentTaskId)

    // Clear temporary data after successful save
    setTempTaskData(null)
    setTempUserEmail("")
  }, [currentTaskId, form, tempTaskData, tempUserEmail, setTempTaskData, setTempUserEmail])

  // Discard temporary changes
  const discardTemporaryChanges = useCallback(() => {
    setTempTaskData(null)
    setTempUserEmail("")
  }, [setTempTaskData, setTempUserEmail])

  const contextValue: TaskFormContextType = {
    form,
    currentStep,
    setCurrentStep,
    mode: currentMode,
    taskId: currentTaskId,
    tempTaskData,
    setTempTaskData,
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
    showFieldsTable,
    setShowFieldsTable,
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
    updateTaskWith360Data,
    updateTaskWithFieldIds,
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