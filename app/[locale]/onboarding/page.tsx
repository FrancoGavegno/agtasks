import { OnboardingProvider } from "@/components/onboarding/onboarding-context"
import { OnboardingContainer } from "@/components/onboarding/onboarding-container"

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingContainer />
    </OnboardingProvider>
  )
}

