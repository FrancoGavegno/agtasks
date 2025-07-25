"use client"

import { useState } from "react"
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
import Step1Protocol from "./step1-protocol"
import Step2Lots from "./step2-lots"
import Step3Tasks from "./step3-tasks"
import {
  type ServiceFormFullValues,
  type TaskFormValues,
  type FieldFormValues,
  type TaskFieldFormValues,
  validateServiceForm,
} from "@/lib/amplify/schemas"
import { 
  ServiceFormProvider, 
  useServiceForm 
} from "@/lib/contexts/service-form-context"
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
  createTaskField,
  updateTask,
} from "@/lib/services/agtasks"

// Componente de debug temporal
function DebugContext() {
  const { formValues } = useServiceForm()
  
  if (process.env.NODE_ENV === 'production') return null
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">Debug Context:</h4>
      <div className="space-y-1">
        <div>Protocol: {formValues.protocolId || 'none'}</div>
        <div>Workspace: {formValues.workspace || 'none'}</div>
        <div>Campaign: {formValues.campaign || 'none'}</div>
        <div>Establishment: {formValues.establishment || 'none'}</div>
        <div>Tasks: {formValues.tasks?.length || 0}</div>
        <div>Fields: {formValues.fields?.length || 0}</div>
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

export default function CreateService({ userEmail }: Props) {
  const router = useRouter()
  const params = useParams()
  const { locale, domain, project } = params
  const t = useTranslations("CreateService")
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProtocol, setSelectedProtocol] = useState<string>("")
  const [selectedProtocolName, setSelectedProtocolName] = useState<string>("")

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const goToServicesList = () => {
    router.push(`/${locale}/domains/${domain}/projects/${project}/services`)
  }

  // Crea el Service en JIRA y retorna el issueKey
  async function createServiceInJiraOnly(
    serviceName: string, 
    description: string, 
    userEmail: string, 
    serviceDeskId: string, 
    requestTypeId: string
  ) {
    return await createServiceInJira(
      serviceName, 
      description, 
      userEmail, 
      serviceDeskId, 
      requestTypeId
    )
  }

  // Crear Service en DB
  async function createServiceInDB(data: ServiceFormFullValues): Promise<string> {
    const response = await createService(data)
    if (!response) throw new Error("Failed to create service in DB")
    return response.id || ""
  }

  // Crear Fields en DB 
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
        return response.id || "";
      } catch (err) {
        console.error('Error creando Field en DB:', { idx, error: err });
        throw err;
      }
    }));
    return createdFields; // array de field IDs
  }

  // Crear Tasks en DB
  async function createServiceTasksInDB(tasks: TaskFormValues[]) {
    const createdTasks = await Promise.all(tasks.map(async (task, idx) => {
      try {
        const response = await createTask({
          taskName: task.taskName,
          taskType: task.taskType,
          userEmail: task.userEmail || "",
          projectId: task.projectId,
          serviceId: task.serviceId,
          formId: task.formId,
          tmpSubtaskId: task.tmpSubtaskId,
          subtaskId: task.subtaskId,
        });
        if (!response) throw new Error("Failed to create task in DB");
        return response.id || "";
      } catch (err) {
        console.error('Error creando Task en DB:', { idx, error: err });
        throw err;
      }
    }));
    return createdTasks; // array de task IDs
  }

  // Crear Subtasks en JIRA (en orden) y devolver los keys
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
      if (response?.key) {
        subtaskKeys.push(response.key);
      } else {
        throw new Error(`Failed to create subtask for task: ${task.taskName}`);
      }
    }
    return subtaskKeys;
  }

  // Asociar cada Field a cada Task mediante TaskField
  async function associateFieldsToTasks(taskIds: string[], fieldIds: string[]) {
    await Promise.all(taskIds.flatMap(taskId =>
      fieldIds.map(fieldId => {
        const tf: TaskFieldFormValues = { taskId, fieldId };
        return createTaskField(tf);
      })
    ));
  }
  
  // Componente interno que usa el contexto
  function CreateServiceForm() {
    const { 
      formValues, 
      enabledTasks,
      updateFormValues 
    } = useServiceForm()

    const nextStep = async () => {
      let isValid = false
      let errors: { [key: string]: string } = {}
      
      switch (currentStep) {
        case 1:
          // Validar solo protocolo en paso 1
          if (!formValues.protocolId || formValues.protocolId.trim() === "") {
            errors.protocolId = "Debes seleccionar un protocolo"
          } else {
            isValid = true
          }
          break
        case 2:
          // Validar solo campos en paso 2
          if (!formValues.fields || formValues.fields.length === 0) {
            errors.fields = "Debes seleccionar al menos un lote"
          } else {
            isValid = true
          }
          break
        case 3:
          // Validar todo el formulario en paso 3
          errors = validateServiceForm(formValues, enabledTasks)
          if (Object.keys(errors).length === 0) {
            isValid = true
            await onSubmit();
            return;
          }
          break
      }
      
      if (!isValid) {
        const firstError = Object.values(errors)[0] || "Por favor, completa todos los campos requeridos."
        toast({
          title: "Formulario incompleto",
          description: firstError,
          variant: "destructive",
        });
        return;
      }
      
      setCurrentStep(currentStep + 1)
    }

    const onSubmit = async () => {
      try {
        setIsSubmitting(true);

        // Generar el nombre del servicio
        const serviceName = `${selectedProtocolName} - ${formValues.fields[0]?.workspaceName || ''} - ${formValues.fields[0]?.farmName || ''}`;

        // Obtener datos del proyecto
        let serviceDeskId = "";
        let requestTypeId = "";
        const response = await getProject(project as string);
        if (response && response.id) {
          serviceDeskId = response.serviceDeskId;
          requestTypeId = response.requestTypeId;
        }

        // Crear Service en JIRA
        const jiraResponse = await createServiceInJiraOnly(
          serviceName,
          "", // description placeholder
          userEmail,
          serviceDeskId,
          requestTypeId
        );
        if (!jiraResponse.success || !jiraResponse.data?.issueKey) {
          throw new Error(`Failed to create Jira service: ${jiraResponse.error || 'No issueKey returned'}`);
        }
        const { issueKey } = jiraResponse.data;

        // Generar la descripción
        const { description, descriptionPlain } = await generateDescriptionField({
          name: serviceName,
          protocolId: formValues.protocolId || "",
          projectId: project as string,
          requestId: issueKey,
          tmpRequestId: formValues.tmpRequestId || "",
          deleted: false,
          tasks: formValues.tasks || [],
          fields: formValues.fields || [],
        });

        // Crear Service en DB
        const serviceId = await createServiceInDB({ 
            name: serviceName,
            protocolId: formValues.protocolId || "",
            projectId: project as string,
            requestId: issueKey,
            tmpRequestId: formValues.tmpRequestId || "",
            deleted: false,
            tasks: formValues.tasks || [],
            fields: formValues.fields || [],
          });

        // Crear Fields en DB
        const fieldIds = await createServiceFieldsInDB(formValues.fields);

        // Crear Tasks en DB (sin subtaskId) - Filtrar tareas duplicadas
        const uniqueTasks = (formValues.tasks || []).filter((task: any, index: number, self: any[]) => 
          index === self.findIndex((t: any) => t.tmpSubtaskId === task.tmpSubtaskId)
        );
        
        const tasks: TaskFormValues[] = uniqueTasks.map((task: any) => ({
          ...task,
          projectId: project as string,
          serviceId: serviceId,
        }));
        const taskIds = await createServiceTasksInDB(tasks);

        // Crear Subtasks en JIRA y obtener los keys
        const subtaskKeys = await createSubtasksInJira(
          issueKey, 
          tasks, 
          descriptionPlain, 
          locale as string, 
          domain as string, 
          project as string
        );

        // Actualizar las tasks con el subtaskId de Jira
        await Promise.all(taskIds.map((taskId, idx) =>
          updateTask(taskId, { subtaskId: subtaskKeys[idx] })
        ));

        // Asociar cada Field a cada Task mediante TaskField
        await associateFieldsToTasks(taskIds, fieldIds);

        toast({
          title: "Servicio creado exitosamente",
          description: "El servicio y sus tareas fueron creados correctamente.",
          duration: 5000,
        });

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
                    <Step1Protocol 
                      selectedProtocol={selectedProtocol} 
                      onSelectProtocol={setSelectedProtocol} 
                      selectedProtocolName={selectedProtocolName} 
                      onSelectProtocolName={setSelectedProtocolName} 
                    />
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Paso 2: Selección de lotes</h2>
                    <Step2Lots userEmail={userEmail} />
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Paso 3: Asignación de tareas</h2>
                    <Step3Tasks />
                  </>
                )}
              </div>
              <CardFooter className="flex justify-end gap-2 bg-white sticky bottom-0 z-10 border-t border-gray-100 pt-4 pb-4">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                  </Button>
                )}
                {currentStep < 3 && (
                  <Button type="button" onClick={nextStep}>
                    <ChevronRight className="w-4 h-4 ml-1" /> Siguiente
                  </Button>
                )}
                {currentStep === 3 && (
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={nextStep}
                  >
                    {isSubmitting ? "Creando..." : "Crear Servicio"}
                  </Button>
                )}
              </CardFooter>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ServiceFormProvider>
      <CreateServiceForm />
      <DebugContext />
    </ServiceFormProvider>
  )
}
