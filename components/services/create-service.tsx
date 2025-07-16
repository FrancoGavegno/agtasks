"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  // CardTitle
} from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Step1Protocol from "./step1-protocol"
import Step2Lots from "./step2-lots"
import Step3Tasks from "./step3-tasks"
import {
  serviceFormSchema,
  // tasksArraySchema,
  // fieldsArraySchema,
  type ServiceFormFullValues,
  type TaskFormValues,
  type FieldFormValues,
  type TaskFieldFormValues,
} from "./validation-schemas"
import { ServiceFormProvider } from "@/lib/contexts/service-form-context"
import {
  generateDescriptionField,
  createService as createServiceInJira,
  createSubtask as createJiraSubtask
} from "@/lib/integrations/jira"
import { useTranslations } from "next-intl"
import {
  getProject,
  createService,
  createField,
  createTask,
  createTaskField
} from "@/lib/services/agtasks"
// import { json } from "stream/consumers"

const defaultValues: ServiceFormFullValues = {
  name: "",
  projectId: "",
  protocolId: "",
  tmpRequestId: "",
  requestId: "",
  deleted: false,
  tasks: [],
  fields: [],
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

  const methods = useForm<ServiceFormFullValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      ...defaultValues,
    },
    mode: "onChange",
  })

  const nextStep = async () => {
    let isValid = false
    switch (currentStep) {
      case 1:
        isValid = await methods.trigger(["protocolId"])
        if (!isValid) {
          const errorMsg = methods.formState.errors.protocolId?.message || "Debes seleccionar un protocolo";
          toast({
            title: "Formulario incompleto",
            description: errorMsg,
            variant: "destructive",
          });
          return;
        }
        break
      case 2:
        isValid = await methods.trigger(["fields"])
        if (!isValid) {
          const errorMsg = methods.formState.errors.fields?.message || "Debes seleccionar al menos un lote";
          toast({
            title: "Formulario incompleto",
            description: errorMsg,
            variant: "destructive",
          });
          return;
        }
        break
      case 3:
        isValid = await methods.trigger("tasks");
        if (!isValid) {
          const errorMsg = methods.formState.errors.tasks?.message || "Todas las tareas deben tener un usuario asignado";
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
  async function createServiceInDB(data: ServiceFormFullValues): Promise<string> {
    const response = await createService(data)
    if (!response) throw new Error("Failed to create service in DB")
    return response.id as string
  }

  // 3. Crear Fields en DB 
  async function createServiceFieldsInDB(lots: FieldFormValues[]) {
    const createdFields = await Promise.all(lots.map(async (field, idx) => {
      try {
        const response = await createField({
          workspaceId: field.workspaceId,
          workspaceName: field.workspaceName,
          campaignId: field.campaignId,
          campaignName: field.campaignName,
          farmId: field.farmId,
          farmName: field.farmName,
          fieldId: field.fieldId,
          fieldName: field.fieldName,
          hectares: field.hectares,
          crop: field.crop,
          hybrid: field.hybrid,
        });
        if (!response) throw new Error("Failed to create field in DB");
        return response.id as string;
      } catch (err) {
        console.error('Error creando Field en DB:', { idx, error: err });
        throw err;
      }
    }));
    return createdFields; // array de field IDs
  }

  // 4. Crear Tasks en DB
  async function createServiceTasksInDB(tasks: TaskFormValues[]) {
    const createdTasks = await Promise.all(tasks.map(async (task, idx) => {
      try {
        const response = await createTask({
          projectId: task.projectId,
          serviceId: task.serviceId,
          tmpSubtaskId: task.tmpSubtaskId,
          subtaskId: task.subtaskId,
          taskName: task.taskName,
          taskType: task.taskType,
          userEmail: task.userEmail,
          formId: task.formId,
        });
        if (!response) throw new Error("Failed to create field in DB");
        return response.id as string;
      } catch (err) {
        console.error('Error creando Field en DB:', { idx, error: err });
        throw err;
      }
    }));
    return createdTasks; // array de field IDs
  }

  // 5. Crear Subtasks en JIRA (en orden) y devolver los keys
  async function createSubtasksInJira(
    issueKey: string, 
    tasks: any[], 
    description: string, 
    locale: string, 
    domain: string, 
    project: string, 
  ) {
    const subtaskKeys: string[] = [];
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const baseUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_SITE_URL
        : 'http://localhost:3000';
      const agtasksUrl = `${baseUrl}/${locale}/domains/${domain}/projects/${project}/tasks/`;
      const response = await createJiraSubtask(
        issueKey,
        task.taskName,
        task.userEmail,
        description,
        agtasksUrl,
        task.taskType
      );
      subtaskKeys.push(response?.key || "");
    }
    return subtaskKeys;
  }

  // 7. Asociar cada Field a cada Task mediante TaskField
  async function associateFieldsToTasks(taskIds: string[], fieldIds: string[]) {
    await Promise.all(taskIds.flatMap(taskId =>
      fieldIds.map(fieldId => {
        const tf: TaskFieldFormValues = { taskId, fieldId };
        return createTaskField(tf);
      })
    ));
  }

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      // Generar el nombre del servicio
      const serviceName = `${selectedProtocolName} - ${data.fields[0]?.workspaceName || ''} - ${data.fields[0]?.farmName || ''}`;

      // Generar la descripción
      const { description, descriptionPlain } = await generateDescriptionField(data);

      // Obtener datos del proyecto
      let serviceDeskId = "";
      let requestTypeId = "";
      const response = await getProject(project as string);
      if (response && response.id) {
        serviceDeskId = response.serviceDeskId;
        requestTypeId = response.requestTypeId;
      }

      // 1. Crear Service en JIRA
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

      // 2. Crear Service en DB
      const serviceId = await createServiceInDB({ 
          ...data,
          projectId: project as string,
          requestId: issueKey,
          name: serviceName,
        });

      // 3. Crear Fields en DB
      const fieldIds = await createServiceFieldsInDB(data.fields);

      // 4. Crear Tasks en DB
      const tasks: TaskFormValues[] = (data.tasks || []).map((task: any) => ({
        ...task,
        projectId: project as string,
        serviceId: serviceId,
      }));
      const taskIds = await createServiceTasksInDB(tasks);

      // 5. Crear Subtasks en JIRA y obtener los keys
      const subtaskKeys = await createSubtasksInJira(
        issueKey, 
        tasks, 
        descriptionPlain, 
        locale as string, 
        domain as string, 
        project as string
      );

      // 6. Asignar los keys a las tareas y guardar en DB
      const tasksWithSubtaskId: TaskFormValues[] = tasks.map((task, idx) => ({
        ...task,
        subtaskId: subtaskKeys[idx],
        projectId: project as string,
        serviceId: serviceId,
      }));
      const taskIdsDB = await createServiceTasksInDB(tasksWithSubtaskId);

      // 7. Asociar cada Field a cada Task mediante TaskField
      await associateFieldsToTasks(taskIdsDB, fieldIds);

      toast({
        title: "Servicio creado exitosamente",
        description: "El servicio y sus tareas fueron creados correctamente.",
        duration: 5000,
      });
      setIsSuccess(true);

      goToServicesList();
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
  // const createNewService = () => {
  //   // Reiniciar el formulario
  //   methods.reset(defaultValues)
  //   // Reiniciar el paso
  //   setCurrentStep(1)
  //   // Ocultar el mensaje de éxito
  //   setIsSuccess(false)
  // }

  // Añadir una función para volver a la lista de servicios
  const goToServicesList = () => {
    router.push(`/${locale}/domains/${domain}/projects/${project}/services`)
  }

  return (
    <ServiceFormProvider>
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-[90%] max-w-4xl h-[80vh] flex flex-col justify-between shadow-md border border-gray-200">
          <CardHeader className="pb-0">
            <StepperBubbles currentStep={currentStep} />
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pt-0">
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit, (errors) => {
                  toast({
                    title: "Formulario incompleto",
                    description: "Por favor, completa todos los campos requeridos.",
                    variant: "destructive",
                  });
                })}
                className="h-full flex flex-col"
              >
                <div className="flex-1">
                  {currentStep === 1 && <><h2 className="text-xl font-semibold mb-4">Paso 1: Selección de protocolo de servicio</h2><Step1Protocol selectedProtocol={selectedProtocol} onSelectProtocol={setSelectedProtocol} selectedProtocolName={selectedProtocolName} onSelectProtocolName={setSelectedProtocolName} /></>}
                  {currentStep === 2 && <><h2 className="text-xl font-semibold mb-4">Paso 2: Selección de lotes</h2><Step2Lots userEmail={userEmail} /></>}
                  {currentStep === 3 && <><h2 className="text-xl font-semibold mb-4">Paso 3: Asignación de tareas</h2><Step3Tasks /></>}
                </div>
                <CardFooter className="flex justify-end gap-2 bg-white sticky bottom-0 z-10 border-t border-gray-100 pt-4 pb-4">
                  {currentStep > 1 && <Button type="button" variant="outline" onClick={prevStep}><ChevronLeft className="w-4 h-4 mr-1" /> Anterior</Button>}
                  {currentStep < 3 && <Button type="button" onClick={nextStep}><ChevronRight className="w-4 h-4 ml-1" /> Siguiente</Button>}
                  {currentStep === 3 && (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creando..." : "Crear Servicio"}
                    </Button>
                  )}
                </CardFooter>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </ServiceFormProvider>
  )
}
