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
import Step1TaskType from "../tasks/step1-task-type"
import Step2LotsEdit from "./step2-lots-edit"
import Step3Details from "../tasks/step3-details"
import {
  taskFormSchema,
  type TaskFormFullValues,
} from "@/lib/schemas"
import { updateTask } from "@/lib/services/agtasks"
import { Task } from "@/lib/interfaces/agtasks"

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

interface EditTaskStepperProps {
  taskData: Task
  projectName: string
  services: any[]
  userEmail: string
}

export default function EditTaskStepper({
  taskData,
  projectName,
  services,
  userEmail
}: EditTaskStepperProps) {
  const router = useRouter()
  const params = useParams()
  const { locale, domain, project } = params
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Preparar datos iniciales para el formulario
  const initialFormData: TaskFormFullValues = {
    taskName: taskData.taskName || "",
    taskType: taskData.taskType || "",
    fields: taskData.taskFields || [],
    projectId: taskData.projectId || "",
    serviceId: taskData.serviceId || "",
    userEmail: taskData.userEmail || "",
    tmpSubtaskId: taskData.tmpSubtaskId || "",
    subtaskId: taskData.subtaskId || "",
    taskData: taskData.taskData ? 
      (typeof taskData.taskData === 'string' ? JSON.parse(taskData.taskData) : taskData.taskData) 
      : null,
    deleted: taskData.deleted || false,
    formId: taskData.formId || "",
  }

  const methods = useForm<TaskFormFullValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialFormData,
  })

  const nextStep = async () => {
    // Validar solo los campos del paso actual
    let fieldsToValidate: string[] = []
    
    if (currentStep === 1) {
      fieldsToValidate = ['taskName', 'taskType']
      // Si es fieldvisit, también validar formId
      if (methods.getValues('taskType') === 'fieldvisit') {
        fieldsToValidate.push('formId')
      }
    } else if (currentStep === 2) {
      fieldsToValidate = ['fields']
    } else if (currentStep === 3) {
      fieldsToValidate = ['userEmail', 'serviceId']
    }
    
    const isValid = await methods.trigger(fieldsToValidate)
    
    // Validación manual adicional para taskData en el paso 1
    if (currentStep === 1 && isValid) {
      const taskData = methods.getValues('taskData')
      const taskType = methods.getValues('taskType')
      
      // Si hay taskData y es fieldvisit, verificar que tenga formId
      if (taskType === 'fieldvisit' && (!taskData?.formId || taskData.formId === '')) {
        toast({
          title: "Formulario incompleto",
          description: "El formulario es requerido para tareas de tipo 'fieldvisit'",
          variant: "destructive",
        })
        return
      }
    }
    
    if (isValid) {
      setCurrentStep(currentStep + 1)
    } else {
      toast({
        title: "Formulario incompleto",
        description: "Por favor, completa todos los campos requeridos antes de continuar.",
        variant: "destructive",
      })
    }
  }

  const prevStep = () => setCurrentStep(currentStep - 1)

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)

      // Preparar datos para actualización
      const updateData = {
        taskName: data.taskName,
        taskType: data.taskType,
        userEmail: data.userEmail,
        serviceId: data.serviceId,
        formId: data.formId,
        taskData: data.taskData ? JSON.stringify(data.taskData) : null,
        taskFields: data.fields
      }

      // Actualizar tarea
      const updated = await updateTask(taskData.id, updateData)
      
      if (!updated) {
        throw new Error("No se pudo actualizar la tarea")
      }

      toast({
        title: "Tarea actualizada exitosamente",
        description: "Los cambios han sido guardados correctamente.",
        duration: 5000,
      })

      setIsSuccess(true)
      
      // Redirigir a la lista de tareas
      router.push(`/${locale}/domains/${domain}/projects/${project}/tasks`)
    } catch (error) {
      toast({
        title: "Error al actualizar tarea",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-start py-8 min-h-screen">
      <Card className="w-[90%] max-w-4xl max-h-[90vh] flex flex-col shadow-md border border-gray-200">
        <CardHeader className="pb-0 flex-shrink-0">
          <StepperBubbles currentStep={currentStep} />
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pt-0 pb-0">
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
              <div className="flex-1 pb-4">
                {currentStep === 1 && (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Paso 1: Tipo de tarea</h2>
                    <Step1TaskType mode="edit" initialData={taskData} />
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Paso 2: Selección de lotes</h2>
                    {(() => {
                      console.log("Debug - EditTaskStepper taskData:", taskData)
                      console.log("Debug - EditTaskStepper taskData.taskFields:", taskData.taskFields)
                      return (
                        <Step2LotsEdit 
                          userEmail={userEmail} 
                          initialFields={taskData.taskFields || []} 
                        />
                      )
                    })()}
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Paso 3: Detalles</h2>
                    <Step3Details 
                      services={services} 
                      projectName={projectName} 
                      mode="edit" 
                      initialData={taskData}
                    />
                  </>
                )}
              </div>
              <CardFooter className="flex justify-end gap-2 bg-white border-t border-gray-100 pt-4 pb-4 flex-shrink-0">
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
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Actualizando..." : "Actualizar Tarea"}
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