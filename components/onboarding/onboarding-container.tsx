"use client"

import { useOnboarding } from "./onboarding-context"
import { ProgressIndicator } from "./progress-indicator"
import { StepOne } from "./steps/step-one"
import { StepTwo } from "./steps/step-two"
import { StepThree } from "./steps/step-three"

export function OnboardingContainer() {
  const { data } = useOnboarding()
  const { currentStep, totalSteps, skippedSteps } = data

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Hola dariobaldati!</h1>
        <p className="text-muted-foreground mt-2">Configura Agtasks completando los siguientes pasos:</p>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-md mx-auto">
          <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} skippedSteps={skippedSteps} />

          <div className="mt-8">
            {currentStep === 1 && <StepOne />}
            {currentStep === 2 && <StepTwo />}
            {currentStep === 3 && <StepThree />}
          </div>
        </div>
      </div>
    </div>
  )
}

