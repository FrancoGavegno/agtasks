"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useRouter, useParams } from "next/navigation"
import Step1Protocol from "./step1-protocol"
import Step2Lots from "./step2-lots"
import Step3Tasks from "./step3-tasks"
import { createServiceSchema, type CreateServiceFormValues } from "./validation-schemas"
import { ServiceFormProvider } from "@/lib/contexts/service-form-context"
import { useTranslations } from "next-intl"

// Valores iniciales del formulario
const defaultValues: CreateServiceFormValues = {
  protocol: "",
  workspace: "",
  campaign: "",
  establishment: "",
  selectedLots: [],
  taskAssignments: [],
}

export default function CreateService() {
  const router = useRouter()
  const params = useParams()
  const { locale, project, domain } = params
  const t = useTranslations("CreateService")

  // Estado para controlar el paso actual del wizard
  const [currentStep, setCurrentStep] = useState(1)
  // Estado para controlar si se debe hacer scroll al inicio
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false)
  // Estado para controlar si se está enviando el formulario
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Añadir un nuevo estado para controlar si se muestra el mensaje de éxito
  const [isSuccess, setIsSuccess] = useState(false)

  // state to capture the selected protocol
  const [selectedProtocol, setSelectedProtocol] = useState<string>("")
  const [selectedProtocolName, setSelectedProtocolName] = useState<string>("")

  // Configurar el formulario con react-hook-form y zod
  const methods = useForm<CreateServiceFormValues>({
    resolver: zodResolver(createServiceSchema),
    defaultValues,
    mode: "onChange",
  })

  // Función para validar el paso actual y avanzar al siguiente
  const nextStep = async () => {
    let isValid = false

    switch (currentStep) {
      case 1:
        // console.log("Validando paso 1, taskAssignments:", methods.getValues("taskAssignments"))
        isValid = await methods.trigger("protocol")
        if (isValid) {
          // Asegurarse de que taskAssignments esté disponible para el siguiente paso
          const protocol = methods.getValues("protocol")
          const taskAssignments = methods.getValues("taskAssignments")
          // console.log("Protocolo seleccionado:", protocol, "Tareas:", taskAssignments)
        }
        break
      case 2:
        // Marcar los campos como "touched" antes de validar
        methods.setValue("selectedLots", methods.getValues("selectedLots"), { shouldDirty: true })
        isValid = await methods.trigger(["workspace", "campaign", "establishment", "selectedLots"])
        break
      case 3:
        // Solo validar las tareas que tienen un rol seleccionado
        const taskAssignments = methods.getValues("taskAssignments")

        // Validar solo las tareas con roles asignados
        const tasksWithRoles = taskAssignments.filter((task) => task.role)

        if (tasksWithRoles.length === 0) {
          // Si no hay tareas con roles, mostrar un mensaje
          toast({
            title: "Asignación incompleta",
            description: "Por favor, asigne al menos un rol a una tarea",
            variant: "destructive",
          })
          return
        }

        // Validar que todas las tareas con roles tengan usuarios asignados
        const incompleteAssignments = tasksWithRoles.filter((task) => !task.assignedTo)

        if (incompleteAssignments.length > 0) {
          // Si hay tareas con roles pero sin usuarios, mostrar un mensaje
          toast({
            title: "Asignación incompleta",
            description: "Por favor, asigne usuarios a todas las tareas con roles",
            variant: "destructive",
          })
          return
        }

        // Si llegamos aquí, la validación es correcta
        isValid = true

        // Enviar el formulario
        onSubmit(methods.getValues())
        return // Retornar aquí para evitar avanzar al siguiente paso
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

  // Función para reiniciar el formulario
  // const resetForm = () => {
  //   methods.reset(defaultValues)
  //   setCurrentStep(1)
  //   setShouldScrollToTop(true)
  // }

  // Envío del formulario
  const onSubmit = async (data: CreateServiceFormValues) => {
    try {
      setIsSubmitting(true)
      // console.log("Form data to submit:", data)

      // Filtrar solo las tareas que tienen rol y usuario asignados
      const validTasks = data.taskAssignments.filter((task) => task.role && task.assignedTo)

      // console.log("serviceName: ", `${selectedProtocolName} - ${data.workspaceName} - ${data.establishmentName}`)

      // Preparar los datos para enviar al API
      const serviceData = {
        projectId: project as string,
        serviceName: `${selectedProtocolName} - ${data.workspaceName} - ${data.establishmentName}`, 
        externalServiceKey: `SRV-${Date.now()}`, // Generar un ID único
        sourceSystem: "jira",
        externalTemplateId: data.protocol,
        workspaceId: data.workspace,
        workspaceName: data.workspaceName || "", // Incluir el nombre del workspace
        campaignId: data.campaign,
        campaignName: data.campaignName || "", // Incluir el nombre de la campaña
        farmId: data.establishment,
        farmName: data.establishmentName || "", // Incluir el nombre del establecimiento
        totalArea: 0, // Se calculará en el backend basado en los lotes seleccionados
        startDate: new Date().toISOString(),
        // Enviar los lotes seleccionados en el formato correcto con sus nombres
        fields: data.selectedLots.map((lotId) => ({
          fieldId: lotId,
          fieldName: data.selectedLotsNames?.[lotId] || "",
        })),
        // Enviar las tareas en el formato correcto
        tasks: validTasks.map((task) => ({
          externalTemplateId: data.protocol,
          sourceSystem: "jira",
          roleId: task.role,
          userId: task.assignedTo,
          taskName: task.task,
        })),
      }

      // console.log("Service data to send:", serviceData)

      // Enviar los datos al API
      const response = await fetch(`/api/v1/agtasks/domains/${domain}/projects/${project}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API error response:", errorData)
        throw new Error(errorData.error || errorData.message || `Error: ${response.status}`)
      }

      // Mostrar mensaje de confirmación
      toast({
        title: "Servicio creado exitosamente",
        description: "El servicio ha sido creado con éxito.",
        duration: 5000,
      })

      // Marcar como exitoso y permitir crear otro
      setIsSuccess(true)

      // No redirigir automáticamente para permitir crear otro servicio
      // router.push(`${locale}/domains/${domain}/projects/${project}/services`)
    } catch (error) {
      console.error("Error creating service:", error)
      toast({
        title: "Error al crear el servicio",
        description: `Ha ocurrido un error al crear el servicio: ${error instanceof Error ? error.message : "Error desconocido"}`,
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
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
        return <Step2Lots />
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
