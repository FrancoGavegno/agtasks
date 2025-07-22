"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  useForm,
  FormProvider
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card"
import {
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Step1TaskType from "./step1-task-type"
import Step2Lots from "./step2-lots"
import Step3Details from "./step3-details"
import {
  createTaskStepperSchema,
  type CreateTaskStepperFormValues,
  type TaskFormValues,
  type FieldFormValues,
  type TaskFieldFormValues,
} from "@/lib/schemas"

import { 
  createTask, 
  createField, 
  createTaskField,
  updateTask 
} from "@/lib/services/agtasks"

import {
  generateDescriptionField,
  createIssue
} from "@/lib/integrations/jira"

const defaultValues: CreateTaskStepperFormValues = {
  name: "",
  taskType: "",
  workspace: "",
  campaign: "",
  establishment: "",
  selectedLots: [],
  projectId: "",
  serviceId: "",
  userEmail: "",
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

export default function CreateTaskStepper({
  projectId,
  userEmail,
  services,
  projectName
}: {
  projectId: string,
  userEmail: string,
  services: any[],
  projectName: string
}) {
  const router = useRouter()
  const params = useParams()
  const { locale, domain, project } = params
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const methods = useForm<CreateTaskStepperFormValues>({
    resolver: zodResolver(createTaskStepperSchema),
    defaultValues: {
      ...defaultValues,
      projectId,
    },
    mode: "onChange",
  })

  const nextStep = async () => {
    let isValid = false
    switch (currentStep) {
      case 1:
        isValid = await methods.trigger(["name", "taskType"])
        if (!isValid) {
          const errorMsg = methods.formState.errors.name?.message || methods.formState.errors.taskType?.message || "Debes completar el nombre y tipo de tarea";
          toast({
            title: "Formulario incompleto",
            description: String(errorMsg),
            variant: "destructive",
          });
          return;
        }
        break
      case 2:
        isValid = await methods.trigger(["selectedLots"])
        if (!isValid) {
          const errorMsg = methods.formState.errors.selectedLots?.message || "Debes seleccionar al menos un lote";
          toast({
            title: "Formulario incompleto",
            description: String(errorMsg),
            variant: "destructive",
          });
          return;
        }
        break
      case 3:
        isValid = await methods.trigger(["userEmail"]);
        if (!isValid) {
          const errorMsg = methods.formState.errors.userEmail?.message || "Debes seleccionar un usuario asignado";
          toast({
            title: "Formulario incompleto",
            description: String(errorMsg),
            variant: "destructive",
          });
          return;
        }
        onSubmit(methods.getValues());
        return;
    }
    if (isValid) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => setCurrentStep(currentStep - 1)

  // Crear Task en DB
  async function createTaskInDB(data: any): Promise<string> {
    const taskData: TaskFormValues = {
      projectId: data.projectId,
      serviceId: data.serviceId || "",
      taskName: data.name,
      taskType: data.taskType,
      userEmail: data.userEmail,
      tmpSubtaskId: "",
      subtaskId: "",
    }
    const response = await createTask(taskData)
    if (!response) throw new Error("Failed to create task in DB")
    return response.id as string
  }

  // Crear Fields en DB
  async function createTaskFieldsInDB(lots: any[]) {
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
    return createdFields;
  }

  // Asociar cada Field a la Task mediante TaskField
  async function associateFieldsToTask(taskId: string, fieldIds: string[]) {
    await Promise.all(fieldIds.map(fieldId => {
      const tf: TaskFieldFormValues = { taskId, fieldId };
      return createTaskField(tf);
    }));
  }

  // Crear Issue en Jira
  async function createIssueInJira(taskName: string, description: string, userEmail: string) {
    const response = await createIssue(
      "", // parentIssueKey (no es subtask)
      taskName,
      userEmail,
      description
    );
    if (!response) throw new Error("Failed to create issue in Jira");
    return response;
  }

  const onSubmit = async (data: any) => {
    console.log("data: ", data)

    try {
      setIsSubmitting(true);

      // Generar la descripción
      const { description, descriptionPlain } = await generateDescriptionField({
        name: data.name,
        projectId: data.projectId,
        protocolId: "",
        tmpRequestId: "",
        requestId: "",
        deleted: false,
        tasks: [{
          taskName: data.name,
          taskType: data.taskType,
          userEmail: data.userEmail,
          tmpSubtaskId: "",
        }],
        fields: data.selectedLots
      });

      // 1. Crear Task en DB
      const taskId = await createTaskInDB(data);

      // 2. Crear Fields en DB
      const fieldIds = await createTaskFieldsInDB(data.selectedLots);

      // 3. Asociar cada Field a la Task mediante TaskField
      await associateFieldsToTask(taskId, fieldIds);

      // 4. Crear Issue en Jira
      const jiraResponse = await createIssueInJira(
        data.name,
        "", // descriptionPlain,
        data.userEmail
      );

      // 5. Actualizar Task con el issueKey de Jira
      if (jiraResponse?.key) {
        await updateTask(taskId, { subtaskId: jiraResponse.key });
      }

      toast({
        title: "Tarea creada exitosamente",
        description: "La tarea y sus campos fueron creados correctamente.",
        duration: 5000,
      });
      setIsSuccess(true);
      
      // Redirigir a la lista de tareas
      router.push(`/${locale}/domains/${domain}/projects/${project}/tasks`);
    } catch (error) {
      toast({
        title: "Error al crear tarea",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
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
                  description: `Por favor, resuelve estos errores: ${JSON.stringify(errors)}`,
                  variant: "destructive",
                });
              })}
              className="h-full flex flex-col"
            >
              <div className="flex-1">
                {currentStep === 1 && <><h2 className="text-xl font-semibold mb-4">Paso 1: Tipo de tarea</h2><Step1TaskType /></>}
                {currentStep === 2 && <><h2 className="text-xl font-semibold mb-4">Paso 2: Selección de lotes</h2><Step2Lots userEmail={userEmail} /></>}
                {currentStep === 3 && <><h2 className="text-xl font-semibold mb-4">Paso 3: Detalles</h2><Step3Details services={services} projectName={projectName} /></>}
              </div>
              <CardFooter className="flex justify-end gap-2 bg-white sticky bottom-0 z-10 border-t border-gray-100 pt-4 pb-4">
                {currentStep > 1 && <Button type="button" variant="outline" onClick={prevStep}><ChevronLeft className="w-4 h-4 mr-1" /> Anterior</Button>}
                {currentStep < 3 && <Button type="button" onClick={nextStep}><ChevronRight className="w-4 h-4 ml-1" /> Siguiente</Button>}
                {currentStep === 3 && (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creando..." : "Crear Tarea"}
                  </Button>
                )}
              </CardFooter>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
} 