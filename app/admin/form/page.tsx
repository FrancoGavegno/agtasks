import { client } from "@/lib/amplify-client"
import { DomainFormsClient } from "./forms-client"
import { serializeModelData } from "@/lib/serialization-utils"

export default async function DomainFormsPage() {
  const { data: domainForms } = await client.models.DomainForm.list()

  // console.log("domainForms: " , domainForms)

  // Serialize the data to remove function properties
  const serializedDomainForms = domainForms?.map((form) => serializeModelData(form)) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Forms</h1>
        <p className="text-muted-foreground">
          Manage domain forms with Kobo Toolbox form mappings.</p>
      </div>
      <DomainFormsClient domainForms={serializedDomainForms} />
    </div>
  )
}
