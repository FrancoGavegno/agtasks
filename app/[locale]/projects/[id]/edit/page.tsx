"use client";

import ProjectForm from "@/components/stepper/project-stepper";

export default function EditProjectPage({ params }: { params: { id: string } }) {
  return (
    <ProjectForm projectId={params.id} />
  );
}