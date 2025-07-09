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

  // Renderizar el paso actual del wizard
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Protocol
          selectedProtocol={selectedProtocol}
          onSelectProtocol={setSelectedProtocol}
          selectedProtocolName={selectedProtocolName}
          onSelectProtocolName={setSelectedProtocolName} />
      case 2:
        return <Step2Lots userEmail={userEmail} />
      case 3:
        return <Step3Tasks />
      default:
        return null
    }
  }

  return (
    <ServiceFormProvider>
      <Card className="w-full max-w-6xl mx-auto border-none shadow-none min-h-[600px]">
        <CardHeader>
          <CardTitle>{t("CardTitle")}</CardTitle>
          <CardDescription>{t("CardDescription")}</CardDescription>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-500"}`}
              >
                1
              </div>
              <div className={`w-16 h-1 ${currentStep >= 2 ? "bg-primary" : "bg-gray-200"}`}></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-500"}`}
              >
                2
              </div>
              <div className={`w-16 h-1 ${currentStep >= 3 ? "bg-primary" : "bg-gray-200"}`}></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-500"}`}
              >
                3
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-center">{t("title")}</h3>
              <p className="text-center text-muted-foreground">{t("subtitle")}</p>
              <div className="flex space-x-4">
                <Button variant="outline" onClick={goToServicesList}>
                  {t("Button-1")}
                </Button>
                <Button onClick={createNewService}>
                  {t("Button-2")}
                </Button>
              </div>
            </div>
          ) : (
            <FormProvider {...methods}>{renderStep()}</FormProvider>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {!isSuccess && (
            <>
              {currentStep > 1 ? (
                <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {t("Button-3")}
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <Button onClick={nextStep} disabled={isSubmitting}>
                  {t("Button-4")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={nextStep} disabled={isSubmitting}>
                  {isSubmitting ? t("isSubmitting") : t("isSubmitting-2")}
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </ServiceFormProvider>
  )
}
