import * as React from "react"
import { cn } from "@/lib/utils"

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep: number
  children: React.ReactNode
}

export function Stepper({ activeStep, children, className, ...props }: StepperProps) {
  const steps = React.Children.toArray(children)

  return (
    <div className={cn("flex items-center", className)} {...props}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {step}
          {index < steps.length - 1 && (
            <div className="mx-2 h-px flex-1 bg-muted" />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  completed?: boolean
}

export function Step({ completed, children, className, ...props }: StepProps) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border-2",
        completed ? "border-primary bg-primary text-primary-foreground" : "border-muted",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function StepLabel({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}

