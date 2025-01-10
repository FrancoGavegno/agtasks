"use client";

import StepperProjectForm from "@/components/project-form/stepper";

export default function EditProjectPage({ params }: { params: { id: string } }) {
  return (
    <StepperProjectForm projectId={params.id} />
  );
}