"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  useTaskForm,
  TaskFormProvider
} from "@/lib/contexts/tasks-context"
import Step1TaskType from "./step1"
import Step2Lots from "./step2"
import Step3Details from "./step3"
import {
  apiClient,
  type Task,
  type CreateTaskInput,
  type CreateFieldInput,
} from "@/lib/integrations/amplify"
import {
  createIssue,
  generateDescriptionField
} from "@/lib/integrations/jira"
import type { 
  Field, 
  TaskFormValues 
} from "@/lib/schemas"

// Componente de debug temporal
function DebugContext() {
  const { form, mode } = useTaskForm()
  const formData = form.getValues()

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">Debug Task Context:</h4>
      <div className="space-y-1">
        <div>taskName: {formData.taskName || 'none'}</div>
        <div>taskType: {formData.taskType || 'none'}</div>
        <div>userEmail: {formData.userEmail || 'none'}</div>
        <div>Fields: {formData.fields?.length || 0}</div>
        <div>Mode: {mode || 'create'}</div>
      </div>
    </div>
  )
}

interface TaskStepperProps {
  projectId: string
  thisUserEmail: string
  services: any[]
  projectName: string
  mode?: 'create' | 'edit'
  taskId?: string
  initialData?: { task: Task, fields: any[] }
}

const STEPS = [1, 2, 3]

function StepperBubbles({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-8 mb-8">
      {STEPS.map((step, idx) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center rounded-full border-2 w-9 h-9 text-lg font-semibold transition-colors
              ${currentStep === step ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-300'}`}
          >
            {step}
          </div>
          {idx < STEPS.length - 1 && (
            <div className="w-16 h-0.5 bg-gray-200" />
          )}
        </div>
      ))}
    </div>
  )
}

// Componente interno que usa el contexto
function TaskStepperForm({
  projectId,
  thisUserEmail,
  services,
  projectName,
  mode = 'create',
  taskId
}: TaskStepperProps) {
  const router = useRouter()
  const params = useParams()
  const { locale, domain, project } = params
  const localeStr = Array.isArray(locale) ? locale[0] : locale
  const domainStr = Array.isArray(domain) ? domain[0] : domain
  const projectStr = Array.isArray(project) ? project[0] : project
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    currentStep,
    setCurrentStep,
    form,
    validateStep,
    resetForm,
    loadTaskForEdit,
    updateTask
  } = useTaskForm()

  // Load task for edit mode
  useEffect(() => {
    if (mode === 'edit' && taskId) {
      loadTaskForEdit(taskId)
    }
  }, [mode, taskId, loadTaskForEdit])

  // Check if current step is valid for button state
  const isCurrentStepValid = () => {
    const formData = form.getValues()

    switch (currentStep) {
      case 1:
        return formData.taskName && formData.taskName.trim() !== "" &&
          formData.taskType && formData.taskType.trim() !== ""
      case 2:
        return formData.fields && formData.fields.length > 0
      case 3:
        return formData.userEmail && formData.userEmail.trim() !== ""
      default:
        return true
    }
  }

  // Auto-validate when form data changes
  useEffect(() => {
    const subscription = form.watch(() => {
      // Clear previous errors when data changes
      if (currentStep === 1) {
        form.clearErrors(["taskName", "taskType"])
      } else if (currentStep === 2) {
        form.clearErrors("fields")
      } else if (currentStep === 3) {
        form.clearErrors("userEmail")
      }
    })

    return () => subscription.unsubscribe()
  }, [form, currentStep])

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToTasksList = () => {
    if (localeStr && domainStr && projectStr) {
      router.push(`/${localeStr}/domains/${domainStr}/projects/${projectStr}/tasks`)
    }
  }

  // Crear Task en DB
  async function createTaskInDB(data: CreateTaskInput): Promise<string> {    
    const response = await apiClient.createTask(data)
    if (!response) throw new Error("Failed to create task in DB")
    return response.id as string
  }

  // Crear Fields en DB
  async function createTaskFieldsInDB(lots: CreateFieldInput[]): Promise<string[]> {
    const fieldIds: string[] = []

    for (const lot of lots) {      
      const result = await apiClient.createField(lot)
      if (result.id) fieldIds.push(result.id)
    }

    return fieldIds
  }

  // Asociar cada Field a la Task mediante TaskField
  async function associateFieldsToTask(taskId: string, fieldIds: string[]) {
    await Promise.all(fieldIds.map(async (fieldId) => {
      await apiClient.createTaskField({ taskId, fieldId })
    }))
  }

  // Crear Issue en Jira
  async function createIssueInJira(
    parentIssueKey: string,
    taskName: string,
    userEmail: string,
    description: string,
    agtasksUrl: string,
    taskType: string,
  ) {
    const response = await createIssue(
      parentIssueKey,
      taskName,
      userEmail,
      description,
      agtasksUrl,
      taskType,
    )
    if (!response) throw new Error("Failed to create issue in Jira")
    return response
  }

  const nextStep = async () => {
    const isValid = await validateStep(currentStep)

    if (!isValid) {
      // Get the first error message from the form
      const errors = form.formState.errors
      let errorMessage = "Por favor, completa todos los campos requeridos antes de continuar."

      if (errors.taskName?.message) {
        errorMessage = errors.taskName.message
      } else if (errors.taskType?.message) {
        errorMessage = errors.taskType.message
      } else if (errors.fields?.message) {
        errorMessage = errors.fields.message
      } else if (errors.userEmail?.message) {
        errorMessage = errors.userEmail.message
      }

      toast({
        title: "Error de validación",
        description: errorMessage,
        variant: "destructive",
      })
      return
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)
      const formData = form.getValues()

      // console.log("formData: ", formData)

      // Validate final step
      const isValid = await validateStep(3)
      if (!isValid) {
        toast({
          title: "Error de validación",
          description: "Por favor, completa todos los campos requeridos antes de continuar.",
          variant: "destructive",
        })
        return
      }

      if (mode === 'edit') {
        // Update existing task
        await updateTask(formData)

        toast({
          title: "Tarea actualizada exitosamente",
          description: "La tarea fue actualizada correctamente.",
          duration: 5000,
        })

        // Redirect to task detail page
        if (taskId && localeStr && domainStr && projectStr) {
          router.push(`/${localeStr}/domains/${domainStr}/projects/${projectStr}/tasks/${taskId}`)
        }
      } else {
        // Create new task
        // Validate required fields
        if (!formData.taskName || !formData.taskType || !formData.userEmail) {
          throw new Error("Missing required fields: taskName, taskType, or userEmail")
        }

        if (!formData.fields || formData.fields.length === 0) {
          throw new Error("No fields selected")
        }

        // Handle project parameter (can be array in Next.js 13+)
        const projectStr = Array.isArray(project) ? project[0] : project
        if (!projectStr || typeof projectStr !== 'string') {
          throw new Error("Project ID is required")
        }

        // Get project data
        let serviceDeskId = "";
        let requestTypeId = "";
        const projectResponse = await apiClient.getProject(projectStr);
        if (projectResponse && projectResponse.id) {
          serviceDeskId = projectResponse.serviceDeskId;
          requestTypeId = projectResponse.requestTypeId;
        }

        // Generate description
        const { descriptionPlain } = await generateDescriptionField(formData.fields as Field[])   

        // Create Task in DB        
        const taskData: CreateTaskInput = {
          projectId: projectStr,          
          // serviceId: formData.serviceId || "",
          taskName: formData.taskName,
          taskType: formData.taskType,
          userEmail: formData.userEmail,
          taskData: formData.taskData ? JSON.stringify(formData.taskData) : "",
          formId: formData.formId || "",
        }

        const taskId = await createTaskInDB(taskData)

        // Create Fields in DB
        const fieldIds = await createTaskFieldsInDB(formData.fields)

        // Associate each Field to the Task via TaskField
        await associateFieldsToTask(taskId, fieldIds)

        // Create Issue in Jira
        // parentIssueKey: string,
        // summary: string,
        // userEmail: string,
        // description: string,
        // agtasksUrl?: string,
        // taskType?: string,
        // serviceDeskId?: string

        const baseUrl = process.env.NODE_ENV === 'production'
          ? process.env.NEXT_PUBLIC_SITE_URL
          : 'http://localhost:3000';
        const agtasksUrl = `${baseUrl}/${localeStr}/domains/${domainStr}/projects/${projectStr}/tasks/${taskId}/edit`;

        const jiraResponse = await createIssueInJira(
          "TAN", // serviceDeskId, // "107" = "TAN",
          formData.taskName,
          formData.userEmail,
          descriptionPlain,
          agtasksUrl,
          formData.taskType,          
        )

        // Update Task with Jira issueKey
        if (jiraResponse?.key) {
          await apiClient.updateTask(taskId, { subtaskId: jiraResponse.key, tmpSubtaskId: ""})
        }

        toast({
          title: "Tarea creada exitosamente",
          description: "La tarea y sus campos fueron creados correctamente.",
          duration: 5000,
        })
        
        goToTasksList()
      }
    } catch (error) {
      console.error("Error processing task:", error)
      toast({
        title: mode === 'edit' ? "Error al actualizar tarea" : "Error al crear tarea",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get step titles based on mode
  const getStepTitle = (step: number) => {
    const baseTitles = {
      1: "Datos de la tarea",
      2: "Selección de lotes",
      3: "Asignación de usuario"
    }

    // const action = mode === 'edit' ? 'Editar' : 'Crear'
    return `Paso ${step}: ${baseTitles[step as keyof typeof baseTitles]}`
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1TaskType />
      case 2:
        return <Step2Lots thisUserEmail={thisUserEmail} mode={mode} />
      case 3:
        return <Step3Details services={services} projectName={projectName} />
      default:
        return <Step1TaskType />
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-[95%] max-w-6xl h-[80vh] flex flex-col shadow-md border border-gray-200">
        <CardHeader className="pb-0">
          <StepperBubbles currentStep={currentStep} />
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pt-0 pb-0">
          <div className="h-full flex flex-col">
            <div className="flex-1 pb-4">
              {currentStep === 1 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">{getStepTitle(1)}</h2>
                  {renderStep()}
                </>
              )}
              {currentStep === 2 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">{getStepTitle(2)}</h2>
                  {renderStep()}
                </>
              )}
              {currentStep === 3 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">{getStepTitle(3)}</h2>
                  {renderStep()}
                </>
              )}
            </div>
            <CardFooter className="flex justify-end gap-2 bg-white sticky bottom-0 z-10 border-t border-gray-100 pt-4 pb-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                </Button>
              )}
              {currentStep < 3 && (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isCurrentStepValid()}
                >
                  <ChevronRight className="w-4 h-4 ml-1" /> Siguiente
                </Button>
              )}
              {currentStep === 3 && (
                <Button
                  type="button"
                  disabled={isSubmitting || !isCurrentStepValid()}
                  onClick={onSubmit}
                >
                  {isSubmitting
                    ? (mode === 'edit' ? "Actualizando..." : "Creando...")
                    : (mode === 'edit' ? "Actualizar Tarea" : "Crear Tarea")
                  }
                </Button>
              )}
            </CardFooter>
          </div>
        </CardContent>
      </Card>
      <DebugContext />
    </div>
  )
}

// Componente wrapper que proporciona el contexto
export default function TaskStepper({
  projectId,
  thisUserEmail,
  services,
  projectName,
  mode = 'create',
  taskId,
  initialData
}: TaskStepperProps) {
  return (
    <TaskFormProvider
      mode={mode}
      taskId={taskId}
      initialData={initialData}
    >
      <TaskStepperForm
        projectId={projectId}
        thisUserEmail={thisUserEmail}
        services={services}
        projectName={projectName}
        mode={mode}
        taskId={taskId}
        initialData={initialData}
      />
    </TaskFormProvider>
  )
} 