'use client'

import CreateProjectStepper from "@/components/create-project-stepper"
import { useParams } from "next/navigation";

export default function CreateProjectPage() {
  const { templateId } = useParams();

  return (
    <div className="container px-1 py-10 mx-auto">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Create Project</h2>
        <CreateProjectStepper templateId={Array.isArray(templateId) ? templateId[0] : templateId} />
      </div>
    </div>

  )
}