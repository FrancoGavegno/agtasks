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
import { TaskService } from "@/lib/services/task-service"
import type { TaskFormValues } from "@/lib/schemas"

// Componente de debug temporal
function DebugContext() {
  const { form, mode, tempTaskData } = useTaskForm()
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
        <div>taskData keys: {formData.taskData ? (typeof formData.taskData === 'string' ? Object.keys(JSON.parse(formData.taskData)).length : Object.keys(formData.taskData).length) : 0}</div>
        <div>tempTaskData keys: {tempTaskData ? Object.keys(tempTaskData).length : 0}</div>
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
  initialData?: { task: any, fields: any[] }
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
    updateTask,
    saveTemporaryChanges,
    discardTemporaryChanges,
    tempTaskData,
    tempFields,
    tempUserEmail
  } = useTaskForm()

  // Check if there are unsaved changes
  const hasUnsavedChanges = tempTaskData !== null || tempFields.length > 0 || tempUserEmail !== ""

  // Load task for edit mode
  useEffect(() => {
    if (mode === 'edit' && taskId) {
      loadTaskForEdit(taskId)
    }
  }, [mode, taskId]) // Removido loadTaskForEdit de las dependencias para evitar renderizado infinito

  // Check if current step is valid for button state
  const isCurrentStepValid = () => {
    const formData = form.getValues()
    
    switch (currentStep) {
      case 1:
        // Step 1: Validar taskName y taskType (igual para ambos modos)
        const step1Valid = Boolean(
          formData.taskName && formData.taskName.trim() !== "" &&
          formData.taskType && formData.taskType.trim() !== ""
        )
        return step1Valid
        
      case 2:
        // Step 2: Validar que haya al menos un lote seleccionado
        if (mode === 'edit') {
          // En modo edición, usar tempFields si están disponibles, sino usar formData.fields
          const fieldsToCheck = tempFields.length > 0 ? tempFields : formData.fields
          const step2Valid = Boolean(fieldsToCheck && fieldsToCheck.length > 0)
          return step2Valid
        } else {
          // En modo creación, usar formData.fields
          const step2Valid = Boolean(formData.fields && formData.fields.length > 0)
          return step2Valid
        }
        
      case 3:
        // Step 3: Validar userEmail (igual para ambos modos)
        const step3Valid = Boolean(formData.userEmail && formData.userEmail.trim() !== "")
        return step3Valid
        
      default:
        return true
    }
  }

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

  const nextStep = async () => {
    try {
      // Validar el step actual antes de avanzar
      const isValid = await validateStep(currentStep)
      
      if (!isValid) {
        toast({
          title: "Error de validación",
          description: "Por favor, completa todos los campos requeridos antes de continuar.",
          variant: "destructive",
        })
        return
      }
      
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1)
      }
    } catch (error) {
      console.error("Error in nextStep:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al validar el paso actual.",
        variant: "destructive",
      })
    }
  }

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)
      const formData = form.getValues()

      if (mode === 'edit') {
        // En modo edición, usar datos temporales si están disponibles
        
        // Prepare form data with temporary changes
        const preparedData = TaskService.prepareFormData(formData, {
          taskData: tempTaskData,
          fields: tempFields,
          userEmail: tempUserEmail,
        })
        
        await updateTask(preparedData)
        
        toast({
          title: "Tarea actualizada exitosamente",
          description: "La tarea fue actualizada correctamente.",
          duration: 5000,
        })
        
        goToTasksList()
      } else {
        // Modo creación usando el servicio unificado
        if (!formData.taskName || !formData.taskType || !formData.userEmail) {
          throw new Error("Missing required fields: taskName, taskType, or userEmail")
        }

        if (!formData.fields || formData.fields.length === 0) {
          throw new Error("No fields selected")
        }

        if (!projectId || typeof projectId !== 'string') {
          throw new Error("Project ID is required")
        }

        // Prepare the base URL for Jira integration
        const baseUrl = process.env.NODE_ENV === 'production'
          ? process.env.NEXT_PUBLIC_SITE_URL
          : 'http://localhost:3000';
        const agtasksUrl = `${baseUrl}/${localeStr}/domains/${domainStr}/projects/${projectId}/tasks/${taskId}/edit`;

        // Use the unified service to create the task
        const result = await TaskService.createTask(formData, {
          createJiraIssue: true,
          jiraParentKey: "TAN", // Default parent key
          agtasksUrl,
        })

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
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={prevStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Anterior
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                {currentStep < STEPS.length ? (
                  <Button onClick={nextStep} disabled={!isCurrentStepValid()}>
                    Siguiente
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={onSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Guardando..." : mode === 'edit' ? "Actualizar Tarea" : "Crear Tarea"}
                  </Button>
                )}
              </div>
            </CardFooter>
          </div>
        </CardContent>
      </Card>
      {/* <DebugContext /> */}
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
      projectId={projectId}
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