"use client"

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Stepper, Step, StepLabel } from "@/components/stepper"
import { fetchArtifacts, fetchCustomFields, fetchArtifactOptions, fetchClickUpProject } from '@/lib/api-mock'
import { Artifact, CustomField, ClickUpProject, FormData } from '@/lib/types'

const formSchema = z.object({
  clickupProjectId: z.string().min(1, "Project ID is required"),
  customFieldAssignments: z.record(z.string()),
  artifactValues: z.record(z.string()),
})

export default function StepperForm() {
  const params = useParams()
  const projectId = params.projectId as string

  const [activeStep, setActiveStep] = useState(0)
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [artifactOptions, setArtifactOptions] = useState<Record<string, string[]>>({})
  const [clickUpProject, setClickUpProject] = useState<ClickUpProject | null>(null)
  
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clickupProjectId: projectId,
      customFieldAssignments: {},
      artifactValues: {},
    },
  })

  const watchCustomFieldAssignments = watch('customFieldAssignments')

  useEffect(() => {
    fetchArtifacts().then(setArtifacts)
    fetchCustomFields().then(setCustomFields)
    fetchClickUpProject(projectId).then(setClickUpProject)
  }, [projectId])

  useEffect(() => {
    const fetchOptions = async () => {
      const options: Record<string, string[]> = {}
      for (const artifactId of Object.values(watchCustomFieldAssignments)) {
        if (artifactId && !options[artifactId]) {
          options[artifactId] = await fetchArtifactOptions(artifactId)
        }
      }
      setArtifactOptions(options)
    }
    fetchOptions()
  }, [watchCustomFieldAssignments])

  const onSubmit = (data: FormData) => {
    console.log(data)
    // Here you would typically send the data to your backend
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const steps = [
    { label: 'Project Info', content: (
      <CardContent>
        <div className="grid w-full items-center gap-4">
          {clickUpProject ? (
            <>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="projectName">Name</Label>
                <Input id="projectName" value={clickUpProject.name} readOnly />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="projectDescription">Description</Label>
                <Input id="projectDescription" value={clickUpProject.description} readOnly />
              </div>
            </>
          ) : (
            <p>Loading project information...</p>
          )}
        </div>
      </CardContent>
    )},
    { label: 'Assign Artifacts', content: (
      <CardContent>
        <div className="grid w-full items-center gap-4">
          {customFields.map((customField) => (
            <div key={customField.id} className="flex flex-col space-y-1.5">
              <Label htmlFor={customField.id}>{customField.name}</Label>
              <Controller
                name={`customFieldAssignments.${customField.id}`}
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an artifact" />
                    </SelectTrigger>
                    <SelectContent>
                      {artifacts.map((artifact) => (
                        <SelectItem key={artifact.id} value={artifact.id}>{artifact.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          ))}
        </div>
      </CardContent>
    )},
    { label: 'Complete Artifacts', content: (
      <CardContent>
        <div className="grid w-full items-center gap-4">
          {Object.entries(watchCustomFieldAssignments).map(([customFieldId, artifactId]) => {
            if (!artifactId) return null;
            const customField = customFields.find(cf => cf.id === customFieldId);
            const artifact = artifacts.find(a => a.id === artifactId);
            if (!customField || !artifact) return null;
            return (
              <div key={customFieldId} className="flex flex-col space-y-1.5">
                <Label htmlFor={customFieldId}>{`${customField.name} (${artifact.name})`}</Label>
                <Controller
                  name={`artifactValues.${customFieldId}`}
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                      <SelectContent>
                        {artifactOptions[artifactId]?.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    )},
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-[600px] mx-auto">
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
          <CardDescription>Assign and complete artifacts for your project</CardDescription>
        </CardHeader>
        <Stepper activeStep={activeStep} className="px-6 py-4">
          {steps.map((step, index) => (
            <Step key={index} completed={index < activeStep}>
              {index + 1}
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {steps[activeStep].content}
        <CardFooter className="flex justify-between">
          <Button onClick={handleBack} disabled={activeStep === 0}>
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button type="submit">Submit</Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </CardFooter>
      </Card>
    </form>
  )
}

