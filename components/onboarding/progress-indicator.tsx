import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  skippedSteps: number[]
}

export function ProgressIndicator({ currentStep, totalSteps, skippedSteps }: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center w-full">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep && !skippedSteps.includes(stepNumber)
          const isSkipped = skippedSteps.includes(stepNumber)

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isSkipped && "border-muted-foreground bg-muted text-muted-foreground",
                  !isActive && !isCompleted && !isSkipped && "border-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <span className={cn("text-sm font-medium", isSkipped && "line-through")}>{stepNumber}</span>
                )}
              </div>
              {stepNumber < totalSteps && (
                <div
                  className={cn(
                    "flex-1 h-0.5 transition-all duration-200",
                    isCompleted || (isSkipped && stepNumber < currentStep) ? "bg-primary" : "bg-muted-foreground",
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

