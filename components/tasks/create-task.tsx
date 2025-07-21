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
  type CreateTaskStepperFormValues 
} from "@/lib/schemas"
import { createTask } from "@/lib/services/agtasks"
import { createSubtask } from "@/lib/integrations/jira"

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
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const methods = useForm<CreateTaskStepperFormValues>({
    resolver: zodResolver(createTaskStepperSchema),
    defaultValues: {
      ...defaultValues,
      projectId,
      userEmail,
    },
    mode: "onChange",
  })

  const nextStep = async () => {
    let isValid = false
    switch (currentStep) {
      case 1:
        isValid = await methods.trigger(["name", "taskType"])
        break
      case 2:
        isValid = await methods.trigger(["workspace", "campaign", "establishment", "selectedLots"])
        break
      case 3:
        isValid = await methods.trigger(["serviceId", "userEmail"])
        break
    }
    if (isValid) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => setCurrentStep(currentStep - 1)

  const onSubmit = async (data: CreateTaskStepperFormValues) => {
    if (!data.userEmail) {
      toast({ title: "Debes seleccionar un usuario asignado", variant: "destructive" })
      return;
    }
    setIsSubmitting(true)
    try {
    //   // 1. Crear Task en Jira
    //   const jiraResult = await createSubtask({
    //     summary: data.name,
    //     description: JSON.stringify(data),
    //     // ...otros campos necesarios para Jira
    //   })
      // 2. Crear Task en DB
      const dbResult = await createTask({
        projectId: data.projectId,
        serviceId: data.serviceId,
        taskName: data.name,
        taskType: data.taskType,
        userEmail: data.userEmail,
        tmpSubtaskId: "",
        // tmpSubtaskId: jiraResult?.id || "",
        // ...otros campos necesarios
      })
      if (dbResult) {
        toast({ title: "Tarea creada exitosamente" })
        router.push(`../`)
      } else {
        toast({ title: "Error al crear la tarea en DB", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error inesperado", description: String(error), variant: "destructive" })
    } finally {
      setIsSubmitting(false)
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
            <form onSubmit={methods.handleSubmit(onSubmit)} className="h-full flex flex-col">
              <div className="flex-1">
                {currentStep === 1 && <><h2 className="text-xl font-semibold mb-4">Paso 1: Tipo de tarea</h2><Step1TaskType /></>}
                {currentStep === 2 && <><h2 className="text-xl font-semibold mb-4">Paso 2: Selección de lotes</h2><Step2Lots userEmail={userEmail} /></>}
                {currentStep === 3 && <><h2 className="text-xl font-semibold mb-4">Paso 3: Detalles</h2><Step3Details services={services} projectName={projectName} /></>}
              </div>
              {/* Los botones van en el CardFooter, fuera del scroll */}
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 bg-white sticky bottom-0 z-10 border-t border-gray-100 pt-4 pb-4">
          {currentStep > 1 && <Button type="button" variant="outline" onClick={prevStep}><ChevronLeft className="w-4 h-4 mr-1" /> Anterior</Button>}
          {currentStep < 3 && <Button type="button" onClick={nextStep}><ChevronRight className="w-4 h-4 ml-1" /> Siguiente</Button>}
          {currentStep === 3 && <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creando..." : "Crear Tarea"}</Button>}
        </CardFooter>
      </Card>
    </div>
  )
} 