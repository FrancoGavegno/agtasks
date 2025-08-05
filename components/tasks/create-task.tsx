"use client"

import { Service } from "@/lib/schemas"
import TaskStepper from "./stepper"

export default function CreateTaskStepper({
  projectId,
  thisUserEmail,
  services,
  projectName
}: {
  projectId: string,
  thisUserEmail: string,
  services: Service[],
  projectName: string
}) {
  return (
    <TaskStepper
      projectId={projectId}
      thisUserEmail={thisUserEmail}
      services={services}
      projectName={projectName}
      mode="create"
    />
  )
} 