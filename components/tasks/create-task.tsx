"use client"

import TaskStepper from "./stepper"

export default function CreateTaskStepper({
  projectId,
  thisUserEmail,
  services,
  projectName
}: {
  projectId: string,
  thisUserEmail: string,
  services: any[],
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