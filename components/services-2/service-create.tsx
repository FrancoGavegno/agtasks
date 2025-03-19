"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ProtocolSummary from "./protocol-summary"
import WorkspaceSelection from "./workspace-selection"
import DeadlineAndRoles from "./deadline-and-roles"
import FormSummary from "./form-summary"
import { Check, ChevronsRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createCustomerRequest } from "@/lib/jira"
import { useToast } from "@/hooks/use-toast"

type ProtocolDetailProps = {
  portalId: string
}

export default function ServiceCreate({ portalId }: ProtocolDetailProps) {
  const [step, setStep] = useState(1)
  const totalSteps = 4
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const { toast } = useToast()

  // Estados para controlar la validez de cada paso
  const [step1Valid, setStep1Valid] = useState(false)
  const [step2Valid, setStep2Valid] = useState(false)
  const [step3Valid, setStep3Valid] = useState(false)
  const [selectedProtocolId, setSelectedProtocolId] = useState<string | undefined>(undefined)

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleFinish = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Aquí recopilaríamos todos los datos de los pasos anteriores
      // En una aplicación real, estos datos vendrían de un estado global o contexto

      // Ejemplo de datos para la solicitud
      const requestData = {
        serviceDeskId: "1", // Reemplazar con el ID real del Service Desk
        requestTypeId: "10", // Reemplazar con el ID real del tipo de solicitud
        requestFieldValues: {
          summary: `Nueva solicitud de protocolo: ${selectedProtocolId}`,
          description: "Solicitud creada desde el formulario wizard para aplicación de protocolo agrícola.",
        },
        raiseOnBehalfOf: "usuario@ejemplo.com", // Email del usuario actual
        requestParticipants: ["participante1@ejemplo.com", "participante2@ejemplo.com"], // Emails de los participantes
      }

      // Llamar a la API para crear la solicitud
      const result = await createCustomerRequest(requestData)

      if (result.success) {
        toast({
          title: "Solicitud enviada",
          description: "Su solicitud ha sido creada exitosamente.",
          variant: "default",
        })

        // Aquí podríamos redirigir al usuario a una página de confirmación o a la lista de solicitudes
      } else {
        throw new Error(result.error || "Error al crear la solicitud")
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al enviar la solicitud",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setShowConfirmDialog(false)
    }
  }

  // Determinar si el botón Siguiente debe estar habilitado según el paso actual
  const isNextButtonEnabled = () => {
    switch (step) {
      case 1:
        return step1Valid
      case 2:
        return step2Valid
      case 3:
        return step3Valid
      default:
        return false
    }
  }

  // Manejar cambios en la selección del protocolo (Step 1)
  const handleProtocolSelectionChange = (isValid: boolean, protocolId?: string) => {
    setStep1Valid(isValid)
    setSelectedProtocolId(protocolId)
  }

  // Manejar cambios en la selección de espacio de trabajo, etc. (Step 2)
  const handleWorkspaceSelectionChange = (isValid: boolean) => {
    setStep2Valid(isValid)
  }

  // Manejar cambios en la fecha límite (Step 3)
  const handleDeadlineSelectionChange = (isValid: boolean) => {
    setStep3Valid(isValid)
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step > index + 1
                    ? "bg-primary text-primary-foreground"
                    : step === index + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {step > index + 1 ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`h-1 w-full min-w-[3rem] sm:min-w-[5rem] md:min-w-[10rem] ${
                    step > index + 1 ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {step === 1 && "Protocolo de servicio a aplicar"}
            {step === 2 && "Espacio de trabajo, Campaña, Establecimiento y Lotes"}
            {step === 3 && "Fecha límite, Roles y Usuarios asignados"}
            {step === 4 && "Resumen de la solicitud"}
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[24rem]">
          {step === 1 && <ProtocolSummary templateId={portalId} onSelectionChange={handleProtocolSelectionChange} />}
          {step === 2 && <WorkspaceSelection onSelectionChange={handleWorkspaceSelectionChange} />}
          {step === 3 && <DeadlineAndRoles onSelectionChange={handleDeadlineSelectionChange} />}
          {step === 4 && <FormSummary />}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={step === 1}>
            Anterior
          </Button>
          {step === totalSteps ? (
            <Button onClick={handleFinish}>Finalizar</Button>
          ) : (
            <Button onClick={nextStep} disabled={!isNextButtonEnabled()}>
              Siguiente
              <ChevronsRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Diálogo de confirmación */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar envío</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea enviar esta solicitud? Una vez enviada, no podrá modificarla.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

