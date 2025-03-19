"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import BasicInformation from "./wizard-steps/basic-information"
import FieldDetails from "./wizard-steps/field-details"
import TeamEquipment from "./wizard-steps/team-equipment"
import AdvancedSettings from "./wizard-steps/advanced-settings"

// Define the steps in the wizard
const steps = [
  { id: "basic", label: "Basic Information" },
  { id: "field", label: "Field Details" },
  { id: "team", label: "Team & Equipment" },
  { id: "advanced", label: "Advanced Settings" },
  { id: "review", label: "Review & Submit" },
]

export default function CreateServiceWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    technique: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    description: "",
    tags: [] as string[],
    files: [] as { name: string; size: string; type: string }[],

    // Field Details
    fieldName: "",
    fieldSize: "",
    fieldUnit: "hectares",
    elevation: "",
    elevationUnit: "meters",
    location: "",
    cropType: "",
    cropVariety: "",
    soilType: "",
    previousCrop: "",
    topography: [] as string[],
    irrigationSystem: "",
    fieldIssues: [] as string[],
    fieldNotes: "",

    // Team & Equipment
    teamMembers: [] as string[],
    teamRoles: {} as Record<string, string>,
    equipment: [] as string[],
    equipmentAvailability: {} as Record<string, string>,
    equipmentNotes: "",

    // Advanced Settings
    budget: "",
    budgetAllocation: {
      equipment: 30,
      labor: 40,
      materials: 20,
      other: 10,
    },
    fundingSource: "",
    roiTarget: "",
    priority: "",
    dataCollectionFrequency: "",
    integrations: [] as string[],
    notifications: false,
    publicVisibility: false,
    advancedAnalytics: false,
    automatedReports: false,
  })

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
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your API
    // and then redirect to the services page or show a success message
  }

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInformation formData={formData} updateFormData={updateFormData} />
      case 1:
        return <FieldDetails formData={formData} updateFormData={updateFormData} />
      case 2:
        return <TeamEquipment formData={formData} updateFormData={updateFormData} />
      case 3:
        return <AdvancedSettings formData={formData} updateFormData={updateFormData} />
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Review Your Service</h2>
            <p className="text-muted-foreground">
              Please review all the information you've provided before creating the service.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Service Name</dt>
                    <dd>{formData.name || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Technique</dt>
                    <dd>{formData.technique || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Timeline</dt>
                    <dd>
                      {formData.startDate ? formData.startDate.toLocaleDateString() : "Not set"} to{" "}
                      {formData.endDate ? formData.endDate.toLocaleDateString() : "Not set"}
                    </dd>
                  </div>
                </dl>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Field Details</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Field Name</dt>
                    <dd>{formData.fieldName || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Size</dt>
                    <dd>{formData.fieldSize ? `${formData.fieldSize} ${formData.fieldUnit}` : "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Crop</dt>
                    <dd>{formData.cropType || "Not provided"}</dd>
                  </div>
                </dl>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Team & Equipment</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Team Members</dt>
                    <dd>{formData.teamMembers.length} selected</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Equipment</dt>
                    <dd>{formData.equipment.length} selected</dd>
                  </div>
                </dl>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Advanced Settings</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Budget</dt>
                    <dd>{formData.budget ? `$${formData.budget}` : "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Priority</dt>
                    <dd>{formData.priority || "Not set"}</dd>
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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/portals/1/services">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Service</h1>
        <p className="text-muted-foreground mt-1">Set up a new precision agriculture service project</p>
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
            <Link href="/services">Cancel</Link>
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>Create Service</Button>
          )}
        </div>
      </div>
    </div>
  )
}

