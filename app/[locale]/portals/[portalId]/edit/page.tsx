import { EditServicePortalForm } from "@/components/portals/edit-service-portal-form"

export default function EditServicePortalPage({ params }: { params: { portalId: string } }) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Service Portal</h1>
      <EditServicePortalForm portalId={params.portalId} />
    </div>
  )
}
