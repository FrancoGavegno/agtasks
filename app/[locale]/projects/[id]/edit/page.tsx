"use client";

import ProjectForm from "@/components/project-stepper/stepper";

export default function EditProjectPage({ params }: { params: { id: string } }) {
  return (
    <ProjectForm projectId={params.id} />
  );
}