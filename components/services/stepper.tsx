"use client"

import { useState, useEffect } from "react"
import {
  useRouter,
  useParams
} from "next/navigation"
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
  useServiceForm,
  ServiceFormProvider
} from "@/lib/contexts/services-context"
import Step1 from "./step1"
import Step2 from "./step2"
import Step3 from "./step3"
import {
  apiClient,
  Service,
  CreateServiceInput,
  CreateTaskInput,
  CreateFieldInput,
  CreateTaskFieldInput
} from "@/lib/integrations/amplify"
import {
  createService,
  createSubtask,
  generateDescriptionField
} from "@/lib/integrations/jira"
import { useTranslations } from "next-intl"
import { Task } from "@/lib/schemas"

// Componente de debug temporal
function DebugContext() {
  const { form } = useServiceForm()
  const formData = form.getValues()

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">Debug Context:</h4>
      <div className="space-y-1">
        <div>protocolId: {formData.protocolId || 'none'}</div>
        <div>protocolName: {formData.protocolName}</div>
        <div>tmpRequestId: {formData.tmpRequestId} </div>
        <div>Fields: {formData.fields?.length || 0}</div>
        <div>Tasks: {formData.tasks?.length || 0}</div>
      </div>
    </div>
  )
}

interface Props {
  userEmail: string
}

const STEPS = [1, 2, 3];

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
function ServiceStepperForm({ userEmail }: Props) {
  const router = useRouter()
  const params = useParams()
  const { locale, domain, project } = params
  const localeStr = Array.isArray(locale) ? locale[0] : locale
  const domainStr = Array.isArray(domain) ? domain[0] : domain
  const projectStr = Array.isArray(project) ? project[0] : project
  const t = useTranslations("CreateService")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    currentStep,
    setCurrentStep,
    form,
    validateStep,
    enabledTasks,
    resetForm
  } = useServiceForm()

  // Check if current step is valid for button state
  const isCurrentStepValid = () => {
    const formData = form.getValues()

    switch (currentStep) {
      case 1:
        return formData.protocolId && formData.protocolId.trim() !== ""
      case 2:
        return formData.fields && formData.fields.length > 0
      case 3:
        // For step 3, we only check if there are tasks and at least one is enabled
        // The detailed validation (userEmail, formId) is handled in validateStep
        return formData.tasks && formData.tasks.length > 0 && enabledTasks.size > 0
      default:
        return true
    }
  }

  // Auto-validate when form data changes
  useEffect(() => {
    const subscription = form.watch(() => {
      // Clear previous errors when data changes
      if (currentStep === 1) {
        form.clearErrors("protocolId")
      } else if (currentStep === 2) {
        form.clearErrors("fields")
      } else if (currentStep === 3) {
        form.clearErrors("tasks")
      }
    })

    return () => subscription.unsubscribe()
  }, [form, currentStep])

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToServicesList = () => {
    if (localeStr && domainStr && projectStr) {
      router.push(`/${localeStr}/domains/${domainStr}/projects/${projectStr}/services`)
    }
  }

  // Crea el Service en JIRA y retorna el issueKey
  async function createServiceInJiraOnly(
    serviceName: string,
    description: string,
    userEmail: string,
    serviceDeskId: string,
    requestTypeId: string
  ) {
    
    return await createService(
      serviceName,
      description,
      userEmail,
      serviceDeskId,
      requestTypeId
    )
  }

  // Crear Service en DB
  async function createServiceInDB(data: CreateServiceInput): Promise<Service> {
    const result = await apiClient.createService(data)
    return result
  }

  // Crear Fields en DB
  async function createServiceFieldsInDB(lots: CreateFieldInput[]): Promise<string[]> {
    const fieldIds: string[] = []

    for (const lot of lots) {
      const fieldData = {
        workspaceId: lot.workspaceId || "",
        workspaceName: lot.workspaceName,
        campaignId: lot.campaignId || "",
        campaignName: lot.campaignName,
        farmId: lot.farmId || "",
        farmName: lot.farmName,
        fieldId: lot.fieldId || "",
        fieldName: lot.fieldName || "",
        hectares: lot.hectares,
        crop: lot.crop,
        hybrid: lot.hybrid,
        deleted: false
      }

      const result = await apiClient.createField(fieldData)
      if (result.id) fieldIds.push(result.id)
    }

    return fieldIds
  }
  // Crear Tasks en DB
  async function createServiceTasksInDB(tasks: CreateTaskInput[]):
    Promise<{ taskIds: string[], tasksCreated: Task[] }> {

    const taskIds: string[] = []
    const tasksCreated: Task[] = []

    for (const task of tasks) {
      const result = await apiClient.createTask(task)
      if (result.id) {
        taskIds.push(result.id)
        tasksCreated.push(result)
      }
    }

    return { taskIds, tasksCreated }
  }

  // Asociar cada Field a cada Task mediante TaskField usando la Lambda function
  async function associateFieldsToTasksBatch(taskIds: string[], fieldIds: string[]) {
    console.log("=== CREAR SERVICIO: TaskFields que se crearán ===")
    console.log("Task IDs:", taskIds)
    console.log("Field IDs:", fieldIds)
    
    // Crear array de todas las combinaciones taskId-fieldId
    const allCombinations: CreateTaskFieldInput[] = []
    for (const taskId of taskIds) {
      for (const fieldId of fieldIds) {
        allCombinations.push({ taskId, fieldId })
      }
    }
    
    console.log(`Total de combinaciones a procesar: ${allCombinations.length}`)
    
    try {
      // Usar la nueva Lambda function para mejor rendimiento
      const results = await apiClient.createTaskFieldsBatch(allCombinations)
      
      console.log(`TaskFields creados exitosamente: ${results.length}`)
      console.log("=== FIN CREAR SERVICIO ===")
      
      return results
    } catch (error) {
      console.error("Error en batch processing:", error)
      throw error
    }
  }

  const nextStep = async () => {
    const isValid = await validateStep(currentStep)

    if (!isValid) {
      // Get the first error message from the form
      const errors = form.formState.errors
      let errorMessage = "Por favor, completa todos los campos requeridos antes de continuar."

      if (errors.protocolId?.message) {
        errorMessage = errors.protocolId.message
      } else if (errors.fields?.message) {
        errorMessage = errors.fields.message
      } else if (errors.tasks?.message) {
        errorMessage = errors.tasks.message
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
      setIsSubmitting(true);
      const formData = form.getValues()

      // // Validate final step
      const isValid = await validateStep(3)
      if (!isValid) {
        toast({
          title: "Error de validación",
          description: "Por favor, completa todos los campos requeridos antes de crear el servicio.",
          variant: "destructive",
        })
        return
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
      // console.log("Project response:", projectResponse);
      if (projectResponse && projectResponse.id) {
        serviceDeskId = projectResponse.serviceDeskId;
        requestTypeId = projectResponse.requestTypeId;
        // console.log("Jira config - serviceDeskId:", serviceDeskId, "requestTypeId:", requestTypeId);
      }

      // Generate service name
      const serviceName = `${formData.protocolName} - ${formData.fields[0]?.workspaceName || ''} - ${formData.fields[0]?.farmName || ''}`;

      // Validate that we have the required Jira configuration
      if (!serviceDeskId || !requestTypeId) {
        throw new Error(`Project configuration is missing required Jira settings. serviceDeskId: "${serviceDeskId}", requestTypeId: "${requestTypeId}"`);
      }

      // Generate description field
      const { description, descriptionPlain } = await generateDescriptionField(formData.fields)

      // Create Service in JIRA
      const jiraResponse = await createServiceInJiraOnly(
        serviceName,
        description,
        userEmail,
        serviceDeskId,
        requestTypeId
      );

      if (!jiraResponse.success || !jiraResponse.data?.issueKey) {
        throw new Error(`Failed to create Jira service: ${jiraResponse.error || 'No issueKey returned'}`);
      }
      const { issueKey } = jiraResponse.data;

      // Create Service in DB
      const serviceData = {
        projectId: projectStr,
        tmpRequestId: formData.tmpRequestId,
        requestId: issueKey,
        name: serviceName,
        protocolId: formData.protocolId,
        deleted: false
      }
      const service = await createServiceInDB(serviceData)

      // Create Fields in DB
      const fieldIds = await createServiceFieldsInDB(formData.fields)

      // Create Tasks in DB (only enabled tasks, without subtaskId initially) 
      const enabledTasksArray = Array.from(enabledTasks)
      const enabledTasksData = enabledTasksArray.map((taskIndex: number) => formData.tasks[taskIndex])

      // Filter duplicate tasks based on tmpSubtaskId
      const uniqueTasks = enabledTasksData.filter((task: any, index: number, self: any[]) =>
        index === self.findIndex((t: any) => t.tmpSubtaskId === task.tmpSubtaskId)
      );

      const tasksToCreate: CreateTaskInput[] = uniqueTasks.map((task: any) => ({
        ...task,
        serviceId: service.id
      }))
      const { taskIds, tasksCreated } = await createServiceTasksInDB(tasksToCreate)

      // Create Subtasks in JIRA and get the keys
      const subtaskKeys: string[] = [];
      for (let i = 0; i < tasksCreated.length; i++) {
        const task = tasksCreated[i];
        const baseUrl = process.env.NODE_ENV === 'production'
          ? process.env.NEXT_PUBLIC_SITE_URL
          : 'http://localhost:3000';
        const agtasksUrl = `${baseUrl}/${localeStr}/domains/${domainStr}/projects/${projectStr}/tasks/${task.id}/edit`;
        const response = await createSubtask(
          issueKey,
          task.taskName || "",
          task.userEmail || "",
          descriptionPlain,
          agtasksUrl,
          task.taskType || ""
        );
        if (response?.key) {
          subtaskKeys.push(response.key);
        } else {
          throw new Error(`Failed to create subtask for task: ${task.taskName}`);
        }
      }

      // Update tasks with Jira subtaskId
      await Promise.all(taskIds.map((taskId, idx) =>
        apiClient.updateTask(taskId, { subtaskId: subtaskKeys[idx] })
      ));

      // Associate fields to tasks
      await associateFieldsToTasksBatch(taskIds, fieldIds)

      toast({
        title: "Servicio creado exitosamente",
        description: "El servicio y sus tareas fueron creados correctamente.",
        duration: 5000,
      })
 
      goToServicesList()
    } catch (error) {
      console.error("Error creating service:", error)
      toast({
        title: "Error al crear el servicio",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false);
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />
      case 2:
        return <Step2 userEmail={userEmail} />
      case 3:
        return <Step3 />
      default:
        return <Step1 />
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
                  <h2 className="text-xl font-semibold mb-4">Paso 1: Selección de protocolo de servicio</h2>
                  {renderStep()}
                </>
              )}
              {currentStep === 2 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Paso 2: Selección de lotes</h2>
                  {renderStep()}
                </>
              )}
              {currentStep === 3 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Paso 3: Asignación de tareas</h2>
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
                  {isSubmitting ? "Creando..." : "Crear Servicio"}
                </Button>
              )}
            </CardFooter>
          </div>
        </CardContent>
      </Card>
      {/* <DebugContext /> */}
    </div>
  )
}

// Componente wrapper que proporciona el contexto
export default function ServiceStepper({ userEmail }: Props) {
  return (
    <ServiceFormProvider>
      <ServiceStepperForm userEmail={userEmail} />
    </ServiceFormProvider>
  )
}
