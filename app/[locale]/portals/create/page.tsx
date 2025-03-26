import { NewServicePortalForm } from "@/components/portals/new-service-portal-form"

export default function NewServicePortalPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Service Portal</h1>
      <NewServicePortalForm />
    </div>
  )
}