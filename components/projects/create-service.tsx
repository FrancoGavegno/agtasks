"use client"

import { useState } from "react"
import { 
  useForm, 
  FormProvider 
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  useRouter, 
  useParams 
} from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
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
  createServiceSchema,
  type CreateServiceFormValues,
} from "./validation-schemas"
import {
  ServiceFormProvider
} from "@/lib/contexts/service-form-context"
import {
  generateDescriptionField,
  createService
} from "@/lib/integrations/jira"
import {
  createService as createAgService,
  createServiceFields,
  createServiceTasks,
  getProject
} from "@/lib/services/agtasks"
import { useTranslations } from "next-intl"

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
  // Estado para controlar el paso actual del wizard
  const [currentStep, setCurrentStep] = useState(1)
  // Estado para controlar si se debe hacer scroll al inicio
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedProtocol, setSelectedProtocol] = useState<string>("")
  const [selectedProtocolName, setSelectedProtocolName] = useState<string>("")

  // Configurar el formulario con react-hook-form y zod
  const methods = useForm<CreateServiceFormValues>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      ...defaultValues,
    },
    mode: "onChange",
  })

  // Función para validar el paso actual y avanzar al siguiente
  const nextStep = async () => {
    let isValid = false

    switch (currentStep) {
      case 1:
        isValid = await methods.trigger("protocol")
        if (isValid) {
          const protocol = methods.getValues("protocol")
          const taskAssignments = methods.getValues("taskAssignments")
        }
        break
      case 2:
        methods.setValue("selectedLots", methods.getValues("selectedLots"), { shouldDirty: true })
        isValid = await methods.trigger(["workspace", "campaign", "establishment", "selectedLots"])
        break
      case 3:
        // Validar que todas las tareas tengan usuario asignado usando el schema
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

  // Función para retroceder al paso anterior
  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    setShouldScrollToTop(true)
  }

  const onSubmit = async (data: CreateServiceFormValues) => {
    try {
      setIsSubmitting(true);
      const serviceName = `${selectedProtocolName} - ${data.workspaceName} - ${data.establishmentName}`;
      const { description, descriptionPlain } = await generateDescriptionField(data);

      // if Project exists then set serviceDeskId and requestTypeId
      let serviceDeskId = "" // "140"
      let requestTypeId = "" // "252"
      
      const res = await getProject(project as string);
      if (res.id) {
        serviceDeskId = res.projectId
        requestTypeId = res.requestTypeId
      }
      // console.log(serviceDeskId, requestTypeId)
          
      // Create Service in Jira
      const jiraResponse = await createService(
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
      
      // Create Service in Agtasks
      const agResponse = await createAgService(
        data, 
        project as string, 
        serviceName, 
        issueKey
      );
      const { id } = agResponse;

      // Create Service Fields in Agtasks 
      await createServiceFields(id, data.selectedLots)
      
      // Create Service Tasks in Agtasks and Jira
      const tasks = data.taskAssignments.map((task) => ({
        externalTemplateId: data.protocol,
        taskName: task.task,
        taskType: task.taskType,
        userEmail: task.assignedTo,
        parentIssueKey: issueKey,
        description: descriptionPlain,
      }));

      if (tasks.length > 0) {
        await createServiceTasks(
          id, 
          tasks, 
          locale as string, 
          domain as string, 
          project as string, 
          serviceDeskId
        );
      }

      toast({
        title: "Servicio creado exitosamente",
        description: "El servicio y sus tareas fueron creados correctamente.",
        duration: 5000,
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Error creating service:", error);
      toast({
        title: "Error al crear el servicio",
        description: `Ha ocurrido un error al crear el servicio: ${error instanceof Error ? error.message : "Error desconocido"}`,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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