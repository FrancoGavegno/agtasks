"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { JiraFormValues, KoboFormValues, PortalFormValues } from "@/lib/validations/onboarding"

export type OnboardingData = {
  jira?: JiraFormValues
  kobo?: KoboFormValues
  portal?: PortalFormValues
  currentStep: number
  totalSteps: number
  skippedSteps: number[]
}

type OnboardingContextType = {
  data: OnboardingData
  setJiraData: (data: JiraFormValues) => void
  setKoboData: (data: KoboFormValues) => void
  setPortalData: (data: PortalFormValues) => void
  nextStep: () => void
  prevStep: () => void
  skipStep: () => void
  resetOnboarding: () => void
}

const initialData: OnboardingData = {
  currentStep: 1,
  totalSteps: 3,
  skippedSteps: [],
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(initialData)

  const setJiraData = (jiraData: JiraFormValues) => {
    setData((prev) => ({ ...prev, jira: jiraData }))
  }

  const setKoboData = (koboData: KoboFormValues) => {
    setData((prev) => ({ ...prev, kobo: koboData }))
  }

  const setPortalData = (portalData: PortalFormValues) => {
    setData((prev) => ({ ...prev, portal: portalData }))
  }

  const nextStep = () => {
    if (data.currentStep < data.totalSteps) {
      setData((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }))
    }
  }

  const prevStep = () => {
    if (data.currentStep > 1) {
      setData((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }))
    }
  }

  const skipStep = () => {
    setData((prev) => ({
      ...prev,
      skippedSteps: [...prev.skippedSteps, prev.currentStep],
      currentStep: prev.currentStep + 1,
    }))
  }

  const resetOnboarding = () => {
    setData(initialData)
  }

  return (
    <OnboardingContext.Provider
      value={{
        data,
        setJiraData,
        setKoboData,
        setPortalData,
        nextStep,
        prevStep,
        skipStep,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}

