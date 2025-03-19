"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import Link from "next/link"
import BasicInformation from "./wizard-steps/basic-information"
import AdvancedOptions from "./wizard-steps/advanced-options"

// Define the steps in the wizard
const steps = [
  { id: "basic", label: "Basic Information" },
  { id: "advanced", label: "Advanced Options" },
  { id: "review", label: "Review & Submit" },
]

export default function CreateTaskWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    description: "",
    dueDate: undefined as Date | undefined,
    priority: "",
    status: "todo",
    assigneeId: "",
    isServiceTask: false,
    serviceId: "",

    // Advanced Options
    tags: [] as string[],
    attachments: [] as { name: string; size: string }[],
    estimatedHours: "",
    dependencies: [] as string[],
  })

  // Sample data for services and team members
  const services = [
    { id: "1", name: "Variable Seeding - North Field" },
    { id: "2", name: "Precision Irrigation - East Field" },
    { id: "3", name: "Variable Fertilization - South Field" },
    { id: "4", name: "Soil Analysis - West Field" },
    { id: "5", name: "Harvest Monitoring - Central Field" },
  ]

  const teamMembers = [
    { id: "1", name: "Maria Rodriguez", role: "Technical Lead", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "2", name: "John Smith", role: "Project Owner", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "3", name: "Carlos Mendez", role: "Field Operator", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "4", name: "Sarah Johnson", role: "Data Analyst", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "5", name: "Miguel Torres", role: "Equipment Provider", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "6", name: "Laura Chen", role: "Soil Scientist", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "7", name: "David Wilson", role: "Irrigation Specialist", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  // Update form data
  const updateFormData = (stepData: Partial<typeof formData>) => {
    setFormData({ ...formData, ...stepData })
  }

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  // Handle form submission
  const handleSubmit = () => {
    console.log("Task created:", formData)
    // Here you would typically send the data to your API
    // and then redirect to the tasks page or show a success message
  }

  // Get assignee name by ID
  const getAssigneeName = (id: string) => {
    const assignee = teamMembers.find((member) => member.id === id)
    return assignee ? assignee.name : "Not assigned"
  }

  // Get service name by ID
  const getServiceName = (id: string) => {
    const service = services.find((service) => service.id === id)
    return service ? service.name : "None"
  }

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInformation
            formData={formData}
            updateFormData={updateFormData}
            teamMembers={teamMembers}
            services={services}
          />
        )
      case 1:
        return <AdvancedOptions formData={formData} updateFormData={updateFormData} />
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Review Your Task</h2>
            <p className="text-muted-foreground">
              Please review all the information you've provided before creating the task.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Task Title</dt>
                    <dd>{formData.title || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                    <dd>{formData.description || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Due Date</dt>
                    <dd>{formData.dueDate ? formData.dueDate.toLocaleDateString() : "Not set"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Priority</dt>
                    <dd className="capitalize">{formData.priority || "Not set"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                    <dd className="capitalize">{formData.status.replace("-", " ") || "Not set"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Assignee</dt>
                    <dd>{getAssigneeName(formData.assigneeId)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Related Service</dt>
                    <dd>{formData.isServiceTask ? getServiceName(formData.serviceId) : "None"}</dd>
                  </div>
                </dl>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Advanced Options</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Tags</dt>
                    <dd>{formData.tags.length > 0 ? formData.tags.join(", ") : "No tags added"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Attachments</dt>
                    <dd>{formData.attachments.length} files</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Estimated Hours</dt>
                    <dd>{formData.estimatedHours || "Not specified"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Dependencies</dt>
                    <dd>
                      {formData.dependencies.length > 0 ? formData.dependencies.length + " tasks" : "No dependencies"}
                    </dd>
                  </div>
                </dl>
              </Card>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // Check if current step is valid
  const isCurrentStepValid = () => {
    if (currentStep === 0) {
      return (
        formData.title &&
        formData.dueDate &&
        formData.priority &&
        formData.assigneeId &&
        (!formData.isServiceTask || (formData.isServiceTask && formData.serviceId))
      )
    }
    return true
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/tasks">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Task</h1>
        <p className="text-muted-foreground mt-1">Add a new task to track work that needs to be completed</p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  index < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : index === currentStep
                      ? "border-primary text-primary"
                      : "border-muted-foreground text-muted-foreground"
                }`}
              >
                {index < currentStep ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
              </div>
              <span
                className={`text-xs mt-2 ${
                  index <= currentStep ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 h-1 w-full bg-muted"></div>
          <div
            className="absolute top-0 h-1 bg-primary transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current step content */}
      <div className="mb-8">{renderStep()}</div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/tasks">Cancel</Link>
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep} disabled={!isCurrentStepValid()}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>Create Task</Button>
          )}
        </div>
      </div>
    </div>
  )
}

