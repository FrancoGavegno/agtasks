"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ProtocolSummary from "./protocol-summary"
import WorkspaceSelection from "./workspace-selection"
import DeadlineAndRoles from "./deadline-and-roles"
import FormSummary from "./form-summary"
import { Check, ChevronsRight } from "lucide-react"

type ProtocolDetailProps = {
  templateId: string
}

export default function WizardForm({ templateId }: ProtocolDetailProps) {
  const [step, setStep] = useState(1)
  const totalSteps = 4

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
            {/* {step === 1 && "Resumen del protocolo a aplicar"}
            {step === 2 && "Selección del espacio de trabajo, campaña, establecimiento y lotes"}
            {step === 3 && "Fecha limite, Roles y Usuarios asignados"}
            {step === 4 && "Resumen"} */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && <ProtocolSummary templateId={templateId} />}
          {step === 2 && <WorkspaceSelection />}
          {step === 3 && <DeadlineAndRoles />}
          {step === 4 && <FormSummary />}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={step === 1}>
            Anterior
          </Button>
          <Button onClick={nextStep} disabled={step === totalSteps}>
            {step === totalSteps - 1 ? "Finalizar" : "Siguiente"}
            {step !== totalSteps - 1 && <ChevronsRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

