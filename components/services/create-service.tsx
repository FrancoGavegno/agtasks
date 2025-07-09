"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Step1Protocol from "./step1-protocol"
import Step2Lots from "./step2-lots"
import Step3Tasks from "./step3-tasks"
import {
  createServiceSchema,
  type CreateServiceFormValues,
} from "./validation-schemas"
import { ServiceFormProvider } from "@/lib/contexts/service-form-context"
import { 
  generateDescriptionField, 
  createService as createServiceInJira, 
  createSubtask as createJiraSubtask 
} from "@/lib/integrations/jira"
// import { client } from "@/lib/amplify-client"
import { useTranslations } from "next-intl"
import { 
  getProject, 
  createService, 
  createField, 
  createTask, 
  createTaskField 
} from "@/lib/services/agtasks"

const defaultValues: CreateServiceFormValues = {
  protocol: "",
  workspace: "",
  campaign: "",
  establishment: "",
  selectedLots: [],
  taskAssignments: [],
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

export default function CreateService({ userEmail }: Props) {
  const router = useRouter()
  const params = useParams()
  const { locale, domain, project } = params
  const t = useTranslations("CreateService")
  const [currentStep, setCurrentStep] = useState(1)
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedProtocol, setSelectedProtocol] = useState<string>("")
  const [selectedProtocolName, setSelectedProtocolName] = useState<string>("")

  const methods = useForm<CreateServiceFormValues>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      ...defaultValues,
    },
    mode: "onChange",
  })

  const nextStep = async () => {
    let isValid = false
    switch (currentStep) {
      case 1:
        isValid = await methods.trigger("protocol")
        break
      case 2:
        methods.setValue("selectedLots", methods.getValues("selectedLots"), { shouldDirty: true })
        isValid = await methods.trigger(["workspace", "campaign", "establishment", "selectedLots"])
        break
      case 3:
        isValid = await methods.trigger("taskAssignments");
        if (!isValid) {
          const errorMsg = methods.formState.errors.taskAssignments?.message || "Todas las tareas deben tener un usuario asignado";
          toast({
            title: "Asignación incompleta",
            description: errorMsg,
            variant: "destructive",
          });
          return;
        }
        onSubmit(methods.getValues());
        return;
    }
    if (isValid) {
      setCurrentStep(currentStep + 1)
      setShouldScrollToTop(true)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    setShouldScrollToTop(true)
  }

  // 1. Crear Service en JIRA
  async function createServiceInJiraOnly(serviceName: string, description: string, userEmail: string, serviceDeskId: string, requestTypeId: string) {
    // Solo crea el Service en JIRA y retorna el issueKey
    return await createServiceInJira(serviceName, description, userEmail, serviceDeskId, requestTypeId)
  }

  // 2. Crear Service en DB
  async function createServiceInDB(data: CreateServiceFormValues, projectId: string, serviceName: string, issueKey: string) {
    const serviceData = {
      projectId,
      name: serviceName,
      tmpRequestId: data.protocol,
      requestId: issueKey,
      deleted: false,
    }
    const response = await createService(serviceData)
    if (!response) throw new Error("Failed to create service in DB")
    return response.id as string
  }

  // 3. Crear Fields en DB (una sola vez por Service)
  async function createServiceFieldsInDB(serviceId: string, lots: any[]) {
    const createdFields = await Promise.all(lots.map(async (field, idx) => {
      try {
        const fieldData = {
          workspaceId: field.workspaceId,
          workspaceName: field.workspaceName,
          campaignId: field.campaignId,
          campaignName: field.campaignName,
          farmId: field.farmId,
          farmName: field.farmName,
          fieldId: field.fieldId,
          fieldName: field.fieldName,
          hectares: field.hectares,
          crop: field.cropName || "",
          hybrid: field.hybridName || "",
          deleted: false,
        };
        console.log('Intentando crear Field en DB:', { idx, fieldData });
        const res = await createField(fieldData);
        console.log('Field creado OK:', res);
        if (!res) throw new Error("Failed to create field in DB");
        return res.id as string;
      } catch (err) {
        console.error('Error creando Field en DB:', { idx, error: err });
        throw err;
      }
    }));
    return createdFields; // array de field IDs
  }

  // 4. Crear Tasks en DB
  async function createServiceTasksInDB(serviceId: string, tasks: any[]) {
    const createdTasks: { id: string; taskName: string; taskType: string; userEmail: string }[] = [];
    for (const task of tasks) {
      const response = await createTask({
        serviceId,
        taskName: task.taskName,
        taskType: task.taskType,
        userEmail: task.userEmail,
        tmpSubtaskId: task.externalTemplateId,
        deleted: false,
      });
      if (!response) throw new Error(`Failed to create task: ${task.taskName}`);
      createdTasks.push({
        id: response.id as string,
        taskName: task.taskName,
        taskType: task.taskType,
        userEmail: task.userEmail,
      });
    }
    return createdTasks;
  }

  // 5. Asociar cada Field a cada Task mediante TaskField
  async function associateFieldsToTasks(taskIds: string[], fieldIds: string[]) {
    await Promise.all(taskIds.flatMap(taskId =>
      fieldIds.map(fieldId =>
        createTaskField({ taskId, fieldId })
      )
    ));
  }

  // 5. Crear Subtasks en JIRA (en orden)
  async function createJiraSubtasks(issueKey: string, tasks: any[], description: string, locale: string, domain: string, project: string, serviceDeskId: string, serviceId: string, createdTasks: any[]) {
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      const createdTask = createdTasks[i]
      if (issueKey && description) {
        const baseUrl = process.env.NODE_ENV === 'production'
          ? process.env.NEXT_PUBLIC_SITE_URL
          : 'http://localhost:3000'
        const agtasksUrl = `${baseUrl}/${locale}/domains/${domain}/projects/${project}/tasks/${createdTask.id}`
        // Solo crea la subtask en JIRA, no mezcla lógica de DB
        await createJiraSubtask(
          issueKey, // parentIssueKey
          task.taskName, // summary
          task.userEmail, // userEmail
          description, // description
          agtasksUrl, // agtasksUrl
          task.taskType, // taskType
          serviceDeskId // serviceDeskId
        )
      }
    }
  }

  // --- PROCESO PRINCIPAL ---
  const onSubmit = async (data: CreateServiceFormValues) => {
    try {
      setIsSubmitting(true);
      const serviceName = `${selectedProtocolName} - ${data.workspaceName} - ${data.establishmentName}`;
      const { description, descriptionPlain } = await generateDescriptionField(data);
      
      // Obtener datos del proyecto
      let serviceDeskId = "" // "140"
      let requestTypeId = "" // "252"
      const res = await getProject(project as string);
      if (res && res.id) {
        serviceDeskId = res.serviceDeskId;
        requestTypeId = res.requestTypeId;
      }

      // 1. Crear Service en JIRA
      const jiraResponse = await createServiceInJiraOnly(
        serviceName,
        description,
        userEmail,
        serviceDeskId,
        requestTypeId
      )
      if (!jiraResponse.success || !jiraResponse.data?.issueKey) {
        throw new Error(`Failed to create Jira service: ${jiraResponse.error || 'No issueKey returned'}`);
      }
      const { issueKey } = jiraResponse.data;

      // 2. Crear Service en DB
      const serviceId = await createServiceInDB(data, project as string, serviceName, issueKey)
      
      // 3. Crear Fields en DB (una sola vez por Service)
      const fieldIds = await createServiceFieldsInDB(serviceId, data.selectedLots);

      // 4. Crear Tasks en DB
      const tasks = data.taskAssignments.map((task) => ({
        externalTemplateId: data.protocol,
        taskName: task.task,
        taskType: task.taskType,
        userEmail: task.assignedTo,
      }));
      const createdTasks = await createServiceTasksInDB(serviceId, tasks);

      // 5. Asociar cada Field a cada Task mediante TaskField
      await associateFieldsToTasks(createdTasks.map(t => t.id), fieldIds);
      
      // 5. Crear Subtasks en JIRA (en orden)
      await createJiraSubtasks(issueKey, tasks, descriptionPlain, locale as string, domain as string, project as string, serviceDeskId, serviceId, createdTasks)
      toast({
        title: "Servicio creado exitosamente",
        description: "El servicio y sus tareas fueron creados correctamente.",
        duration: 5000,
      });
      setIsSuccess(true);
    } catch (error) {
      toast({
        title: "Error al crear servicio",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Función para reiniciar el formulario 
  const createNewService = () => {
    // Reiniciar el formulario
    methods.reset(defaultValues)
    // Reiniciar el paso
    setCurrentStep(1)
    // Ocultar el mensaje de éxito
    setIsSuccess(false)
  }

  // Añadir una función para volver a la lista de servicios
  const goToServicesList = () => {
    router.push(`/${locale}/domains/${domain}/projects/${project}/services`)
  }

  // Nuevo renderizado con Card y Stepper visual
  return (
    <ServiceFormProvider>
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-[90%] max-w-4xl h-[80vh] flex flex-col justify-between shadow-md border border-gray-200">
          <CardHeader className="pb-0">
            <StepperBubbles currentStep={currentStep} />
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pt-0">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="h-full flex flex-col">
                <div className="flex-1">
                  {currentStep === 1 && <><h2 className="text-xl font-semibold mb-4">Paso 1: Protocolo</h2><Step1Protocol selectedProtocol={selectedProtocol} onSelectProtocol={setSelectedProtocol} selectedProtocolName={selectedProtocolName} onSelectProtocolName={setSelectedProtocolName} /></>}
                  {currentStep === 2 && <><h2 className="text-xl font-semibold mb-4">Paso 2: Selección de lotes</h2><Step2Lots userEmail={userEmail} /></>}
                  {currentStep === 3 && <><h2 className="text-xl font-semibold mb-4">Paso 3: Tareas</h2><Step3Tasks /></>}
                </div>
              </form>
            </FormProvider>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 bg-white sticky bottom-0 z-10 border-t border-gray-100 pt-4 pb-4">
            {currentStep > 1 && <Button type="button" variant="outline" onClick={prevStep}><ChevronLeft className="w-4 h-4 mr-1" /> Anterior</Button>}
            {currentStep < 3 && <Button type="button" onClick={nextStep}><ChevronRight className="w-4 h-4 ml-1" /> Siguiente</Button>}
            {currentStep === 3 && <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creando..." : "Crear Servicio"}</Button>}
          </CardFooter>
        </Card>
      </div>
    </ServiceFormProvider>
  )
}
