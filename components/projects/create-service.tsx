"use client"

import { useState, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "@/hooks/use-toast"

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
  // Estado para controlar el paso actual del wizard
  const [currentStep, setCurrentStep] = useState(1)
  // Estado para controlar si se debe hacer scroll al inicio
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false)

  // Configurar el formulario con react-hook-form y zod
  const methods = useForm<CreateServiceFormValues>({
    resolver: zodResolver(createServiceSchema),
    defaultValues,
    mode: "onChange",
  })

  // Efecto para hacer scroll al inicio cuando cambia el paso
  useEffect(() => {
    if (shouldScrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      setShouldScrollToTop(false)
    }
  }, [shouldScrollToTop])

  // Función para validar el paso actual y avanzar al siguiente
  const nextStep = async () => {
    let isValid = false

    switch (currentStep) {
      case 1:
        isValid = await methods.trigger("protocol")
        break
      case 2:
        // Marcar los campos como "touched" antes de validar
        methods.setValue("selectedLots", methods.getValues("selectedLots"), {
          shouldValidate: true,
          shouldTouch: true,
          shouldDirty: true,
        })

        isValid = await methods.trigger(["workspace", "campaign", "establishment", "selectedLots"])

        // Si no es válido y específicamente el error es en selectedLots, mostrar un toast
        if (!isValid && methods.formState.errors.selectedLots) {
          toast({
            title: "Selección incompleta",
            description: "Por favor, seleccione al menos un lote para continuar",
            variant: "destructive",
          })
        }
        break
      case 3:
        // Marcar todos los campos de tareas como "touched"
        const taskAssignments = methods.getValues("taskAssignments")
        taskAssignments.forEach((_, index) => {
          methods.setValue(`taskAssignments.${index}.role`, methods.getValues(`taskAssignments.${index}.role`), {
            shouldValidate: true,
            shouldTouch: true,
            shouldDirty: true,
          })
          methods.setValue(
            `taskAssignments.${index}.assignedTo`,
            methods.getValues(`taskAssignments.${index}.assignedTo`),
            {
              shouldValidate: true,
              shouldTouch: true,
              shouldDirty: true,
            },
          )
        })

        // Validar todas las tareas
        isValid = await methods.trigger("taskAssignments")

        // Verificar si hay tareas con roles asignados
        const tasksWithRoles = taskAssignments.filter((task) => task.role)

        if (tasksWithRoles.length === 0) {
          toast({
            title: "Asignación incompleta",
            description: "Por favor, asigne al menos un rol a una tarea",
            variant: "destructive",
          })
          return
        }

        // Verificar si todas las tareas con roles tienen usuarios asignados
        const incompleteAssignments = tasksWithRoles.filter((task) => !task.assignedTo)

        if (incompleteAssignments.length > 0) {
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
  const onSubmit = (data: CreateServiceFormValues) => {
    // Aquí iría la lógica para enviar los datos al servidor
    console.log("Datos del formulario:", data)

    // Mostrar mensaje de confirmación
    toast({
      title: "Servicio creado exitosamente",
      description: "El servicio ha sido creado con éxito. Puede crear un nuevo servicio.",
      duration: 5000,
    })

    // Reiniciar el formulario y volver al paso 1
    resetForm()
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
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Atrás
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 ? (
            <Button onClick={nextStep}>
              Siguiente
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={nextStep}>Confirmar</Button>
          )}
        </CardFooter>
      </Card>
    </ServiceFormProvider>
  )
}
