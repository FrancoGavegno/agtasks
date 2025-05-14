"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useRouter, useParams } from "next/navigation"

// Importar los componentes de los pasos
import Step1Protocol from "./step1-protocol"
import Step2Lots from "./step2-lots"
import Step3Tasks from "./step3-tasks"

// Importar los esquemas de validación
import { createServiceSchema, type CreateServiceFormValues } from "./validation-schemas"

// Importar el contexto del formulario
import { ServiceFormProvider } from "@/lib/contexts/service-form-context"

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
  const { locale, projectId, domainId } = params
  // const projectId = params.project as string
  // const domainId = "8644" // TODO: Get domainId from params

  // Estado para controlar el paso actual del wizard
  const [currentStep, setCurrentStep] = useState(1)
  // Estado para controlar si se debe hacer scroll al inicio
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false)
  // Estado para controlar si se está enviando el formulario
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        console.log("Validando paso 1, taskAssignments:", methods.getValues("taskAssignments"))
        isValid = await methods.trigger("protocol")
        if (isValid) {
          // Asegurarse de que taskAssignments esté disponible para el siguiente paso
          const protocol = methods.getValues("protocol")
          const taskAssignments = methods.getValues("taskAssignments")
          console.log("Protocolo seleccionado:", protocol, "Tareas:", taskAssignments)
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
  const resetForm = () => {
    methods.reset(defaultValues)
    setCurrentStep(1)
    setShouldScrollToTop(true)
  }

  // Función para manejar el envío del formulario
  const onSubmit = async (data: CreateServiceFormValues) => {
    try {
      setIsSubmitting(true)

      // Preparar los datos para enviar al API
      const serviceData = {
        projectId: projectId,
        serviceName: `Servicio de ${data.protocol === "variable-seeding" ? "Siembra Variable" : "Monitoreo Satelital"}`,
        externalServiceKey: "", // Se generará en el backend
        sourceSystem: "jira",
        externalTemplateId: data.protocol,
        workspaceId: data.workspace,
        campaignId: data.campaign,
        farmId: data.establishment,
        totalArea: 0, // Se calculará en base a los lotes seleccionados
        startDate: new Date().toISOString(),
        fields: data.selectedLots,
        tasks: data.taskAssignments
          .filter((task) => task.role && task.assignedTo) // Solo incluir tareas con rol y usuario asignados
          .map((task) => ({
            externalTemplateId: data.protocol,
            sourceSystem: "jira",
            roleId: task.role,
            userId: task.assignedTo,
          })),
      }

      // Enviar los datos al API
      const response = await fetch(`/api/v1/agtasks/domains/${domainId}/projects/${projectId}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error: ${response.status}`)
      }

      // Mostrar mensaje de confirmación
      toast({
        title: "Servicio creado exitosamente",
        description: "El servicio ha sido creado con éxito.",
        duration: 5000,
      })

      // Redirigir a la página de servicios
      router.push(`${locale}/domains/${domainId}/projects/${projectId}/services`)
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

  // Renderizar el paso actual del wizard
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Protocol />
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
      <Card className="w-full max-w-6xl mx-auto border-none min-h-[600px]">
        <CardHeader>
          <CardTitle>Crear Nuevo Servicio</CardTitle>
          <CardDescription>Complete los siguientes pasos para crear un nuevo servicio</CardDescription>

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
          <FormProvider {...methods}>{renderStep()}</FormProvider>
        </CardContent>

        <CardFooter className="flex justify-between">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Atrás
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 ? (
            <Button onClick={nextStep} disabled={isSubmitting}>
              Siguiente
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Confirmar"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </ServiceFormProvider>
  )
}
