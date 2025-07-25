import { apiClient } from "@/lib/integrations/amplify"
import { Schema } from "@/amplify/data/resource"
type DomainForm = Schema["DomainForm"]["type"]
import { DomainFormsClient } from "./forms-client"

export default async function DomainFormsPage() {
  const { items: domainForms } = await apiClient.listDomainForms()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Forms</h1>
        <p className="text-muted-foreground">
          Manage domain forms with Kobo Toolbox form mappings.</p>
      </div>
      <DomainFormsClient domainForms={domainForms as DomainForm[]} />
    </div>
  )
}
